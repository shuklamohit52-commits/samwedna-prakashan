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
  AlertCircle,
  ShieldAlert,
  Lock,
  LogOut,
  User,
  Users,
  Search,
  Filter,
  Download,
  ExternalLink,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Eye,
  MapPin,
  Phone,
  Mail,
  Award,
  X,
  FileSpreadsheet,
  GraduationCap
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
  ExamCategory,
  UserProfile 
} from '../types';

export const AdminPanelView: React.FC = () => {
  const { 
    user,
    isAdmin,
    setCurrentView,
    logoutUser,
    adminAuthenticated, 
    setAdminAuthenticated, 
    orders, 
    updateOrderStatus, 
    studentScores, 
    currentAffairs, 
    addCurrentAffair,
    updateCurrentAffair,
    deleteCurrentAffair,
    studentsList,
    updateStudentDetails,
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
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'students' | 'current-affairs' | 'quiz' | 'pdfs' | 'videos' | 'books' | 'supabase'>('analytics');

  // Supabase Config State
  const initialConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(initialConfig.anonKey);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Student Tracking & Management State
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterExam, setStudentFilterExam] = useState('All');
  const [studentFilterStatus, setStudentFilterStatus] = useState('All');
  const [dossierStudent, setDossierStudent] = useState<UserProfile | null>(null);
  const [editStudentModal, setEditStudentModal] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editExam, setEditExam] = useState('');
  const [editPlan, setEditPlan] = useState<'free' | 'monthly' | 'yearly'>('yearly');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editStreet, setEditStreet] = useState('');

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

  // 2. Current Affairs & Topic Banner
  const [caTitle, setCaTitle] = useState('');
  const [caHindiTitle, setCaHindiTitle] = useState('');
  const [caDate, setCaDate] = useState('14 October 2026');
  const [caCategory, setCaCategory] = useState('Polity & Constitution');
  const [caSummary, setCaSummary] = useState('');
  const [caKeyPoints, setCaKeyPoints] = useState('');
  const [caImageUrl, setCaImageUrl] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80');
  const [editingCaId, setEditingCaId] = useState<string | null>(null);
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
  const [vidInstructor, setVidInstructor] = useState('Samwedna Academic Faculty');
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
    if (adminPasscode.trim() === 'admin123' || adminPasscode.trim() === 'samwedna2026' || adminPasscode.trim() === 'samvedna2026' || adminPasscode.trim() === 'booksboon') {
      setAdminAuthenticated(true);
      localStorage.setItem('samwedna_admin_auth', 'true');
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

  const handleEditCurrentAffair = (article: CurrentAffairArticle) => {
    setEditingCaId(article.id);
    setCaTitle(article.title);
    setCaHindiTitle(article.hindiTitle || '');
    setCaDate(article.date);
    setCaCategory(article.category);
    setCaSummary(article.summary);
    setCaKeyPoints(article.keyPoints.join('\n'));
    setCaImageUrl(article.imageUrl || article.bannerImage || '');
    if (article.relatedMcq) {
      setCaMcqQuestion(article.relatedMcq.question);
      setCaMcqOpt1(article.relatedMcq.options[0] || '');
      setCaMcqOpt2(article.relatedMcq.options[1] || '');
      setCaMcqOpt3(article.relatedMcq.options[2] || '');
      setCaMcqOpt4(article.relatedMcq.options[3] || '');
      setCaMcqCorrect(article.relatedMcq.correctIndex);
      setCaMcqExp(article.relatedMcq.explanation);
    }
    showToast(`Loaded "${article.title}" into editor for updating banner and content`, 'info');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCancelEditCa = () => {
    setEditingCaId(null);
    setCaTitle('');
    setCaHindiTitle('');
    setCaSummary('');
    setCaKeyPoints('');
    setCaImageUrl('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80');
    setCaMcqQuestion('');
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

    const banner = caImageUrl.trim() || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';

    const articleData: CurrentAffairArticle = {
      id: editingCaId || `ca-${Date.now()}`,
      title: caTitle.trim(),
      hindiTitle: caHindiTitle.trim() || undefined,
      date: caDate,
      category: caCategory,
      tags: [caCategory, 'Daily Update', 'Exam Preparation'],
      readTime: '4 min read',
      summary: caSummary.trim(),
      keyPoints: keyPointsArray.length > 0 ? keyPointsArray : ['Key exam takeaway on policy, institutions and governance.'],
      fullContent: caSummary.trim(),
      imageUrl: banner,
      bannerImage: banner,
      relatedMcq: caMcqQuestion ? {
        question: caMcqQuestion,
        options: [caMcqOpt1 || 'Option A', caMcqOpt2 || 'Option B', caMcqOpt3 || 'Option C', caMcqOpt4 || 'Option D'],
        correctIndex: caMcqCorrect,
        explanation: caMcqExp || 'Official solution explanation.'
      } : undefined
    };

    if (editingCaId) {
      updateCurrentAffair(articleData);
      setEditingCaId(null);
    } else {
      addCurrentAffair(articleData);
    }

    setCaTitle('');
    setCaHindiTitle('');
    setCaSummary('');
    setCaKeyPoints('');
    setCaImageUrl('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80');
    setCaMcqQuestion('');
  };

  const handleOpenEditStudent = (student: UserProfile) => {
    setEditStudentModal(student);
    setEditName(student.name);
    setEditPhone(student.phone);
    setEditExam(student.targetExam);
    setEditPlan(student.subscription?.planId || 'yearly');
    setEditCity(student.address?.city || '');
    setEditState(student.address?.state || '');
    setEditStreet(student.address?.street || '');
  };

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudentModal) return;

    updateStudentDetails(editStudentModal.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      targetExam: editExam,
      subscription: {
        ...editStudentModal.subscription,
        planId: editPlan,
        planName: editPlan === 'yearly' ? 'Yearly Elite Scholar' : (editPlan === 'monthly' ? 'Monthly Aspirant Pro' : 'Student Free Pass')
      },
      address: {
        ...editStudentModal.address,
        street: editStreet.trim(),
        city: editCity.trim(),
        state: editState.trim(),
      }
    });

    setEditStudentModal(null);
    showToast(`Updated student profile for ${editName}`, 'success');
  };

  const handleExportStudentsCsv = () => {
    const headers = ['Roll Number', 'Full Name', 'Email', 'Phone', 'Target Exam', 'Membership Tier', 'Tests Taken', 'Orders Placed', 'Joined Date'];
    const rows = studentsList.map(s => [
      `"${s.rollNumber || ''}"`,
      `"${s.name || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.targetExam || ''}"`,
      `"${s.subscription?.planName || s.subscription?.planId || 'Free'}"`,
      (s.testScores || []).length,
      (s.orders || []).length,
      `"${(s as any).createdAt || '2026'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `samwedna_students_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Students roster CSV exported successfully!', 'success');
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
      description: pdfDesc || 'Free high-yield exam preparation notes prepared by Samwedna Institute.',
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
      author: bookAuthor || 'Samwedna Editorial Board',
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
    const sql = `-- SUPABASE DATABASE SCHEMA FOR SAMWEDNA INSTITUTE & BOOKSBOON
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

  // Security Check 1: User is not logged in at all
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 text-rose-500 flex items-center justify-center mx-auto shadow-xl border border-rose-500/30">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black tracking-widest text-rose-600 uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Protected Administrator Console
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Administrator Authentication Required
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This console is strictly restricted. Only users logged in with authorized administrator email addresses can access publishing tools and order fulfillment.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left space-y-2.5">
          <p className="text-xs font-bold text-slate-800">Authorized Administrator Accounts:</p>
          <ul className="text-xs text-slate-600 space-y-1.5 font-mono">
            <li className="flex items-center gap-2 text-indigo-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>shukla.mohit52@gmail.com</span>
            </li>
            <li className="flex items-center gap-2 text-indigo-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>booksboon17@gmail.com</span>
            </li>
            <li className="flex items-center gap-2 text-indigo-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>sgi181069@gmail.com</span>
            </li>
            <li className="flex items-center gap-2 text-indigo-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>spiindia181069@gmail.com</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => setCurrentView('signin')}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Key className="w-4 h-4" />
          <span>Login with Authorized Admin Email</span>
        </button>
      </div>
    );
  }

  // Security Check 2: User is logged in, but not an authorized admin
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xl border border-amber-300">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Access Restricted
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Administrator Access Denied
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are currently signed in as <strong className="text-slate-900 font-mono">{user.email}</strong>, which does not have administrator privileges.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
          <p className="font-bold text-slate-700">Required Administrator Accounts:</p>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Please log in using your primary account (<span className="font-mono text-indigo-700">shukla.mohit52@gmail.com</span>) or one of the institutional administrative IDs (<span className="font-mono text-indigo-700">booksboon17@gmail.com</span>, <span className="font-mono text-indigo-700">sgi181069@gmail.com</span>, <span className="font-mono text-indigo-700">spiindia181069@gmail.com</span>).
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              logoutUser();
              setCurrentView('signin');
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Switch Account to Authorized Admin</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
          >
            Return to Store & Student Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Admin HUD Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex items-center -space-x-3 shrink-0 mt-1">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-amber-300 p-0.5 shadow-md z-10">
                <img 
                  src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
                  alt="BooksBoon" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-indigo-300 p-0.5 shadow-md z-0">
                <img 
                  src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/sjgj.jpg" 
                  alt="Samwedna" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>

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
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200">
              <span className="text-[10px] text-cyan-300 font-bold uppercase block">Authenticated Administrator:</span>
              <span className="font-mono font-bold text-white text-xs">{user?.email}</span>
            </div>
            <button
              onClick={() => {
                setCurrentView('home');
                showToast('Returned to Store & Student Portal', 'info');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin Console</span>
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

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registered Students</span>
            <span className="text-lg font-black text-emerald-300">{studentsList.length}</span>
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
          { id: 'students', label: `Students Directory (${studentsList.length})` },
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

      {/* TAB: STUDENTS DIRECTORY & TRACKING */}
      {activeAdminTab === 'students' && (
        <div className="space-y-6">
          {/* Top Header & Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Student Aspirants Roster & Academic Tracking</span>
              </h2>
              <p className="text-xs text-slate-500">
                Track enrolled students, contact info, target examinations, CBT mock test scores, and physical book orders.
              </p>
            </div>

            <button
              onClick={handleExportStudentsCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export Students Roster (CSV)</span>
            </button>
          </div>

          {/* Student KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Enrolled</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">{studentsList.length}</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Active Student Profiles</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Yearly Elite Scholars</span>
              <span className="text-2xl font-extrabold text-indigo-600 mt-1 block font-mono">
                {studentsList.filter(s => s.subscription?.planId === 'yearly').length}
              </span>
              <span className="text-[11px] text-indigo-600 font-semibold">₹0 Scholarship Active</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Test Attempts</span>
              <span className="text-2xl font-extrabold text-amber-600 mt-1 block font-mono">
                {studentsList.reduce((acc, s) => acc + (s.testScores?.length || 0), 0)}
              </span>
              <span className="text-[11px] text-slate-500">All-India CBT Simulations</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Hard Copy Orders</span>
              <span className="text-2xl font-extrabold text-teal-600 mt-1 block font-mono">
                {studentsList.reduce((acc, s) => acc + (s.orders?.length || 0), 0)}
              </span>
              <span className="text-[11px] text-slate-500">BooksBoon Deliveries</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name, email, roll no, phone, city..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Exam:</span>
                <select
                  value={studentFilterExam}
                  onChange={(e) => setStudentFilterExam(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                >
                  <option value="All">All Exams</option>
                  <option value="UPSC Civil Services (IAS / IPS)">UPSC Civil Services</option>
                  <option value="SSC CGL & Railway NTPC">SSC CGL & Railway</option>
                  <option value="Banking PO & Clerk (IBPS / SBI)">Banking PO & Clerk</option>
                  <option value="Teaching & UGC NET (Hindi Sahitya)">Teaching & UGC NET</option>
                  <option value="State PSC (UPPSC, BPSC, MPPSC)">State PSC</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-semibold">Tier:</span>
                <select
                  value={studentFilterStatus}
                  onChange={(e) => setStudentFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                >
                  <option value="All">All Tiers</option>
                  <option value="yearly">Yearly Elite Scholar (₹0)</option>
                  <option value="free">Free Forever Pass</option>
                </select>
              </div>

              {(studentSearch || studentFilterExam !== 'All' || studentFilterStatus !== 'All') && (
                <button
                  onClick={() => {
                    setStudentSearch('');
                    setStudentFilterExam('All');
                    setStudentFilterStatus('All');
                  }}
                  className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Student Details</th>
                    <th className="p-3.5">Contact</th>
                    <th className="p-3.5">Target Examination</th>
                    <th className="p-3.5">Membership Pass</th>
                    <th className="p-3.5">CBT Tests</th>
                    <th className="p-3.5">Books Ordered</th>
                    <th className="p-3.5">Registered</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsList
                    .filter(s => {
                      const q = studentSearch.toLowerCase().trim();
                      const matchSearch = !q || 
                        (s.name && s.name.toLowerCase().includes(q)) ||
                        (s.email && s.email.toLowerCase().includes(q)) ||
                        (s.phone && s.phone.toLowerCase().includes(q)) ||
                        (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
                        (s.address?.city && s.address.city.toLowerCase().includes(q));

                      const matchExam = studentFilterExam === 'All' || s.targetExam === studentFilterExam;
                      const matchStatus = studentFilterStatus === 'All' || 
                        (studentFilterStatus === 'yearly' && s.subscription?.planId === 'yearly') ||
                        (studentFilterStatus === 'free' && s.subscription?.planId === 'free');

                      return matchSearch && matchExam && matchStatus;
                    })
                    .map((student) => {
                      const testsCount = (student.testScores || []).length;
                      const avgAccuracy = testsCount > 0 
                        ? Math.round((student.testScores || []).reduce((acc, t) => acc + (t.accuracyPercentage || 75), 0) / testsCount)
                        : null;
                      const ordersCount = (student.orders || []).length;
                      const totalSpend = (student.orders || []).reduce((acc, o) => acc + (o.totalAmount || 0), 0);

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Student name & roll */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 shadow-2xs">
                                {student.avatar ? (
                                  <img src={student.avatar} alt={student.name} className="w-full h-full rounded-xl object-cover" />
                                ) : (
                                  <span>{student.name.substring(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{student.name}</span>
                                <span className="text-[10px] text-indigo-600 font-mono font-semibold">
                                  {student.rollNumber || `SAM-2026-${student.id.slice(-4)}`}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="p-3.5 space-y-0.5">
                            <a href={`mailto:${student.email}`} className="text-slate-800 hover:text-indigo-600 hover:underline block truncate max-w-[180px]">
                              {student.email}
                            </a>
                            <a href={`tel:${student.phone}`} className="text-[11px] text-slate-500 hover:text-slate-700 block font-mono">
                              {student.phone}
                            </a>
                            {student.address?.city && (
                              <span className="text-[10px] text-slate-400 block">
                                {student.address.city}, {student.address.state}
                              </span>
                            )}
                          </td>

                          {/* Target Exam */}
                          <td className="p-3.5">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-[11px] font-semibold max-w-[170px] truncate">
                              {student.targetExam}
                            </span>
                          </td>

                          {/* Subscription */}
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                student.subscription?.planId === 'yearly'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {student.subscription?.planName || 'Free Student Pass'}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-semibold block">
                                ₹0 Fees (100% Scholarship)
                              </span>
                            </div>
                          </td>

                          {/* Tests */}
                          <td className="p-3.5">
                            {testsCount > 0 ? (
                              <div>
                                <span className="font-bold text-slate-900 block">{testsCount} Tests Taken</span>
                                <span className="text-[10px] text-emerald-700 font-semibold">
                                  Avg Accuracy: {avgAccuracy}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">0 Tests</span>
                            )}
                          </td>

                          {/* Orders */}
                          <td className="p-3.5">
                            {ordersCount > 0 ? (
                              <div>
                                <span className="font-bold text-slate-900 block">{ordersCount} Orders</span>
                                <span className="text-[10px] text-indigo-600 font-semibold">
                                  Total: ₹{totalSpend}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">No orders</span>
                            )}
                          </td>

                          {/* Joined */}
                          <td className="p-3.5 text-slate-500 text-[11px]">
                            {(student as any).createdAt || '15 Jan 2026'}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setDossierStudent(student)}
                                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                title="View Complete Academic Dossier & Activity"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Dossier</span>
                              </button>

                              <button
                                onClick={() => handleOpenEditStudent(student)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Edit Student Profile Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRENT AFFAIRS UPLOAD */}
      {/* TAB 2: CURRENT AFFAIRS & TOPIC BANNER UPLOAD */}
      {activeAdminTab === 'current-affairs' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>{editingCaId ? 'Update Current Affairs Article & Topic Banner' : 'Publish Daily Current Affairs Article & Topic Banner'}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Topic banners are displayed prominently on the Current Affairs page and student digests.
                </p>
              </div>

              {editingCaId && (
                <button
                  type="button"
                  onClick={handleCancelEditCa}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel Edit (Create New)
                </button>
              )}
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
                    placeholder="e.g. भारत ने गहरे समुद्र मिशन का सफल परीक्षण किया"
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
                    <option value="International Relations">International Relations</option>
                    <option value="Defense & Security">Defense & Security</option>
                  </select>
                </div>
              </div>

              {/* TOPIC BANNER IMAGE INPUT & PRESETS */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Topic Image Banner URL *</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Live preview below</span>
                </div>

                <input
                  type="url"
                  required
                  value={caImageUrl}
                  onChange={(e) => setCaImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                />

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Or select curated topic banner preset:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: '🏛️ Polity & Parliament', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80' },
                      { name: '🚀 Science & Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
                      { name: '📈 Economy & RBI', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' },
                      { name: '🌿 Climate & Forests', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80' },
                      { name: '🛡️ Defense & Borders', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80' },
                      { name: '⚡ Tech & AI', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setCaImageUrl(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          caImageUrl === preset.url
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Banner Preview */}
                {caImageUrl && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-indigo-200 shadow-inner bg-slate-900 group">
                    <img 
                      src={caImageUrl} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white text-[11px]">
                      <span className="font-bold block">{caTitle || 'Topic Banner Preview'}</span>
                      <span className="text-slate-300 text-[10px]">{caCategory} · Samwedna Editorial</span>
                    </div>
                  </div>
                )}
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

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCaId ? 'Save & Update Topic Banner & Article' : 'Publish Daily Current Affairs & Banner'}</span>
                </button>

                {editingCaId && (
                  <button
                    type="button"
                    onClick={handleCancelEditCa}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Published Articles List with Banner Previews */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Published Current Affairs & Topic Banners ({currentAffairs.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Update banners, replace image assets, or edit article copy anytime.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAffairs.map((article) => {
                const bannerSrc = article.imageUrl || article.bannerImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';
                return (
                  <div 
                    key={article.id} 
                    className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between bg-white"
                  >
                    {/* Topic Banner Thumbnail */}
                    <div className="relative w-full h-32 bg-slate-900">
                      <img 
                        src={bannerSrc} 
                        alt={article.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-600/90 text-white text-[10px] font-bold">
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 text-white text-xs">
                        <span className="text-[10px] text-slate-300 block">{article.date}</span>
                        <h4 className="font-bold text-xs truncate text-white">{article.title}</h4>
                      </div>
                    </div>

                    {/* Content Excerpt & Controls */}
                    <div className="p-4 space-y-3">
                      {article.hindiTitle && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic font-medium">
                          {article.hindiTitle}
                        </p>
                      )}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-[10px] text-slate-400 font-mono">ID: {article.id}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditCurrentAffair(article)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Banner</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete article "${article.title}"?`)) {
                                deleteCurrentAffair(article.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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

      {/* MODAL 1: STUDENT ACADEMIC DOSSIER & TRACKING DETAILS */}
      {dossierStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-md">
                  {dossierStudent.avatar ? (
                    <img src={dossierStudent.avatar} alt={dossierStudent.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    dossierStudent.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 font-display">{dossierStudent.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      {dossierStudent.subscription?.planName || 'Active Student'}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-mono font-bold mt-0.5">
                    Roll Number: {dossierStudent.rollNumber || `SAM-2026-${dossierStudent.id.slice(-4)}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDossierStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Contact Details</span>
                <span className="font-semibold text-slate-900 block mt-1">{dossierStudent.email}</span>
                <span className="text-slate-600 block mt-0.5 font-mono">{dossierStudent.phone}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Target Competitive Exam</span>
                <span className="font-semibold text-indigo-900 block mt-1">{dossierStudent.targetExam}</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                  Scholarship: 100% Free (₹0 Fees)
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Delivery Address</span>
                <span className="text-slate-700 block mt-1 leading-snug">
                  {dossierStudent.address?.street}, {dossierStudent.address?.city}, {dossierStudent.address?.state} - {dossierStudent.address?.pinCode}
                </span>
                {dossierStudent.address?.landmark && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">Landmark: {dossierStudent.address.landmark}</span>
                )}
              </div>
            </div>

            {/* CBT Test Scores History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>CBT Mock Test Performance History ({dossierStudent.testScores?.length || 0})</span>
                </h4>
              </div>

              {(!dossierStudent.testScores || dossierStudent.testScores.length === 0) ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No CBT mock test attempts recorded for this student yet.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] font-bold uppercase">
                      <tr>
                        <th className="p-2.5">Test Title</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Score</th>
                        <th className="p-2.5">Accuracy</th>
                        <th className="p-2.5">AIR Rank</th>
                        <th className="p-2.5">Percentile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dossierStudent.testScores.map((score) => (
                        <tr key={score.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-900">{score.testTitle}</td>
                          <td className="p-2.5 text-slate-500">{score.dateAttempted}</td>
                          <td className="p-2.5 font-bold text-indigo-700">
                            {score.scoreObtained} / {score.totalMarks}
                          </td>
                          <td className="p-2.5 font-semibold text-emerald-700">
                            {score.accuracyPercentage}%
                          </td>
                          <td className="p-2.5 font-bold text-amber-700 font-mono">
                            #{score.rank}
                          </td>
                          <td className="p-2.5 text-slate-700 font-mono">
                            {score.percentile}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* BooksBoon Orders History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-600" />
                  <span>BooksBoon Physical Orders ({dossierStudent.orders?.length || 0})</span>
                </h4>
              </div>

              {(!dossierStudent.orders || dossierStudent.orders.length === 0) ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No hard copy book orders placed yet.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] font-bold uppercase">
                      <tr>
                        <th className="p-2.5">Order ID</th>
                        <th className="p-2.5">Tracking Number</th>
                        <th className="p-2.5">Items</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dossierStudent.orders.map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-indigo-700">{ord.orderId}</td>
                          <td className="p-2.5 text-slate-600 font-mono text-[11px]">{ord.trackingId}</td>
                          <td className="p-2.5 text-slate-800">
                            {ord.items.map(i => `${i.title} (${i.quantity})`).join(', ')}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900">₹{ord.totalAmount}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {ord.shippingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDossierStudent(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STUDENT PROFILE DETAILS */}
      {editStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Edit Student Profile</h3>
                <p className="text-xs text-slate-500">Update academic details and delivery address records</p>
              </div>
              <button
                type="button"
                onClick={() => setEditStudentModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Examination</label>
                <select
                  value={editExam}
                  onChange={(e) => setEditExam(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="UPSC Civil Services (IAS / IPS)">UPSC Civil Services (IAS / IPS)</option>
                  <option value="SSC CGL & Railway NTPC">SSC CGL & Railway NTPC</option>
                  <option value="Banking PO & Clerk (IBPS / SBI)">Banking PO & Clerk (IBPS / SBI)</option>
                  <option value="Teaching & UGC NET (Hindi Sahitya)">Teaching & UGC NET (Hindi Sahitya)</option>
                  <option value="State PSC (UPPSC, BPSC, MPPSC)">State PSC (UPPSC, BPSC, MPPSC)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Membership Plan</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="yearly">Yearly Elite Scholar (₹0 Free Scholarship)</option>
                  <option value="free">Free Forever Pass</option>
                  <option value="monthly">Monthly Aspirant Pro</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditStudentModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
