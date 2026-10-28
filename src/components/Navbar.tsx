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
  ArrowRight,
  Languages
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
    isAdmin,
    logoutUser, 
    setAccountTab,
    searchQuery,
    setSearchQuery,
    setFilterCategory,
    appLanguage,
    setAppLanguage
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

      {/* 2. Top Segmented Dual-Portal Banner - Full Width & Prominent */}
      <div className="w-full bg-slate-950 text-white border-b border-slate-800 py-3 px-4 sm:px-8">
        <div className="w-full space-y-2.5">
          {/* Micro Bar: National Helpline & Status & Admin Console */}
          <div className="w-full flex flex-wrap items-center justify-between text-xs text-slate-400 pb-1.5 border-b border-slate-800/80 gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Admissions &amp; Books Delivery Portal 2026
              </span>
            </div>

            {/* Global Bilingual Medium Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px] font-bold">
              <span className="px-2 text-slate-400 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Medium:</span>
              </span>
              <button
                type="button"
                onClick={() => setAppLanguage('BILINGUAL')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'BILINGUAL'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Bilingual / द्विभाषी (Hindi + English)"
              >
                द्विभाषी / Bilingual
              </button>
              <button
                type="button"
                onClick={() => setAppLanguage('HI')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'HI'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="हिन्दी माध्यम (Hindi Medium)"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setAppLanguage('EN')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'EN'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English Medium"
              >
                English
              </button>
            </div>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-cyan-300 border border-cyan-400/30'
                  }`}
                  title="Admin Panel: Upload Quizzes, Daily CA, Free PDFs & Videos"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
              )}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-slate-400">Helpline:</span>
                <a href="tel:+919792903247" className="text-amber-400 font-bold hover:underline">+91 9792903247</a>
              </div>
            </div>
          </div>

          {/* Dual Category Tabs Covering the Entire Page Width */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={handleSwitchToBooksboon}
              className={`w-full flex items-center gap-3.5 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold transition-all text-left cursor-pointer border ${
                portalMode === 'booksboon'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 shadow-lg border-amber-300 ring-2 ring-amber-400/40'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-sm shrink-0 border-2 border-amber-300">
                <img 
                  src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
                  alt="BooksBoon" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight leading-tight">
                    BOOKSBOON.COM
                  </span>
                  <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${portalMode === 'booksboon' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'}`}>
                    Physical Books Store
                  </span>
                </div>
                <span className={`text-xs sm:text-sm block truncate font-medium mt-0.5 ${portalMode === 'booksboon' ? 'text-slate-950 font-semibold' : 'text-slate-400'}`}>
                  Hard Copies, Reference Books &amp; Exam Magazines Delivered Across India
                </span>
              </div>
            </button>

            <button
              onClick={handleSwitchToInstitute}
              className={`w-full flex items-center gap-3.5 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold transition-all text-left cursor-pointer border ${
                portalMode === 'institute'
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white shadow-lg border-indigo-400 ring-2 ring-indigo-400/40'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-sm shrink-0 border-2 border-indigo-300">
                <img 
                  src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/sjgj.jpg" 
                  alt="Samwedna Group of Institutes" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight leading-tight">
                    SAMWEDNA GROUP OF INSTITUTES
                  </span>
                  <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${portalMode === 'institute' ? 'bg-white text-indigo-950' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'}`}>
                    Govt Exam Academy
                  </span>
                </div>
                <span className={`text-xs sm:text-sm block truncate font-medium mt-0.5 ${portalMode === 'institute' ? 'text-indigo-100 font-semibold' : 'text-slate-400'}`}>
                  Daily Current Affairs, Online CBT Test Series &amp; Free Study Material
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar with Large Wordmark & Icons */}
      <div className="w-full mx-auto px-4 sm:px-8 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Wordmark dependent on active portal - Enlarged & Covering Header */}
          <div className="flex items-center gap-3 shrink-0">
            {portalMode === 'booksboon' ? (
              <button 
                onClick={() => handleNavClick('product')}
                className="flex items-center gap-3.5 text-left group cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white border-2 border-amber-400/90 shadow-md shadow-amber-500/10 flex items-center justify-center p-1 group-hover:scale-105 transition-transform shrink-0">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
                    alt="BooksBoon Official Logo" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display block leading-none">
                      BOOKSBOON
                    </span>
                    <span className="text-xs font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded shadow-xs">
                      .COM
                    </span>
                  </div>
                  <span className="text-xs font-bold text-rose-600 tracking-wider uppercase block mt-1">
                    Hard Copies &amp; Magazines National Store
                  </span>
                </div>
              </button>
            ) : (
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-3.5 text-left group cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white border-2 border-indigo-400/90 shadow-md shadow-indigo-500/10 flex items-center justify-center p-1 group-hover:scale-105 transition-transform shrink-0">
                  <img 
                    src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/sjgj.jpg" 
                    alt="Samwedna Group of Institutes Official Logo" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-display block leading-none">
                    SAMWEDNA
                  </span>
                  <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase block mt-1">
                    GROUP OF INSTITUTES · GOVT EXAM PREPARATION
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 bg-white hover:bg-indigo-50/40 text-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer group"
                title="Click to Login / Sign Up"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Login</span>
              </button>
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
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${
                portalMode === 'booksboon' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
              }`}
            >
              <img 
                src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/bokbon.jpg" 
                alt="BooksBoon" 
                className="w-4 h-4 rounded-full object-cover shrink-0"
              />
              <span>BooksBoon.com</span>
            </button>
            <button
              onClick={() => {
                handleSwitchToInstitute();
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 ${
                portalMode === 'institute' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <img 
                src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/sjgj.jpg" 
                alt="Samwedna" 
                className="w-4 h-4 rounded-full object-cover shrink-0"
              />
              <span>Samwedna Institute</span>
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

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left px-3 py-2 text-xs font-bold text-cyan-700 hover:bg-cyan-50 rounded-lg flex items-center gap-2"
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
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
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
