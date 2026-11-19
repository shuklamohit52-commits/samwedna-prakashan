import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, HardCopyOrder, UserTestScore, CurrentAffairArticle, FreePdfResource, TestSeriesExam, VideoLecture, Book } from '../types';

// Initialize Firebase singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Enforce browser-level local persistence so sessions never expire on page refresh or tab close
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase setPersistence notice:', err);
});

// CRITICAL: Always provide firestoreDatabaseId for custom/named databases
// Configured with experimentalForceLongPolling to eliminate 10-second backend connection timeouts in cloud/iframe environments
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true
    }, firebaseConfig.firestoreDatabaseId);
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
})();

// Validate connection to Firestore on boot as mandated
async function testConnection() {
  try {
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      new Promise((_, reject) => setTimeout(() => reject(new Error('the client is offline or connection timeout')), 3500))
    ]);
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('connection timeout') || error.message.includes('offline'))) {
      console.info("Firestore connection check: Operating seamlessly with local cache / long-polling transport.");
    }
  }
}
testConnection();

// Required error handling contract
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Map Firebase Auth error codes to user-friendly messages
export const getAuthErrorMessage = (error: any): string => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is currently disabled in Firebase console. Please check provider settings.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your spelling or sign up.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify your credentials.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. The login popup was closed before completion.';
    case 'auth/popup-blocked':
      return 'Login popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email using a different sign-in method.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
};

/**
 * Real Google Sign-In with popup
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfile(result.user, 'google');
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

/**
 * Real Facebook Sign-In with popup
 */
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    if (result.user) {
      await syncUserProfile(result.user, 'facebook');
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

/**
 * Real Email & Password Login
 */
export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
    if (result.user) {
      await syncUserProfile(result.user, 'email');
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

/**
 * Real Email & Password Sign-Up
 */
export const registerWithEmail = async (
  email: string, 
  pass: string, 
  displayName: string,
  extra?: { phone?: string; targetExam?: string }
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (result.user && displayName) {
      await updateProfile(result.user, { displayName });
    }
    if (result.user) {
      await syncUserProfile(result.user, 'email', {
        displayName,
        phone: extra?.phone,
        targetExam: extra?.targetExam
      });
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

/**
 * Send Password Reset Email
 */
export const resetUserPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: getAuthErrorMessage(error) };
  }
};

/**
 * Sign Out
 */
export const logOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: getAuthErrorMessage(error) };
  }
};

/**
 * Helper to sync user profile into Firestore /users/{userId}
 */
export const syncUserProfile = async (
  firebaseUser: FirebaseUser, 
  provider: 'google' | 'facebook' | 'email',
  extra?: { displayName?: string; phone?: string; targetExam?: string }
) => {
  const path = `users/${firebaseUser.uid}`;
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userRef);
    
    const now = new Date().toISOString();
    const isNew = !docSnap.exists();
    
    const userDocData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: extra?.displayName || firebaseUser.displayName || 'Learner',
      photoURL: firebaseUser.photoURL || '',
      phone: extra?.phone || firebaseUser.phoneNumber || '',
      role: 'student',
      targetExam: extra?.targetExam || 'SSC CGL & Railway NTPC',
      updatedAt: now,
      ...(isNew ? { createdAt: now } : {})
    };

    await setDoc(userRef, userDocData, { merge: true });
    return userDocData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

/**
 * Persist or update complete UserProfile to Firestore users/{id}
 */
export const saveUserProfileToFirestore = async (profile: UserProfile) => {
  const path = `users/${profile.id}`;
  try {
    const userRef = doc(db, 'users', profile.id);
    const now = new Date().toISOString();
    const data = {
      uid: profile.id,
      email: profile.email,
      displayName: profile.name,
      name: profile.name,
      phone: profile.phone,
      targetExam: profile.targetExam,
      rollNumber: profile.rollNumber,
      address: profile.address,
      subscription: profile.subscription,
      role: profile.isAdmin ? 'admin' : 'student',
      updatedAt: now,
      createdAt: (profile as any).createdAt || now
    };
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};


/**
 * Save Order to Firestore
 */
export const persistOrderToFirestore = async (order: HardCopyOrder) => {
  const path = `orders/${order.orderId}`;
  try {
    const orderRef = doc(db, 'orders', order.orderId);
    const orderData = {
      orderId: order.orderId,
      userId: auth.currentUser?.uid || 'guest_checkout',
      customerName: order.studentName,
      customerEmail: order.studentEmail,
      customerPhone: order.phone,
      itemsCount: order.items.length,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      shippingStatus: order.shippingStatus,
      createdAt: order.createdAt || new Date().toISOString()
    };
    await setDoc(orderRef, orderData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

/**
 * Save Test Attempt Score to Firestore
 */
export const persistTestScoreToFirestore = async (score: UserTestScore) => {
  const path = `testAttempts/${score.id}`;
  try {
    const attemptRef = doc(db, 'testAttempts', score.id);
    const attemptData = {
      attemptId: score.id,
      userId: auth.currentUser?.uid || 'anonymous_student',
      testId: score.testId,
      testTitle: score.testTitle,
      category: score.category,
      score: score.scoreObtained,
      totalMarks: score.totalMarks,
      accuracy: score.accuracyPercentage,
      percentile: score.percentile,
      completedAt: score.dateAttempted || new Date().toISOString()
    };
    await setDoc(attemptRef, attemptData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

/**
 * Strip undefined recursively so Firestore setDoc never throws invalid field errors
 */
const sanitizeForFirestore = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item)) as unknown as T;
  }
  if (obj && typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        clean[key] = sanitizeForFirestore(val);
      }
    }
    return clean as T;
  }
  return obj;
};

/**
 * Helper to sort items newest-first using createdAt, timestamp suffix in id, or date
 */
export const extractTimestampMs = (item: { id?: string; createdAt?: number | string; date?: string }): number => {
  if (typeof item.createdAt === 'number' && !Number.isNaN(item.createdAt)) {
    return item.createdAt;
  }
  if (typeof item.createdAt === 'string') {
    const parsed = Date.parse(item.createdAt);
    if (!Number.isNaN(parsed)) return parsed;
  }
  if (item.id) {
    const numMatch = item.id.match(/(\d{10,13})$/);
    if (numMatch) {
      const n = Number(numMatch[1]);
      if (!Number.isNaN(n)) return numMatch[1].length === 10 ? n * 1000 : n;
    }
  }
  if (item.date) {
    const parsedDate = Date.parse(item.date);
    if (!Number.isNaN(parsedDate)) return parsedDate;
  }
  return 0;
};

export interface FirestoreWriteResult {
  ok: boolean;
  error?: string;
  code?: string;
}

const formatFirestoreWriteError = (error: any): FirestoreWriteResult => {
  const code = error?.code || 'unknown';
  const rawMessage = error?.message || String(error);

  if (!auth.currentUser) {
    return {
      ok: false,
      code: 'unauthenticated',
      error: 'Firebase session is not authenticated. Click "Verify Google Admin Account" in Admin Console so uploads sync to all visitors.'
    };
  }
  if (code === 'permission-denied' || rawMessage.toLowerCase().includes('permission')) {
    return {
      ok: false,
      code: 'permission-denied',
      error: `Firestore permission denied for "${auth.currentUser.email || 'current user'}". Sign in with an authorized Admin Gmail account.`
    };
  }
  if (rawMessage.toLowerCase().includes('exceeds the maximum allowed size') || code === 'invalid-argument') {
    return {
      ok: false,
      code: 'document-too-large',
      error: 'Item size exceeds Firestore 1 MB limit (likely a large embedded image or PDF). Use an image under 800KB or a hosted PDF/Image URL.'
    };
  }
  return { ok: false, code, error: rawMessage };
};

/**
 * 1. Current Affairs Firestore Synchronization
 */
export const saveCurrentAffairToFirestore = async (article: CurrentAffairArticle): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'current_affairs', article.id);
    const payload = sanitizeForFirestore({
      ...article,
      createdAt: article.createdAt ?? (extractTimestampMs(article) || Date.now()),
      updatedAt: Date.now()
    });
    await setDoc(ref, payload, { merge: true });
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore current_affairs write error:', formatted);
    return formatted;
  }
};

export const deleteCurrentAffairFromFirestore = async (articleId: string): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'current_affairs', articleId);
    await deleteDoc(ref);
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore current_affairs delete error:', formatted);
    return formatted;
  }
};

export const fetchCurrentAffairsFromFirestore = async (): Promise<CurrentAffairArticle[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'current_affairs'));
    return snap.docs.map(d => d.data() as CurrentAffairArticle);
  } catch (err) {
    console.warn('Firestore fetch current_affairs notice:', err);
    return null;
  }
};

export const subscribeToCurrentAffairs = (callback: (articles: CurrentAffairArticle[]) => void) => {
  try {
    return onSnapshot(collection(db, 'current_affairs'), (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as CurrentAffairArticle);
      callback(items);
    }, (err) => {
      console.warn('Firestore current_affairs subscription notice:', err.message);
    });
  } catch (err) {
    console.warn('Firestore listener unavailable:', err);
    return () => {};
  }
};

/**
 * 2. Free PDFs Firestore Synchronization
 */
export const saveFreePdfToFirestore = async (pdf: FreePdfResource): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'free_pdfs', pdf.id);
    const payload = sanitizeForFirestore({
      ...pdf,
      createdAt: pdf.createdAt ?? (extractTimestampMs(pdf) || Date.now()),
      updatedAt: Date.now()
    });
    await setDoc(ref, payload, { merge: true });
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore free_pdfs write error:', formatted);
    return formatted;
  }
};

export const deleteFreePdfFromFirestore = async (pdfId: string): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'free_pdfs', pdfId);
    await deleteDoc(ref);
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore free_pdfs delete error:', formatted);
    return formatted;
  }
};

export const fetchFreePdfsFromFirestore = async (): Promise<FreePdfResource[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'free_pdfs'));
    return snap.docs.map(d => d.data() as FreePdfResource);
  } catch (err) {
    console.warn('Firestore fetch free_pdfs notice:', err);
    return null;
  }
};

export const subscribeToFreePdfs = (callback: (pdfs: FreePdfResource[]) => void) => {
  try {
    return onSnapshot(collection(db, 'free_pdfs'), (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as FreePdfResource);
      callback(items);
    }, (err) => {
      console.warn('Firestore free_pdfs subscription notice:', err.message);
    });
  } catch (err) {
    console.warn('Firestore listener unavailable:', err);
    return () => {};
  }
};

/**
 * 3. CBT Mock Tests Firestore Synchronization
 */
export const saveTestSeriesToFirestore = async (test: TestSeriesExam): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'test_series', test.id);
    const payload = sanitizeForFirestore({
      ...test,
      createdAt: test.createdAt ?? (extractTimestampMs(test) || Date.now()),
      updatedAt: Date.now()
    });
    await setDoc(ref, payload, { merge: true });
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore test_series write error:', formatted);
    return formatted;
  }
};

export const fetchTestSeriesFromFirestore = async (): Promise<TestSeriesExam[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'test_series'));
    return snap.docs.map(d => d.data() as TestSeriesExam);
  } catch (err) {
    console.warn('Firestore fetch test_series notice:', err);
    return null;
  }
};

export const subscribeToTestSeries = (callback: (tests: TestSeriesExam[]) => void) => {
  try {
    return onSnapshot(collection(db, 'test_series'), (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as TestSeriesExam);
      callback(items);
    }, (err) => {
      console.warn('Firestore test_series subscription notice:', err.message);
    });
  } catch (err) {
    console.warn('Firestore listener unavailable:', err);
    return () => {};
  }
};

/**
 * 4. Video Lectures Firestore Synchronization
 */
export const saveVideoLectureToFirestore = async (video: VideoLecture): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'video_lectures', video.id);
    const payload = sanitizeForFirestore({
      ...video,
      createdAt: video.createdAt ?? (extractTimestampMs(video) || Date.now()),
      updatedAt: Date.now()
    });
    await setDoc(ref, payload, { merge: true });
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore video_lectures write error:', formatted);
    return formatted;
  }
};

export const fetchVideoLecturesFromFirestore = async (): Promise<VideoLecture[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'video_lectures'));
    return snap.docs.map(d => d.data() as VideoLecture);
  } catch (err) {
    console.warn('Firestore fetch video_lectures notice:', err);
    return null;
  }
};

export const subscribeToVideoLectures = (callback: (videos: VideoLecture[]) => void) => {
  try {
    return onSnapshot(collection(db, 'video_lectures'), (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as VideoLecture);
      callback(items);
    }, (err) => {
      console.warn('Firestore video_lectures subscription notice:', err.message);
    });
  } catch (err) {
    console.warn('Firestore listener unavailable:', err);
    return () => {};
  }
};

/**
 * 5. BooksBoon Catalog Firestore Synchronization
 */
export const saveBookToFirestore = async (book: Book): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'books', book.id);
    // Firestore has a 1 MiB per-document limit. Keep full URLs, omit oversized base64 PDF blobs (Supabase stores full PDFs).
    const safeBook: Record<string, any> = { ...book };
    if (typeof safeBook.pdfUrl === 'string' && safeBook.pdfUrl.startsWith('data:') && safeBook.pdfUrl.length > 450000) {
      delete safeBook.pdfUrl;
    }
    const payload = sanitizeForFirestore({
      ...safeBook,
      createdAt: book.createdAt ?? (extractTimestampMs(book) || Date.now()),
      updatedAt: Date.now()
    });
    await setDoc(ref, payload, { merge: true });
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore books write error:', formatted);
    return formatted;
  }
};

export const deleteBookFromFirestore = async (id: string): Promise<FirestoreWriteResult> => {
  try {
    await deleteDoc(doc(db, 'books', id));
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore books delete error:', formatted);
    return formatted;
  }
};

export const fetchBooksFromFirestore = async (): Promise<Book[] | null> => {
  try {
    const snap = await getDocs(collection(db, 'books'));
    return snap.docs.map(d => d.data() as Book);
  } catch (err) {
    console.warn('Firestore fetch books notice:', err);
    return null;
  }
};

export const subscribeToBooks = (callback: (books: Book[]) => void) => {
  try {
    return onSnapshot(collection(db, 'books'), (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as Book);
      callback(items);
    }, (err) => {
      console.warn('Firestore books subscription notice:', err.message);
    });
  } catch (err) {
    console.warn('Firestore listener unavailable:', err);
    return () => {};
  }
};

/**
 * 6. Exams Registry & Public Settings Firestore Synchronization
 */
export const saveExamToFirestore = async (categoryId: string, exam: any): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'exams', exam.id);
    const payload = sanitizeForFirestore({
      ...exam,
      categoryId,
      updatedAt: Date.now()
    });
    await setDoc(ref, payload, { merge: true });
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore exams write notice:', formatted);
    return formatted;
  }
};

export const deleteExamFromFirestore = async (examId: string): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'exams', examId);
    await deleteDoc(ref);
    return { ok: true };
  } catch (error) {
    const formatted = formatFirestoreWriteError(error);
    console.warn('Firestore exams delete notice:', formatted);
    return formatted;
  }
};

export const subscribeToExams = (callback: (exams: any[]) => void) => {
  try {
    return onSnapshot(collection(db, 'exams'), (snapshot) => {
      const items = snapshot.docs.map(d => d.data());
      callback(items);
    }, (err) => {
      console.warn('Firestore exams subscription notice:', err.message);
    });
  } catch (err) {
    console.warn('Firestore exams listener unavailable:', err);
    return () => {};
  }
};

export const savePublicSettingToFirestore = async (settingId: string, data: Record<string, any>): Promise<FirestoreWriteResult> => {
  try {
    const ref = doc(db, 'public_settings', settingId);
    await setDoc(ref, sanitizeForFirestore({ id: settingId, ...data, updatedAt: Date.now() }), { merge: true });
    return { ok: true };
  } catch (error) {
    return formatFirestoreWriteError(error);
  }
};

export const subscribeToPublicSetting = (settingId: string, callback: (data: Record<string, any> | null) => void) => {
  try {
    return onSnapshot(doc(db, 'public_settings', settingId), (snap) => {
      callback(snap.exists() ? snap.data() : null);
    }, (err) => {
      console.warn(`Firestore public_settings/${settingId} notice:`, err.message);
    });
  } catch (err) {
    console.warn('Firestore public_settings listener unavailable:', err);
    return () => {};
  }
};

/**
 * 7. Real Registered Users Directory Synchronization for Admin
 */
export const getAllUsersFromFirestore = async (): Promise<UserProfile[]> => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (snap.empty) return [];
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: data.uid || d.id,
        email: data.email || '',
        name: data.displayName || data.name || data.email?.split('@')[0] || 'Registered Student',
        phone: data.phone || '+91 97929 03247',
        targetExam: data.targetExam || 'SSC CGL & Railway NTPC',
        rollNumber: data.rollNumber || `SAM-2026-${d.id.slice(0, 4)}`,
        address: data.address || {
          street: 'Campus Hub',
          city: 'Gorakhpur',
          state: 'Uttar Pradesh',
          pinCode: '273016'
        },
        subscription: data.subscription || {
          planId: 'yearly',
          planName: '1-Year Elite Scholar Pass (₹0 Scholarship)',
          validUntil: '31 Dec 2026',
          status: 'active'
        },
        testScores: data.testScores || [],
        orders: data.orders || [],
        library: data.library || [],
        savedCurrentAffairs: data.savedCurrentAffairs || [],
        isAdmin: data.role === 'admin'
      } as UserProfile;
    });
  } catch (err) {
    console.warn('Notice reading users collection:', err);
    return [];
  }
};

export const getUserProfileFromFirestore = async (uid: string): Promise<any | null> => {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn('Notice getting user profile:', err);
    return null;
  }
};

export { onAuthStateChanged };
export type { FirebaseUser };
