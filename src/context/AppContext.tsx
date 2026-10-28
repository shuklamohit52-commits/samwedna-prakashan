import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PageView, 
  AccountTab, 
  PortalMode,
  Book, 
  CartItem, 
  UserProfile, 
  DownloadedBook,
  CurrentAffairArticle,
  FreePdfResource,
  StudyMaterialItem,
  VideoLecture,
  TestSeriesExam,
  UserTestScore,
  HardCopyOrder,
  AppLanguage
} from '../types';
import { 
  BOOKS_DATA, 
  INITIAL_USER, 
  TEST_SERIES_DATA, 
  USER_TEST_SCORES_DATA,
  DAILY_CURRENT_AFFAIRS,
  FREE_PDFS_DATA,
  STUDY_MATERIALS_DATA,
  VIDEO_LECTURES,
  INITIAL_ORDERS,
  INITIAL_STUDENTS
} from '../data/mockData';
import { OrdersService, TestScoresService } from '../services/supabase';
import { 
  auth, 
  onAuthStateChanged, 
  logOutUser, 
  persistOrderToFirestore, 
  persistTestScoreToFirestore,
  saveCurrentAffairToFirestore,
  deleteCurrentAffairFromFirestore,
  subscribeToCurrentAffairs,
  saveFreePdfToFirestore,
  deleteFreePdfFromFirestore,
  subscribeToFreePdfs,
  saveTestSeriesToFirestore,
  subscribeToTestSeries,
  saveVideoLectureToFirestore,
  subscribeToVideoLectures,
  saveBookToFirestore,
  subscribeToBooks,
  getAllUsersFromFirestore,
  getUserProfileFromFirestore,
  syncUserProfile,
  saveUserProfileToFirestore
} from '../services/firebase';

interface AppContextType {
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  accountTab: AccountTab;
  setAccountTab: (tab: AccountTab) => void;
  user: UserProfile | null;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  cart: CartItem[];
  addToCart: (book: Book, format?: 'Paperback' | 'E-Book' | 'Magazine') => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  
  // Institute Test Series & CBT
  testSeriesList: TestSeriesExam[];
  addTestSeries: (test: TestSeriesExam) => void;
  activeTestExam: TestSeriesExam | null;
  setActiveTestExam: (test: TestSeriesExam | null) => void;
  studentScores: UserTestScore[];
  saveStudentTestScore: (score: UserTestScore) => void;

  // Institute Current Affairs
  currentAffairs: CurrentAffairArticle[];
  addCurrentAffair: (article: CurrentAffairArticle) => void;
  updateCurrentAffair: (article: CurrentAffairArticle) => void;
  deleteCurrentAffair: (id: string) => void;
  bookmarkCurrentAffair: (id: string) => void;

  // Institute Free PDFs & Study Material
  freePdfs: FreePdfResource[];
  addFreePdf: (pdf: FreePdfResource) => void;
  deleteFreePdf: (id: string) => void;
  bookmarkPdf: (id: string) => void;
  studyMaterials: StudyMaterialItem[];
  addStudyMaterial: (item: StudyMaterialItem) => void;
  readingPdf: { title: string; url: string; pages: number } | null;
  setReadingPdf: (val: { title: string; url: string; pages: number } | null) => void;

  // Stubs for course brochure dialogs
  isBrochureOpen: boolean;
  setIsBrochureOpen: (open: boolean) => void;
  activeBrochureCourse: any;
  setActiveBrochureCourse: (c: any) => void;
  leadModal: { open: boolean; course: any; type: 'syllabus' | 'fees' };
  setLeadModal: (val: { open: boolean; course: any; type: 'syllabus' | 'fees' }) => void;

  // Institute Video Lectures
  videoLectures: VideoLecture[];
  addVideoLecture: (lecture: VideoLecture) => void;
  activeVideo: VideoLecture | null;
  setActiveVideo: (v: VideoLecture | null) => void;

  // BooksBoon Catalog & Orders
  booksCatalog: Book[];
  addBookToCatalog: (book: Book) => void;
  orders: HardCopyOrder[];
  placeOrder: (order: HardCopyOrder) => Promise<HardCopyOrder>;
  updateOrderStatus: (orderId: string, status: HardCopyOrder['shippingStatus'], trackingId?: string) => Promise<void>;

  // Ebook reader & library
  readingEbook: DownloadedBook | null;
  setReadingEbook: (book: DownloadedBook | null) => void;
  downloadBookToLibrary: (book: Book) => { success: boolean; reason?: string };

  // Auth & Admin & Students Directory
  isAdmin: boolean;
  studentsList: UserProfile[];
  isRegisteredStudent: (email: string) => boolean;
  verifyStudentCredentials: (email: string, password: string) => { valid: boolean; reason?: 'not_found' | 'wrong_password' | 'admin' };
  updateStudentDetails: (studentId: string, data: Partial<UserProfile>) => void;
  loginUser: (email: string, name?: string, phone?: string, provider?: 'email' | 'google' | 'facebook', avatar?: string, targetExam?: string) => void;
  logoutUser: () => void;
  registerUser: (data: Partial<UserProfile>, planId: 'free' | 'monthly' | 'yearly', password?: string) => void;
  adminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;

  // Global UI & Filters
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  appLanguage: AppLanguage;
  setAppLanguage: (lang: AppLanguage) => void;
}

// Authorized Administrator Gmail Accounts
export const AUTHORIZED_ADMIN_EMAILS = [
  'shukla.mohit52@gmail.com',
  'booksboon17@gmail.com',
  'sgi181069@gmail.com',
  'spiindia181069@gmail.com',
  'archanashuklashukla58@gmail.com'
] as const;

export const isAuthorizedAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === clean);
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portalMode, setPortalMode] = useState<PortalMode>('booksboon');
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [accountTab, setAccountTab] = useState<AccountTab>('dashboard');
  
  // Persisted user: defaults to null (no one is pre-logged in)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const activeSession = localStorage.getItem('samwedna_active_session_user');
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        if (parsed && parsed.email) return parsed;
      }
      // Purge old pre-login keys so no user is automatically pre-logged in
      localStorage.removeItem('samwedna_user');
      return null;
    } catch {
      return null;
    }
  });

  // Calculate whether current user is an authorized administrator
  const isAdmin = Boolean(user && isAuthorizedAdmin(user.email));

  // Admin authentication (active only when logged in with an authorized administrator email)
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(() => {
    try {
      const activeSession = localStorage.getItem('samwedna_active_session_user');
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        return Boolean(parsed && isAuthorizedAdmin(parsed.email));
      }
      return false;
    } catch {
      return false;
    }
  });

  // Keep adminAuthenticated in sync with authorized administrator account
  useEffect(() => {
    if (isAdmin) {
      setAdminAuthenticated(true);
    } else {
      setAdminAuthenticated(false);
    }
  }, [isAdmin]);

  // Listen to Firebase Auth state changes with remote profile synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userEmail = firebaseUser.email || '';
        const userIsAdmin = isAuthorizedAdmin(userEmail);
        
        let remoteProfile: any = null;
        try {
          remoteProfile = await getUserProfileFromFirestore(firebaseUser.uid);
        } catch (e) {
          console.warn('Could not fetch remote profile:', e);
        }

        const resolvedUser: UserProfile = {
          ...INITIAL_USER,
          id: firebaseUser.uid,
          email: userEmail,
          name: remoteProfile?.displayName || remoteProfile?.name || firebaseUser.displayName || (userEmail ? userEmail.split('@')[0] : 'Learner'),
          phone: remoteProfile?.phone || firebaseUser.phoneNumber || '+91 97929 03247',
          authProvider: firebaseUser.providerData[0]?.providerId.includes('google')
            ? 'google'
            : firebaseUser.providerData[0]?.providerId.includes('facebook')
            ? 'facebook'
            : 'email',
          avatar: remoteProfile?.photoURL || firebaseUser.photoURL || undefined,
          targetExam: remoteProfile?.targetExam || 'SSC CGL & Railway NTPC',
          rollNumber: remoteProfile?.rollNumber || `SAM-2026-${firebaseUser.uid.slice(0, 4)}`,
          isAdmin: userIsAdmin
        };

        setUser(resolvedUser);
        try {
          localStorage.setItem('samwedna_active_session_user', JSON.stringify(resolvedUser));
        } catch (e) {
          console.error(e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore subscriptions for live reflections across all visitors
  useEffect(() => {
    const unsubCa = subscribeToCurrentAffairs((articles) => {
      if (articles && articles.length > 0) {
        setCurrentAffairs(articles);
        try {
          localStorage.setItem('samwedna_ca', JSON.stringify(articles));
        } catch (e) { console.error(e); }
      }
    });

    const unsubPdfs = subscribeToFreePdfs((pdfs) => {
      if (pdfs && pdfs.length > 0) {
        setFreePdfs(pdfs);
        try {
          localStorage.setItem('samwedna_pdfs', JSON.stringify(pdfs));
        } catch (e) { console.error(e); }
      }
    });

    const unsubTests = subscribeToTestSeries((tests) => {
      if (tests && tests.length > 0) {
        setTestSeriesList(tests);
        try {
          localStorage.setItem('samwedna_tests', JSON.stringify(tests));
        } catch (e) { console.error(e); }
      }
    });

    const unsubVideos = subscribeToVideoLectures((videos) => {
      if (videos && videos.length > 0) {
        setVideoLectures(videos);
        try {
          localStorage.setItem('samwedna_videos', JSON.stringify(videos));
        } catch (e) { console.error(e); }
      }
    });

    const unsubBooks = subscribeToBooks((books) => {
      if (books && books.length > 0) {
        setBooksCatalog(books);
        try {
          localStorage.setItem('samwedna_books', JSON.stringify(books));
        } catch (e) { console.error(e); }
      }
    });

    // Real Registered Users from Firestore
    getAllUsersFromFirestore().then((remoteUsers) => {
      if (remoteUsers && remoteUsers.length > 0) {
        setStudentsList(prev => {
          const map = new Map<string, UserProfile>();
          remoteUsers.forEach(u => map.set(u.email.toLowerCase(), u));
          prev.forEach(u => {
            if (!map.has(u.email.toLowerCase())) {
              map.set(u.email.toLowerCase(), u);
            }
          });
          return Array.from(map.values());
        });
      }
    }).catch(console.warn);

    return () => {
      unsubCa && unsubCa();
      unsubPdfs && unsubPdfs();
      unsubTests && unsubTests();
      unsubVideos && unsubVideos();
      unsubBooks && unsubBooks();
    };
  }, []);

  // Persisted cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic datasets with local storage persistence & sync
  const [booksCatalog, setBooksCatalog] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_books');
      return saved ? JSON.parse(saved) : BOOKS_DATA;
    } catch {
      return BOOKS_DATA;
    }
  });

  const [testSeriesList, setTestSeriesList] = useState<TestSeriesExam[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_tests');
      return saved ? JSON.parse(saved) : TEST_SERIES_DATA;
    } catch {
      return TEST_SERIES_DATA;
    }
  });

  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairArticle[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_ca');
      return saved ? JSON.parse(saved) : DAILY_CURRENT_AFFAIRS;
    } catch {
      return DAILY_CURRENT_AFFAIRS;
    }
  });

  const [freePdfs, setFreePdfs] = useState<FreePdfResource[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_pdfs');
      return saved ? JSON.parse(saved) : FREE_PDFS_DATA;
    } catch {
      return FREE_PDFS_DATA;
    }
  });

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterialItem[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_materials');
      return saved ? JSON.parse(saved) : STUDY_MATERIALS_DATA;
    } catch {
      return STUDY_MATERIALS_DATA;
    }
  });

  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_videos');
      return saved ? JSON.parse(saved) : VIDEO_LECTURES;
    } catch {
      return VIDEO_LECTURES;
    }
  });

  const [orders, setOrders] = useState<HardCopyOrder[]>(() => {
    try {
      const saved = localStorage.getItem('booksboon_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [studentScores, setStudentScores] = useState<UserTestScore[]>(() => {
    try {
      const email = user?.email || 'shukla.mohit52@gmail.com';
      const saved = localStorage.getItem(`student_scores_${email}`);
      return saved ? JSON.parse(saved) : USER_TEST_SCORES_DATA;
    } catch {
      return USER_TEST_SCORES_DATA;
    }
  });

  // Students Directory for Admin Tracking & Session Persistence
  const [studentsList, setStudentsList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('samwedna_students', JSON.stringify(studentsList));
    } catch (e) {
      console.error(e);
    }
  }, [studentsList]);

  const isRegisteredStudent = (email: string): boolean => {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    if (isAuthorizedAdmin(clean)) return true;
    return studentsList.some(s => s.email.toLowerCase() === clean);
  };

  // Dedicated credentials verification to prevent unverified automatic logins
  const verifyStudentCredentials = (email: string, pass: string): { valid: boolean; reason?: 'not_found' | 'wrong_password' | 'admin' } => {
    if (!email) return { valid: false, reason: 'not_found' };
    const cleanEmail = email.trim().toLowerCase();

    // Check if authorized admin
    if (isAuthorizedAdmin(cleanEmail)) {
      if (pass.length < 6) return { valid: false, reason: 'wrong_password' };
      return { valid: true, reason: 'admin' };
    }

    // Retrieve locally registered passwords
    let registeredAccounts: Record<string, string> = {
      'shukla.mohit52@gmail.com': 'samwedna2026',
      'ananya.ias2026@gmail.com': 'upsc2026',
      'rahul.ssc2026@gmail.com': 'ssccgl2026',
      'priya.patel.upsc@gmail.com': 'iasaspirant'
    };

    try {
      const stored = localStorage.getItem('samwedna_student_accounts');
      if (stored) {
        registeredAccounts = { ...registeredAccounts, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error(e);
    }

    const studentRecord = studentsList.find(s => s.email.toLowerCase() === cleanEmail);
    const hasRegisteredPassword = Boolean(registeredAccounts[cleanEmail]);

    // If neither accounts store nor students list has this email, it does NOT exist!
    if (!hasRegisteredPassword && !studentRecord) {
      return { valid: false, reason: 'not_found' };
    }

    // If password is registered, check strict match
    if (hasRegisteredPassword) {
      if (registeredAccounts[cleanEmail] !== pass) {
        return { valid: false, reason: 'wrong_password' };
      }
      return { valid: true };
    }

    // If in initial student list, accept minimum 6 chars
    if (pass.length < 6) {
      return { valid: false, reason: 'wrong_password' };
    }

    return { valid: true };
  };

  const updateStudentDetails = (studentId: string, data: Partial<UserProfile>) => {
    setStudentsList(prev => {
      const updated = prev.map(s => s.id === studentId ? { ...s, ...data } : s);
      const student = updated.find(s => s.id === studentId);
      if (student) {
        saveUserProfileToFirestore(student).catch(console.warn);
      }
      return updated;
    });
    if (user && user.id === studentId) {
      setUser(prev => prev ? { ...prev, ...data } : null);
    }
    showToast('Student record updated successfully', 'success');
  };

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTestExam, setActiveTestExam] = useState<TestSeriesExam | null>(null);
  const [readingPdf, setReadingPdf] = useState<{ title: string; url: string; pages: number } | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);
  const [readingEbook, setReadingEbook] = useState<DownloadedBook | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Persistent Bilingual Language Selector: 'BILINGUAL' | 'HI' | 'EN'
  const [appLanguage, setAppLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('samwedna_app_lang');
      return (saved as AppLanguage) || 'BILINGUAL';
    } catch {
      return 'BILINGUAL';
    }
  });

  const setAppLanguage = (lang: AppLanguage) => {
    setAppLanguageState(lang);
    try {
      localStorage.setItem('samwedna_app_lang', lang);
    } catch (e) {
      console.error(e);
    }
  };

  // Keep active user session in localStorage so user remains logged in across browser restarts
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('samwedna_active_session_user', JSON.stringify(user));
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Keep students directory synchronized in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('samwedna_students', JSON.stringify(studentsList));
    } catch (e) {
      console.error(e);
    }
  }, [studentsList]);

  useEffect(() => {
    try {
      localStorage.setItem('samwedna_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const addToCart = (book: Book, format: 'Paperback' | 'E-Book' | 'Magazine' = 'Paperback') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.book.id === book.id && item.format === format);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { book, format, quantity: 1 }];
    });
    showToast(`Added "${book.title}" (${format}) to BooksBoon Cart!`, 'success');
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(item => item.book.id !== bookId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev => prev.map(item => item.book.id === bookId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.format === 'Paperback' ? item.book.paperbackPrice : (item.format === 'Magazine' ? item.book.paperbackPrice : Math.round(item.book.paperbackPrice * 0.45));
    return acc + (price * item.quantity);
  }, 0);

  const placeOrder = async (order: HardCopyOrder): Promise<HardCopyOrder> => {
    const created = await OrdersService.createOrder(order);
    try {
      await persistOrderToFirestore(created);
    } catch (err) {
      console.warn('Firestore order sync notice:', err);
    }
    setOrders(prev => [created, ...prev]);
    clearCart();
    // Also attach to user orders
    if (user) {
      const updatedUserOrders = [created, ...(user.orders || [])];
      setUser({ ...user, orders: updatedUserOrders });
      setStudentsList(prev => prev.map(s => s.email.toLowerCase() === user.email.toLowerCase() ? {
        ...s,
        orders: [created, ...(s.orders || [])]
      } : s));
    }
    showToast(`Order #${order.orderId} placed successfully via Razorpay!`, 'success');
    return created;
  };

  const updateOrderStatus = async (orderId: string, status: HardCopyOrder['shippingStatus'], trackingId?: string) => {
    await OrdersService.updateOrderStatus(orderId, status, trackingId);
    setOrders(prev => prev.map(o => o.orderId === orderId ? { 
      ...o, 
      shippingStatus: status,
      ...(trackingId ? { trackingId } : {})
    } : o));
    setStudentsList(prev => prev.map(s => ({
      ...s,
      orders: s.orders?.map(o => o.orderId === orderId ? { ...o, shippingStatus: status, ...(trackingId ? { trackingId } : {}) } : o)
    })));
    showToast(`Order status updated to "${status}"`, 'info');
  };

  const saveStudentTestScore = (score: UserTestScore) => {
    const email = user?.email || 'shukla.mohit52@gmail.com';
    TestScoresService.saveScore(score, email);
    try {
      persistTestScoreToFirestore(score);
    } catch (err) {
      console.warn('Firestore test score sync notice:', err);
    }
    setStudentScores(prev => [score, ...prev]);
    if (user) {
      setUser({
        ...user,
        testScores: [score, ...(user.testScores || [])]
      });
      setStudentsList(prev => prev.map(s => s.email.toLowerCase() === user.email.toLowerCase() ? {
        ...s,
        testScores: [score, ...(s.testScores || [])]
      } : s));
    }
    showToast(`Test submitted! You scored ${score.scoreObtained}/${score.totalMarks} (AIR Rank: #${score.rank})`, 'success');
  };

  const bookmarkCurrentAffair = (id: string) => {
    if (!user) {
      showToast('Please Sign In to save articles to your Student Dashboard', 'info');
      setCurrentView('signin');
      return;
    }
    const current = user.savedCurrentAffairs || [];
    const exists = current.includes(id);
    const updated = exists ? current.filter(x => x !== id) : [...current, id];
    setUser({ ...user, savedCurrentAffairs: updated });
    showToast(exists ? 'Article removed from your saved list' : 'Article bookmarked to Student Dashboard!', 'success');
  };

  const bookmarkPdf = (id: string) => {
    if (!user) {
      showToast('Please Sign In to bookmark PDFs to your Student Dashboard', 'info');
      setCurrentView('signin');
      return;
    }
    const current = user.bookmarkedPdfs || [];
    const exists = current.includes(id);
    const updated = exists ? current.filter(x => x !== id) : [...current, id];
    setUser({ ...user, bookmarkedPdfs: updated });
    showToast(exists ? 'PDF removed from bookmarks' : 'PDF saved to your Student Library!', 'success');
  };

  // Admin creators & managers with Firestore synchronization
  const addCurrentAffair = async (article: CurrentAffairArticle) => {
    const updated = [article, ...currentAffairs.filter(a => a.id !== article.id)];
    setCurrentAffairs(updated);
    try {
      localStorage.setItem('samwedna_ca', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    await saveCurrentAffairToFirestore(article);
    showToast('Daily Current Affairs article published and synced to website!', 'success');
  };

  const updateCurrentAffair = async (article: CurrentAffairArticle) => {
    const updated = currentAffairs.map(a => a.id === article.id ? article : a);
    setCurrentAffairs(updated);
    try {
      localStorage.setItem('samwedna_ca', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    await saveCurrentAffairToFirestore(article);
    showToast('Current affairs article updated and synced across website!', 'success');
  };

  const deleteCurrentAffair = async (id: string) => {
    const updated = currentAffairs.filter(a => a.id !== id);
    setCurrentAffairs(updated);
    try {
      localStorage.setItem('samwedna_ca', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    await deleteCurrentAffairFromFirestore(id);
    showToast('Current affairs article deleted successfully', 'info');
  };

  const addFreePdf = async (pdf: FreePdfResource) => {
    const updated = [pdf, ...freePdfs.filter(p => p.id !== pdf.id)];
    setFreePdfs(updated);
    try {
      localStorage.setItem('samwedna_pdfs', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    await saveFreePdfToFirestore(pdf);
    showToast('Free PDF study material uploaded and synced across website!', 'success');
  };

  const deleteFreePdf = async (id: string) => {
    const updated = freePdfs.filter(p => p.id !== id);
    setFreePdfs(updated);
    try {
      localStorage.setItem('samwedna_pdfs', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    await deleteFreePdfFromFirestore(id);
    showToast('PDF study resource deleted successfully', 'info');
  };

  const addStudyMaterial = (item: StudyMaterialItem) => {
    const updated = [item, ...studyMaterials];
    setStudyMaterials(updated);
    localStorage.setItem('samwedna_materials', JSON.stringify(updated));
    showToast('Study Material note published successfully!', 'success');
  };

  const addVideoLecture = async (lecture: VideoLecture) => {
    const updated = [lecture, ...videoLectures.filter(v => v.id !== lecture.id)];
    setVideoLectures(updated);
    try {
      localStorage.setItem('samwedna_videos', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    await saveVideoLectureToFirestore(lecture);
    showToast('Video Lecture link uploaded and synced across website!', 'success');
  };

  const addTestSeries = async (test: TestSeriesExam) => {
    const updated = [test, ...testSeriesList.filter(t => t.id !== test.id)];
    setTestSeriesList(updated);
    try {
      localStorage.setItem('samwedna_tests', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    await saveTestSeriesToFirestore(test);
    showToast(`CBT Mock Test "${test.title}" created and synced across website!`, 'success');
  };

  const addBookToCatalog = async (book: Book) => {
    const updated = [book, ...booksCatalog.filter(b => b.id !== book.id)];
    setBooksCatalog(updated);
    try {
      localStorage.setItem('samwedna_books', JSON.stringify(updated));
    } catch (e) { console.error(e); }
    await saveBookToFirestore(book);
    showToast(`Book/Magazine "${book.title}" added and synced to BooksBoon store!`, 'success');
  };

  const downloadBookToLibrary = (book: Book): { success: boolean; reason?: string } => {
    if (!user) {
      showToast('Please Sign In to download PDF study material', 'error');
      setCurrentView('signin');
      return { success: false, reason: 'auth_required' };
    }

    const alreadyDownloaded = user.library.some(b => b.bookId === book.id);
    if (alreadyDownloaded) {
      showToast(`"${book.title}" is already in your Student Library!`, 'info');
      setCurrentView('account');
      setAccountTab('library');
      return { success: true };
    }

    const newDownload: DownloadedBook = {
      id: `lib_${Date.now()}`,
      bookId: book.id,
      title: book.title,
      author: book.author,
      downloadedAt: new Date().toISOString().split('T')[0],
      fileSize: `${(Math.random() * 15 + 10).toFixed(1)} MB`,
      totalPages: book.pages,
      lastReadPage: 1,
      category: book.category,
      coverGradient: book.coverGradient
    };

    setUser({
      ...user,
      library: [newDownload, ...user.library]
    });

    showToast(`"${book.title}" saved to your Student Library!`, 'success');
    return { success: true };
  };

  const loginUser = (
    email: string, 
    name?: string, 
    phone?: string, 
    provider: 'email' | 'google' | 'facebook' = 'email',
    avatar?: string,
    targetExam?: string
  ) => {
    const defaultRoll = `SAM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const userIsAdmin = isAuthorizedAdmin(email);

    // Auto-resolve realistic administrator names if not passed
    let resolvedName = name;
    if (!resolvedName) {
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail === 'shukla.mohit52@gmail.com') {
        resolvedName = 'Mohit Shukla';
      } else if (cleanEmail === 'booksboon17@gmail.com') {
        resolvedName = 'BooksBoon Administrator';
      } else if (cleanEmail === 'sgi181069@gmail.com') {
        resolvedName = 'Samwedna Institute Administrator';
      } else if (cleanEmail === 'spiindia181069@gmail.com') {
        resolvedName = 'Samwedna Prakashan Administrator';
      } else if (cleanEmail === 'archanashuklashukla58@gmail.com') {
        resolvedName = 'Archana Shukla';
      } else {
        resolvedName = email.split('@')[0].toUpperCase() || 'Learner';
      }
    }

    // Check if student exists in persistent students directory
    const existingStudent = studentsList.find(s => s.email.toLowerCase() === email.trim().toLowerCase());
    const loggedInUser: UserProfile = existingStudent ? {
      ...existingStudent,
      name: name || existingStudent.name || resolvedName,
      phone: phone || existingStudent.phone || '+91 97929 03247',
      authProvider: provider,
      avatar: avatar || existingStudent.avatar || undefined,
      isAdmin: userIsAdmin
    } : {
      ...INITIAL_USER,
      id: `std_${Date.now()}`,
      email: email.trim(),
      name: resolvedName,
      phone: phone || '+91 97929 03247',
      authProvider: provider,
      avatar: avatar || undefined,
      rollNumber: defaultRoll,
      targetExam: targetExam || 'SSC CGL & Railway NTPC',
      isAdmin: userIsAdmin
    };

    setUser(loggedInUser);
    try {
      localStorage.setItem('samwedna_active_session_user', JSON.stringify(loggedInUser));
    } catch (e) {
      console.error(e);
    }
    if (userIsAdmin) {
      setAdminAuthenticated(true);
      showToast(`Welcome Administrator, ${loggedInUser.name}! Admin console unlocked.`, 'success');
    } else {
      showToast(`Welcome back, ${loggedInUser.name}! (${provider === 'google' ? 'Google / Gmail' : (provider === 'facebook' ? 'Facebook' : 'Email')} verified)`, 'success');
    }
    setCurrentView('student-dashboard');
    setAccountTab('dashboard');
  };

  const logoutUser = async () => {
    try {
      await logOutUser();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    setUser(null);
    setAdminAuthenticated(false);
    try {
      localStorage.removeItem('samwedna_active_session_user');
      localStorage.removeItem('samwedna_user');
      localStorage.removeItem('samwedna_admin_auth');
    } catch (e) {
      console.error(e);
    }
    showToast('You have been logged out successfully', 'info');
    setCurrentView('home');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      try {
        localStorage.setItem('samwedna_active_session_user', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      setStudentsList(prev => prev.map(s => s.id === user.id ? { ...s, ...data } : s));
      showToast('Profile updated successfully!', 'success');
    }
  };

  const registerUser = (data: Partial<UserProfile>, planId: 'free' | 'monthly' | 'yearly', password?: string) => {
    const planNameMap = {
      free: 'Student Free Pass',
      monthly: 'Monthly Aspirant Pro',
      yearly: 'Yearly Elite Scholar'
    };

    const userEmail = (data.email || 'student@samwedna.org').trim().toLowerCase();

    // Persist registered credentials for login verification
    if (password) {
      try {
        let accounts: Record<string, string> = {};
        const stored = localStorage.getItem('samwedna_student_accounts');
        if (stored) {
          accounts = JSON.parse(stored);
        }
        accounts[userEmail] = password;
        localStorage.setItem('samwedna_student_accounts', JSON.stringify(accounts));
      } catch (e) {
        console.error(e);
      }
    }

    const newUser: UserProfile = {
      id: `std_${Date.now()}`,
      rollNumber: `SAM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name || 'New Aspirant',
      email: userEmail,
      phone: data.phone || '+91 97929 03247',
      address: data.address || {
        street: 'Main Road',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
        landmark: 'Near Metro Station'
      },
      targetExam: data.targetExam || 'SSC CGL & Railway NTPC',
      subscription: {
        planId,
        planName: planNameMap[planId],
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: planId === 'yearly' ? '2027-10-14' : (planId === 'monthly' ? '2026-11-14' : '2099-12-31'),
        status: 'Active'
      },
      library: INITIAL_USER.library.slice(0, 1),
      savedCurrentAffairs: ['ca-2026-10-14-01'],
      bookmarkedPdfs: ['pdf-01', 'pdf-02'],
      testScores: USER_TEST_SCORES_DATA.slice(0, 2),
      orders: INITIAL_ORDERS,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setUser(newUser);
    try {
      localStorage.setItem('samwedna_active_session_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    setStudentsList(prev => {
      const filtered = prev.filter(s => s.email.toLowerCase() !== newUser.email.toLowerCase());
      return [newUser, ...filtered];
    });

    // Sync new student profile to Firestore
    syncUserProfile(
      auth.currentUser || ({ uid: newUser.id, email: newUser.email, displayName: newUser.name } as any),
      'email',
      { displayName: newUser.name, phone: newUser.phone, targetExam: newUser.targetExam }
    ).catch(console.warn);
    saveUserProfileToFirestore(newUser).catch(console.warn);

    showToast(`Welcome to Samwedna! Your Student ID is ${newUser.rollNumber}`, 'success');
    setCurrentView('student-dashboard');
    setAccountTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        portalMode,
        setPortalMode,
        currentView,
        setCurrentView,
        accountTab,
        setAccountTab,
        user,
        updateUserProfile,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        selectedBook,
        setSelectedBook,

        // Test Series & CBT
        testSeriesList,
        addTestSeries,
        activeTestExam,
        setActiveTestExam,
        studentScores,
        saveStudentTestScore,

        // Current Affairs
        currentAffairs,
        addCurrentAffair,
        updateCurrentAffair,
        deleteCurrentAffair,
        bookmarkCurrentAffair,

        // PDFs & Study Material
        freePdfs,
        addFreePdf,
        deleteFreePdf,
        bookmarkPdf,
        studyMaterials,
        addStudyMaterial,
        readingPdf,
        setReadingPdf,

        // Brochure stubs
        isBrochureOpen: false,
        setIsBrochureOpen: () => {},
        activeBrochureCourse: null,
        setActiveBrochureCourse: () => {},
        leadModal: { open: false, course: null, type: 'syllabus' },
        setLeadModal: () => {},

        // Video Lectures
        videoLectures,
        addVideoLecture,
        activeVideo,
        setActiveVideo,

        // BooksBoon
        booksCatalog,
        addBookToCatalog,
        orders,
        placeOrder,
        updateOrderStatus,

        // Library & Ebook
        readingEbook,
        setReadingEbook,
        downloadBookToLibrary,

        // Auth & Admin & Students Directory
        isAdmin,
        studentsList,
        isRegisteredStudent,
        verifyStudentCredentials,
        updateStudentDetails,
        loginUser,
        logoutUser,
        registerUser,
        adminAuthenticated,
        setAdminAuthenticated,

        // UI
        toast,
        showToast,
        searchQuery,
        setSearchQuery,
        filterCategory,
        setFilterCategory,
        appLanguage,
        setAppLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
