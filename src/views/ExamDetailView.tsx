import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EXAMS_CATEGORIES_DATA, getCategoryByExamId, ExamSubItem } from '../data/examsData';
import { ExamLogo } from '../components/ExamLogo';
import { TopicLogo } from '../components/TopicLogo';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  FileText, 
  GraduationCap, 
  Layers, 
  Play, 
  Search, 
  Share2, 
  ShieldCheck, 
  ShoppingBag, 
  Sparkles, 
  Star, 
  Timer, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';

export const ExamDetailView: React.FC = () => {
  const { 
    selectedExam, 
    selectExamById, 
    setCurrentView, 
    booksCatalog, 
    addToCart, 
    setSelectedBook,
    testSeriesList, 
    setActiveTestExam, 
    freePdfs, 
    currentAffairs,
    setSelectedCaArticleId,
    appLanguage,
    setAppLanguage,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'books' | 'pdfs' | 'ca'>('overview');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(selectedExam ? (getCategoryByExamId(selectedExam.id)?.id || 'ssc') : 'ssc');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [selectedExam?.id]);

  if (!selectedExam) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <GraduationCap className="w-16 h-16 text-indigo-600 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Select an Examination</h2>
        <p className="text-slate-600 max-w-md mb-6">
          Explore complete syllabus, BooksBoon publications, All-India CBT mock test series and free study materials across all Government exams.
        </p>
        <button
          onClick={() => selectExamById('ssc-cgl')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md cursor-pointer"
        >
          View SSC CGL 2026 Hub
        </button>
      </div>
    );
  }

  const parentCategory = getCategoryByExamId(selectedExam.id);
  const isHindiPreferred = appLanguage === 'HI' || appLanguage === 'BILINGUAL';

  // Matching books for this exam
  const matchedBooks = booksCatalog.filter(book => {
    if (selectedExam.recommendedBookIds?.includes(book.id)) return true;
    const cat = parentCategory?.id;
    if (cat === 'teaching' && book.category === 'Teaching & UGC NET') return true;
    if (cat === 'ssc' && (book.category === 'All SSC Exam' || book.subject.includes('सामान्य'))) return true;
    if (cat === 'banking' && (book.category === 'All Bank Exam' || book.subject.includes('सामान्य'))) return true;
    if (cat === 'railways' && (book.category === 'All Railway Exam' || book.subject.includes('सामान्य'))) return true;
    if (cat === 'civil-services' && (book.category === 'UPSC & Civil Services' || book.subject.includes('सामान्य'))) return true;
    return false;
  }).slice(0, 4);

  // Matching mock tests for this exam
  const matchedTests = testSeriesList.filter(t => {
    if (selectedExam.mockTestIds?.includes(t.id)) return true;
    const nameMatch = t.title.toLowerCase().includes(selectedExam.name.toLowerCase());
    return nameMatch;
  });
  const displayTests = matchedTests.length > 0 ? matchedTests : testSeriesList.slice(0, 3);

  // Matching free PDFs
  const matchedPdfs = freePdfs.slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500">
            <button 
              onClick={() => setCurrentView('home')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-bold">{parentCategory?.name || 'Exams'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-indigo-600 font-extrabold">{selectedExam.name}</span>
          </div>
        </div>
      </div>

      {/* 2. Rich Hero Header Banner */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedExam.badge || 'Official Exam Hub 2026'}
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 text-cyan-300 font-bold text-xs border border-cyan-400/30">
                  {parentCategory?.name || 'Govt Examination'}
                </span>
                {selectedExam.officialBoard && (
                  <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-400/30">
                    {selectedExam.officialBoard}
                  </span>
                )}
                {selectedExam.vacancies && (
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {selectedExam.vacancies}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-4">
                <div className="p-1 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-indigo-600 shadow-xl shrink-0 mt-1">
                  <div className="bg-slate-950 p-2 rounded-[13px]">
                    <ExamLogo 
                      examId={selectedExam.id} 
                      logoUrl={selectedExam.logoUrl} 
                      size="lg" 
                    />
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display">
                    {selectedExam.name}
                    <span className="block text-lg sm:text-2xl font-bold text-slate-300 mt-1">
                      {selectedExam.fullName}
                    </span>
                  </h1>
                  {isHindiPreferred && selectedExam.hindiName && (
                    <p className="text-base sm:text-lg font-bold text-amber-300 mt-2">
                      {selectedExam.hindiName}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isHindiPreferred && selectedExam.hindiDescription 
                  ? selectedExam.hindiDescription 
                  : selectedExam.description}
              </p>

              {/* High-Tech Exam HUD Spec Matrix with HD Gradient Borders */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-md">
                  <div className="bg-slate-950/95 p-3 rounded-[14.5px] h-full flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-indigo-300 block uppercase tracking-wider">Eligibility</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white truncate block mt-0.5" title={selectedExam.eligibility}>
                      {selectedExam.eligibility}
                    </span>
                  </div>
                </div>

                <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-md">
                  <div className="bg-slate-950/95 p-3 rounded-[14.5px] h-full flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-purple-300 block uppercase tracking-wider">Exam Pattern</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white truncate block mt-0.5" title={selectedExam.pattern}>
                      {selectedExam.pattern}
                    </span>
                  </div>
                </div>

                <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 shadow-md">
                  <div className="bg-slate-950/95 p-3 rounded-[14.5px] h-full flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-amber-300 block uppercase tracking-wider">Total Marks</span>
                    <span className="text-xs sm:text-sm font-extrabold text-amber-300 block mt-0.5">
                      {selectedExam.totalMarks}
                    </span>
                  </div>
                </div>

                <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 shadow-md">
                  <div className="bg-slate-950/95 p-3 rounded-[14.5px] h-full flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-rose-300 block uppercase tracking-wider">Negative Marking</span>
                    <span className="text-xs sm:text-sm font-extrabold text-rose-400 block mt-0.5">
                      {selectedExam.negativeMarking || '-0.25 Marks'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Tech Quick Action Card with HD Gradient Border */}
            <div className="w-full lg:w-80 shrink-0 p-[1.5px] rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 shadow-2xl">
              <div className="bg-slate-950/90 rounded-[22.5px] p-5 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Full Preparation Kit</h4>
                    <p className="text-xs text-slate-400">Books + Mock Tests + PDFs</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => {
                      const test = displayTests[0];
                      if (test) {
                        setActiveTestExam(test);
                      } else {
                        setCurrentView('test-series');
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Free CBT Mock Test</span>
                  </button>

                  <button
                    onClick={() => {
                      if (matchedBooks.length > 0) {
                        setSelectedBook(matchedBooks[0]);
                      } else {
                        setCurrentView('product');
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Recommended Book</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('pdfs');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Free Syllabus PDF</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    100% NTA/TCS-iON Pattern
                  </span>
                  <span className="text-amber-400 font-bold">AIR Ranking Live</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Sub-Sections Tab Navigation */}
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-3 no-scrollbar text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-1 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Overview &amp; Syllabus</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`pb-2 px-1 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
                activeTab === 'tests'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>CBT Test Series ({displayTests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`pb-2 px-1 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
                activeTab === 'books'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>BooksBoon Publications ({matchedBooks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pdfs')}
              className={`pb-2 px-1 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
                activeTab === 'pdfs'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Free PDFs &amp; Notes ({matchedPdfs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ca')}
              className={`pb-2 px-1 border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-2 ${
                activeTab === 'ca'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Daily Current Affairs &amp; MCQs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Tab Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OVERVIEW & SYLLABUS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Syllabus Breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Comprehensive Syllabus &amp; Core Subjects</span>
                  </h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Latest 2026 Edition
                  </span>
                </div>

                <div className="space-y-3">
                  {(selectedExam.syllabusHighlights || [
                    'Section 1: General Intelligence, Reasoning & Logical Aptitude',
                    'Section 2: Quantitative Aptitude & Numerical Ability',
                    'Section 3: General Awareness & Current Affairs Takeaways',
                    'Section 4: Language Proficiency & Comprehension'
                  ]).map((topic, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{topic}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          High Weightage · Includes conceptual theory, previous year questions &amp; chapter-wise mock tests.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Stages */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Selection Process &amp; Stages</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Stage 1</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">CBT Examination</h4>
                    <p className="text-xs text-slate-600 mt-1">Computer-based objective test with normalized scoring.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Stage 2</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">Mains / Skill Evaluation</h4>
                    <p className="text-xs text-slate-600 mt-1">In-depth specialized domain testing / typing / interview.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Stage 3</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">Document &amp; Merit</h4>
                    <p className="text-xs text-slate-600 mt-1">Final All-India Merit list followed by appointment orders.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar: Quick Exam Switcher */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="font-black text-sm text-slate-900 mb-3 flex items-center justify-between">
                  <span>Explore Other {parentCategory?.name}</span>
                  <span className="text-xs text-indigo-600 font-bold">{parentCategory?.exams.length} Exams</span>
                </h4>

                <div className="space-y-2">
                  {parentCategory?.exams.map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => selectExamById(exam.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        exam.id === selectedExam.id
                          ? 'bg-indigo-50 border-indigo-500 font-bold text-indigo-900 shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <ExamLogo examId={exam.id} logoUrl={exam.logoUrl} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-slate-900">{exam.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{exam.fullName}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* BooksBoon Guarantee Card */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-slate-950 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded">
                  BooksBoon Promise
                </span>
                <h4 className="text-base font-black mt-2 leading-tight">
                  Authentic Hard Copies &amp; Direct Institute Delivery
                </h4>
                <p className="text-xs text-slate-900/80 mt-1.5 leading-relaxed">
                  Every book purchased on BooksBoon is dispatched via express courier with real-time tracking, GST invoice, and complimentary digital mock test access.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-950/15 flex items-center justify-between font-mono text-xs font-bold">
                  <span>Courier Support:</span>
                  <a href="tel:+919792903247" className="underline hover:text-white">+91 9792903247</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CBT TEST SERIES */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedExam.name} All India CBT Mock Test Series
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Real NTA/TCS-iON exam interface with instant AIR rank, sectional timer &amp; detailed solutions.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('test-series')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shrink-0"
              >
                Browse All 25+ Tests
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTests.map((test) => (
                <div 
                  key={test.id}
                  className="p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-amber-400 hover:via-orange-500 hover:to-indigo-500 shadow-md hover:shadow-2xl hover:shadow-indigo-500/25 transition-all group flex flex-col"
                >
                  <div className="bg-white rounded-[22.5px] p-5 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          {test.difficulty}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {test.durationMinutes} Mins · {test.totalMarks} Marks
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                        {isHindiPreferred && test.hindiTitle ? test.hindiTitle : test.title}
                      </h4>

                      <div className="mt-3 py-2 px-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Total Questions:</span>
                          <span className="font-bold text-slate-800">{test.totalQuestions} Questions</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Negative Marking:</span>
                          <span className="font-bold text-rose-600">-0.50 Marks</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Enrolled Candidates:</span>
                          <span className="font-bold text-indigo-600">{(test.enrolledStudents || 1420).toLocaleString()}+</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">
                        {test.isFreeDemo ? 'Free All-India Demo' : 'Pro Series'}
                      </span>
                      <button
                        onClick={() => setActiveTestExam(test)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Take Test Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BOOKSBOON PUBLICATIONS */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  BooksBoon Official Publications for {selectedExam.name}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Hard copies printed on high GSM bond paper with chapterwise theory &amp; verified previous year answer keys.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('product')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition-colors shrink-0"
              >
                View Full Bookstore
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedBooks.map((book) => (
                <div 
                  key={book.id}
                  className="p-[1.5px] rounded-3xl bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-md hover:shadow-2xl hover:shadow-amber-500/25 transition-all group flex flex-col"
                >
                  <div className="bg-white rounded-[22.5px] p-5 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex gap-4">
                        <div className="w-20 h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                          {book.bannerImage ? (
                            <img 
                              src={book.bannerImage} 
                              alt={book.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold p-2 text-center text-xs">
                              {book.title.slice(0, 20)}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            {book.badge || 'Hard Copy'}
                          </span>
                          <h4 
                            onClick={() => setSelectedBook(book)}
                            className="font-extrabold text-slate-900 text-sm mt-1.5 leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer"
                          >
                            {isHindiPreferred && book.hindiTitle ? book.hindiTitle : book.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{book.author}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-base font-black text-slate-900">₹{book.paperbackPrice}</span>
                            <span className="text-xs text-slate-400 line-through">₹{book.originalPrice}</span>
                            <span className="text-[11px] font-bold text-emerald-600">
                              {Math.round(((book.originalPrice - book.paperbackPrice) / book.originalPrice) * 100)}% off
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => addToCart(book, 'Paperback')}
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => {
                          addToCart(book, 'Paperback');
                          setCurrentView('checkout');
                        }}
                        className="py-2 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition-colors cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FREE PDFS & NOTES */}
        {activeTab === 'pdfs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Free Downloadable Study Materials for {selectedExam.name}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Formula sheets, topic-wise mind maps and previous years solved papers in PDF format.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('free-pdfs')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shrink-0"
              >
                View All Free PDFs
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedPdfs.map((pdf) => (
                <div 
                  key={pdf.id}
                  className="p-[1.5px] rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 shadow-xs hover:shadow-xl transition-all group"
                >
                  <div className="bg-white rounded-[14.5px] p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-black shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{pdf.category}</span>
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {isHindiPreferred && pdf.hindiTitle ? pdf.hindiTitle : pdf.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {pdf.pages} Pages · {pdf.fileSize} · {pdf.downloadsCount || 820}+ Downloads
                        </p>
                      </div>
                    </div>

                    <a
                      href={pdf.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DAILY CURRENT AFFAIRS */}
        {activeTab === 'ca' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Daily Current Affairs &amp; Exam Takeaways
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Bilingual capsules updated every morning with practice MCQs and HTML formatted analysis.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('current-affairs')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shrink-0"
              >
                Go to Current Affairs Portal
              </button>
            </div>

            <div className="space-y-4">
              {currentAffairs.slice(0, 3).map((article) => (
                <div 
                  key={article.id}
                  className="p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-xs hover:shadow-xl transition-all group"
                >
                  <div className="bg-white rounded-[14.5px] p-5 space-y-4">
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Image Logo of Topic at Left of Text */}
                      <div className="shrink-0">
                        <TopicLogo 
                          imageUrl={article.imageUrl || article.bannerImage}
                          category={article.category}
                          title={article.title}
                          size="md"
                        />
                      </div>

                      {/* Topic Text */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                            {article.category}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{article.date}</span>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                          {isHindiPreferred && article.hindiTitle ? article.hindiTitle : article.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {isHindiPreferred && article.hindiSummary ? article.hindiSummary : article.summary}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Read Time: {article.readTime}</span>
                      <button
                        onClick={() => {
                          setSelectedCaArticleId(article.id);
                          setCurrentView('current-affairs');
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Read Complete Article &amp; Take MCQ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
