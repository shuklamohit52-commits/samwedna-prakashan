import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  LogOut, 
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Store,
  FileText,
  Video,
  Award,
  Layers,
  Sparkles,
  Package,
  Key,
  Flame,
  ArrowRight,
  Languages,
  Briefcase,
  Landmark,
  Shield,
  Train,
  Crosshair,
  TrendingUp,
  ExternalLink,
  Zap,
  HelpCircle
} from 'lucide-react';
import { PageView } from '../types';
import { RedTickerBar } from './RedTickerBar';
import { ExamCategoryGroup, ExamSubItem } from '../data/examsData';
import { ExamLogo } from './ExamLogo';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    user, 
    isAdmin,
    logoutUser, 
    setAccountTab,
    searchQuery,
    setSearchQuery,
    setFilterCategory,
    appLanguage,
    setAppLanguage,
    selectExamById,
    selectedExam,
    examsCategories
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  
  // Mega-menu state for Exams (hover & focus supported)
  const [isExamsMenuOpen, setIsExamsMenuOpen] = useState(false);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('banking');
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dropdown state for Samwedna Hub
  const [isSamwednaMenuOpen, setIsSamwednaMenuOpen] = useState(false);
  const samwednaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavClick = (view: PageView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    setIsExamsMenuOpen(false);
    setIsSamwednaMenuOpen(false);
  };

  const handleExamClick = (examId: string) => {
    selectExamById(examId);
    setIsExamsMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleExamsMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsExamsMenuOpen(true);
  };

  const handleExamsMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsExamsMenuOpen(false);
    }, 220);
  };

  const handleSamwednaMouseEnter = () => {
    if (samwednaMenuTimeoutRef.current) clearTimeout(samwednaMenuTimeoutRef.current);
    setIsSamwednaMenuOpen(true);
  };

  const handleSamwednaMouseLeave = () => {
    samwednaMenuTimeoutRef.current = setTimeout(() => {
      setIsSamwednaMenuOpen(false);
    }, 220);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('product');
      setShowSearchInput(false);
      setMobileMenuOpen(false);
    }
  };

  const activeCategory = (examsCategories && examsCategories.length > 0)
    ? (examsCategories.find(c => c.id === activeCategoryKey) || examsCategories[0])
    : { id: 'ssc', name: 'SSC Exams', description: '', exams: [] };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'ssc':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'banking':
        return <Landmark className="w-4 h-4 text-sky-600" />;
      case 'teaching':
        return <GraduationCap className="w-4 h-4 text-amber-600" />;
      case 'civil-services':
        return <Shield className="w-4 h-4 text-emerald-600" />;
      case 'railways':
        return <Train className="w-4 h-4 text-rose-600" />;
      case 'defence':
        return <Crosshair className="w-4 h-4 text-zinc-700" />;
      case 'police':
        return <Award className="w-4 h-4 text-yellow-600" />;
      default:
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* 1. Dynamic Red Running Ticker */}
      <RedTickerBar />

      {/* 2. Unified Header Micro-Bar */}
      <div className="w-full bg-slate-950 text-white border-b border-slate-800 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              BooksBoon Official Publications &amp; Examination Portal 2026
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Global Bilingual Medium Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px] font-bold">
              <span className="px-2 text-slate-400 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Medium:</span>
              </span>
              <button
                type="button"
                onClick={() => setAppLanguage('BILINGUAL')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'BILINGUAL'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Bilingual / द्विभाषी (Hindi + English)"
              >
                द्विभाषी
              </button>
              <button
                type="button"
                onClick={() => setAppLanguage('HI')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'HI'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="हिन्दी माध्यम"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setAppLanguage('EN')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'EN'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English Medium"
              >
                English
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-cyan-300 border border-cyan-400/30'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Console</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-400 hidden sm:inline">Helpline:</span>
              <a href="tel:+919792903247" className="text-amber-400 font-bold hover:underline">+91 9792903247</a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main Brand Navigation Bar */}
      <div className="w-full mx-auto px-4 sm:px-8 bg-white relative">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Unified Brand Wordmark & Official Logos */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 text-left group cursor-pointer shrink-0"
          >
            {/* Dual Logos (BooksBoon Primary + Samwedna Group) */}
            <div className="flex items-center -space-x-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white border-2 border-amber-400 shadow-md flex items-center justify-center p-1 group-hover:scale-105 transition-transform shrink-0 z-10">
                <img 
                  src="/logo.jpg" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://raw.githubusercontent.com/luckymohittiwari52-oss/quiz-assets/main/images/bokbon.jpg";
                  }}
                  alt="BooksBoon Official Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white border-2 border-indigo-400 shadow-sm flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform shrink-0">
                <img 
                  src="/sjgj.jpg" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://raw.githubusercontent.com/luckymohittiwari52-oss/quiz-assets/main/images/sjgj.jpg";
                  }}
                  alt="Samwedna Group of Institutes Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display block leading-none">
                  BOOKSBOON
                </span>
                <span className="text-xs font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded shadow-xs">
                  .COM
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-indigo-700 tracking-wide uppercase block mt-1">
                BooksBoon Publications · In Association with Samwedna Group
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentView === 'home' 
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            {/* 2. EXAMS (MEGA-MENU HOVER / DROPDOWN LIKE TESTBOOK) */}
            <div 
              className="relative"
              onMouseEnter={handleExamsMouseEnter}
              onMouseLeave={handleExamsMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  if (currentView !== 'exam-detail') {
                    handleNavClick('exam-detail');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentView === 'exam-detail' || isExamsMenuOpen
                    ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Exams</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExamsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* TESTBOOK-STYLE MEGA MENU CONTAINER */}
              {isExamsMenuOpen && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[850px] xl:w-[940px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn"
                  onMouseEnter={handleExamsMouseEnter}
                  onMouseLeave={handleExamsMouseLeave}
                >
                  <div className="flex divide-x divide-slate-100 min-h-[480px]">
                    
                    {/* Left Column: Categories List */}
                    <div className="w-64 bg-slate-50/70 p-3 space-y-1 shrink-0 overflow-y-auto max-h-[520px]">
                      <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Exam Categories
                      </div>

                      {(examsCategories && examsCategories.length > 0 ? examsCategories : []).map((cat) => {
                        const isActive = cat.id === activeCategoryKey;
                        return (
                          <button
                            key={cat.id}
                            onMouseEnter={() => setActiveCategoryKey(cat.id)}
                            onClick={() => setActiveCategoryKey(cat.id)}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100 border border-slate-200/80 font-extrabold'
                                : 'text-slate-700 hover:bg-white/80 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="p-1 rounded-lg bg-slate-100">{getCategoryIcon(cat.id)}</span>
                              <span className="truncate">{cat.name}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-indigo-600 translate-x-0.5' : 'text-slate-400'}`} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: 3-Column Exams Grid (High-Tech HD Gradient Border Cards!) */}
                    <div className="flex-1 p-5 bg-white flex flex-col justify-between overflow-y-auto max-h-[520px]">
                      <div>
                        {/* Header for Active Category */}
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                          <div>
                            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                              {getCategoryIcon(activeCategory.id)}
                              <span>{activeCategory.name}</span>
                              <span className="text-xs font-normal text-slate-500">
                                ({activeCategory.exams.length} Exams Listed)
                              </span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{activeCategory.description}</p>
                          </div>

                          <button
                            onClick={() => {
                              if (activeCategory.exams[0]) {
                                handleExamClick(activeCategory.exams[0].id);
                              }
                            }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Explore Category Hub</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 3-Column High-Tech Exam Cards Grid with HD Gradient Borders */}
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5">
                          {activeCategory.exams.map((exam) => (
                            <div
                              key={exam.id}
                              onClick={() => handleExamClick(exam.id)}
                              className="group text-left p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/30 to-purple-500/20 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-2xs hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer transform hover:-translate-y-0.5"
                            >
                              <div className="bg-white group-hover:bg-indigo-50/25 p-2.5 rounded-[14.5px] flex items-center justify-between gap-2.5 transition-colors h-full">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {/* Authentic Official Exam Board Logo */}
                                  <ExamLogo examId={exam.id} category={activeCategory.name} size="sm" customLogoUrl={exam.logoUrl} />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 truncate block tracking-tight">
                                        {exam.name}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-semibold truncate block">
                                      {exam.vacancies || exam.eligibility.slice(0, 22)}
                                    </span>
                                  </div>
                                </div>

                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mega Menu Footer Banner */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                            BOOKSBOON + SAMWEDNA
                          </span>
                          <span className="text-slate-600 text-xs font-medium">
                            Includes Official Books, CBT Simulated Mocks, and Daily Analysis.
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (activeCategory.exams[0]) {
                              handleExamClick(activeCategory.exams[0].id);
                            }
                          }}
                          className="font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          View Full Pattern &rarr;
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 3. Books & Publications */}
            <button
              onClick={() => {
                setFilterCategory('All');
                handleNavClick('product');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentView === 'product' 
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Books &amp; Publications
            </button>

            {/* 4. Test Series */}
            <button
              onClick={() => handleNavClick('test-series')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currentView === 'test-series' 
                  ? 'bg-indigo-50 text-indigo-700 font-extrabold' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Test Series
            </button>

            {/* 5. SAMWEDNA SECTIONS (MULTI-PAGES & SUB-SECTIONS DROPDOWN) */}
            <div 
              className="relative"
              onMouseEnter={handleSamwednaMouseEnter}
              onMouseLeave={handleSamwednaMouseLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  currentView === 'current-affairs' || currentView === 'free-pdfs' || currentView === 'video-lectures' || currentView === 'study-materials' || currentView === 'house-of-samwedna' || isSamwednaMenuOpen
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Samwedna Hub</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSamwednaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSamwednaMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-fadeIn"
                  onMouseEnter={handleSamwednaMouseEnter}
                  onMouseLeave={handleSamwednaMouseLeave}
                >
                  <div className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Samwedna Institute Sections
                  </div>

                  <button
                    onClick={() => handleNavClick('current-affairs')}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">Daily Current Affairs</p>
                      <p className="text-[11px] text-slate-500 font-normal">Bilingual capsules &amp; HTML analysis</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('free-pdfs')}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">Free PDFs &amp; Capsules</p>
                      <p className="text-[11px] text-slate-500 font-normal">Formula sheets &amp; mindmaps</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('video-lectures')}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">Video Lectures</p>
                      <p className="text-[11px] text-slate-500 font-normal">Recorded classes &amp; faculty lessons</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('study-materials')}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">Study Materials</p>
                      <p className="text-[11px] text-slate-500 font-normal">Handwritten notes &amp; syllabus sheets</p>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => handleNavClick('house-of-samwedna')}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">About Samwedna &amp; Centers</p>
                      <p className="text-[11px] text-slate-500 font-normal">Delhi · Gorakhpur · Lucknow · Patna</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </nav>

          {/* Right Actions: Search, Cart, Student Auth */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Quick Search Toggle */}
            <div className="relative">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books, exams, tests, PDFs..."
                    autoFocus
                    className="w-52 sm:w-64 pl-8 pr-8 py-2 text-xs bg-slate-100 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowSearchInput(false)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Search Books & Exams"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* BooksBoon Cart Icon */}
            <button
              onClick={() => handleNavClick('cart')}
              className="relative p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="BooksBoon Cart"
              title="Shopping Cart & Checkout"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Student Account / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        Roll: {user.rollNumber || 'SAM-2026-8841'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setAccountTab('dashboard');
                        handleNavClick('student-dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      CBT Test Analytics
                    </button>

                    <button
                      onClick={() => {
                        setAccountTab('orders');
                        handleNavClick('student-dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-indigo-500" />
                      BooksBoon Hard Copy Orders
                    </button>

                    <button
                      onClick={() => {
                        setAccountTab('library');
                        handleNavClick('student-dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      My E-Library &amp; Free PDFs
                    </button>

                    {isAdmin && (
                      <>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={() => {
                            handleNavClick('admin');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 flex items-center gap-2"
                        >
                          <Key className="w-3.5 h-3.5" />
                          Admin Control Panel
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('signin')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
                title="Click to Login / Sign Up"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* 4. Mobile Menu Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fadeIn max-h-[80vh] overflow-y-auto">
          
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Home
            </button>

            {/* Mobile Exams Accordion */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                All India Examinations Hub
              </span>

              <div className="space-y-1">
                {examsCategories.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <span className="text-xs font-extrabold text-indigo-700 block px-2 pt-1 flex items-center gap-1.5">
                      {getCategoryIcon(cat.id)}
                      {cat.name}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 pl-2">
                      {cat.exams.slice(0, 4).map((exam) => (
                        <button
                          key={exam.id}
                          onClick={() => handleExamClick(exam.id)}
                          className="text-left px-2 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-white rounded-lg border border-slate-200/60 truncate"
                        >
                          {exam.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setFilterCategory('All');
                handleNavClick('product');
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center justify-between"
            >
              <span>Books &amp; Publications Catalog</span>
              <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded">Store</span>
            </button>

            <button
              onClick={() => handleNavClick('test-series')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              All India CBT Test Series
            </button>

            <button
              onClick={() => handleNavClick('current-affairs')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Daily Current Affairs
            </button>

            <button
              onClick={() => handleNavClick('free-pdfs')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Free PDFs &amp; E-Books
            </button>

            <button
              onClick={() => handleNavClick('video-lectures')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Video Lectures
            </button>

            <button
              onClick={() => handleNavClick('house-of-samwedna')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              About Samwedna &amp; Centers
            </button>

            <button
              onClick={() => handleNavClick('student-dashboard')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl"
            >
              Student Dashboard
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left px-3 py-2 text-xs font-bold text-cyan-700 hover:bg-cyan-50 rounded-xl flex items-center gap-2"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Admin Control Panel</span>
              </button>
            )}

            {!user ? (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleNavClick('signin')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Sign In</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out ({user.name.split(' ')[0]})</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </header>
  );
};
