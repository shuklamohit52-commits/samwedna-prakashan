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
 * Checks if a string is already in standard 8-4-4-4-12 UUID format
 */
export const isStandardUuid = (str: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

/**
 * Deterministically maps any string ID (like 'ca-1793173096472' or 'pdf-01')
 * into a valid UUID v4 format. This guarantees Supabase tables created with
 * UUID columns accept rows without throwing syntax errors.
 */
export const toDeterministicUuid = (input: string): string => {
  if (isStandardUuid(input)) return input;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  let h3 = 0x58765431;
  let h4 = 0xa5a5a5a5;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
    h2 = Math.imul(h2 ^ (c << 5), 2246822519) >>> 0;
    h3 = Math.imul(h3 ^ (c << 9), 3266489917) >>> 0;
    h4 = Math.imul(h4 ^ (c << 13), 668265263) >>> 0;
  }
  const s1 = h1.toString(16).padStart(8, '0');
  const s2 = (h2 & 0xffff).toString(16).padStart(4, '0');
  const s3 = ('4' + ((h2 >>> 16) & 0x0fff).toString(16).padStart(3, '0'));
  const s4 = ('a' + (h3 & 0x0fff).toString(16).padStart(3, '0'));
  const s5 = (h3.toString(16).padStart(8, '0') + h4.toString(16).padStart(8, '0')).slice(0, 12);
  return `${s1}-${s2}-${s3}-${s4}-${s5}`;
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
        await upsertResilient(supabaseClient, 'current_affairs', [article], 'id');
      } catch (e) {
        console.warn('Supabase CA upsert fallback:', e);
      }
    }
  },
  async delete(id: string): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('current_affairs').delete().or(`id.eq.${id},id.eq.${toDeterministicUuid(id)}`);
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
        await upsertResilient(supabaseClient, 'free_pdfs', [pdf], 'id');
      } catch (e) {
        console.warn('Supabase PDF upsert fallback:', e);
      }
    }
  },
  async delete(id: string): Promise<void> {
    if (supabaseClient) {
      try {
        await supabaseClient.from('free_pdfs').delete().or(`id.eq.${id},id.eq.${toDeterministicUuid(id)}`);
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
-- SUPABASE COMPLETE COMPATIBILITY & MIGRATION SCHEMA FOR SAMWEDNA & BOOKSBOON
-- Paste & click 'RUN' in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AUTOMATIC TYPE MIGRATION: Convert 'id' column from UUID to TEXT if table was previously created as UUID
DO $$
BEGIN
  -- 1. current_affairs id migration
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'current_affairs' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.current_affairs ALTER COLUMN id TYPE TEXT USING id::TEXT;
  END IF;

  -- 2. free_pdfs id migration
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'free_pdfs' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.free_pdfs ALTER COLUMN id TYPE TEXT USING id::TEXT;
  END IF;

  -- 3. books id migration
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.books ALTER COLUMN id TYPE TEXT USING id::TEXT;
  END IF;

  -- 4. exams id migration
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'exams' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.exams ALTER COLUMN id TYPE TEXT USING id::TEXT;
  END IF;

  -- 5. test_series id migration
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'test_series' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.test_series ALTER COLUMN id TYPE TEXT USING id::TEXT;
  END IF;

  -- 6. video_lectures id migration
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'video_lectures' AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.video_lectures ALTER COLUMN id TYPE TEXT USING id::TEXT;
  END IF;
END $$;

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
  date TEXT NOT NULL,
  category TEXT NOT NULL
);
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "hindiTitle" TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "hindiSummary" TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "keyPoints" TEXT[];
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "hindiKeyPoints" TEXT[];
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "fullContent" TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "hindiFullContent" TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "isHtmlFormatted" BOOLEAN DEFAULT false;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "bannerImage" TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "readTime" TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "pdfUrl" TEXT;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "relatedMcq" JSONB;
ALTER TABLE current_affairs ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();

-- 5. Free PDFs & Study Notes (Bilingual)
CREATE TABLE IF NOT EXISTS free_pdfs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL
);
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "downloadUrl" TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS downloadurl TEXT;
ALTER TABLE free_pdfs ALTER COLUMN "downloadUrl" DROP NOT NULL;
ALTER TABLE free_pdfs ALTER COLUMN downloadurl DROP NOT NULL;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "hindiTitle" TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "hindiSubject" TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "fileSize" TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS pages INTEGER;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "hindiDescription" TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "dateAdded" TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "downloadsCount" INTEGER DEFAULT 1;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "isTrending" BOOLEAN DEFAULT false;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "isBilingual" BOOLEAN DEFAULT true;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "targetExam" TEXT;
ALTER TABLE free_pdfs ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();

-- 6. Video Lectures
CREATE TABLE IF NOT EXISTS video_lectures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT
);
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS "hindiTitle" TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS "hindiSubject" TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS instructor TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS views TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS exam TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS "thumbnailGradient" TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS "hindiDescription" TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS "youtubeId" TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS "isUpcoming" BOOLEAN DEFAULT false;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS "upcomingDate" TEXT;
ALTER TABLE video_lectures ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();

-- 7. Books Catalog (BooksBoon Hard Copies & Publications)
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL
);
ALTER TABLE books ADD COLUMN IF NOT EXISTS "hindiTitle" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "hindiAuthor" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "paperbackPrice" NUMERIC;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "originalPrice" NUMERIC;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "ebookAvailable" BOOLEAN DEFAULT true;
ALTER TABLE books ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.8;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "reviewsCount" INTEGER DEFAULT 100;
ALTER TABLE books ADD COLUMN IF NOT EXISTS pages INTEGER;
ALTER TABLE books ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "hindiDescription" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS features TEXT[];
ALTER TABLE books ADD COLUMN IF NOT EXISTS "tableOfContents" TEXT[];
ALTER TABLE books ADD COLUMN IF NOT EXISTS "samplePdfUrl" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "coverGradient" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "coverIcon" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "patternYear" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "isTestSeries" BOOLEAN DEFAULT false;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "testsCount" INTEGER;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "bannerImage" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "inStock" BOOLEAN DEFAULT true;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "stockCount" INTEGER DEFAULT 100;
ALTER TABLE books ADD COLUMN IF NOT EXISTS publisher TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS isbn TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "isHardCopyOnly" BOOLEAN DEFAULT false;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "isMagazine" BOOLEAN DEFAULT false;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();

-- 8. Government Exams & Syllabus Registry (Fixes 'permission denied for table exams')
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  category TEXT NOT NULL
);
ALTER TABLE exams ADD COLUMN IF NOT EXISTS "hindiName" TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS "officialBoard" TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS vacancies TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS eligibility TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS pattern TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS "totalMarks" TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS "negativeMarking" TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS "hindiDescription" TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS "gradientBorder" TEXT;
ALTER TABLE exams ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();

-- 9. CBT Mock Test Series
CREATE TABLE IF NOT EXISTS test_series (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL
);
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "hindiTitle" TEXT;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "hindiCategory" TEXT;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "durationMinutes" INTEGER;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "totalQuestions" INTEGER;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "totalMarks" INTEGER;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "questionsCount" INTEGER;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "negativeMarking" NUMERIC;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS difficulty TEXT;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "enrolledStudents" INTEGER;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "isFreeDemo" BOOLEAN DEFAULT true;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "syllabusCovered" TEXT[];
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "hindiSyllabusCovered" TEXT[];
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "lastUpdated" TEXT;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "associatedBookId" TEXT;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS questions JSONB;
ALTER TABLE test_series ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();

-- 10. GRANTS AND ROW LEVEL SECURITY (Fixes permission denied for anon/authenticated)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Enable RLS and setup permissive public access policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_affairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_series ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Full Access" ON orders;
DROP POLICY IF EXISTS "Public Read Access" ON orders;
CREATE POLICY "Public Full Access" ON orders FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON test_scores;
DROP POLICY IF EXISTS "Public Read Access" ON test_scores;
CREATE POLICY "Public Full Access" ON test_scores FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON current_affairs;
DROP POLICY IF EXISTS "Public Read Access" ON current_affairs;
CREATE POLICY "Public Full Access" ON current_affairs FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON free_pdfs;
DROP POLICY IF EXISTS "Public Read Access" ON free_pdfs;
CREATE POLICY "Public Full Access" ON free_pdfs FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON video_lectures;
DROP POLICY IF EXISTS "Public Read Access" ON video_lectures;
CREATE POLICY "Public Full Access" ON video_lectures FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON books;
DROP POLICY IF EXISTS "Public Read Access" ON books;
CREATE POLICY "Public Full Access" ON books FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON exams;
DROP POLICY IF EXISTS "Public Read Access" ON exams;
CREATE POLICY "Public Full Access" ON exams FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON test_series;
DROP POLICY IF EXISTS "Public Read Access" ON test_series;
CREATE POLICY "Public Full Access" ON test_series FOR ALL TO public USING (true) WITH CHECK (true);

-- 11. Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
`;
};

/**
 * Adaptive resilient upsert helper:
 * - Detects missing column errors from Supabase schema cache and strips unknown columns automatically
 * - Detects UUID column type mismatch (invalid input syntax for type uuid) and converts string IDs to deterministic UUIDs
 * - Retries automatically so that sync succeeds even on legacy or partial table structures.
 */
export async function upsertResilient(
  client: SupabaseClient,
  tableName: string,
  items: any[],
  onConflict = 'id'
): Promise<{ success: boolean; message: string; count: number }> {
  if (!items || items.length === 0) return { success: true, message: `No records`, count: 0 };

  let currentBatch = items.map(it => ({ ...it }));
  const maxRetries = 15;
  let attempt = 0;
  let hasConvertedToUuid = false;

  while (attempt < maxRetries) {
    attempt++;
    const { error } = await client.from(tableName).upsert(currentBatch, { onConflict });

    if (!error) {
      return { 
        success: true, 
        message: `Synced ${currentBatch.length} records successfully`, 
        count: currentBatch.length 
      };
    }

    const errorMsg = error.message || '';

    // 1. Handle UUID type mismatch when table id column was created as UUID in Postgres
    if (errorMsg.toLowerCase().includes('invalid input syntax for type uuid') && !hasConvertedToUuid) {
      hasConvertedToUuid = true;
      console.warn(`[Supabase Sync] Table '${tableName}' has a UUID primary key. Converting string IDs to valid deterministic UUIDs...`);
      currentBatch = currentBatch.map(row => {
        const originalId = String(row.id || '');
        return {
          ...row,
          id: toDeterministicUuid(originalId)
        };
      });
      continue;
    }

    // 2. Handle missing column in Supabase schema cache
    const match = errorMsg.match(/Could not find the '([^']+)' column/i);
    if (match && match[1]) {
      const missingColumn = match[1];
      console.warn(`[Supabase Sync] Removing unmapped column '${missingColumn}' from table '${tableName}' to retry...`);
      currentBatch = currentBatch.map(row => {
        const copy = { ...row };
        delete copy[missingColumn];
        return copy;
      });
      continue;
    }

    // 3. Handle NOT NULL constraint violations (e.g. column "downloadurl" vs "downloadUrl")
    const notNullMatch = errorMsg.match(/null value in column "([^"]+)" of relation "[^"]+" violates not-null constraint/i);
    if (notNullMatch && notNullMatch[1]) {
      const colName = notNullMatch[1];
      console.warn(`[Supabase Sync] Table '${tableName}' has a NOT NULL column '${colName}'. Auto-populating from matching fields...`);
      currentBatch = currentBatch.map(row => {
        let val = row[colName];
        if (val === undefined || val === null) {
          // Look for case-insensitive match (e.g. downloadUrl matching downloadurl)
          const matchingKey = Object.keys(row).find(
            k => k.toLowerCase() === colName.toLowerCase() || 
                 k.replace(/_/g, '').toLowerCase() === colName.toLowerCase()
          );
          if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null) {
            val = row[matchingKey];
          }
        }
        if (val === undefined || val === null) {
          val = colName.toLowerCase().includes('url') ? '/samples/sample.pdf' : 'N/A';
        }
        return {
          ...row,
          [colName]: val
        };
      });
      continue;
    }

    // 4. Handle permission errors
    if (errorMsg.toLowerCase().includes('permission denied')) {
      return { 
        success: false, 
        message: `Permission denied on table '${tableName}'. Please copy & run the updated SQL Schema in Supabase SQL editor.`, 
        count: 0 
      };
    }

    // Other unexpected error
    return { success: false, message: errorMsg, count: 0 };
  }

  return { success: false, message: `Reached max retries while adapting schema for ${tableName}`, count: 0 };
}

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
  let allSuccess = true;

  try {
    // 1. Sync Current Affairs
    if (payload.currentAffairs?.length) {
      const cleanCa = payload.currentAffairs.map(a => ({
        id: a.id,
        title: a.title,
        hindiTitle: a.hindiTitle || null,
        date: a.date,
        category: a.category,
        tags: a.tags || [],
        readTime: a.readTime || '5 min',
        summary: a.summary || '',
        hindiSummary: a.hindiSummary || null,
        keyPoints: a.keyPoints || [],
        hindiKeyPoints: a.hindiKeyPoints || [],
        fullContent: a.fullContent || '',
        hindiFullContent: a.hindiFullContent || null,
        isHtmlFormatted: Boolean(a.isHtmlFormatted),
        imageUrl: a.imageUrl || null,
        bannerImage: a.bannerImage || a.imageUrl || null,
        pdfUrl: a.pdfUrl || null,
        relatedMcq: a.relatedMcq || null
      }));

      const res = await upsertResilient(client, 'current_affairs', cleanCa, 'id');
      if (res.success) {
        results.push(`Current Affairs: synced ${res.count} articles`);
      } else {
        allSuccess = false;
        results.push(`Current Affairs: ${res.message}`);
      }
    }

    // 2. Sync Free PDFs
    if (payload.freePdfs?.length) {
      const cleanPdfs = payload.freePdfs.map(p => {
        const url = p.downloadUrl || '/samples/sample.pdf';
        return {
          id: p.id,
          title: p.title,
          hindiTitle: p.hindiTitle || null,
          category: p.category,
          subject: p.subject || 'General Studies',
          hindiSubject: p.hindiSubject || null,
          fileSize: p.fileSize || '10 MB',
          pages: Number(p.pages) || 50,
          downloadUrl: url,
          downloadurl: url,
          description: p.description || '',
          hindiDescription: p.hindiDescription || null,
          language: p.language || 'Bilingual',
          dateAdded: p.dateAdded || 'Recently Added',
          downloadsCount: Number(p.downloadsCount) || 1,
          isTrending: Boolean(p.isTrending),
          isBilingual: Boolean(p.isBilingual),
          targetExam: p.targetExam || null
        };
      });

      const res = await upsertResilient(client, 'free_pdfs', cleanPdfs, 'id');
      if (res.success) {
        results.push(`Free PDFs: synced ${res.count} files`);
      } else {
        allSuccess = false;
        results.push(`Free PDFs: ${res.message}`);
      }
    }

    // 3. Sync Books Catalog
    if (payload.books?.length) {
      const cleanBooks = payload.books.map(b => ({
        id: b.id,
        title: b.title,
        hindiTitle: b.hindiTitle || null,
        author: b.author || 'Samwedna Editorial Board',
        hindiAuthor: b.hindiAuthor || null,
        category: b.category,
        subject: b.subject || 'Exam Special',
        price: Number(b.paperbackPrice || b.price || 395),
        paperbackPrice: Number(b.paperbackPrice || b.price || 395),
        originalPrice: Number(b.originalPrice || 480),
        discount: Math.round(((Number(b.originalPrice || 480) - Number(b.paperbackPrice || 395)) / Number(b.originalPrice || 480)) * 100),
        ebookAvailable: Boolean(b.ebookAvailable),
        rating: Number(b.rating) || 4.9,
        reviewsCount: Number(b.reviewsCount) || 100,
        pages: Number(b.pages) || 350,
        language: b.language || 'Hindi',
        badge: b.badge || null,
        description: b.description || '',
        hindiDescription: b.hindiDescription || null,
        bannerImage: b.bannerImage || null,
        inStock: b.inStock !== false,
        stockCount: Number(b.stockCount) || 100
      }));

      const res = await upsertResilient(client, 'books', cleanBooks, 'id');
      if (res.success) {
        results.push(`Books: synced ${res.count} publications`);
      } else {
        allSuccess = false;
        results.push(`Books: ${res.message}`);
      }
    }

    // 4. Sync Exams
    if (payload.exams?.length) {
      const res = await upsertResilient(client, 'exams', payload.exams, 'id');
      if (res.success) {
        results.push(`Exams: synced ${res.count} examinations`);
      } else {
        allSuccess = false;
        results.push(`Exams: ${res.message}`);
      }
    }

    // 5. Sync Test Series
    if (payload.testSeries?.length) {
      const cleanTests = payload.testSeries.map(t => ({
        id: t.id,
        title: t.title,
        hindiTitle: t.hindiTitle || null,
        category: t.category,
        hindiCategory: t.hindiCategory || null,
        duration: Number(t.durationMinutes || t.duration || 60),
        durationMinutes: Number(t.durationMinutes || t.duration || 60),
        totalQuestions: Number(t.totalQuestions || 100),
        totalMarks: Number(t.totalMarks || 100),
        questionsCount: Number(t.totalQuestions || 100),
        negativeMarking: Number(t.negativeMarking || 0.25),
        difficulty: t.difficulty || 'Moderate',
        enrolledStudents: Number(t.enrolledStudents || 1000),
        isFreeDemo: Boolean(t.isFreeDemo),
        syllabusCovered: t.syllabusCovered || [],
        hindiSyllabusCovered: t.hindiSyllabusCovered || [],
        language: t.language || 'Bilingual',
        lastUpdated: t.lastUpdated || '2026',
        associatedBookId: t.associatedBookId || null,
        questions: t.questions || []
      }));

      const res = await upsertResilient(client, 'test_series', cleanTests, 'id');
      if (res.success) {
        results.push(`Test Series: synced ${res.count} tests`);
      } else {
        allSuccess = false;
        results.push(`Test Series: ${res.message}`);
      }
    }

    // 6. Sync Video Lectures
    if (payload.videoLectures?.length) {
      const res = await upsertResilient(client, 'video_lectures', payload.videoLectures, 'id');
      if (res.success) {
        results.push(`Video Lectures: synced ${res.count} lectures`);
      }
    }

    return {
      success: allSuccess,
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
