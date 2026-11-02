import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ArrowRight, 
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
  Truck,
  Video,
  Layers,
  Flame,
  Zap,
  Briefcase,
  Landmark,
  Shield,
  Train,
  Crosshair,
  Calendar
} from 'lucide-react';
import { BOOKS_DATA } from '../data/mockData';
import { EXAMS_CATEGORIES_DATA } from '../data/examsData';
import { BookImage } from '../components/BookImage';
import { ExamLogo } from '../components/ExamLogo';
import { TopicLogo } from '../components/TopicLogo';

export const HomeView: React.FC = () => {
  const { 
    setCurrentView, 
    setSelectedBook, 
    setActiveTestExam, 
    addToCart, 
    searchQuery, 
    setSearchQuery, 
    setFilterCategory,
    currentAffairs,
    setSelectedCaArticleId,
    freePdfs,
    testSeriesList,
    selectExamById,
    appLanguage,
    examsCategories
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      badge: 'Official Bookstore · BooksBoon.com',
      title: 'BooksBoon Hard Copies & Publications',
      subheading: 'Authentic printed textbooks, Hindi Sahitya 2500+ MCQs, General Studies volumes, and monthly examination magazines delivered directly to your doorstep across India. Powered by Razorpay.',
      accent: 'Doorstep Courier Delivery Across India',
      ctaText: 'Shop Books & Publications',
      ctaAction: () => {
        setFilterCategory('All');
        setCurrentView('product');
      },
      secondaryText: 'Explore All Exams Hub',
      secondaryAction: () => {
        selectExamById('ssc-cgl');
      },
      gradient: 'from-slate-950 via-amber-950/60 to-slate-900',
      badgeColor: 'bg-amber-400 text-slate-950'
    },
    {
      badge: 'National Examination Hub 2026',
      title: 'Target Your Dream Govt Exam',
      subheading: 'Access complete syllabus breakdown, NTA/TCS-iON CBT mock tests, BooksBoon reference publications, daily current affairs capsules, and free PDF study sheets.',
      accent: 'Covering SSC, Banking, Teaching, Railways, UPSC & State Exams',
      ctaText: 'Browse 50+ Examinations',
      ctaAction: () => {
        selectExamById('sbi-clerk');
      },
      secondaryText: 'Try Free CBT Mock Test',
      secondaryAction: () => {
        if (testSeriesList.length > 0) {
          setActiveTestExam(testSeriesList[0]);
        } else {
          setCurrentView('test-series');
        }
      },
      gradient: 'from-slate-950 via-indigo-950 to-slate-900',
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      badge: 'National Bestseller',
      title: 'हिन्दी साहित्य का इतिहास (2500+ MCQs)',
      subheading: 'डॉ. रजनीश कुमार यादव (सहायक प्रोफेसर, हिन्दी - JNU/BHU) कृत संशोधित द्वितीय संस्करण। UGC NET, BPSC TRE, UP TGT/PGT हेतु सर्वाधिक अनुशंसित ग्रंथ।',
      accent: 'Paperback In Stock for Immediate Dispatch',
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
      badgeColor: 'bg-rose-600 text-white'
    }
  ];

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'ssc':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'banking':
        return <Landmark className="w-5 h-5 text-sky-600" />;
      case 'teaching':
        return <GraduationCap className="w-5 h-5 text-amber-600" />;
      case 'civil-services':
        return <Shield className="w-5 h-5 text-emerald-600" />;
      case 'railways':
        return <Train className="w-5 h-5 text-rose-600" />;
      case 'defence':
        return <Crosshair className="w-5 h-5 text-zinc-700" />;
      case 'police':
        return <Award className="w-5 h-5 text-yellow-600" />;
      default:
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
    }
  };

  const isHindi = appLanguage === 'HI';

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Slideshow Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Slide Copy */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md bg-white/5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${heroSlides[currentSlide].badgeColor}`}>
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
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
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
              <div className="flex items-center gap-2 pt-2">
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
              <div className="bg-gradient-to-br from-slate-900/95 to-indigo-950/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      BooksBoon Quick Dispatch
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Physical Stock Ready
                  </span>
                </div>

                {/* Highlight Real Book */}
                {BOOKS_DATA[0] && (
                  <div className="flex items-center gap-4 bg-white/5 p-3.5 rounded-2xl border border-white/10">
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
                          className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] cursor-pointer shadow-xs"
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
                    placeholder="Search books, exams, authors, or PDFs..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </form>

                {/* Feature Bullets */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Courier All Over India</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Razorpay Integration</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. EXAMS HUB SECTION (MATCHING SCREENSHOT INSTRUCTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider">
                Exams Mega Directory
              </span>
              <span className="text-xs text-slate-500 font-medium">50+ Target Examinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
              Select Your Target Examination
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Click any exam to open its dedicated hub with complete syllabus, BooksBoon publications, CBT mock tests, and free study materials.
            </p>
          </div>

          <button
            onClick={() => selectExamById('ssc-cgl')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>Open Exams Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* High-Tech Categories Cards with HD Gradient Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {(examsCategories && examsCategories.length > 0 ? examsCategories : EXAMS_CATEGORIES_DATA).map((cat) => (
            <div 
              key={cat.id}
              className="p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-600/30 via-indigo-600/40 to-purple-600/30 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-md hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="bg-white group-hover:bg-indigo-50/20 p-5 rounded-[22.5px] h-full flex flex-col justify-between transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-white shadow-2xs transition-colors">
                      {getCategoryIcon(cat.id)}
                    </div>
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {cat.exams.length} Exams Listed
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5 line-clamp-1">{cat.hindiName}</p>

                  {/* High-Tech Popular Exams with Official Logos */}
                  <div className="space-y-1.5 mt-4">
                    {cat.exams.slice(0, 3).map((e) => (
                      <button
                        key={e.id}
                        onClick={() => selectExamById(e.id)}
                        className="w-full text-left p-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-white text-slate-800 hover:text-indigo-600 border border-slate-200/70 hover:border-indigo-400 hover:shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer group/pill"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ExamLogo examId={e.id} category={cat.name} size="sm" customLogoUrl={e.logoUrl} />
                          <span className="text-xs font-extrabold truncate">{e.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 group-hover/pill:text-indigo-600 shrink-0">&rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => selectExamById(cat.exams[0].id)}
                    className="font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full {cat.name} Hub</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Syllabus Live
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BOOKSBOON BOOKS LISTING & BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-2xs">
                BooksBoon Publications
              </span>
              <span className="text-xs text-slate-500 font-medium">Original Hard Copies · Direct Publisher</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
              Featured Books &amp; Exam Solved Papers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              High GSM white bond paper, comprehensive chapterwise theory &amp; error-free answer keys.
            </p>
          </div>

          <button
            onClick={() => {
              setFilterCategory('All');
              setCurrentView('product');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Books Grid with HD Gradient Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BOOKS_DATA.slice(0, 4).map((book) => (
            <div 
              key={book.id}
              className="p-[1.5px] rounded-3xl bg-gradient-to-br from-amber-400/40 via-orange-500/20 to-indigo-500/30 hover:from-amber-400 hover:via-orange-500 hover:to-indigo-600 shadow-sm hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="bg-white p-4 rounded-[22.5px] h-full flex flex-col justify-between">
                <div>
                  <div 
                    onClick={() => setSelectedBook(book)}
                    className="relative aspect-3/4 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 cursor-pointer shadow-xs"
                  >
                    <BookImage book={book} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-xs text-[10px] font-black text-amber-300 shadow-xs border border-amber-400/30">
                      {book.badge || 'Official Book'}
                    </span>
                  </div>

                  <div className="pt-3.5 space-y-1.5">
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block truncate">
                      {book.category}
                    </span>
                    <h4 
                      onClick={() => setSelectedBook(book)}
                      className="font-extrabold text-sm text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {isHindi && book.hindiTitle ? book.hindiTitle : book.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{book.author}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-base font-black text-slate-900">₹{book.paperbackPrice}</span>
                        <span className="text-xs text-slate-400 line-through ml-1.5 font-normal">₹{book.originalPrice}</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
                        {Math.round(((book.originalPrice - book.paperbackPrice) / book.originalPrice) * 100)}% off
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-2">
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
                    className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition-colors cursor-pointer shadow-xs"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SAMWEDNA SECTIONS: DAILY CURRENT AFFAIRS & FREE STUDY MATERIAL */}
      <section className="bg-gradient-to-b from-slate-100 to-white py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-black uppercase tracking-wider">
                  Samwedna Institute
                </span>
                <span className="text-xs text-slate-500 font-medium">Daily Updated Knowledge</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
                Daily Current Affairs &amp; Free Study Material
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                HTML-formatted analytical capsules with interactive MCQs and instant PDF formula sheets.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('current-affairs')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                All Current Affairs
              </button>
              <button
                onClick={() => setCurrentView('free-pdfs')}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                All Free PDFs
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Daily Current Affairs Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Today's Current Affairs Capsules</span>
                </h3>
              </div>

              <div className="space-y-3">
                {currentAffairs.slice(0, 3).map((article) => (
                  <div 
                    key={article.id}
                    onClick={() => {
                      setSelectedCaArticleId(article.id);
                      setCurrentView('current-affairs');
                    }}
                    className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 sm:gap-4 group"
                  >
                    {/* Image Logo of Topic at Left of Text */}
                    <div className="shrink-0">
                      <TopicLogo 
                        imageUrl={article.imageUrl || article.bannerImage}
                        category={article.category}
                        title={article.title}
                        size="md"
                      />
                    </div>

                    {/* Topic Text Content on Right */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] tracking-wide">
                          {article.category}
                        </span>
                        <span className="text-slate-400 text-[11px] flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {article.date}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {isHindi && article.hindiTitle ? article.hindiTitle : article.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {isHindi && article.hindiSummary ? article.hindiSummary : article.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Free Downloadable PDFs Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>Free Downloadable PDF Capsules</span>
                </h3>
              </div>

              <div className="space-y-3">
                {freePdfs.slice(0, 3).map((pdf) => (
                  <div 
                    key={pdf.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-indigo-400 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{pdf.category}</span>
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {isHindi && pdf.hindiTitle ? pdf.hindiTitle : pdf.title}
                        </h4>
                        <span className="text-[11px] text-slate-500">{pdf.pages} Pages · {pdf.fileSize}</span>
                      </div>
                    </div>

                    <a
                      href={pdf.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. ALL INDIA CBT MOCK TEST SERIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                Exam Hall Simulator
              </span>
              <span className="text-xs text-slate-500 font-medium">NTA &amp; TCS-iON Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1">
              All India Computer Based Tests (CBT)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Simulate real examination room experience with countdown timer, negative marking, and instant percentile analytics.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('test-series')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>View All CBT Tests</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testSeriesList.slice(0, 3).map((test) => (
            <div 
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                    {test.difficulty}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {test.durationMinutes} Min · {test.totalMarks} Marks
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                  {isHindi && test.hindiTitle ? test.hindiTitle : test.title}
                </h4>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-bold text-slate-800">{test.totalQuestions} Qs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Negative Marking:</span>
                    <span className="font-bold text-rose-600">-0.50 Marks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Candidates Attempted:</span>
                    <span className="font-bold text-indigo-600">{(test.enrolledStudents || 1200).toLocaleString()}+</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">Free All-India Demo</span>
                <button
                  onClick={() => setActiveTestExam(test)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
