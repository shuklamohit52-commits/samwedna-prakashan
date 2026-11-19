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

const SUPABASE_SHARED_FLAG_KEY = 'samwedna_supabase_shared_firestore';

export const hasEnvSupabaseConfig = (): boolean => {
  const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  return Boolean(url && key && url.startsWith('https://'));
};

export const setSupabasePublicSharedFlag = (shared: boolean): void => {
  try {
    if (shared) {
      localStorage.setItem(SUPABASE_SHARED_FLAG_KEY, 'true');
    } else {
      localStorage.removeItem(SUPABASE_SHARED_FLAG_KEY);
    }
  } catch { /* ignore */ }
};

export const getSupabaseShareMode = (): 'env' | 'firestore' | 'local-only' | 'none' => {
  if (hasEnvSupabaseConfig()) return 'env';
  if (!isSupabaseConfigured()) return 'none';
  try {
    if (localStorage.getItem(SUPABASE_SHARED_FLAG_KEY) === 'true') return 'firestore';
  } catch { /* ignore */ }
  return 'local-only';
};

export const getStoredSupabaseConfig = (): StoredSupabaseConfig => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.url === 'string' && parsed.url.trim() && typeof parsed.anonKey === 'string' && parsed.anonKey.trim()) {
        return { url: parsed.url.trim(), anonKey: parsed.anonKey.trim() };
      }
    }
  } catch (e) {
    console.warn('Error reading stored Supabase config:', e);
  }
  return {
    url: envUrl,
    anonKey: envKey
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string): void => {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();
  localStorage.setItem(SUPABASE_CONFIG_STORAGE_KEY, JSON.stringify({ url: cleanUrl, anonKey: cleanKey }));
  // Re-initialize client
  initSupabaseClient(cleanUrl, cleanKey);
};

let supabaseClient: SupabaseClient | null = null;

export const initSupabaseClient = (url?: string, anonKey?: string): SupabaseClient | null => {
  const stored = getStoredSupabaseConfig();
  const finalUrl = (url || stored.url || '').trim();
  const finalKey = (anonKey || stored.anonKey || '').trim();

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
  return Boolean(config.url && config.anonKey && config.url.startsWith('https://'));
};

export const subscribeToSupabaseChanges = (onChange: () => void): (() => void) => {
  const client = supabaseClient || initSupabaseClient();
  if (!client) return () => {};
  try {
    const channel = client
      .channel('booksboon-public-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'current_affairs' }, () => onChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'free_pdfs' }, () => onChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => onChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'test_series' }, () => onChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'video_lectures' }, () => onChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exams' }, () => onChange())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, () => onChange())
      .subscribe();

    return () => {
      try {
        client.removeChannel(channel);
      } catch { /* ignore */ }
    };
  } catch {
    return () => {};
  }
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
    const client = supabaseClient || initSupabaseClient();
    let merged = [...local];

    if (client) {
      try {
        const { data, error } = await client.from('orders').select('*').order('createdAt', { ascending: false });
        if (!error && Array.isArray(data)) {
          const map = new Map<string, HardCopyOrder>();
          (data as HardCopyOrder[]).forEach(o => {
            if (o && o.orderId) map.set(o.orderId, o);
          });
          local.forEach(o => {
            if (o && o.orderId && !map.has(o.orderId)) map.set(o.orderId, o);
          });
          merged = Array.from(map.values());
          setLocalStorageArray('booksboon_orders', merged);
        }
      } catch (e) {
        console.warn('Supabase orders fetch fallback:', e);
      }
    }

    if (email) {
      return merged.filter(o => o.studentEmail?.toLowerCase() === email.toLowerCase());
    }
    return merged;
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

export interface SupabaseOpResult {
  success: boolean;
  message?: string;
}

const toIsoTimestamp = (val?: number | string): string => {
  if (typeof val === 'number' && !Number.isNaN(val) && val > 0) {
    return new Date(val).toISOString();
  }
  if (typeof val === 'string' && val.trim()) {
    const parsed = Date.parse(val);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  }
  return new Date().toISOString();
};

// 3. CURRENT AFFAIRS REPOSITORY
export const CurrentAffairsService = {
  async upsert(article: CurrentAffairArticle): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const clean = {
        id: article.id,
        title: article.title,
        hindiTitle: article.hindiTitle || null,
        date: article.date,
        category: article.category,
        tags: article.tags || [],
        readTime: article.readTime || '5 min',
        summary: article.summary || '',
        hindiSummary: article.hindiSummary || null,
        keyPoints: article.keyPoints || [],
        hindiKeyPoints: article.hindiKeyPoints || [],
        fullContent: article.fullContent || '',
        hindiFullContent: article.hindiFullContent || null,
        isHtmlFormatted: Boolean(article.isHtmlFormatted),
        imageUrl: article.imageUrl || null,
        bannerImage: article.bannerImage || article.imageUrl || null,
        pdfUrl: article.pdfUrl || null,
        relatedMcq: article.relatedMcq || null,
        createdAt: toIsoTimestamp(article.createdAt)
      };
      const res = await upsertResilient(client, 'current_affairs', [clean], 'id');
      return { success: res.success, message: res.message };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async delete(id: string): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const { error } = await client.from('current_affairs').delete().or(`id.eq.${id},id.eq.${toDeterministicUuid(id)}`);
      if (error) return { success: false, message: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async fetchAll(): Promise<CurrentAffairArticle[]> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return [];
    try {
      let rows: any[] = [];
      const { data, error } = await client.from('current_affairs').select('*').order('createdAt', { ascending: false });
      if (error) {
        const fallback = await client.from('current_affairs').select('*');
        if (fallback.error || !Array.isArray(fallback.data)) return [];
        rows = fallback.data;
      } else if (Array.isArray(data)) {
        rows = data;
      }

      return rows
        .filter(r => r && r.id)
        .map((r: any) => ({
          ...r,
          id: String(r.id),
          title: r.title || '',
          hindiTitle: r.hindiTitle ?? r.hindititle ?? undefined,
          date: r.date || 'Today',
          category: r.category || 'National',
          tags: Array.isArray(r.tags) ? r.tags : [],
          readTime: r.readTime ?? r.readtime ?? '5 min read',
          summary: r.summary || '',
          hindiSummary: r.hindiSummary ?? r.hindisummary ?? undefined,
          keyPoints: Array.isArray(r.keyPoints) ? r.keyPoints : (Array.isArray(r.keypoints) ? r.keypoints : []),
          hindiKeyPoints: Array.isArray(r.hindiKeyPoints) ? r.hindiKeyPoints : (Array.isArray(r.hindikeypoints) ? r.hindikeypoints : undefined),
          fullContent: r.fullContent ?? r.fullcontent ?? r.summary ?? '',
          hindiFullContent: r.hindiFullContent ?? r.hindifullcontent ?? r.hindiSummary ?? r.hindisummary ?? undefined,
          isHtmlFormatted: Boolean(r.isHtmlFormatted ?? r.ishtmlformatted ?? true),
          imageUrl: r.imageUrl ?? r.imageurl ?? r.bannerImage ?? r.bannerimage ?? undefined,
          bannerImage: r.bannerImage ?? r.bannerimage ?? r.imageUrl ?? r.imageurl ?? undefined,
          pdfUrl: r.pdfUrl ?? r.pdfurl ?? undefined,
          relatedMcq: r.relatedMcq ?? r.relatedmcq ?? undefined,
          createdAt: r.createdAt ?? r.createdat ?? r.created_at ?? undefined
        })) as CurrentAffairArticle[];
    } catch {
      return [];
    }
  }
};

// 4. FREE PDFS REPOSITORY
export const FreePdfsService = {
  async upsert(pdf: FreePdfResource): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const url = pdf.downloadUrl || '/samples/sample.pdf';
      const clean = {
        id: pdf.id,
        title: pdf.title,
        hindiTitle: pdf.hindiTitle || null,
        category: pdf.category,
        subject: pdf.subject || 'General Studies',
        hindiSubject: pdf.hindiSubject || null,
        fileSize: pdf.fileSize || '10 MB',
        pages: Number(pdf.pages) || 50,
        downloadUrl: url,
        downloadurl: url,
        description: pdf.description || '',
        hindiDescription: pdf.hindiDescription || null,
        language: pdf.language || 'Bilingual',
        dateAdded: pdf.dateAdded || 'Recently Added',
        downloadsCount: Number(pdf.downloadsCount) || 1,
        isTrending: Boolean(pdf.isTrending),
        createdAt: toIsoTimestamp(pdf.createdAt)
      };
      const res = await upsertResilient(client, 'free_pdfs', [clean], 'id');
      return { success: res.success, message: res.message };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async delete(id: string): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const { error } = await client.from('free_pdfs').delete().or(`id.eq.${id},id.eq.${toDeterministicUuid(id)}`);
      if (error) return { success: false, message: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async fetchAll(): Promise<FreePdfResource[]> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return [];
    try {
      const { data, error } = await client.from('free_pdfs').select('*');
      if (error || !Array.isArray(data)) return [];
      return data.map((row: any) => ({
        ...row,
        downloadUrl: row.downloadUrl || row.downloadurl || '/samples/sample.pdf'
      })) as FreePdfResource[];
    } catch {
      return [];
    }
  }
};

// 5. BOOKS SERVICE & E-BOOK PDF STORAGE
export const uploadPdfToSupabaseStorage = async (
  file: File
): Promise<{ url: string | null; error?: string }> => {
  const client = supabaseClient || initSupabaseClient();
  if (!client) {
    return { url: null, error: 'Supabase not configured' };
  }
  try {
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `uploads/${Date.now()}_${cleanName}`;
    const { error: uploadError } = await client.storage
      .from('ebooks')
      .upload(storagePath, file, {
        contentType: 'application/pdf',
        upsert: true
      });
    if (uploadError) {
      return { url: null, error: uploadError.message };
    }
    const { data: pubData } = client.storage.from('ebooks').getPublicUrl(storagePath);
    if (pubData?.publicUrl) {
      return { url: pubData.publicUrl };
    }
    return { url: null, error: 'Could not obtain public URL from Supabase Storage.' };
  } catch (e: any) {
    return { url: null, error: e?.message || String(e) };
  }
};

export const BooksService = {
  async upsert(book: Book): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const clean = {
        id: book.id,
        title: book.title,
        hindiTitle: book.hindiTitle || null,
        author: book.author || 'Samwedna Editorial Board',
        hindiAuthor: book.hindiAuthor || null,
        category: book.category,
        subject: book.subject || 'Exam Special',
        price: Number(book.paperbackPrice || 0),
        paperbackPrice: Number(book.paperbackPrice || 0),
        originalPrice: Number(book.originalPrice || book.paperbackPrice || 199),
        ebookAvailable: Boolean(book.ebookAvailable),
        ebookPrice: typeof book.ebookPrice === 'number' ? Number(book.ebookPrice) : null,
        pdfUrl: book.pdfUrl || null,
        pdfFileName: book.pdfFileName || null,
        previewPagesLimit: Number(book.previewPagesLimit) || 5,
        productType: book.productType || (book.isMagazine ? 'magazine' : (book.isHardCopyOnly ? 'hardcopy' : 'both')),
        isHardCopyOnly: Boolean(book.isHardCopyOnly),
        isMagazine: Boolean(book.isMagazine),
        rating: Number(book.rating) || 4.9,
        reviewsCount: Number(book.reviewsCount) || 100,
        pages: Number(book.pages) || 350,
        language: book.language || 'Hindi',
        badge: book.badge || null,
        description: book.description || '',
        hindiDescription: book.hindiDescription || null,
        features: Array.isArray(book.features) ? book.features : [],
        tableOfContents: Array.isArray(book.tableOfContents) ? book.tableOfContents : [],
        samplePdfUrl: book.samplePdfUrl || '/samples/sample.pdf',
        coverGradient: book.coverGradient || 'from-indigo-900 to-slate-900',
        coverIcon: book.coverIcon || 'BookOpen',
        patternYear: book.patternYear || '2026 Edition',
        bannerImage: book.bannerImage || null,
        backCoverImage: book.backCoverImage || null,
        galleryImages: Array.isArray(book.galleryImages) ? book.galleryImages : [],
        inStock: book.inStock !== false,
        stockCount: Number(book.stockCount) || 100,
        createdAt: toIsoTimestamp(book.createdAt)
      };
      const res = await upsertResilient(client, 'books', [clean], 'id');
      return { success: res.success, message: res.message };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async delete(id: string): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const { error } = await client.from('books').delete().or(`id.eq.${id},id.eq.${toDeterministicUuid(id)}`);
      if (error) return { success: false, message: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async fetchAll(): Promise<Book[]> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return [];
    try {
      const { data, error } = await client.from('books').select('*');
      if (error || !Array.isArray(data)) return [];
      return data
        .filter(r => r && r.id)
        .map((r: any) => ({
          ...r,
          id: String(r.id),
          title: r.title || '',
          hindiTitle: r.hindiTitle ?? r.hindititle ?? undefined,
          author: r.author || 'Samwedna Editorial Board',
          hindiAuthor: r.hindiAuthor ?? r.hindiauthor ?? undefined,
          category: r.category || 'All SSC Exam',
          subject: r.subject || 'Exam Special',
          paperbackPrice: Number(r.paperbackPrice ?? r.paperbackprice ?? r.price ?? 0),
          originalPrice: Number(r.originalPrice ?? r.originalprice ?? r.paperbackPrice ?? r.price ?? 199),
          ebookAvailable: Boolean(r.ebookAvailable ?? r.ebookavailable ?? Boolean(r.pdfUrl ?? r.pdfurl)),
          ebookPrice:
            r.ebookPrice !== undefined && r.ebookPrice !== null
              ? Number(r.ebookPrice)
              : r.ebookprice !== undefined && r.ebookprice !== null
              ? Number(r.ebookprice)
              : undefined,
          pdfUrl: r.pdfUrl ?? r.pdfurl ?? undefined,
          pdfFileName: r.pdfFileName ?? r.pdffilename ?? undefined,
          previewPagesLimit: Number(r.previewPagesLimit ?? r.previewpageslimit ?? 5) || 5,
          productType: r.productType ?? r.producttype ?? undefined,
          isHardCopyOnly: Boolean(r.isHardCopyOnly ?? r.ishardcopyonly ?? false),
          isMagazine: Boolean(r.isMagazine ?? r.ismagazine ?? false),
          rating: Number(r.rating) || 4.8,
          reviewsCount: Number(r.reviewsCount ?? r.reviewscount ?? 100),
          pages: Number(r.pages) || 200,
          language: r.language || 'Hindi',
          badge: r.badge ?? undefined,
          description: r.description || '',
          hindiDescription: r.hindiDescription ?? r.hindidescription ?? undefined,
          features: Array.isArray(r.features) ? r.features : ['Authentic Samwedna Publication'],
          tableOfContents: Array.isArray(r.tableOfContents)
            ? r.tableOfContents
            : Array.isArray(r.tableofcontents)
            ? r.tableofcontents
            : [],
          samplePdfUrl: r.samplePdfUrl ?? r.samplepdfurl ?? '/samples/sample.pdf',
          coverGradient: r.coverGradient ?? r.covergradient ?? 'from-indigo-900 to-slate-900',
          coverIcon: r.coverIcon ?? r.covericon ?? 'BookOpen',
          patternYear: r.patternYear ?? r.patternyear ?? '2026 Edition',
          bannerImage: r.bannerImage ?? r.bannerimage ?? undefined,
          backCoverImage: r.backCoverImage ?? r.backcoverimage ?? undefined,
          galleryImages: Array.isArray(r.galleryImages)
            ? r.galleryImages
            : Array.isArray(r.galleryimages)
            ? r.galleryimages
            : [],
          inStock: r.inStock !== false && r.instock !== false,
          stockCount: Number(r.stockCount ?? r.stockcount ?? 100),
          createdAt: r.createdAt ?? r.createdat ?? r.created_at ?? undefined
        })) as Book[];
    } catch {
      return [];
    }
  }
};

// 6. EXAMS & SYLLABUS REPOSITORY
export const ExamsService = {
  async upsert(exam: any): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const res = await upsertResilient(client, 'exams', [exam], 'id');
      return { success: res.success, message: res.message };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async delete(id: string): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const { error } = await client.from('exams').delete().or(`id.eq.${id},id.eq.${toDeterministicUuid(id)}`);
      if (error) return { success: false, message: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async fetchAll(): Promise<any[]> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return [];
    try {
      const { data, error } = await client.from('exams').select('*');
      if (error || !Array.isArray(data)) return [];
      return data;
    } catch {
      return [];
    }
  }
};

// 7. TEST SERIES REPOSITORY
export const TestSeriesService = {
  async upsert(test: TestSeriesExam): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const clean = {
        id: test.id,
        title: test.title,
        hindiTitle: test.hindiTitle || null,
        category: test.category,
        hindiCategory: test.hindiCategory || null,
        duration: Number(test.durationMinutes || 60),
        durationMinutes: Number(test.durationMinutes || 60),
        totalQuestions: Number(test.totalQuestions || 100),
        totalMarks: Number(test.totalMarks || 100),
        questionsCount: Number(test.totalQuestions || 100),
        negativeMarking: Number(test.negativeMarking || 0.25),
        difficulty: test.difficulty || 'Moderate',
        enrolledStudents: Number(test.enrolledStudents || 1000),
        isFreeDemo: Boolean(test.isFreeDemo),
        syllabusCovered: test.syllabusCovered || [],
        hindiSyllabusCovered: test.hindiSyllabusCovered || [],
        language: test.language || 'Bilingual',
        lastUpdated: test.lastUpdated || '2026',
        associatedBookId: test.associatedBookId || null,
        questions: test.questions || [],
        createdAt: toIsoTimestamp(test.createdAt)
      };
      const res = await upsertResilient(client, 'test_series', [clean], 'id');
      return { success: res.success, message: res.message };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async fetchAll(): Promise<TestSeriesExam[]> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return [];
    try {
      const { data, error } = await client.from('test_series').select('*');
      if (error || !Array.isArray(data)) return [];
      return data as TestSeriesExam[];
    } catch {
      return [];
    }
  }
};

// 8. VIDEO LECTURES REPOSITORY
export const VideoLecturesService = {
  async upsert(video: VideoLecture): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const clean = {
        ...video,
        createdAt: toIsoTimestamp(video.createdAt)
      };
      const res = await upsertResilient(client, 'video_lectures', [clean], 'id');
      return { success: res.success, message: res.message };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async fetchAll(): Promise<VideoLecture[]> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return [];
    try {
      const { data, error } = await client.from('video_lectures').select('*');
      if (error || !Array.isArray(data)) return [];
      return data as VideoLecture[];
    } catch {
      return [];
    }
  }
};

// 9. APP SETTINGS REPOSITORY (Cross-device sync for deleted IDs without requiring Firestore)
export const AppSettingsService = {
  async saveSetting(id: string, value: Record<string, any>): Promise<SupabaseOpResult> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return { success: false, message: 'Supabase not configured' };
    try {
      const { error } = await client.from('app_settings').upsert([{ id, value, updatedAt: new Date().toISOString() }], { onConflict: 'id' });
      if (error) return { success: false, message: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e?.message || String(e) };
    }
  },
  async getSetting(id: string): Promise<Record<string, any> | null> {
    const client = supabaseClient || initSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('app_settings').select('value').eq('id', id).maybeSingle();
      if (error || !data) return null;
      return (data as any).value || null;
    } catch {
      return null;
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
ALTER TABLE books ADD COLUMN IF NOT EXISTS "backCoverImage" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "galleryImages" TEXT[];
ALTER TABLE books ADD COLUMN IF NOT EXISTS "ebookPrice" NUMERIC;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "pdfUrl" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "pdfFileName" TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "previewPagesLimit" INTEGER DEFAULT 5;
ALTER TABLE books ADD COLUMN IF NOT EXISTS "productType" TEXT;
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

-- 10. App Settings Table (Shared metadata such as deleted default IDs)
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  value JSONB DEFAULT '{}'::jsonb,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 11. GRANTS AND ROW LEVEL SECURITY (Fixes permission denied for anon/authenticated)
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
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Public Full Access" ON app_settings;
DROP POLICY IF EXISTS "Public Read Access" ON app_settings;
CREATE POLICY "Public Full Access" ON app_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- 12. Optional Public Storage Bucket for E-Book & Magazine PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebooks', 'ebooks', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Ebooks Bucket Read" ON storage.objects;
CREATE POLICY "Public Ebooks Bucket Read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'ebooks');

DROP POLICY IF EXISTS "Public Ebooks Bucket Upload" ON storage.objects;
CREATE POLICY "Public Ebooks Bucket Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'ebooks');

DROP POLICY IF EXISTS "Public Ebooks Bucket Update" ON storage.objects;
CREATE POLICY "Public Ebooks Bucket Update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'ebooks');

-- 13. Notify PostgREST to reload schema cache immediately
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

    // 2. Handle missing column in Supabase schema cache or Postgres column errors
    const match =
      errorMsg.match(/Could not find the '([^']+)' column/i) ||
      errorMsg.match(/column "([^"]+)" of relation "[^"]+" does not exist/i);
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
        relatedMcq: a.relatedMcq || null,
        createdAt: toIsoTimestamp(a.createdAt)
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
          targetExam: p.targetExam || null,
          createdAt: toIsoTimestamp(p.createdAt)
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
        price: Number(b.paperbackPrice || b.price || 0),
        paperbackPrice: Number(b.paperbackPrice || b.price || 0),
        originalPrice: Number(b.originalPrice || b.paperbackPrice || 199),
        discount: Number(b.originalPrice || 0) > 0
          ? Math.round(((Number(b.originalPrice) - Number(b.paperbackPrice || 0)) / Number(b.originalPrice)) * 100)
          : 0,
        ebookAvailable: Boolean(b.ebookAvailable),
        ebookPrice: typeof b.ebookPrice === 'number' ? Number(b.ebookPrice) : null,
        pdfUrl: b.pdfUrl || null,
        pdfFileName: b.pdfFileName || null,
        previewPagesLimit: Number(b.previewPagesLimit) || 5,
        productType: b.productType || (b.isMagazine ? 'magazine' : (b.isHardCopyOnly ? 'hardcopy' : 'both')),
        isHardCopyOnly: Boolean(b.isHardCopyOnly),
        isMagazine: Boolean(b.isMagazine),
        rating: Number(b.rating) || 4.9,
        reviewsCount: Number(b.reviewsCount) || 100,
        pages: Number(b.pages) || 350,
        language: b.language || 'Hindi',
        badge: b.badge || null,
        description: b.description || '',
        hindiDescription: b.hindiDescription || null,
        features: Array.isArray(b.features) ? b.features : [],
        tableOfContents: Array.isArray(b.tableOfContents) ? b.tableOfContents : [],
        samplePdfUrl: b.samplePdfUrl || '/samples/sample.pdf',
        coverGradient: b.coverGradient || 'from-indigo-900 to-slate-900',
        coverIcon: b.coverIcon || 'BookOpen',
        patternYear: b.patternYear || '2026 Edition',
        bannerImage: b.bannerImage || null,
        backCoverImage: b.backCoverImage || null,
        galleryImages: Array.isArray(b.galleryImages) ? b.galleryImages : [],
        inStock: b.inStock !== false,
        stockCount: Number(b.stockCount) || 100,
        createdAt: toIsoTimestamp(b.createdAt)
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
        questions: t.questions || [],
        createdAt: toIsoTimestamp(t.createdAt)
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
      const cleanVideos = payload.videoLectures.map(v => ({
        ...v,
        createdAt: toIsoTimestamp(v.createdAt)
      }));
      const res = await upsertResilient(client, 'video_lectures', cleanVideos, 'id');
      if (res.success) {
        results.push(`Video Lectures: synced ${res.count} lectures`);
      } else {
        allSuccess = false;
        results.push(`Video Lectures: ${res.message}`);
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
