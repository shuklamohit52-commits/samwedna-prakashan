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
  Check
} from 'lucide-react';
import { AVAILABLE_TEST_SERIES, USER_TEST_SCORES_DATA, BOOKS_DATA } from '../data/mockData';
import { TestSeriesExam, UserTestScore, ExamCategory } from '../types';

export const TestSeriesView: React.FC = () => {
  const { 
    testSeriesList, 
    studentScores, 
    setActiveTestExam, 
    setSelectedBook, 
    setCurrentView, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'available' | 'scores' | 'analytics'>('available');
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
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Progress Tracker</span>
          </button>
        </div>
      </div>

      {/* 2. PROGRESS TRACKER BANNER (Displays progress for completed tests and user scores) */}
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

            <p className="text-[11px] text-slate-300">
              Target: Complete 2 tests every week before official Commission notification.
            </p>
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
              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded uppercase tracking-wider">
                        {test.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {test.isFreeDemo && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            FREE DEMO
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {test.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-indigo-600 transition-colors leading-tight">
                      {test.title}
                    </h3>
                    {test.hindiTitle && (
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {test.hindiTitle}
                      </p>
                    )}

                    {/* Meta Specs */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Questions</span>
                        <span className="font-bold text-slate-800 font-mono">{test.totalQuestions} Qs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Duration</span>
                        <span className="font-bold text-slate-800 font-mono">{test.durationMinutes} Mins</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Maximum Marks</span>
                        <span className="font-bold text-slate-800 font-mono">{test.totalMarks} Marks</span>
                      </div>
                    </div>

                    {/* Syllabus Chips */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                        Key Syllabus Covered:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {test.syllabusCovered.map((s, i) => (
                          <span key={i} className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Associated Book link */}
                    {matchedBook && (
                      <div 
                        onClick={() => handleViewAssociatedBook(matchedBook.id)}
                        className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs cursor-pointer hover:bg-indigo-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-indigo-950 truncate max-w-[240px]">
                            Recommended Book: <strong>{matchedBook.title}</strong>
                          </span>
                        </div>
                        <span className="text-indigo-600 text-[11px] font-bold shrink-0">View Book →</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.enrolledStudents.toLocaleString()} Enrolled</span>
                    </span>

                    <button
                      onClick={() => handleStartTest(test)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start CBT Test</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 2: USER SCORES HISTORY */}
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

      {/* 5. TAB 3: PROGRESS TRACKER ANALYTICS BREAKDOWN */}
      {activeTab === 'analytics' && (
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
      )}

    </div>
  );
};
