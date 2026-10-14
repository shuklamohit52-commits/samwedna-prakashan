import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { PageView } from '../types';
import { RedTickerBar } from './RedTickerBar';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    portalMode, 
    setPortalMode, 
    cartCount, 
    user, 
    logoutUser, 
    setAccountTab,
    searchQuery,
    setSearchQuery,
    setFilterCategory
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleNavClick = (view: PageView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (portalMode === 'booksboon') {
        setCurrentView('product');
      } else {
        setCurrentView('current-affairs');
      }
      setShowSearchInput(false);
    }
  };

  const handleSwitchToBooksboon = () => {
    setPortalMode('booksboon');
    setCurrentView('product');
  };

  const handleSwitchToInstitute = () => {
    setPortalMode('institute');
    setCurrentView('current-affairs');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* 1. Dynamic Red Box Marquee Moving All Across for New Releases */}
      <RedTickerBar />

      {/* 2. Top Segmented Dual-Portal Switcher (BooksBoon.com vs Samwedna Group of Institutes) */}
      <div className="bg-slate-900 text-white border-b border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 gap-2">
          
          {/* Dual Category Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleSwitchToBooksboon}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                portalMode === 'booksboon'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>BOOKSBOON.COM</span>
              <span className="hidden sm:inline text-[9px] bg-slate-950/20 px-1.5 py-0.2 rounded font-extrabold uppercase">
                Hard Copies & Magazines
              </span>
            </button>

            <button
              onClick={handleSwitchToInstitute}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                portalMode === 'institute'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>SAMWEDNA GROUP OF INSTITUTES</span>
              <span className="hidden md:inline text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-extrabold uppercase">
                Exam Preparation
              </span>
            </button>
          </div>

          {/* Quick Admin Access & Helpline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('admin')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-cyan-400 text-slate-950'
                  : 'bg-white/10 hover:bg-white/20 text-cyan-300 border border-cyan-400/30'
              }`}
              title="Admin Panel: Upload Quizzes, Daily CA, Free PDFs & Videos"
            >
              <Key className="w-3 h-3" />
              <span>Admin Panel</span>
            </button>

            <span className="hidden lg:inline text-[11px] text-slate-400">
              Helpline: <strong className="text-white">+91 9792903247</strong>
            </span>
          </div>

        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Brand Wordmark dependent on active portal */}
          <div className="flex items-center gap-3 shrink-0">
            {portalMode === 'booksboon' ? (
              <button 
                onClick={() => handleNavClick('product')}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-200 group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-black tracking-tight text-slate-900 font-display block leading-tight">
                      BOOKSBOON
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1 rounded">
                      .COM
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-600 tracking-wider uppercase block">
                    Hard Copies & Magazines Store
                  </span>
                </div>
              </button>
            ) : (
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-slate-900 font-display block leading-tight">
                    SAMWEDNA
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase block">
                    GROUP OF INSTITUTES
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            {portalMode === 'booksboon' ? (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-xs font-bold transition-colors py-1 ${
                    currentView === 'home' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => {
                    setFilterCategory('All');
                    handleNavClick('product');
                  }}
                  className={`text-xs font-bold transition-colors py-1 ${
                    currentView === 'product' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hard Copy Catalog
                </button>

                <button
                  onClick={() => {
                    setFilterCategory('Teaching & UGC NET');
                    handleNavClick('product');
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 py-1"
                >
                  Hindi Sahitya (2500+ MCQs)
                </button>

                <button
                  onClick={() => {
                    setFilterCategory('Magazines & Periodicals');
                    handleNavClick('product');
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 py-1"
                >
                  Magazines & Periodicals
                </button>

                <button
                  onClick={() => handleNavClick('cart')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 py-1"
                >
                  Cart & Checkout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-xs font-bold transition-colors py-1 ${
                    currentView === 'home' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => handleNavClick('current-affairs')}
                  className={`text-xs font-bold transition-colors py-1 ${
                    currentView === 'current-affairs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Daily Current Affairs
                </button>

                <button
                  onClick={() => handleNavClick('test-series')}
                  className={`text-xs font-bold transition-colors py-1 ${
                    currentView === 'test-series' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CBT Test Series
                </button>

                <button
                  onClick={() => handleNavClick('free-pdfs')}
                  className={`text-xs font-bold transition-colors py-1 ${
                    currentView === 'free-pdfs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Free PDFs & E-Books
                </button>

                <button
                  onClick={() => handleNavClick('study-materials')}
                  className={`text-xs font-bold transition-colors py-1 ${
                    currentView === 'study-materials' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Study Materials
                </button>

                <button
                  onClick={() => handleNavClick('video-lectures')}
                  className={`text-xs font-bold transition-colors py-1 ${
                    currentView === 'video-lectures' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Video Lectures
                </button>
              </>
            )}
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
                    placeholder={portalMode === 'booksboon' ? "Search hard copy books, ISBN, author..." : "Search tests, current affairs, PDFs..."}
                    autoFocus
                    className="w-52 sm:w-64 pl-8 pr-8 py-1.5 text-xs bg-slate-100 rounded-lg border border-slate-300 focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowSearchInput(false)}
                    className="absolute right-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Search Portal"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* BooksBoon Cart Icon */}
            <button
              onClick={() => handleNavClick('cart')}
              className="relative p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-800 text-xs font-bold transition-colors cursor-pointer"
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
                      My E-Library & Free PDFs
                    </button>

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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('signin')}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Student Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="hidden sm:inline-block px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Join Free
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fadeIn">
          
          {/* Portal Switcher in Mobile */}
          <div className="p-2 bg-slate-100 rounded-xl flex gap-2">
            <button
              onClick={() => {
                handleSwitchToBooksboon();
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg text-center ${
                portalMode === 'booksboon' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
              }`}
            >
              BooksBoon.com
            </button>
            <button
              onClick={() => {
                handleSwitchToInstitute();
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg text-center ${
                portalMode === 'institute' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Samwedna Institute
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>

            {portalMode === 'booksboon' ? (
              <>
                <button
                  onClick={() => handleNavClick('product')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Hard Copy Catalog (Novels, GS, Exam Books)
                </button>
                <button
                  onClick={() => handleNavClick('cart')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Cart & Checkout ({cartCount})
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('current-affairs')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Daily Current Affairs
                </button>
                <button
                  onClick={() => handleNavClick('test-series')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  CBT Test Series (Real Exam Pattern)
                </button>
                <button
                  onClick={() => handleNavClick('free-pdfs')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Free PDFs & E-Books
                </button>
                <button
                  onClick={() => handleNavClick('study-materials')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Study Materials & Mindmaps
                </button>
                <button
                  onClick={() => handleNavClick('video-lectures')}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg"
                >
                  Video Lectures
                </button>
              </>
            )}

            <button
              onClick={() => handleNavClick('student-dashboard')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg"
            >
              Student Dashboard
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2 text-xs font-bold text-cyan-700 hover:bg-cyan-50 rounded-lg"
            >
              Admin Control Panel
            </button>
          </div>

        </div>
      )}

    </header>
  );
};
