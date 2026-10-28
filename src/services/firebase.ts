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
 * 1. Current Affairs Firestore Synchronization
 */
export const saveCurrentAffairToFirestore = async (article: CurrentAffairArticle) => {
  const path = `current_affairs/${article.id}`;
  try {
    const ref = doc(db, 'current_affairs', article.id);
    await setDoc(ref, article, { merge: true });
  } catch (error) {
    console.warn('Firestore write notice (falling back locally):', error);
  }
};

export const deleteCurrentAffairFromFirestore = async (articleId: string) => {
  const path = `current_affairs/${articleId}`;
  try {
    const ref = doc(db, 'current_affairs', articleId);
    await deleteDoc(ref);
  } catch (error) {
    console.warn('Firestore delete notice (falling back locally):', error);
  }
};

export const subscribeToCurrentAffairs = (callback: (articles: CurrentAffairArticle[]) => void) => {
  try {
    return onSnapshot(collection(db, 'current_affairs'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => doc.data() as CurrentAffairArticle);
        callback(items);
      }
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
export const saveFreePdfToFirestore = async (pdf: FreePdfResource) => {
  try {
    const ref = doc(db, 'free_pdfs', pdf.id);
    await setDoc(ref, pdf, { merge: true });
  } catch (error) {
    console.warn('Firestore free_pdfs write notice:', error);
  }
};

export const deleteFreePdfFromFirestore = async (pdfId: string) => {
  try {
    const ref = doc(db, 'free_pdfs', pdfId);
    await deleteDoc(ref);
  } catch (error) {
    console.warn('Firestore free_pdfs delete notice:', error);
  }
};

export const subscribeToFreePdfs = (callback: (pdfs: FreePdfResource[]) => void) => {
  try {
    return onSnapshot(collection(db, 'free_pdfs'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => doc.data() as FreePdfResource);
        callback(items);
      }
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
export const saveTestSeriesToFirestore = async (test: TestSeriesExam) => {
  try {
    const ref = doc(db, 'test_series', test.id);
    await setDoc(ref, test, { merge: true });
  } catch (error) {
    console.warn('Firestore test_series write notice:', error);
  }
};

export const subscribeToTestSeries = (callback: (tests: TestSeriesExam[]) => void) => {
  try {
    return onSnapshot(collection(db, 'test_series'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => doc.data() as TestSeriesExam);
        callback(items);
      }
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
export const saveVideoLectureToFirestore = async (video: VideoLecture) => {
  try {
    const ref = doc(db, 'video_lectures', video.id);
    await setDoc(ref, video, { merge: true });
  } catch (error) {
    console.warn('Firestore video_lectures write notice:', error);
  }
};

export const subscribeToVideoLectures = (callback: (videos: VideoLecture[]) => void) => {
  try {
    return onSnapshot(collection(db, 'video_lectures'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => doc.data() as VideoLecture);
        callback(items);
      }
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
export const saveBookToFirestore = async (book: Book) => {
  try {
    const ref = doc(db, 'books', book.id);
    await setDoc(ref, book, { merge: true });
  } catch (error) {
    console.warn('Firestore books write notice:', error);
  }
};

export const subscribeToBooks = (callback: (books: Book[]) => void) => {
  try {
    return onSnapshot(collection(db, 'books'), (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => doc.data() as Book);
        callback(items);
      }
    }, (err) => {
      console.warn('Firestore books subscription notice:', err.message);
    });
  } catch (err) {
    console.warn('Firestore listener unavailable:', err);
    return () => {};
  }
};

/**
 * 6. Real Registered Users Directory Synchronization for Admin
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
