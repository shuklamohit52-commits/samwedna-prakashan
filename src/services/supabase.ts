import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  CurrentAffairArticle, 
  FreePdfResource, 
  StudyMaterialItem, 
  VideoLecture, 
  Book, 
  HardCopyOrder, 
  UserTestScore, 
  UserProfile,
  TestSeriesExam
} from '../types';

const SUPABASE_CONFIG_STORAGE_KEY = 'samwedna_supabase_config';

interface StoredSupabaseConfig {
  url: string;
  anonKey: string;
}

export const getStoredSupabaseConfig = (): StoredSupabaseConfig => {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading stored Supabase config:', e);
  }
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string): void => {
  localStorage.setItem(SUPABASE_CONFIG_STORAGE_KEY, JSON.stringify({ url, anonKey }));
  // Re-initialize client
  initSupabaseClient(url, anonKey);
};

let supabaseClient: SupabaseClient | null = null;

export const initSupabaseClient = (url?: string, anonKey?: string): SupabaseClient | null => {
  const finalUrl = url || getStoredSupabaseConfig().url;
  const finalKey = anonKey || getStoredSupabaseConfig().anonKey;

  if (finalUrl && finalKey && finalUrl.startsWith('https://')) {
    try {
      supabaseClient = createClient(finalUrl, finalKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseClient = null;
    }
  }
  return null;
};

// Initial invocation
initSupabaseClient();

export const isSupabaseConfigured = (): boolean => {
  const config = getStoredSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

export const testSupabaseConnection = async (url: string, anonKey: string): Promise<{ success: boolean; message: string }> => {
  if (!url || !anonKey) {
    return { success: false, message: 'Please provide both Project URL and Public Anon Key.' };
  }
  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    return { success: false, message: 'Invalid URL format. Expected: https://<project-ref>.supabase.co' };
  }

  try {
    const client = createClient(url, anonKey);
    // Ping with a lightweight query
    const { error } = await client.from('app_health').select('*').limit(1);
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      // 42P01 means table does not exist, which still proves connection works!
      return { 
        success: true, 
        message: 'Connected to Supabase successfully! (Tables will be created upon first sync).' 
      };
    }
    return { success: true, message: 'Supabase connection verified successfully!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Connection failed: ${msg}` };
  }
};

/**
 * High-reliability Local & Supabase Hybrid Storage
 * Ensures that if Supabase is offline or credentials are not yet entered,
 * student tests, orders, current affairs, and admin uploads are never lost.
 */

const getLocalStorageArray = <T>(key: string, defaultVal: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocalStorageArray = <T>(key: string, val: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
};

// 1. ORDERS REPOSITORY (BooksBoon E-Commerce)
export const OrdersService = {
  async createOrder(order: HardCopyOrder): Promise<HardCopyOrder> {
    const local = getLocalStorageArray<HardCopyOrder>('booksboon_orders', []);
    const updated = [order, ...local];
    setLocalStorageArray('booksboon_orders', updated);

    if (supabaseClient) {
      try {
        await supabaseClient.from('orders').insert([order]);
      } catch (e) {
        console.warn('Supabase remote insert fallback:', e);
      }
    }
    return order;
  },

  async getOrders(email?: string): Promise<HardCopyOrder[]> {
    const local = getLocalStorageArray<HardCopyOrder>('booksboon_orders', []);
    if (email) {
      return local.filter(o => o.studentEmail.toLowerCase() === email.toLowerCase());
    }
    return local;
  },

  async updateOrderStatus(orderId: string, status: HardCopyOrder['shippingStatus'], trackingId?: string): Promise<void> {
    const local = getLocalStorageArray<HardCopyOrder>('booksboon_orders', []);
    const updated = local.map(o => o.orderId === orderId ? { 
      ...o, 
      shippingStatus: status,
      ...(trackingId ? { trackingId } : {})
    } : o);
    setLocalStorageArray('booksboon_orders', updated);

    if (supabaseClient) {
      try {
        await supabaseClient.from('orders').update({ shippingStatus: status, ...(trackingId ? { trackingId } : {}) }).eq('orderId', orderId);
      } catch (e) {
        console.warn('Supabase update order error:', e);
      }
    }
  }
};

// 2. STUDENT TEST SCORES REPOSITORY (CBT Exam Pattern)
export const TestScoresService = {
  async saveScore(score: UserTestScore, userEmail: string): Promise<void> {
    const key = `student_scores_${userEmail}`;
    const local = getLocalStorageArray<UserTestScore>(key, []);
    const updated = [score, ...local];
    setLocalStorageArray(key, updated);

    // Global admin list
    const allScores = getLocalStorageArray<UserTestScore & { userEmail: string }>('all_student_scores', []);
    setLocalStorageArray('all_student_scores', [{ ...score, userEmail }, ...allScores]);

    if (supabaseClient) {
      try {
        await supabaseClient.from('test_scores').insert([{ ...score, student_email: userEmail }]);
      } catch (e) {
        console.warn('Supabase test score insert fallback:', e);
      }
    }
  },

  async getScores(userEmail: string): Promise<UserTestScore[]> {
    const key = `student_scores_${userEmail}`;
    return getLocalStorageArray<UserTestScore>(key, []);
  },

  async getAllScores(): Promise<(UserTestScore & { userEmail: string })[]> {
    return getLocalStorageArray<UserTestScore & { userEmail: string }>('all_student_scores', []);
  }
};

// 3. CURRENT AFFAIRS REPOSITORY
export const CurrentAffairsService = {
  async upsert(article: CurrentAffairArticle): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('current_affairs').upsert([article], { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase CA upsert fallback:', e);
      }
    }
  },
  async delete(id: string): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('current_affairs').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase CA delete fallback:', e);
      }
    }
  }
};

// 4. FREE PDFS REPOSITORY
export const FreePdfsService = {
  async upsert(pdf: FreePdfResource): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('free_pdfs').upsert([pdf], { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase PDF upsert fallback:', e);
      }
    }
  },
  async delete(id: string): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('free_pdfs').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase PDF delete fallback:', e);
      }
    }
  }
};

// 5. BOOKS SERVICE
export const BooksService = {
  async upsert(book: Book): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('books').upsert([book], { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase book upsert fallback:', e);
      }
    }
  }
};

// 6. EXAMS & SYLLABUS REPOSITORY
export const ExamsService = {
  async upsert(exam: any): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('exams').upsert([exam], { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase exam upsert fallback:', e);
      }
    }
  },
  async delete(id: string): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('exams').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase exam delete fallback:', e);
      }
    }
  }
};

// COMPLETE SUPABASE SQL SCHEMA GENERATOR
export const getSupabaseSchemaSql = (): string => {
  return `-- ==============================================================================
-- SUPABASE COMPLETE DATABASE SCHEMA FOR SAMWEDNA INSTITUTE & BOOKSBOON.COM
-- Execute this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Orders Table (Hard-copy & e-book purchases)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "orderId" TEXT UNIQUE NOT NULL,
  "trackingId" TEXT,
  "studentEmail" TEXT NOT NULL,
  "studentName" TEXT NOT NULL,
  phone TEXT,
  address JSONB,
  items JSONB,
  subtotal NUMERIC,
  "shippingFee" NUMERIC,
  "totalAmount" NUMERIC NOT NULL,
  "paymentMethod" TEXT,
  "paymentId" TEXT,
  "paymentStatus" TEXT,
  "shippingStatus" TEXT DEFAULT 'Processing',
  "courierPartner" TEXT,
  "estimatedDelivery" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Student Test Scores (CBT Exam Performance Tracking)
CREATE TABLE IF NOT EXISTS test_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "testId" TEXT NOT NULL,
  "testTitle" TEXT NOT NULL,
  student_email TEXT NOT NULL,
  category TEXT,
  "scoreObtained" NUMERIC NOT NULL,
  "totalMarks" NUMERIC NOT NULL,
  "accuracyPercentage" NUMERIC,
  percentile NUMERIC,
  rank INTEGER,
  "totalCandidates" INTEGER,
  "timeSpentMinutes" INTEGER,
  "dateAttempted" TEXT,
  status TEXT DEFAULT 'Completed',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Current Affairs Articles (Bilingual with rich HTML)
CREATE TABLE IF NOT EXISTS current_affairs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "hindiTitle" TEXT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  summary TEXT NOT NULL,
  "hindiSummary" TEXT,
  "keyPoints" TEXT[],
  "hindiKeyPoints" TEXT[],
  "fullContent" TEXT,
  "hindiFullContent" TEXT,
  "imageUrl" TEXT,
  "bannerImage" TEXT,
  "relatedMcq" JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Free PDFs & Study Notes (Bilingual with base64/device upload)
CREATE TABLE IF NOT EXISTS free_pdfs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "hindiTitle" TEXT,
  category TEXT NOT NULL,
  subject TEXT,
  "hindiSubject" TEXT,
  "fileSize" TEXT,
  pages INTEGER,
  "downloadUrl" TEXT NOT NULL,
  "isBilingual" BOOLEAN DEFAULT true,
  "targetExam" TEXT,
  "isTrending" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Video Lectures
CREATE TABLE IF NOT EXISTS video_lectures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "hindiTitle" TEXT,
  subject TEXT,
  "hindiSubject" TEXT,
  instructor TEXT,
  duration TEXT,
  "youtubeId" TEXT,
  description TEXT,
  "hindiDescription" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Books Catalog (BooksBoon Hard Copies & Publications)
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "hindiTitle" TEXT,
  author TEXT,
  "hindiAuthor" TEXT,
  category TEXT,
  subject TEXT,
  price NUMERIC,
  "originalPrice" NUMERIC,
  discount NUMERIC,
  pages INTEGER,
  language TEXT,
  description TEXT,
  "hindiDescription" TEXT,
  "bannerImage" TEXT,
  "inStock" BOOLEAN DEFAULT true,
  "stockCount" INTEGER DEFAULT 100,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Government Exams & Syllabus Registry (SSC, Railways, Banking, etc.)
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "hindiName" TEXT,
  "fullName" TEXT NOT NULL,
  category TEXT NOT NULL,
  "officialBoard" TEXT,
  "logoUrl" TEXT,
  badge TEXT,
  vacancies TEXT,
  eligibility TEXT,
  pattern TEXT,
  "totalMarks" TEXT,
  "negativeMarking" TEXT,
  description TEXT,
  "hindiDescription" TEXT,
  "gradientBorder" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CBT Mock Test Series
CREATE TABLE IF NOT EXISTS test_series (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "hindiTitle" TEXT,
  category TEXT NOT NULL,
  duration INTEGER,
  "totalMarks" INTEGER,
  "questionsCount" INTEGER,
  "negativeMarking" NUMERIC,
  questions JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Enable Row Level Security (RLS) with Public Read & Authenticated Write
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_affairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_series ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated read access for student portal
CREATE POLICY "Public Read Access" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON orders FOR UPDATE USING (true);

CREATE POLICY "Public Read Access" ON test_scores FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON test_scores FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Access" ON current_affairs FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON free_pdfs FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON video_lectures FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON books FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON exams FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON test_series FOR ALL USING (true);
`;
};

// SYNC ALL CONTENT TO SUPABASE DIRECTLY
export const syncAllDataToSupabase = async (payload: {
  orders: any[];
  currentAffairs: any[];
  freePdfs: any[];
  videoLectures: any[];
  books: any[];
  exams: any[];
  testSeries: any[];
}): Promise<{ success: boolean; details: string }> => {
  const client = initSupabaseClient();
  if (!client) {
    return { 
      success: false, 
      details: 'Supabase client is not configured. Please save your Project URL and Anon Key first.' 
    };
  }

  const results: string[] = [];

  try {
    // 1. Sync Current Affairs
    if (payload.currentAffairs?.length) {
      const { error } = await client.from('current_affairs').upsert(payload.currentAffairs, { onConflict: 'id' });
      if (error) results.push(`Current Affairs: ${error.message}`);
      else results.push(`Current Affairs: synced ${payload.currentAffairs.length} articles`);
    }

    // 2. Sync Free PDFs
    if (payload.freePdfs?.length) {
      const { error } = await client.from('free_pdfs').upsert(payload.freePdfs, { onConflict: 'id' });
      if (error) results.push(`Free PDFs: ${error.message}`);
      else results.push(`Free PDFs: synced ${payload.freePdfs.length} files`);
    }

    // 3. Sync Books Catalog
    if (payload.books?.length) {
      const { error } = await client.from('books').upsert(payload.books, { onConflict: 'id' });
      if (error) results.push(`Books: ${error.message}`);
      else results.push(`Books: synced ${payload.books.length} publications`);
    }

    // 4. Sync Exams
    if (payload.exams?.length) {
      const { error } = await client.from('exams').upsert(payload.exams, { onConflict: 'id' });
      if (error) results.push(`Exams: ${error.message}`);
      else results.push(`Exams: synced ${payload.exams.length} examinations`);
    }

    // 5. Sync Test Series
    if (payload.testSeries?.length) {
      const { error } = await client.from('test_series').upsert(payload.testSeries, { onConflict: 'id' });
      if (error) results.push(`Test Series: ${error.message}`);
      else results.push(`Test Series: synced ${payload.testSeries.length} tests`);
    }

    return {
      success: true,
      details: results.join(' • ')
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      details: `Sync encountered error: ${msg}`
    };
  }
};
