import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Award, 
  BookOpen, 
  Package, 
  Bookmark, 
  Settings, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Download, 
  FileText, 
  Truck, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Target,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { BookImage } from '../components/BookImage';

export const StudentDashboardView: React.FC = () => {
  const { 
    user, 
    updateUserProfile, 
    logoutUser, 
    accountTab, 
    setAccountTab, 
    setCurrentView,
    setPortalMode,
    studentScores,
    currentAffairs,
    freePdfs,
    orders,
    setReadingPdf
  } = useApp();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [targetExam, setTargetExam] = useState(user?.targetExam || 'SSC CGL & Railway NTPC');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pinCode, setPinCode] = useState(user?.address?.pinCode || '');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Student Authentication Required</h2>
        <p className="text-sm text-slate-600">
          Sign in to access your personal test scorecards, bookmarked current affairs, e-library, and BooksBoon order tracker.
        </p>
        <button
          onClick={() => setCurrentView('signin')}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Sign In to Student Portal
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      targetExam,
      address: {
        street,
        city,
        state,
        pinCode
      }
    });
    setEditMode(false);
  };

  // Filter bookmarked current affairs
  const savedArticles = currentAffairs.filter(a => user.savedCurrentAffairs?.includes(a.id));

  // Filter bookmarked PDFs
  const savedPdfs = freePdfs.filter(p => user.bookmarkedPdfs?.includes(p.id));

  // User orders
  const userOrders = orders.filter(o => o.studentEmail.toLowerCase() === user.email.toLowerCase());

  // Aggregate student stats
  const totalTests = studentScores.length;
  const avgAccuracy = totalTests > 0 
    ? (studentScores.reduce((acc, s) => acc + s.accuracyPercentage, 0) / totalTests).toFixed(1)
    : '0';
  const bestRank = totalTests > 0 
    ? Math.min(...studentScores.map(s => s.rank))
    : '-';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* 1. Student Identity Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-lg border border-white/20">
              {user.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {user.rollNumber || 'SAM-2026-8841'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {user.subscription.planName}
                </span>
              </div>

              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                <span>{user.email}</span>
                <span>•</span>
                <span>{user.phone}</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  Target: {user.targetExam}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{editMode ? 'Close Edit' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">CBT Tests Taken</span>
            <span className="text-xl font-black text-amber-300">{totalTests}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Average Accuracy</span>
            <span className="text-xl font-black text-emerald-300">{avgAccuracy}%</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Best AIR Rank</span>
            <span className="text-xl font-black text-cyan-300">#{bestRank}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Hard Copy Orders</span>
            <span className="text-xl font-black text-purple-300">{userOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Profile Edit Drawer */}
      {editMode && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-6 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-600" />
            <span>Update Student Information & Delivery Address</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Exam</label>
                <input
                  type="text"
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / District</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setAccountTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl transition-colors cursor-pointer ${
            accountTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>CBT Test Analytics ({studentScores.length})</span>
        </button>

        <button
          onClick={() => setAccountTab('current-affairs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl transition-colors cursor-pointer ${
            accountTab === 'current-affairs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Current Affairs ({savedArticles.length})</span>
        </button>

        <button
          onClick={() => setAccountTab('library')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl transition-colors cursor-pointer ${
            accountTab === 'library'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My E-Library & Free PDFs ({user.library.length + savedPdfs.length})</span>
        </button>

        <button
          onClick={() => setAccountTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-t-xl transition-colors cursor-pointer ${
            accountTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>BooksBoon Hard Copy Orders ({userOrders.length})</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: CBT Test Scores & Analytics */}
      {accountTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Attempted CBT Tests & Real Exam Rankings</h2>
              <p className="text-xs text-slate-500">Every score is recorded with All-India rank calculation and accuracy analytics</p>
            </div>
            <button
              onClick={() => {
                setPortalMode('institute');
                setCurrentView('test-series');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Take New Mock Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {studentScores.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No Tests Attempted Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select any exam from our All-India CBT Test Series to benchmark your preparation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {studentScores.map((score) => (
                <div 
                  key={score.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {score.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {score.dateAttempted}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">
                      {score.testTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span>Time: <strong>{score.timeSpentMinutes} mins</strong></span>
                      <span>•</span>
                      <span>Accuracy: <strong className="text-purple-700">{score.accuracyPercentage}%</strong></span>
                      <span>•</span>
                      <span>Candidates: <strong>{score.totalCandidates.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 self-end lg:self-center">
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Marks</span>
                      <span className="text-xl font-black text-indigo-700">{score.scoreObtained}</span>
                      <span className="text-xs text-slate-400">/{score.totalMarks}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">All-India Rank</span>
                      <span className="text-xl font-black text-emerald-600">#{score.rank}</span>
                      <span className="text-[10px] text-slate-400 block">Top {((score.rank / score.totalCandidates) * 100).toFixed(1)}%</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Percentile</span>
                      <span className="text-xl font-black text-cyan-600">{score.percentile}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Saved Current Affairs */}
      {accountTab === 'current-affairs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Saved Daily Current Affairs</h2>
              <p className="text-xs text-slate-500">Bookmarked high-yield news summaries for last-minute exam revision</p>
            </div>
            <button
              onClick={() => {
                setPortalMode('institute');
                setCurrentView('current-affairs');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Browse Today&apos;s News →
            </button>
          </div>

          {savedArticles.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No Articles Saved Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Visit Daily Current Affairs and click the Bookmark icon to pin articles here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedArticles.map((art) => (
                <div key={art.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 font-bold border border-cyan-200">
                      {art.category}
                    </span>
                    <span className="text-slate-400">{art.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{art.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{art.summary}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setPortalMode('institute');
                        setCurrentView('current-affairs');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Full Article</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: My E-Library & Free PDFs */}
      {accountTab === 'library' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Downloaded Books & Free PDF Capsules</h2>
              <p className="text-xs text-slate-500">Read in-browser or download to study offline</p>
            </div>
            <button
              onClick={() => {
                setPortalMode('institute');
                setCurrentView('free-pdfs');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Browse All Free PDFs →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.library.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-16 rounded-lg bg-gradient-to-tr ${item.coverGradient} flex items-center justify-center text-white font-bold text-xs shadow-xs`}>
                    PDF
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{item.author}</p>
                    <span className="text-[10px] text-indigo-600 font-semibold">{item.fileSize} • {item.totalPages} Pages</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setReadingPdf({ title: item.title, url: '/samples/sample.pdf', pages: item.totalPages })}
                    className="flex-1 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold text-center cursor-pointer"
                  >
                    Read Online
                  </button>
                  <a
                    href="/samples/sample.pdf"
                    download
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}

            {savedPdfs.map((pdf) => (
              <div key={pdf.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-tr from-cyan-700 to-indigo-900 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    PDF
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{pdf.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{pdf.subject}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">{pdf.fileSize} • {pdf.pages} Pages</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setReadingPdf({ title: pdf.title, url: pdf.downloadUrl, pages: pdf.pages })}
                    className="flex-1 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold text-center cursor-pointer"
                  >
                    Read Online
                  </button>
                  <a
                    href={pdf.downloadUrl}
                    download
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BooksBoon Hard Copy Orders */}
      {accountTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">BooksBoon Physical Hard Copy Orders</h2>
              <p className="text-xs text-slate-500">Track delivery status via India Post Speed Post & Courier Partners</p>
            </div>
            <button
              onClick={() => {
                setPortalMode('booksboon');
                setCurrentView('product');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Order More Hard Copies →
            </button>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Visit BooksBoon.com to order physical hard copy books and magazines with door-step delivery.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div key={ord.orderId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Order ID</span>
                      <span className="font-black text-sm text-slate-900 font-mono">{ord.orderId}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tracking Number</span>
                      <span className="font-bold text-xs text-indigo-700 font-mono bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                        {ord.trackingId}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <Truck className="w-3 h-3" />
                        {ord.shippingStatus}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Paid</span>
                      <span className="font-extrabold text-sm text-slate-900">₹{ord.totalAmount}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-800 font-medium">{item.title} ({item.format}) × {item.quantity}</span>
                        <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
                    <span>Partner: <strong>{ord.courierPartner}</strong></span>
                    <span>Estimated Delivery: <strong className="text-emerald-700">{ord.estimatedDelivery}</strong></span>
                    <button
                      onClick={() => window.print()}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Print Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
