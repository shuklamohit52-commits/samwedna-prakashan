import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Star, 
  Download, 
  ShoppingBag, 
  ShieldCheck, 
  Play, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  Store,
  GraduationCap,
  FileText,
  Bookmark,
  Truck,
  Video,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { BOOKS_DATA, VIDEO_LECTURES } from '../data/mockData';
import { ExamCategory, Book } from '../types';
import { BookImage } from '../components/BookImage';
import { RedTickerBar } from '../components/RedTickerBar';

export const HomeView: React.FC = () => {
  const { 
    setCurrentView, 
    setPortalMode,
    setSelectedBook, 
    setActiveTestExam, 
    addToCart, 
    searchQuery, 
    setSearchQuery, 
    setFilterCategory,
    currentAffairs,
    freePdfs,
    testSeriesList
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'booksboon' | 'institute'>('booksboon');

  // Hero slideshow focusing strictly on BooksBoon & Samwedna Institute (NO coaching)
  const heroSlides = [
    {
      badge: 'BooksBoon.com Store',
      title: 'Order Hard Copy Textbooks & Magazines',
      subheading: 'Official online bookstore for original physical copies. Dispatched in waterproof packaging with door-step delivery via India Post & Bluedart. Powered by Razorpay.',
      accent: 'Door-Step Delivery across all PIN codes in India',
      ctaText: 'Shop Hard Copies on BooksBoon',
      ctaAction: () => {
        setPortalMode('booksboon');
        setCurrentView('product');
      },
      secondaryText: 'View Cart & Checkout',
      secondaryAction: () => setCurrentView('cart'),
      gradient: 'from-slate-950 via-amber-950/60 to-slate-900',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30'
    },
    {
      badge: 'Samwedna Group of Institutes',
      title: 'Complete Solution for Student Exam Preparation',
      subheading: 'Daily bilingual Current Affairs, Real CBT Mock Test Series, Free PDF study material capsules, Concept Mindmaps, and Faculty Video Lectures.',
      accent: 'Bilingual (Hindi & English) Study Ecosystem',
      ctaText: 'Access Student Prep Portal',
      ctaAction: () => {
        setPortalMode('institute');
        setCurrentView('current-affairs');
      },
      secondaryText: 'Try Real Exam CBT Demo',
      secondaryAction: () => {
        setPortalMode('institute');
        if (testSeriesList.length > 0) {
          setActiveTestExam(testSeriesList[0]);
        } else {
          setCurrentView('test-series');
        }
      },
      gradient: 'from-slate-950 via-indigo-950 to-slate-900',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
    },
    {
      badge: 'Bestseller Hard Copy',
      title: 'हिन्दी साहित्य का इतिहास (2500+ MCQs)',
      subheading: 'डॉ. रजनीश कुमार यादव (सहायक प्रोफेसर, हिन्दी - JNU/BHU) कृत परिमार्जित एवं संशोधित द्वितीय संस्करण। UGC NET, BPSC TRE, TGT/PGT हेतु सर्वाधिक लोकप्रिय प्रमाणिक ग्रंथ।',
      accent: 'Hard Copy Paperback in Stock for Immediate Dispatch',
      ctaText: 'Order Hard Copy (₹395)',
      ctaAction: () => {
        const book = BOOKS_DATA.find(b => b.id === 'hindi-sahitya-itihas-rajneesh') || BOOKS_DATA[0];
        addToCart(book, 'Paperback');
        setCurrentView('checkout');
      },
      secondaryText: 'Look Inside / Sample PDF',
      secondaryAction: () => {
        const book = BOOKS_DATA.find(b => b.id === 'hindi-sahitya-itihas-rajneesh') || BOOKS_DATA[0];
        setSelectedBook(book);
      },
      gradient: 'from-stone-950 via-red-950/70 to-slate-950',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30'
    }
  ];

  // Auto-play hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Slideshow Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Slide Copy */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${heroSlides[currentSlide].badgeColor}`}>
                  {heroSlides[currentSlide].badge}
                </span>
                <span className="text-slate-300 text-xs hidden sm:inline">
                  {heroSlides[currentSlide].accent}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {heroSlides[currentSlide].subheading}
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={heroSlides[currentSlide].ctaAction}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>{heroSlides[currentSlide].ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={heroSlides[currentSlide].secondaryAction}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>{heroSlides[currentSlide].secondaryText}</span>
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="flex items-center gap-2 pt-4">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

            {/* Right Interactive Highlights Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-900/90 to-indigo-950/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      BooksBoon Quick Dispatch
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    In Physical Stock
                  </span>
                </div>

                {/* Highlight Real Book */}
                {BOOKS_DATA[0] && (
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div className="w-16 h-22 rounded-xl overflow-hidden shrink-0 shadow-md">
                      <BookImage book={BOOKS_DATA[0]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block truncate">
                        {BOOKS_DATA[0].category}
                      </span>
                      <h4 className="font-bold text-sm text-white line-clamp-1">
                        {BOOKS_DATA[0].title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">{BOOKS_DATA[0].author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-extrabold text-amber-400">
                          ₹{BOOKS_DATA[0].paperbackPrice}
                          <span className="text-[11px] text-slate-500 line-through ml-1.5 font-normal">
                            ₹{BOOKS_DATA[0].originalPrice}
                          </span>
                        </span>
                        <button
                          onClick={() => {
                            addToCart(BOOKS_DATA[0], 'Paperback');
                            setCurrentView('checkout');
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] cursor-pointer shadow-xs"
                        >
                          Buy Hard Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instant Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books, author, ISBN, or exam..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </form>

                {/* Feature Bullets */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Free Shipping &gt; ₹499</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Razorpay Secure Checkout</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. The Two Main Pillars Segmented Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block">
            Integrated Platform Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
            Two Pillars. One Complete Solution.
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Choose between our dedicated physical bookstore at BooksBoon.com or access complete student exam preparation at Samwedna Group of Institutes.
          </p>

          {/* Pillar Switcher Buttons */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mt-2">
            <button
              onClick={() => setActiveCategoryTab('booksboon')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'booksboon'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Category 1: BooksBoon.com (Store)</span>
            </button>

            <button
              onClick={() => setActiveCategoryTab('institute')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryTab === 'institute'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Category 2: Samwedna Group of Institutes</span>
            </button>
          </div>
        </div>

        {/* PILLAR 1: BOOKSBOON.COM SHOWCASE */}
        {activeCategoryTab === 'booksboon' && (
          <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 rounded-3xl border border-amber-200/80 p-8 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/60">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-amber-300 p-0.5 shadow-xs shrink-0">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
                      alt="BooksBoon" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                      booksboon.com
                    </span>
                    <span className="text-xs font-bold text-amber-800">Hard Copies & Magazines E-Commerce</span>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display">
                  Physical Hard Copy Books & Magazines
                </h3>
                <p className="text-xs text-slate-600 max-w-xl">
                  Order authentic physical paperbacks printed on 70 GSM maplitho with high-durability thermal lamination. Seamless online cart, checkout, and Razorpay payment.
                </p>
              </div>

              <button
                onClick={() => {
                  setPortalMode('booksboon');
                  setCurrentView('product');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
              >
                <span>Browse Full BooksBoon Catalog</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Official Real Banner Images Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {BOOKS_DATA.filter(b => b.bannerImage).slice(0, 5).map((book) => (
                <div 
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Real Image Container */}
                    <div className="relative aspect-3/4 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                      <BookImage 
                        book={book} 
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-white shadow-xs">
                        {book.badge || 'Official Book'}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block truncate">
                        {book.category}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">By {book.author}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-slate-900">₹{book.paperbackPrice}</span>
                        <span className="text-xs text-slate-400 line-through ml-1.5">₹{book.originalPrice}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        Hard Copy
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book, 'Paperback');
                        setCurrentView('checkout');
                      }}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Hard Copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* PILLAR 2: SAMWEDNA GROUP OF INSTITUTES SHOWCASE */}
        {activeCategoryTab === 'institute' && (
          <div className="bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/30 rounded-3xl border border-indigo-200/80 p-8 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-200/60">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-indigo-300 p-0.5 shadow-xs shrink-0">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/sjgj.jpg" 
                      alt="Samwedna Group of Institutes" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-black">
                      samwedna.org
                    </span>
                    <span className="text-xs font-bold text-indigo-800">Complete Student Preparation Solution</span>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display">
                  Daily Current Affairs, Test Series, Free PDFs & Video Lectures
                </h3>
                <p className="text-xs text-slate-600 max-w-xl">
                  Comprehensive digital ecosystem engineered for UPSC, UPPSC, SSC CGL, Teaching, Railway, and Banking exams with authenticated student dashboard and Supabase persistence.
                </p>
              </div>

              <button
                onClick={() => {
                  setPortalMode('institute');
                  setCurrentView('current-affairs');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </button>
            </div>

            {/* 4 Feature Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1: Daily Current Affairs */}
              <div 
                onClick={() => {
                  setPortalMode('institute');
                  setCurrentView('current-affairs');
                }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Daily Current Affairs
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Updated every morning with key points, bilingual notes, and 5 instant retention MCQs.
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <span>Read Today&apos;s Edition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Feature 2: CBT Test Series */}
              <div 
                onClick={() => {
                  setPortalMode('institute');
                  setCurrentView('test-series');
                }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Real Exam CBT Test Series
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Actual TCS iON & NTA pattern: timer, question palette, negative marks, and All-India Rank.
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <span>Take Live CBT Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Feature 3: Free PDFs & Study Material */}
              <div 
                onClick={() => {
                  setPortalMode('institute');
                  setCurrentView('free-pdfs');
                }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Free PDFs & E-Books
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    NCERT capsules, Polity cheat sheets, speed maths formulas, and topper handwritten notes.
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <span>Browse Free PDFs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Feature 4: Video Lectures */}
              <div 
                onClick={() => {
                  setPortalMode('institute');
                  setCurrentView('video-lectures');
                }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Faculty Video Lectures
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Concept breakdown videos covering Polity, Speed Maths, Static GK, and Reasoning puzzles.
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <span>Watch Lectures</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>

          </div>
        )}

      </section>

      {/* 4. Student Preparation Feature Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                Dedicated Student Dashboard & Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                Track Your Marks, All-India Rank, and BooksBoon Orders in One Place
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Log in to review your CBT performance history, bookmark high-yield current affairs, access downloaded PDF study materials, and track hard copy deliveries.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('student-dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Open Student Dashboard
                </button>

                <button
                  onClick={() => setCurrentView('signin')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Student Sign In / Register
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                Live Platform Stats
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Enrolled Students</span>
                  <strong className="text-white">45,000+</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Daily Current Affairs Readers</span>
                  <strong className="text-white">12,400+ Daily</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Hard Copies Dispatched</span>
                  <strong className="text-white">35,000+ Books</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Database Sync</span>
                  <strong className="text-emerald-400">Supabase Cloud Active</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
