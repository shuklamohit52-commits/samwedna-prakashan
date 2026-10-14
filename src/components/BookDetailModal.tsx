import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Download, 
  Star, 
  BookOpen, 
  Check, 
  ShieldCheck, 
  Share2, 
  Eye, 
  Layers, 
  FileText 
} from 'lucide-react';
import { Book } from '../types';
import { BookImage } from './BookImage';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { addToCart, setCurrentView, user, downloadBookToLibrary, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'toc' | 'sample'>('overview');

  const discountPercent = Math.round(((book.originalPrice - book.paperbackPrice) / book.originalPrice) * 100);

  const handleBuyPaperback = () => {
    addToCart(book, 'Paperback');
    onClose();
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePdfDownload = () => {
    // Exact requirement: "PDF download button which will navigate to subscription pricing page"
    if (!user || user.subscription.planId === 'free' || user.subscription.status !== 'Active') {
      showToast('PDF E-Book downloads are included with our Subscription Plans. Redirecting to Pricing...', 'info');
      onClose();
      setCurrentView('signup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const result = downloadBookToLibrary(book);
      if (result.success) {
        onClose();
        setCurrentView('account');
      }
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Book details link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{book.category}</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{book.patternYear}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Share Book"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Book Cover Graphic */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[280px]">
                {book.bannerImage ? (
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200 bg-slate-950 relative group">
                    <BookImage 
                      book={book} 
                      className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                        Official Edition
                      </span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                        {book.language}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* 3D Book styling container */
                  <div className={`aspect-3/4 rounded-xl bg-gradient-to-br ${book.coverGradient} p-6 text-white shadow-xl flex flex-col justify-between border-r-4 border-b-4 border-slate-950/40 relative overflow-hidden transform transition-transform group-hover:scale-[1.02]`}>
                    {/* Spine effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-white/10 border-r border-white/20"></div>

                    {/* Header stamp */}
                    <div className="pl-2">
                      <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-cyan-200 uppercase">
                        <span>Samvedna Prakashan</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] text-white font-mono">{book.language}</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-1">{book.patternYear}</div>
                    </div>

                    {/* Book Title Center */}
                    <div className="pl-2 my-auto py-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                        <BookOpen className="w-5 h-5 text-cyan-300" />
                      </div>
                      <h3 className="text-xl font-extrabold font-display leading-tight tracking-tight drop-shadow-xs">
                        {book.title}
                      </h3>
                      {book.hindiTitle && (
                        <p className="text-xs text-slate-200 mt-1 font-medium line-clamp-2">
                          {book.hindiTitle}
                        </p>
                      )}
                    </div>

                    {/* Footer tags */}
                    <div className="pl-2 border-t border-white/20 pt-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300">{book.pages} Pages</span>
                        {book.isTestSeries && (
                          <span className="font-bold text-amber-300">{book.testsCount} Mock Tests Included</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">By {book.author}</p>
                    </div>
                  </div>
                )}

                {/* Badge if present */}
                {book.badge && (
                  <div className="absolute -top-3 -right-3 bg-amber-500 text-slate-950 font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                    {book.badge}
                  </div>
                )}
              </div>

              {/* Book Metadata table */}
              <div className="w-full max-w-[280px] mt-6 bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Language</span>
                  <span className="font-semibold text-slate-900">{book.language}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pages</span>
                  <span className="font-semibold text-slate-900">{book.pages}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Publisher</span>
                  <span className="font-semibold text-slate-900">Samvedna Prakashan</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Format Available</span>
                  <span className="font-semibold text-slate-900">Paperback & Digital PDF</span>
                </div>
              </div>
            </div>

            {/* Right: Book Details & The 2 Buy Options */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'fill-current' : 'text-slate-300'}`} />
                    ))}
                    <span className="ml-1.5 font-bold text-slate-800">{book.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">({book.reviewsCount.toLocaleString()} verified reviews)</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 font-display leading-tight">
                  {book.title}
                </h2>
                {book.hindiTitle && (
                  <p className="text-sm text-slate-600 mt-1 font-medium">
                    {book.hindiTitle}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">Author: <strong className="text-slate-700">{book.author}</strong></p>
              </div>

              {/* Price Callout */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Paperback Edition Price</div>
                  <div className="flex items-baseline gap-2.5 mt-0.5">
                    <span className="text-2xl font-extrabold text-slate-900 font-display">
                      ₹{book.paperbackPrice}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{book.originalPrice}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    In Stock (Ready to Dispatch)
                  </span>
                  <div className="text-[11px] text-slate-500">Free delivery on orders ₹499+</div>
                </div>
              </div>

              {/* TWO PRIMARY BUY OPTIONS (Critical User Requirement) */}
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Select Purchase Option:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Buy Paperback -> takes directly to cart */}
                  <button
                    onClick={handleBuyPaperback}
                    className="flex flex-col items-start justify-center p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Physical Copy</span>
                      <ShoppingBag className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-base font-bold mt-1">Buy Paperback (₹{book.paperbackPrice})</div>
                    <span className="text-[11px] text-indigo-100 mt-1">Dispatches in 24 hrs · Tracked Courier</span>
                  </button>

                  {/* Option 2: PDF Download Button -> navigates to subscription pricing page */}
                  <button
                    onClick={handlePdfDownload}
                    className="flex flex-col items-start justify-center p-3.5 bg-white hover:bg-slate-50 text-slate-900 rounded-xl border-2 border-indigo-600 shadow-sm transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Digital Access</span>
                      <Download className="w-4 h-4 text-indigo-600 group-hover:translate-y-0.5 transition-transform" />
                    </div>
                    <div className="text-base font-bold mt-1 text-indigo-950">PDF Download</div>
                    <span className="text-[11px] text-slate-600 mt-1">
                      {user && user.subscription.planId !== 'free' 
                        ? 'Included with your Active Plan' 
                        : 'View Subscription Pricing Plans →'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Tabs for details */}
              <div>
                <div className="flex border-b border-slate-200 gap-6 text-xs font-medium">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Overview & Features
                  </button>
                  <button
                    onClick={() => setActiveTab('toc')}
                    className={`pb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'toc'
                        ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Table of Contents
                  </button>
                  <button
                    onClick={() => setActiveTab('sample')}
                    className={`pb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'sample'
                        ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sample Chapter Preview
                  </button>
                </div>

                <div className="pt-4 text-xs text-slate-600 leading-relaxed">
                  {activeTab === 'overview' && (
                    <div className="space-y-3">
                      <p>{book.description}</p>
                      <h4 className="font-semibold text-slate-900 pt-1">Key Highlights:</h4>
                      <ul className="space-y-1.5 pl-1">
                        {book.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'toc' && (
                    <div className="space-y-2">
                      <p className="text-slate-500 mb-2 font-medium">Complete syllabus coverage across {book.pages} pages:</p>
                      <div className="divide-y divide-slate-100 bg-slate-50 rounded-lg p-3">
                        {book.tableOfContents.map((chap, i) => (
                          <div key={i} className="py-1.5 flex items-center gap-2">
                            <span className="font-mono text-slate-400 font-semibold">{(i + 1).toString().padStart(2, '0')}.</span>
                            <span className="text-slate-800 font-medium">{chap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'sample' && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          Chapter 1: Foundational Practice Set & Solutions
                        </span>
                        <span className="text-[10px] text-slate-500">12 Pages Excerpt</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                        &quot;Question 1: In the new 2026 examination scheme, speed calculation in Elementary Arithmetic is expedited using cross-multiplication shortcuts. Example: Compute 48 × 52 in 2 seconds: (50 - 2)(50 + 2) = 2500 - 4 = 2496...&quot;
                      </p>
                      <div className="flex justify-end">
                        <button
                          onClick={handlePdfDownload}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Full Sample PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
