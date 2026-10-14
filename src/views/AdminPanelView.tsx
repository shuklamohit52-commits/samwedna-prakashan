import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Database, 
  PlusCircle, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Video, 
  HelpCircle, 
  Package, 
  Truck, 
  TrendingUp, 
  Key, 
  Copy, 
  Check, 
  RefreshCw,
  Sparkles,
  Layers,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { 
  testSupabaseConnection, 
  saveSupabaseConfig, 
  getStoredSupabaseConfig, 
  isSupabaseConfigured 
} from '../services/supabase';
import { 
  CurrentAffairArticle, 
  FreePdfResource, 
  StudyMaterialItem, 
  VideoLecture, 
  TestSeriesExam, 
  Book, 
  CBTQuestion,
  ExamCategory 
} from '../types';

export const AdminPanelView: React.FC = () => {
  const { 
    adminAuthenticated, 
    setAdminAuthenticated, 
    orders, 
    updateOrderStatus, 
    studentScores, 
    currentAffairs, 
    addCurrentAffair,
    freePdfs,
    addFreePdf,
    videoLectures,
    addVideoLecture,
    testSeriesList,
    addTestSeries,
    booksCatalog,
    addBookToCatalog,
    showToast 
  } = useApp();

  const [adminPasscode, setAdminPasscode] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'quiz' | 'current-affairs' | 'pdfs' | 'videos' | 'books' | 'orders' | 'supabase'>('analytics');

  // Supabase Config State
  const initialConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(initialConfig.anonKey);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form states for creating content:
  // 1. Quiz / CBT Test
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState<ExamCategory>('All SSC Exam');
  const [quizDuration, setQuizDuration] = useState('60');
  const [quizMarks, setQuizMarks] = useState('200');
  const [quizDifficulty, setQuizDifficulty] = useState<'Easy' | 'Moderate' | 'Hard' | 'Exam Pattern'>('Exam Pattern');
  const [quizQText, setQuizQText] = useState('');
  const [quizOptA, setQuizOptA] = useState('');
  const [quizOptB, setQuizOptB] = useState('');
  const [quizOptC, setQuizOptC] = useState('');
  const [quizOptD, setQuizOptD] = useState('');
  const [quizCorrectIdx, setQuizCorrectIdx] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

  // 2. Current Affairs
  const [caTitle, setCaTitle] = useState('');
  const [caHindiTitle, setCaHindiTitle] = useState('');
  const [caDate, setCaDate] = useState('14 October 2026');
  const [caCategory, setCaCategory] = useState('Polity & Constitution');
  const [caSummary, setCaSummary] = useState('');
  const [caKeyPoints, setCaKeyPoints] = useState('');
  const [caMcqQuestion, setCaMcqQuestion] = useState('');
  const [caMcqOpt1, setCaMcqOpt1] = useState('');
  const [caMcqOpt2, setCaMcqOpt2] = useState('');
  const [caMcqOpt3, setCaMcqOpt3] = useState('');
  const [caMcqOpt4, setCaMcqOpt4] = useState('');
  const [caMcqCorrect, setCaMcqCorrect] = useState(0);
  const [caMcqExp, setCaMcqExp] = useState('');

  // 3. Free PDF
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfCategory, setPdfCategory] = useState<ExamCategory>('Teaching & UGC NET');
  const [pdfSubject, setPdfSubject] = useState('');
  const [pdfSize, setPdfSize] = useState('12.5 MB');
  const [pdfPages, setPdfPages] = useState('84');
  const [pdfUrl, setPdfUrl] = useState('/samples/sample.pdf');
  const [pdfDesc, setPdfDesc] = useState('');

  // 4. Video Lecture
  const [vidTitle, setVidTitle] = useState('');
  const [vidSubject, setVidSubject] = useState('');
  const [vidInstructor, setVidInstructor] = useState('Samvedna Academic Faculty');
  const [vidDuration, setVidDuration] = useState('1 hr 30 min');
  const [vidExam, setVidExam] = useState('All Competitive Exams');
  const [vidYoutubeId, setVidYoutubeId] = useState('');
  const [vidDesc, setVidDesc] = useState('');

  // 5. BooksBoon Hard Copy Book/Magazine
  const [bookTitle, setBookTitle] = useState('');
  const [bookHindiTitle, setBookHindiTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPrice, setBookPrice] = useState('395');
  const [bookOrigPrice, setBookOrigPrice] = useState('480');
  const [bookCategory, setBookCategory] = useState<ExamCategory>('Teaching & UGC NET');
  const [bookCoverUrl, setBookCoverUrl] = useState('');
  const [bookPages, setBookPages] = useState('450');
  const [bookStock, setBookStock] = useState('150');

  // Admin authentication bypass or login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode.trim() === 'admin123' || adminPasscode.trim() === 'samvedna2026' || adminPasscode.trim() === 'booksboon') {
      setAdminAuthenticated(true);
      localStorage.setItem('samvedna_admin_auth', 'true');
      showToast('Admin mode authenticated successfully!', 'success');
    } else {
      showToast('Invalid passcode. (Hint: Use "admin123")', 'error');
    }
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setSupabaseStatusMsg(null);
    const result = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setIsTestingSupabase(false);
    setSupabaseStatusMsg(result);
    if (result.success) {
      saveSupabaseConfig(supabaseUrl, supabaseKey);
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  // Handlers for submitting new items
  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      showToast('Please provide a test title', 'error');
      return;
    }

    const newQuestion: CBTQuestion = {
      id: Date.now(),
      section: 'General Section',
      questionText: quizQText || `Sample high-yield question for ${quizTitle}`,
      options: [quizOptA || 'Option A', quizOptB || 'Option B', quizOptC || 'Option C', quizOptD || 'Option D'],
      correctIndex: quizCorrectIdx,
      explanation: quizExplanation || 'Detailed conceptual explanation based on standard exam syllabus.'
    };

    const newTest: TestSeriesExam = {
      id: `ts-${Date.now()}`,
      title: quizTitle,
      category: quizCategory,
      totalQuestions: 1,
      durationMinutes: parseInt(quizDuration) || 60,
      totalMarks: parseInt(quizMarks) || 200,
      difficulty: quizDifficulty,
      enrolledStudents: 1,
      isFreeDemo: true,
      syllabusCovered: [quizCategory, 'Full Mock Test Pattern'],
      lastUpdated: 'Just now',
      questions: [newQuestion]
    };

    addTestSeries(newTest);
    setQuizTitle('');
    setQuizQText('');
  };

  const handleCreateCurrentAffair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caTitle.trim() || !caSummary.trim()) {
      showToast('Please fill title and summary', 'error');
      return;
    }

    const keyPointsArray = caKeyPoints
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newArticle: CurrentAffairArticle = {
      id: `ca-${Date.now()}`,
      title: caTitle,
      hindiTitle: caHindiTitle || undefined,
      date: caDate,
      category: caCategory,
      tags: [caCategory, 'Daily Update', 'UPSC Prelims'],
      readTime: '4 min read',
      summary: caSummary,
      keyPoints: keyPointsArray.length > 0 ? keyPointsArray : ['Crucial current events takeaways for all exams.'],
      fullContent: caSummary,
      relatedMcq: caMcqQuestion ? {
        question: caMcqQuestion,
        options: [caMcqOpt1 || 'Option A', caMcqOpt2 || 'Option B', caMcqOpt3 || 'Option C', caMcqOpt4 || 'Option D'],
        correctIndex: caMcqCorrect,
        explanation: caMcqExp || 'Official solution explanation.'
      } : undefined
    };

    addCurrentAffair(newArticle);
    setCaTitle('');
    setCaHindiTitle('');
    setCaSummary('');
    setCaKeyPoints('');
  };

  const handleCreatePdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle.trim()) {
      showToast('Please enter PDF title', 'error');
      return;
    }

    const newPdf: FreePdfResource = {
      id: `pdf-${Date.now()}`,
      title: pdfTitle,
      category: pdfCategory,
      subject: pdfSubject || 'General Studies',
      fileSize: pdfSize,
      pages: parseInt(pdfPages) || 50,
      downloadUrl: pdfUrl || '/samples/sample.pdf',
      downloadsCount: 1,
      description: pdfDesc || 'Free high-yield exam preparation notes prepared by Samvedna Institute.',
      dateAdded: 'Today',
      isTrending: true
    };

    addFreePdf(newPdf);
    setPdfTitle('');
    setPdfDesc('');
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim()) {
      showToast('Please enter video title', 'error');
      return;
    }

    const newVid: VideoLecture = {
      id: `vid-${Date.now()}`,
      title: vidTitle,
      subject: vidSubject || 'General Studies',
      instructor: vidInstructor,
      duration: vidDuration,
      views: '1.2K views',
      exam: vidExam,
      thumbnailGradient: 'from-blue-900 to-indigo-950',
      description: vidDesc || 'Comprehensive video lecture with exam notes.',
      youtubeId: vidYoutubeId || undefined
    };

    addVideoLecture(newVid);
    setVidTitle('');
    setVidDesc('');
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) {
      showToast('Please enter book title', 'error');
      return;
    }

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: bookTitle,
      hindiTitle: bookHindiTitle || undefined,
      category: bookCategory,
      subject: 'Exam Special',
      author: bookAuthor || 'Samvedna Editorial Board',
      paperbackPrice: parseInt(bookPrice) || 395,
      originalPrice: parseInt(bookOrigPrice) || 480,
      ebookAvailable: true,
      rating: 4.9,
      reviewsCount: 120,
      pages: parseInt(bookPages) || 350,
      language: 'Hindi',
      badge: 'New & Upcoming',
      description: 'Authentic hard copy edition printed with high-grade thermal binding.',
      features: ['Genuine hard copy', 'Fast courier delivery via India Post'],
      tableOfContents: ['Chapter 1: Foundations', 'Chapter 2: Solved Papers'],
      samplePdfUrl: '/samples/sample.pdf',
      coverGradient: 'from-indigo-900 to-slate-900',
      coverIcon: 'BookOpen',
      patternYear: '2026 Edition',
      bannerImage: bookCoverUrl || undefined,
      inStock: true,
      stockCount: parseInt(bookStock) || 100
    };

    addBookToCatalog(newBook);
    setBookTitle('');
    setBookHindiTitle('');
    setBookCoverUrl('');
  };

  const copySqlSchema = () => {
    const sql = `-- SUPABASE DATABASE SCHEMA FOR SAMVEDNA INSTITUTE & BOOKSBOON
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orderId TEXT UNIQUE NOT NULL,
  trackingId TEXT,
  studentEmail TEXT NOT NULL,
  studentName TEXT NOT NULL,
  phone TEXT,
  address JSONB,
  items JSONB,
  subtotal NUMERIC,
  shippingFee NUMERIC,
  totalAmount NUMERIC NOT NULL,
  paymentMethod TEXT,
  paymentId TEXT,
  paymentStatus TEXT,
  shippingStatus TEXT DEFAULT 'Processing',
  courierPartner TEXT,
  estimatedDelivery TEXT,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  testId TEXT NOT NULL,
  testTitle TEXT NOT NULL,
  student_email TEXT NOT NULL,
  category TEXT,
  scoreObtained NUMERIC NOT NULL,
  totalMarks NUMERIC NOT NULL,
  accuracyPercentage NUMERIC,
  percentile NUMERIC,
  rank INTEGER,
  totalCandidates INTEGER,
  timeSpentMinutes INTEGER,
  dateAttempted TEXT,
  status TEXT DEFAULT 'Completed',
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS current_affairs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  hindiTitle TEXT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  summary TEXT NOT NULL,
  keyPoints TEXT[],
  fullContent TEXT,
  relatedMcq JSONB,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS free_pdfs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT,
  fileSize TEXT,
  pages INTEGER,
  downloadUrl TEXT NOT NULL,
  downloadsCount INTEGER DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    showToast('Supabase SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // If not authenticated as Admin, show login gate
  if (!adminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-cyan-400 flex items-center justify-center mx-auto shadow-xl border border-indigo-500/30">
          <Key className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 font-display">
            High-Tech Admin Panel Access
          </h2>
          <p className="text-xs text-slate-500">
            Authorized management for Quiz CBTs, Current Affairs, Free PDFs, Video Lectures, and BooksBoon orders.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Passcode
            </label>
            <input
              type="password"
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              placeholder="Enter admin passcode (e.g. admin123)"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            Authenticate & Enter Admin Console
          </button>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-center gap-1">
            <span>Development Passcode:</span>
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono font-bold">admin123</code>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Admin HUD Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase">
                ADMIN CONSOLE ACTIVE
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-300">
                Supabase: {isSupabaseConfigured() ? 'Connected' : 'Local Hybrid Store'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Central Management & Content Publishing
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Upload Daily Current Affairs, manage CBT Mock Test series, publish Free PDFs, add Video Lectures, and handle BooksBoon hard copy order fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAdminAuthenticated(false);
                localStorage.removeItem('samvedna_admin_auth');
                showToast('Exited Admin Mode', 'info');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Exit Admin Mode
            </button>
          </div>
        </div>

        {/* Global Stats HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Tests</span>
            <span className="text-lg font-black text-amber-300">{testSeriesList.length}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Affairs</span>
            <span className="text-lg font-black text-cyan-300">{currentAffairs.length}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Free PDFs</span>
            <span className="text-lg font-black text-emerald-300">{freePdfs.length}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Books Catalog</span>
            <span className="text-lg font-black text-purple-300">{booksCatalog.length}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Orders Placed</span>
            <span className="text-lg font-black text-rose-300">{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'analytics', label: 'Overview & Orders' },
          { id: 'current-affairs', label: 'Daily Current Affairs' },
          { id: 'quiz', label: 'CBT Test Series' },
          { id: 'pdfs', label: 'Free PDFs & Notes' },
          { id: 'videos', label: 'Video Lectures' },
          { id: 'books', label: 'BooksBoon Store' },
          { id: 'supabase', label: 'Supabase Database' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as typeof activeAdminTab)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl transition-colors cursor-pointer ${
              activeAdminTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & ORDERS */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent BooksBoon Orders & Fulfillment</h2>
            <span className="text-xs text-slate-500">{orders.length} total customer orders</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">City & State</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.orderId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-indigo-700">{ord.orderId}</td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-900 block">{ord.studentName}</span>
                        <span className="text-[11px] text-slate-500">{ord.phone}</span>
                      </td>
                      <td className="p-3 text-slate-600">{ord.address.city}, {ord.address.state}</td>
                      <td className="p-3 text-slate-700">
                        {ord.items.map(it => `${it.title} (${it.quantity})`).join(', ')}
                      </td>
                      <td className="p-3 font-bold text-slate-900">₹{ord.totalAmount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.shippingStatus === 'Delivered' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.shippingStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={ord.shippingStatus}
                          onChange={(e) => updateOrderStatus(ord.orderId, e.target.value as typeof ord.shippingStatus)}
                          className="px-2 py-1 rounded-lg border border-slate-300 text-[11px] bg-white font-semibold"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Dispatched via Courier">Dispatched</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRENT AFFAIRS UPLOAD */}
      {activeAdminTab === 'current-affairs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Publish Daily Current Affairs Article</h2>
            <p className="text-xs text-slate-500">Provide bilingual content and attached MCQ question for daily student tests</p>
          </div>

          <form onSubmit={handleCreateCurrentAffair} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Article Title (English) *</label>
                <input
                  type="text"
                  required
                  value={caTitle}
                  onChange={(e) => setCaTitle(e.target.value)}
                  placeholder="e.g. India Inaugurates Deep Ocean Mission Submersible"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <input
                  type="text"
                  required
                  value={caDate}
                  onChange={(e) => setCaDate(e.target.value)}
                  placeholder="14 October 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hindi Title (Optional)</label>
                <input
                  type="text"
                  value={caHindiTitle}
                  onChange={(e) => setCaHindiTitle(e.target.value)}
                  placeholder="e.g. भारत ने गहरे समुद्र मिशन का परीक्षण किया"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={caCategory}
                  onChange={(e) => setCaCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Polity & Constitution">Polity & Constitution</option>
                  <option value="Economy & Banking">Economy & Banking</option>
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Environment">Environment</option>
                  <option value="National">National</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Article Summary & Content *</label>
              <textarea
                required
                rows={3}
                value={caSummary}
                onChange={(e) => setCaSummary(e.target.value)}
                placeholder="High-yield summary describing the event and its policy significance..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Key Takeaways (One per line)</label>
              <textarea
                rows={3}
                value={caKeyPoints}
                onChange={(e) => setCaKeyPoints(e.target.value)}
                placeholder="Nodal agency: NIOT Chennai&#10;Key constitutional article: 341&#10;Exam relevance: UPSC Prelims Paper-I"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Attached Instant MCQ */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 block">Attached Retention MCQ Question</span>
              <input
                type="text"
                value={caMcqQuestion}
                onChange={(e) => setCaMcqQuestion(e.target.value)}
                placeholder="Question: Which institute developed this project?"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={caMcqOpt1}
                  onChange={(e) => setCaMcqOpt1(e.target.value)}
                  placeholder="Option A"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  value={caMcqOpt2}
                  onChange={(e) => setCaMcqOpt2(e.target.value)}
                  placeholder="Option B"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  value={caMcqOpt3}
                  onChange={(e) => setCaMcqOpt3(e.target.value)}
                  placeholder="Option C"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  value={caMcqOpt4}
                  onChange={(e) => setCaMcqOpt4(e.target.value)}
                  placeholder="Option D"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="font-semibold text-slate-700">Correct Option:</label>
                <select
                  value={caMcqCorrect}
                  onChange={(e) => setCaMcqCorrect(parseInt(e.target.value))}
                  className="px-3 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <input
                type="text"
                value={caMcqExp}
                onChange={(e) => setCaMcqExp(e.target.value)}
                placeholder="Detailed solution explanation..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Publish Daily Current Affairs
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: QUIZ / CBT TEST UPLOAD */}
      {activeAdminTab === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Create All-India CBT Mock Test</h2>
            <p className="text-xs text-slate-500">Configure timer, marks, negative marking, and questions for realistic exam simulation</p>
          </div>

          <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. SSC CGL Tier-1 All India Live CBT Mock #05"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Category</label>
                <select
                  value={quizCategory}
                  onChange={(e) => setQuizCategory(e.target.value as ExamCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="All SSC Exam">All SSC Exam</option>
                  <option value="Teaching & UGC NET">Teaching & UGC NET</option>
                  <option value="UPSC & Civil Services">UPSC & Civil Services</option>
                  <option value="All Railway Exam">All Railway Exam</option>
                  <option value="All Bank Exam">All Bank Exam</option>
                  <option value="All State Exam">All State Exam</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={quizMarks}
                  onChange={(e) => setQuizMarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value as typeof quizDifficulty)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="Exam Pattern">Exam Pattern</option>
                  <option value="Hard">Hard</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Easy">Easy</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 block">Add Test Question</span>
              <textarea
                rows={2}
                value={quizQText}
                onChange={(e) => setQuizQText(e.target.value)}
                placeholder="Question text..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={quizOptA}
                  onChange={(e) => setQuizOptA(e.target.value)}
                  placeholder="Option A"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  value={quizOptB}
                  onChange={(e) => setQuizOptB(e.target.value)}
                  placeholder="Option B"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  value={quizOptC}
                  onChange={(e) => setQuizOptC(e.target.value)}
                  placeholder="Option C"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
                <input
                  type="text"
                  value={quizOptD}
                  onChange={(e) => setQuizOptD(e.target.value)}
                  placeholder="Option D"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="font-semibold text-slate-700">Correct Option:</label>
                <select
                  value={quizCorrectIdx}
                  onChange={(e) => setQuizCorrectIdx(parseInt(e.target.value))}
                  className="px-3 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <input
                type="text"
                value={quizExplanation}
                onChange={(e) => setQuizExplanation(e.target.value)}
                placeholder="Explanation of the correct answer..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Save & Launch CBT Test Series
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: FREE PDFS & NOTES */}
      {activeAdminTab === 'pdfs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Upload Free PDF Study Material / E-Book</h2>
            <p className="text-xs text-slate-500">Add notes, NCERT summaries, or formula books for free student access</p>
          </div>

          <form onSubmit={handleCreatePdf} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PDF Resource Title *</label>
                <input
                  type="text"
                  required
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="e.g. Indian Polity 100 Most Expected Articles"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Category</label>
                <select
                  value={pdfCategory}
                  onChange={(e) => setPdfCategory(e.target.value as ExamCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="Teaching & UGC NET">Teaching & UGC NET</option>
                  <option value="UPSC & Civil Services">UPSC & Civil Services</option>
                  <option value="All SSC Exam">All SSC Exam</option>
                  <option value="All Railway Exam">All Railway Exam</option>
                  <option value="All Bank Exam">All Bank Exam</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={pdfSubject}
                  onChange={(e) => setPdfSubject(e.target.value)}
                  placeholder="e.g. Indian Polity"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">File Size</label>
                <input
                  type="text"
                  value={pdfSize}
                  onChange={(e) => setPdfSize(e.target.value)}
                  placeholder="e.g. 14.5 MB"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Pages</label>
                <input
                  type="number"
                  value={pdfPages}
                  onChange={(e) => setPdfPages(e.target.value)}
                  placeholder="64"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Download / Sample URL</label>
              <input
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="/samples/sample.pdf or direct storage link"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={pdfDesc}
                onChange={(e) => setPdfDesc(e.target.value)}
                placeholder="High-yield notes for rapid revision before exam..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Upload PDF Resource
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: VIDEO LECTURES */}
      {activeAdminTab === 'videos' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Upload Video Lecture Link & Details</h2>
            <p className="text-xs text-slate-500">Embed YouTube or MP4 video lecture with subject notes</p>
          </div>

          <form onSubmit={handleCreateVideo} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lecture Title *</label>
                <input
                  type="text"
                  required
                  value={vidTitle}
                  onChange={(e) => setVidTitle(e.target.value)}
                  placeholder="e.g. Indian Constitution Article 1 to 51A Masterclass"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={vidSubject}
                  onChange={(e) => setVidSubject(e.target.value)}
                  placeholder="e.g. Indian Polity"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty / Instructor</label>
                <input
                  type="text"
                  value={vidInstructor}
                  onChange={(e) => setVidInstructor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={vidDuration}
                  onChange={(e) => setVidDuration(e.target.value)}
                  placeholder="1 hr 45 min"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">YouTube Video ID / URL</label>
                <input
                  type="text"
                  value={vidYoutubeId}
                  onChange={(e) => setVidYoutubeId(e.target.value)}
                  placeholder="e.g. dQw4w9WgXcQ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Save Video Lecture
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: BOOKSBOON CATALOG */}
      {activeAdminTab === 'books' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Add Book or Magazine to BooksBoon.com</h2>
            <p className="text-xs text-slate-500">Publish physical hard copies and magazines with stock count and CDN cover images</p>
          </div>

          <form onSubmit={handleCreateBook} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Book / Magazine Title *</label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="e.g. निर्वाचन लोकतंत्र का आधार"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author / Editor</label>
                <input
                  type="text"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  placeholder="e.g. अरुण कुमार सिंह"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hard Copy Price (₹) *</label>
                <input
                  type="number"
                  value={bookPrice}
                  onChange={(e) => setBookPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  value={bookOrigPrice}
                  onChange={(e) => setBookOrigPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Stock Count</label>
                <input
                  type="number"
                  value={bookStock}
                  onChange={(e) => setBookStock(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cover Image CDN URL</label>
              <input
                type="text"
                value={bookCoverUrl}
                onChange={(e) => setBookCoverUrl(e.target.value)}
                placeholder="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            {bookCoverUrl && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <img src={bookCoverUrl} alt="Preview" className="w-16 h-20 object-cover rounded shadow-xs" />
                <span className="text-xs text-slate-600">Cover preview looks great!</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Add to BooksBoon.com
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: SUPABASE DATABASE INTEGRATION */}
      {activeAdminTab === 'supabase' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Supabase Database Integration Settings</h2>
              <p className="text-xs text-slate-500">Connect your Supabase project to persist orders, test scores, and student dashboard records</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              isSupabaseConfigured() ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured() ? 'Configured' : 'Offline / Local Store'}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Supabase Project URL *
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzabcdefg.supabase.co"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Supabase Public Anon Key *
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={isTestingSupabase}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isTestingSupabase ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing Connection...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Test & Save Supabase Connection</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={copySqlSchema}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy Supabase SQL Schema'}</span>
              </button>
            </div>

            {supabaseStatusMsg && (
              <div className={`p-4 rounded-xl border text-xs font-medium ${
                supabaseStatusMsg.success 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}>
                {supabaseStatusMsg.message}
              </div>
            )}

            {/* Quick SQL schema instructions */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2 mt-4">
              <span className="font-bold text-slate-800 block">How to set up Supabase tables:</span>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a free project at <strong>supabase.com</strong>.</li>
                <li>Go to <strong>Project Settings → API</strong> and copy your Project URL & anon key.</li>
                <li>Go to <strong>SQL Editor</strong> in Supabase, click <strong>&quot;Copy Supabase SQL Schema&quot;</strong> above, paste, and run.</li>
              </ol>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
