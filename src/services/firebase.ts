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
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, HardCopyOrder, UserTestScore } from '../types';

// Initialize Firebase singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
// CRITICAL: Always provide firestoreDatabaseId for custom/named databases
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Validate connection to Firestore on boot as mandated
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection check: Client currently offline or initializing.");
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

export { onAuthStateChanged };
export type { FirebaseUser };
