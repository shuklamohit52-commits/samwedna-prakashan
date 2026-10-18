export type PortalMode = 'booksboon' | 'institute';

export type PageView = 
  | 'home' 
  | 'booksboon'
  | 'product' 
  | 'checkout'
  | 'order-success'
  | 'current-affairs'
  | 'test-series'
  | 'free-pdfs'
  | 'study-materials'
  | 'video-lectures' 
  | 'house-of-samwedna'
  | 'house-of-samvedna'
  | 'blog'
  | 'services'
  | 'academic'
  | 'signin' 
  | 'signup' 
  | 'account' 
  | 'student-dashboard'
  | 'cart'
  | 'admin';

export type AccountTab = 'dashboard' | 'profile' | 'tests' | 'current-affairs' | 'library' | 'orders' | 'payment';

export type ExamCategory = 
  | 'All SSC Exam' 
  | 'All Bank Exam' 
  | 'All Railway Exam' 
  | 'All Defence Exam' 
  | 'All State Exam'
  | 'UPSC & Civil Services'
  | 'Teaching & UGC NET'
  | 'Magazines & Periodicals';

export type BookFormat = 'Paperback' | 'E-Book' | 'Magazine' | 'Test Series Combo';

export interface CBTQuestion {
  id: number;
  section: string;
  questionText: string;
  hindiQuestionText?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TestSeriesExam {
  id: string;
  title: string;
  hindiTitle?: string;
  category: ExamCategory;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  negativeMarking?: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Exam Pattern';
  enrolledStudents: number;
  isFreeDemo: boolean;
  syllabusCovered: string[];
  lastUpdated: string;
  associatedBookId?: string;
  questions?: CBTQuestion[];
}

export interface UserTestScore {
  id: string;
  testId: string;
  testTitle: string;
  category: string;
  dateAttempted: string;
  scoreObtained: number;
  totalMarks: number;
  accuracyPercentage: number;
  percentile: number;
  rank: number;
  totalCandidates: number;
  timeSpentMinutes: number;
  correctCount?: number;
  incorrectCount?: number;
  unattemptedCount?: number;
  status: 'Completed' | 'In Progress';
}

export interface Book {
  id: string;
  title: string;
  hindiTitle?: string;
  category: ExamCategory;
  subject: string;
  author: string;
  paperbackPrice: number;
  originalPrice: number;
  ebookAvailable: boolean;
  rating: number;
  reviewsCount: number;
  pages: number;
  language: 'Hindi' | 'English' | 'Bilingual';
  badge?: 'Best Seller' | 'New & Upcoming' | 'Discounted' | 'Top Rated';
  description: string;
  features: string[];
  tableOfContents: string[];
  samplePdfUrl: string;
  coverGradient: string;
  coverIcon: string;
  patternYear: string;
  isTestSeries?: boolean;
  testsCount?: number;
  bannerImage?: string;
  inStock?: boolean;
  stockCount?: number;
  publisher?: string;
  isbn?: string;
  isHardCopyOnly?: boolean;
  isMagazine?: boolean;
}

export interface CartItem {
  book: Book;
  format: 'Paperback' | 'E-Book' | 'Magazine';
  quantity: number;
}

export interface UserSubscription {
  planId: 'free' | 'monthly' | 'yearly';
  planName: string;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired';
}

export interface DownloadedBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  downloadedAt: string;
  fileSize: string;
  totalPages: number;
  lastReadPage: number;
  category: string;
  coverGradient: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber?: string;
  avatar?: string;
  authProvider?: 'email' | 'google' | 'facebook';
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    landmark?: string;
  };
  targetExam: string;
  subscription: UserSubscription;
  library: DownloadedBook[];
  savedCurrentAffairs?: string[];
  bookmarkedPdfs?: string[];
  testScores?: UserTestScore[];
  orders?: HardCopyOrder[];
  isAdmin?: boolean;
}

export interface CurrentAffairArticle {
  id: string;
  title: string;
  hindiTitle?: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  summary: string;
  hindiSummary?: string;
  keyPoints: string[];
  fullContent: string;
  relatedMcq?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  pdfUrl?: string;
}

export interface FreePdfResource {
  id: string;
  title: string;
  category: ExamCategory | string;
  subject: string;
  fileSize: string;
  pages: number;
  downloadUrl: string;
  downloadsCount: number;
  description: string;
  dateAdded: string;
  isTrending?: boolean;
  previewExcerpt?: string;
  tags?: string[];
}

export interface StudyMaterialItem {
  id: string;
  title: string;
  hindiTitle?: string;
  category: string;
  subject: string;
  type: 'Mindmap' | 'Formula Sheet' | 'Handwritten Notes' | 'Syllabus Breakdown';
  pages: number;
  downloadUrl: string;
  fileSize: string;
  description: string;
  highlights: string[];
  badge?: string;
}

export interface VideoLecture {
  id: string;
  title: string;
  hindiTitle?: string;
  subject: string;
  instructor: string;
  duration: string;
  views: string;
  exam: string;
  thumbnailGradient: string;
  isUpcoming?: boolean;
  upcomingDate?: string;
  description: string;
  youtubeId?: string;
  videoUrl?: string;
  pdfNotesUrl?: string;
}

export interface HardCopyOrder {
  orderId: string;
  trackingId: string;
  createdAt: string;
  studentEmail: string;
  studentName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    landmark?: string;
  };
  items: {
    bookId: string;
    title: string;
    format: string;
    quantity: number;
    price: number;
    coverImage?: string;
  }[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'Razorpay' | 'UPI' | 'Card' | 'COD';
  paymentId: string;
  paymentStatus: 'Paid' | 'Pending';
  shippingStatus: 'Processing' | 'Packed' | 'Dispatched via Courier' | 'In Transit' | 'Delivered';
  courierPartner: string;
  estimatedDelivery: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastTested?: string;
}

export interface AcademicCourse {
  id: string;
  title: string;
  targetExam: string;
  duration: string;
  mode: string;
  summary: string;
  highlights: string[];
  curriculumOverview: string[];
  brochureFileName: string;
  syllabusFileName: string;
  feeDetails: {
    tuitionFee: number;
    studyMaterial: number;
    testSeriesFee: number;
    total: number;
    installments: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

export interface LeaderboardStudent {
  id: string;
  rank: number;
  name: string;
  rollNumber: string;
  avatarUrl?: string;
  avatarInitials: string;
  city: string;
  state: string;
  targetExam: string;
  category: string;
  testId: string;
  testTitle: string;
  score: number;
  totalMarks: number;
  accuracy: number;
  timeTakenMinutes: number;
  percentile: number;
  submittedAt: string;
  badge?: string;
  isCurrentUser?: boolean;
  trend: 'up' | 'down' | 'same' | 'new';
  trendValue?: number;
}

