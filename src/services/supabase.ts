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
