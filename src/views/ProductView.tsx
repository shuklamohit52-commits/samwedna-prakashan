import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Filter, 
  Search, 
  ShoppingBag, 
  Download, 
  Star, 
  BookOpen, 
  RotateCcw, 
  Eye, 
  Check, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { BOOKS_DATA } from '../data/mockData';
import { Book, ExamCategory } from '../types';
import { BookImage } from '../components/BookImage';
import { RedTickerBar } from '../components/RedTickerBar';
import { Flame } from 'lucide-react';

export const ProductView: React.FC = () => {
  const { 
    setSelectedBook, 
    addToCart, 
    setCurrentView, 
    user, 
    downloadBookToLibrary, 
    showToast,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory
  } = useApp();

  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [priceMax, setPriceMax] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: { label: string; value: string }[] = [
    { label: 'All Exams', value: 'All' },
    { label: 'Teaching & UGC NET (TGT/PGT, BPSC TRE)', value: 'Teaching & UGC NET' },
    { label: 'SSC Exams (CGL, GD, CHSL)', value: 'All SSC Exam' },
    { label: 'Railway Exams (NTPC, RPF)', value: 'All Railway Exam' },
    { label: 'Banking & Insurance (PO, Clerk)', value: 'All Bank Exam' },
    { label: 'Defence Exams (Agniveer, CDS)', value: 'All Defence Exam' },
    { label: 'State PSC & Police (Raj, UP, Bihar)', value: 'All State Exam' },
    { label: 'UPSC & Civil Services', value: 'UPSC & Civil Services' },
  ];

  const formats = ['All', 'Paperback', 'E-Book', 'Magazine', 'Test Series Combo'];
  const languages = ['All', 'Hindi', 'English', 'Bilingual'];

  const filteredBooks = useMemo(() => {
    return BOOKS_DATA.filter((book) => {
      // Category filter
      if (filterCategory !== 'All' && book.category !== filterCategory) {
        return false;
      }
      // Language filter
      if (selectedLanguage !== 'All' && book.language !== selectedLanguage) {
        return false;
      }
      // Format filter
      if (selectedFormat === 'Test Series Combo' && !book.isTestSeries) {
        return false;
      }
      if (selectedFormat === 'Magazine' && !book.title.toLowerCase().includes('magazine')) {
        return false;
      }
      // Price filter
      if (book.paperbackPrice > priceMax) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesCategory = book.category.toLowerCase().includes(query);
        const matchesSubject = book.subject.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesCategory && !matchesSubject) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.paperbackPrice - b.paperbackPrice;
      if (sortBy === 'price-desc') return b.paperbackPrice - a.paperbackPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [filterCategory, selectedLanguage, selectedFormat, priceMax, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setFilterCategory('All');
    setSelectedFormat('All');
    setSelectedLanguage('All');
    setPriceMax(1200);
    setSearchQuery('');
    setSortBy('popular');
  };

  const handlePdfDownloadClick = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || user.subscription.planId === 'free' || user.subscription.status !== 'Active') {
      showToast('PDF downloads require an active subscription. Opening Pricing Plans...', 'info');
      setCurrentView('signup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const res = downloadBookToLibrary(book);
      if (res.success) {
        setCurrentView('account');
      }
    }
  };

  const handleBuyPaperbackClick = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book, 'Paperback');
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="text-amber-600 font-bold">BooksBoon.com</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Hard Copies & Magazines Store</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-amber-300 p-0.5 shadow-sm shrink-0">
              <img 
                src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
                alt="BooksBoon Official Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                  BooksBoon Hard Copies & Magazines
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                  booksboon.com
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official publisher store for physical hard copy books, magazines, and study guides with door-step courier delivery. Free shipping on orders over ₹499.
              </p>
            </div>
          </div>
        </div>

        {/* Search bar inside product view */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, exams, authors..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Red Box Marquee Ticker for New Releases */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-red-500/80 animate-red-glow">
        <RedTickerBar speed="normal" />
      </div>

      {/* Main 2-Column Layout: Left Catalogue Filters, Right Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Catalogue Filters (Desktop) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-display">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>Catalogue Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Exam Categories */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
                Exam Categories
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setFilterCategory(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      filterCategory === cat.value
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {filterCategory === cat.value && (
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Language filter */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                Medium / Language
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-slate-900 text-white border-slate-900 font-medium'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Format filter */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2.5">
                Format
              </h4>
              <div className="space-y-1">
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedFormat === fmt
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max slider */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Max Price
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600">
                  ₹{priceMax}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹100</span>
                <span>₹1,200</span>
              </div>
            </div>

            {/* BooksBoon Physical Hard Copy Guarantee */}
            <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-2">
              <p className="font-bold text-amber-300">BooksBoon Door-step Delivery</p>
              <p className="text-[11px] text-slate-300">
                100% genuine physical textbooks & magazines dispatched within 24 hours via India Post Speed Post.
              </p>
              <button
                onClick={() => setCurrentView('cart')}
                className="text-[11px] text-amber-400 font-bold hover:underline block pt-1 cursor-pointer"
              >
                View Cart & Checkout with Razorpay →
              </button>
            </div>

          </div>
        </aside>

        {/* RIGHT COLUMN: Product Grid */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Top Sort Bar & Results Count */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-600">
              Showing <strong className="text-slate-900 font-bold">{filteredBooks.length}</strong> books and test series
              {filterCategory !== 'All' && <span> in <span className="text-indigo-600 font-semibold">{filterCategory}</span></span>}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <span className="text-slate-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-indigo-600"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Book Cards Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const discount = Math.round(((book.originalPrice - book.paperbackPrice) / book.originalPrice) * 100);

                return (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Visual Cover Top Banner */}
                    {book.bannerImage ? (
                      <div 
                        onClick={() => setSelectedBook(book)}
                        className="h-52 bg-slate-950 cursor-pointer relative overflow-hidden group"
                      >
                        <BookImage 
                          book={book} 
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-200 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                            {book.language}
                          </span>
                          {book.badge && (
                            <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase">
                              {book.badge}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white pointer-events-none">
                          <span className="font-semibold text-cyan-300 drop-shadow-xs">{book.pages} Pages</span>
                          <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                            ₹{book.paperbackPrice}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setSelectedBook(book)}
                        className={`p-6 bg-gradient-to-br ${book.coverGradient} text-white cursor-pointer relative overflow-hidden flex flex-col justify-between h-48`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-200 bg-white/10 px-2 py-0.5 rounded">
                            {book.language}
                          </span>
                          {book.badge && (
                            <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-xs uppercase">
                              {book.badge}
                            </span>
                          )}
                        </div>

                        <div className="my-auto py-1">
                          <h3 className="text-base font-bold font-display leading-tight group-hover:text-cyan-200 transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-[10px] text-slate-300 mt-1 line-clamp-1">{book.patternYear}</p>
                        </div>

                        <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-slate-200">
                          <span>{book.pages} Pages</span>
                          <span className="font-semibold text-cyan-300">
                            {book.isTestSeries ? `${book.testsCount} Tests Included` : 'Full Guide'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Content & Action Bar */}
                    <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold text-slate-800">{book.rating}</span>
                          <span className="text-[11px] text-slate-400">({book.reviewsCount})</span>
                        </div>

                        <h4 
                          onClick={() => setSelectedBook(book)}
                          className="text-xs font-bold text-slate-900 font-display line-clamp-1 hover:text-indigo-600 cursor-pointer"
                        >
                          {book.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Author: {book.author}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1.5">
                          {book.description}
                        </p>
                      </div>

                      {/* Price Section */}
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div>
                          <span className="text-lg font-bold text-slate-900 font-display">
                            ₹{book.paperbackPrice}
                          </span>
                          <span className="text-xs text-slate-400 line-through ml-1.5">
                            ₹{book.originalPrice}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      </div>

                      {/* 2 Primary Buy Buttons: Buy Paperback (takes to cart) & PDF Download (navigates to subscription) */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={(e) => handleBuyPaperbackClick(book, e)}
                          className="py-2.5 px-2 text-center text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Buy Paperback & Proceed to Cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Buy Paperback</span>
                        </button>

                        <button
                          onClick={(e) => handlePdfDownloadClick(book, e)}
                          className="py-2.5 px-2 text-center text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Download PDF or View Subscription"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-600" />
                          <span>PDF Download</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                No Books Matching Your Filter
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing category filters to explore the complete catalog.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
