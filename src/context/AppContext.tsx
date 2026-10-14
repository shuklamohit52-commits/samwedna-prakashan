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
  HardCopyOrder
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
  INITIAL_ORDERS
} from '../data/mockData';
import { OrdersService, TestScoresService } from '../services/supabase';

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
  bookmarkCurrentAffair: (id: string) => void;

  // Institute Free PDFs & Study Material
  freePdfs: FreePdfResource[];
  addFreePdf: (pdf: FreePdfResource) => void;
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

  // Auth & Admin
  loginUser: (email: string, name?: string, phone?: string) => void;
  logoutUser: () => void;
  registerUser: (data: Partial<UserProfile>, planId: 'free' | 'monthly' | 'yearly') => void;
  adminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;

  // Global UI & Filters
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portalMode, setPortalMode] = useState<PortalMode>('booksboon');
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [accountTab, setAccountTab] = useState<AccountTab>('dashboard');
  
  // Persisted user
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('samvedna_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Admin authentication
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('samvedna_admin_auth') === 'true';
  });

  // Persisted cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('samvedna_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic datasets with local storage persistence & sync
  const [booksCatalog, setBooksCatalog] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('samvedna_books');
      return saved ? JSON.parse(saved) : BOOKS_DATA;
    } catch {
      return BOOKS_DATA;
    }
  });

  const [testSeriesList, setTestSeriesList] = useState<TestSeriesExam[]>(() => {
    try {
      const saved = localStorage.getItem('samvedna_tests');
      return saved ? JSON.parse(saved) : TEST_SERIES_DATA;
    } catch {
      return TEST_SERIES_DATA;
    }
  });

  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairArticle[]>(() => {
    try {
      const saved = localStorage.getItem('samvedna_ca');
      return saved ? JSON.parse(saved) : DAILY_CURRENT_AFFAIRS;
    } catch {
      return DAILY_CURRENT_AFFAIRS;
    }
  });

  const [freePdfs, setFreePdfs] = useState<FreePdfResource[]>(() => {
    try {
      const saved = localStorage.getItem('samvedna_pdfs');
      return saved ? JSON.parse(saved) : FREE_PDFS_DATA;
    } catch {
      return FREE_PDFS_DATA;
    }
  });

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterialItem[]>(() => {
    try {
      const saved = localStorage.getItem('samvedna_materials');
      return saved ? JSON.parse(saved) : STUDY_MATERIALS_DATA;
    } catch {
      return STUDY_MATERIALS_DATA;
    }
  });

  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>(() => {
    try {
      const saved = localStorage.getItem('samvedna_videos');
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

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTestExam, setActiveTestExam] = useState<TestSeriesExam | null>(null);
  const [readingPdf, setReadingPdf] = useState<{ title: string; url: string; pages: number } | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);
  const [readingEbook, setReadingEbook] = useState<DownloadedBook | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('samvedna_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('samvedna_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('samvedna_cart', JSON.stringify(cart));
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
    setOrders(prev => [created, ...prev]);
    clearCart();
    // Also attach to user orders
    if (user) {
      const updatedUserOrders = [created, ...(user.orders || [])];
      setUser({ ...user, orders: updatedUserOrders });
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
    showToast(`Order status updated to "${status}"`, 'info');
  };

  const saveStudentTestScore = (score: UserTestScore) => {
    const email = user?.email || 'shukla.mohit52@gmail.com';
    TestScoresService.saveScore(score, email);
    setStudentScores(prev => [score, ...prev]);
    if (user) {
      setUser({
        ...user,
        testScores: [score, ...(user.testScores || [])]
      });
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

  // Admin creators
  const addCurrentAffair = (article: CurrentAffairArticle) => {
    const updated = [article, ...currentAffairs];
    setCurrentAffairs(updated);
    localStorage.setItem('samvedna_ca', JSON.stringify(updated));
    showToast('Daily Current Affairs article published successfully!', 'success');
  };

  const addFreePdf = (pdf: FreePdfResource) => {
    const updated = [pdf, ...freePdfs];
    setFreePdfs(updated);
    localStorage.setItem('samvedna_pdfs', JSON.stringify(updated));
    showToast('Free PDF study material uploaded successfully!', 'success');
  };

  const addStudyMaterial = (item: StudyMaterialItem) => {
    const updated = [item, ...studyMaterials];
    setStudyMaterials(updated);
    localStorage.setItem('samvedna_materials', JSON.stringify(updated));
    showToast('Study Material note published successfully!', 'success');
  };

  const addVideoLecture = (lecture: VideoLecture) => {
    const updated = [lecture, ...videoLectures];
    setVideoLectures(updated);
    localStorage.setItem('samvedna_videos', JSON.stringify(updated));
    showToast('Video Lecture link uploaded successfully!', 'success');
  };

  const addTestSeries = (test: TestSeriesExam) => {
    const updated = [test, ...testSeriesList];
    setTestSeriesList(updated);
    localStorage.setItem('samvedna_tests', JSON.stringify(updated));
    showToast(`CBT Mock Test "${test.title}" created successfully!`, 'success');
  };

  const addBookToCatalog = (book: Book) => {
    const updated = [book, ...booksCatalog];
    setBooksCatalog(updated);
    localStorage.setItem('samvedna_books', JSON.stringify(updated));
    showToast(`Book/Magazine "${book.title}" added to BooksBoon catalog!`, 'success');
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

  const loginUser = (email: string, name?: string, phone?: string) => {
    const loggedInUser: UserProfile = {
      ...INITIAL_USER,
      email: email || INITIAL_USER.email,
      name: name || (email.split('@')[0].toUpperCase() || 'Learner'),
      phone: phone || INITIAL_USER.phone
    };
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    setCurrentView('student-dashboard');
    setAccountTab('dashboard');
  };

  const logoutUser = () => {
    setUser(null);
    showToast('You have been logged out successfully', 'info');
    setCurrentView('home');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      showToast('Profile updated successfully!', 'success');
    }
  };

  const registerUser = (data: Partial<UserProfile>, planId: 'free' | 'monthly' | 'yearly') => {
    const planNameMap = {
      free: 'Student Free Pass',
      monthly: 'Monthly Aspirant Pro',
      yearly: 'Yearly Elite Scholar'
    };

    const newUser: UserProfile = {
      id: `std_${Date.now()}`,
      rollNumber: `SAM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name || 'New Aspirant',
      email: data.email || 'student@samvedna.org',
      phone: data.phone || '+91 98765 43210',
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
      orders: INITIAL_ORDERS
    };

    setUser(newUser);
    showToast(`Welcome to Samvedna! Your Student ID is ${newUser.rollNumber}`, 'success');
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
        bookmarkCurrentAffair,

        // PDFs & Study Material
        freePdfs,
        addFreePdf,
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

        // Auth & Admin
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
        setFilterCategory
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
