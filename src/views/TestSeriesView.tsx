import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  Play, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  Filter, 
  Search, 
  Calendar, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Eye,
  Check,
  Trophy,
  Zap,
  Sparkles
} from 'lucide-react';
import { AVAILABLE_TEST_SERIES, USER_TEST_SCORES_DATA, BOOKS_DATA } from '../data/mockData';
import { TestSeriesExam, UserTestScore, ExamCategory } from '../types';
import { TestLeaderboard } from '../components/TestLeaderboard';
import { ExamCountdownTimer } from '../components/ExamCountdownTimer';
import { StudentPerformanceAnalytics } from '../components/StudentPerformanceAnalytics';

export const TestSeriesView: React.FC = () => {
  const { 
    testSeriesList, 
    studentScores, 
    setActiveTestExam, 
    setSelectedBook, 
    setCurrentView, 
    showToast,
    appLanguage,
    setAppLanguage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'available' | 'leaderboard' | 'scores' | 'analytics'>('available');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Teaching & UGC NET',
    'All SSC Exam',
    'All Railway Exam',
    'All State Exam',
    'All Defence Exam',
    'All Bank Exam'
  ];

  // Filtered test catalog
  const filteredTests = testSeriesList.filter(test => {
    if (selectedCategory !== 'All' && test.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = test.title.toLowerCase().includes(q);
      const matchHindi = test.hindiTitle?.toLowerCase().includes(q);
      const matchSyllabus = test.syllabusCovered.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchHindi && !matchSyllabus) return false;
    }
    return true;
  });

  // Calculate Progress Tracker Metrics
  const totalAvailable = testSeriesList.length;
  const completedCount = studentScores.length;
  const completionPercentage = Math.round((completedCount / (totalAvailable || 1)) * 100);
  
  const avgScore = studentScores.length > 0 
    ? studentScores.reduce((acc, s) => acc + (s.scoreObtained / s.totalMarks) * 100, 0) / studentScores.length 
    : 0;
  const avgAccuracy = studentScores.length > 0 
    ? studentScores.reduce((acc, s) => acc + s.accuracyPercentage, 0) / studentScores.length 
    : 0;
  const totalMinutesSpent = studentScores.reduce((acc, s) => acc + s.timeSpentMinutes, 0);

  const handleStartTest = (test: TestSeriesExam) => {
    setActiveTestExam(test);
    showToast(`Launching ${test.title} in CBT Simulation Interface...`, 'info');
  };

  const handleViewAssociatedBook = (bookId?: string) => {
    if (!bookId) return;
    const book = BOOKS_DATA.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <button onClick={() => setCurrentView('home')} className="hover:text-slate-800 cursor-pointer">Home</button>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Competitive Exam Test Series</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Online CBT Test Series & Progress Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            All-India Computer-Based Tests (CBT), sectional drills, and detailed question-level scorecard analytics by Samwedna Prakashan.
          </p>
        </div>

        {/* Quick Tabs Controller */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Available Tests ({testSeriesList.length})
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-amber-400 text-slate-950 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className={`w-3.5 h-3.5 ${activeTab === 'leaderboard' ? 'text-slate-950' : 'text-amber-500'}`} />
            <span>AIR Leaderboard</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scores'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Scores ({studentScores.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Score Analytics (Recharts)</span>
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME EXAM SESSION COUNTDOWN TIMER */}
      <ExamCountdownTimer onStartExam={handleStartTest} />

      {/* 3. PROGRESS TRACKER BANNER (Displays progress for completed tests and user scores) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Progress gauge & completed count */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
              Student Preparation Velocity
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              {completedCount} of {totalAvailable} Full Tests Completed
            </h3>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span>Curriculum Coverage</span>
                <span className="text-cyan-300 font-bold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <p className="text-[11px] text-slate-300">
                Target: Complete 2 tests every week before official Commission notification.
              </p>
              <button
                onClick={() => setActiveTab('analytics')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-400/30 shadow-xs"
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-300" />
                <span>View Score Analytics & Trajectory</span>
              </button>
            </div>
          </div>

          {/* 3 Metric Score Badges */}
          <div className="md:col-span-7 grid grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Average Accuracy</p>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                {avgAccuracy.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">High Precision Tier</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Est. All-India Percentile</p>
              <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                97.5%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Top 2.5% of Candidates</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Time Tested</p>
              <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
                {(totalMinutesSpent / 60).toFixed(1)} hrs
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{totalMinutesSpent} Minutes Total</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. TAB 1: AVAILABLE TESTS CATALOG */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          
          {/* Real-Time Leaderboard Spotlight Card */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 rounded-2xl p-4 shadow-md border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                <Trophy className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded">
                    LIVE RANKINGS ACTIVE
                  </span>
                  <span className="text-xs font-bold text-slate-950">Samwedna All-India Mock League</span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  See where you stand among 14,000+ candidates across India with real-time test percentiles and state rankings.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-current" />
              <span>View Live Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests, topics, books..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTests.map((test) => {
              const matchedBook = BOOKS_DATA.find(b => b.id === test.associatedBookId);
              const isHindi = appLanguage === 'HI';
              const primaryTitle = isHindi && test.hindiTitle ? test.hindiTitle : test.title;
              const secondaryTitle = isHindi && test.hindiTitle ? test.title : test.hindiTitle;

              return (
                <div
                  key={test.id}
                  className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-indigo-500/80 shadow-md hover:shadow-xl transition-all p-6 sm:p-7 flex flex-col justify-between space-y-5 group relative overflow-hidden"
                >
                  {/* Top Corner Ribbon / Badge */}
                  <div className="absolute top-0 right-0">
                    <span className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs">
                      {test.language || 'BILINGUAL / द्विभाषी'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center gap-2 pr-28">
                      <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg uppercase tracking-wider">
                        {test.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                        {test.difficulty}
                      </span>
                      {test.isFreeDemo && (
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>FREE PASS</span>
                        </span>
                      )}
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 font-display group-hover:text-indigo-600 transition-colors leading-snug">
                        {primaryTitle}
                      </h3>
                      {secondaryTitle && (
                        <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                          {secondaryTitle}
                        </p>
                      )}
                    </div>

                    {/* NTA / TCS Pattern Authentic Metrics HUD */}
                    <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-center">
                      <div className="border-r border-slate-200/60 pr-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Questions</span>
                        <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block">{test.totalQuestions} Qs</span>
                      </div>
                      <div className="border-r border-slate-200/60 pr-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Time</span>
                        <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block">{test.durationMinutes}m</span>
                      </div>
                      <div className="border-r border-slate-200/60 pr-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Max Marks</span>
                        <span className="text-sm font-black text-indigo-700 font-mono mt-0.5 block">{test.totalMarks}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Negative</span>
                        <span className="text-sm font-black text-rose-600 font-mono mt-0.5 block">
                          -{test.negativeMarking ?? 0.50}
                        </span>
                      </div>
                    </div>

                    {/* Exam Simulation Benefits List */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium pt-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Instant All-India Rank</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Bilingual Solutions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>NTA Standard CBT Screen</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Percentile Breakdown</span>
                      </div>
                    </div>

                    {/* Syllabus Chips */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Syllabus Modules Covered:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {test.syllabusCovered.map((s, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Associated Book recommendation */}
                    {matchedBook && (
                      <div 
                        onClick={() => handleViewAssociatedBook(matchedBook.id)}
                        className="p-3 bg-indigo-50/70 hover:bg-indigo-100/70 rounded-2xl border border-indigo-200/80 flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <BookOpen className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-indigo-950 font-bold truncate">
                            Recommended Book: {matchedBook.title}
                          </span>
                        </div>
                        <span className="text-indigo-700 text-xs font-black shrink-0 ml-2">Book Details →</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing HUD & Big Primary Action */}
                  <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-emerald-700 font-mono">₹0 FREE</span>
                        <span className="text-xs line-through text-slate-400 font-semibold font-mono">₹499</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-md">
                          100% Scholarship
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{test.enrolledStudents.toLocaleString()}+ Candidates Attempted</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleStartTest(test)}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.02]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start CBT Mock / टेस्ट शुरू करें</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3B. TAB 2: REAL-TIME AIR LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <TestLeaderboard onStartTest={handleStartTest} />
      )}

      {/* 4. TAB 3: USER SCORES HISTORY */}
      {activeTab === 'scores' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">Completed Test Scorecards</h2>
              <p className="text-xs text-slate-500">Verified results from your completed CBT mock test sessions.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {studentScores.length} Attempted Tests
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {studentScores.map((rec) => (
              <div key={rec.id} className="py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {rec.category}
                    </span>
                    <span className="text-xs text-slate-400">· Attempted: {rec.dateAttempted}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {rec.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {rec.testTitle}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>Time Spent: <strong className="text-slate-800">{rec.timeSpentMinutes} mins</strong></span>
                    <span>·</span>
                    <span>Accuracy: <strong className="text-emerald-600 font-mono">{rec.accuracyPercentage}%</strong></span>
                    <span>·</span>
                    <span>All India Rank: <strong className="text-amber-600 font-mono">#{rec.rank}</strong> / {rec.totalCandidates.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end lg:self-auto">
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-indigo-600 font-mono font-display">
                      {rec.scoreObtained} <span className="text-xs text-slate-400 font-normal">/ {rec.totalMarks}</span>
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {rec.percentile} Percentile
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const matchedTest = testSeriesList.find(t => t.id === rec.testId) || testSeriesList[0];
                      if (matchedTest) setActiveTestExam(matchedTest);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Solutions</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 4: RECHARTS GRAPHICAL PERFORMANCE ANALYTICS & SECTION BREAKDOWN */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Main Graphical Historical Performance Analytics Component (Recharts) */}
          <StudentPerformanceAnalytics onStartExam={() => setActiveTab('available')} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Section-wise Accuracy Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500">Based on your cumulative answers in the CBT engine:</p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Hindi Sahitya & Literature (साहित्य)</span>
                    <span className="font-mono text-emerald-600">94.2%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Indian Polity & Constitution (राजव्यवस्था)</span>
                    <span className="font-mono text-emerald-600">91.8%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '91.8%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>General Intelligence & Reasoning (तर्कशक्ति)</span>
                    <span className="font-mono text-indigo-600">88.5%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '88.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Quantitative Aptitude & Mathematics (गणित)</span>
                    <span className="font-mono text-amber-600">82.0%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Recommended Next Actions</span>
              </h3>
              <p className="text-xs text-slate-500">Curated steps based on your test accuracy:</p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">1. Take Speed Arithmetic Sectional Drill</span>
                  <p className="text-slate-600 text-[11px]">
                    Improve math speed by 15% using Vedic calculations before the next full CBT test.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">2. Revise Reetikaal & Modern Prose in Hindi</span>
                  <p className="text-slate-600 text-[11px]">
                    Refer to Dr. Rajneesh Kumar Yadav&apos;s book <em>हिन्दी साहित्य का इतिहास (2500+ MCQs)</em> Chapters 3 and 4.
                  </p>
                  <button
                    onClick={() => handleViewAssociatedBook('hindi-sahitya-itihas-rajneesh')}
                    className="text-indigo-600 font-bold text-[11px] hover:underline block pt-1 cursor-pointer"
                  >
                    Open Book Details →
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">3. Review Election Laws & ECI Articles</span>
                  <p className="text-slate-600 text-[11px]">
                    Refer to Dr. Arun Pratap Singh&apos;s textbook <em>निर्वाचन - लोकतंत्र का आधार</em>.
                  </p>
                  <button
                    onClick={() => handleViewAssociatedBook('nirvachan-loktantra-ka-aadhar-arun-singh')}
                    className="text-indigo-600 font-bold text-[11px] hover:underline block pt-1 cursor-pointer"
                  >
                    Open Book Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
