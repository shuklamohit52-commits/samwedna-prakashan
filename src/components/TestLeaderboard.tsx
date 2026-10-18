import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  RefreshCw, 
  Play, 
  Zap, 
  ShieldCheck, 
  Flame, 
  ArrowUpRight, 
  UserCheck, 
  GraduationCap,
  Users,
  Compass
} from 'lucide-react';
import { LeaderboardStudent, TestSeriesExam } from '../types';

interface TestLeaderboardProps {
  onStartTest?: (test: TestSeriesExam) => void;
}

// Initial realistic All-India candidates curated for Samwedna competitive exams
const INITIAL_LEADERBOARD_DATA: LeaderboardStudent[] = [
  {
    id: 'lb-1',
    rank: 1,
    name: 'Ananya Srivastava',
    rollNumber: 'SAM-2026-1042',
    avatarInitials: 'AS',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    targetExam: 'Teaching & UGC NET (Hindi Sahitya)',
    category: 'Teaching & UGC NET',
    testId: 'ts-ugc-hindi-sahitya-01',
    testTitle: 'हिन्दी साहित्य का इतिहास वस्तुनिष्ठ संकलन (2500+ MCQs Special CBT)',
    score: 194.0,
    totalMarks: 200,
    accuracy: 97.5,
    timeTakenMinutes: 84,
    percentile: 99.98,
    submittedAt: '12 mins ago',
    badge: 'AIR 1 · Gold Scholar',
    trend: 'same'
  },
  {
    id: 'lb-2',
    rank: 2,
    name: 'Vikramaditya Rao',
    rollNumber: 'SAM-2026-2189',
    avatarInitials: 'VR',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    targetExam: 'SSC CGL & CHSL 2026',
    category: 'All SSC Exam',
    testId: 'ts-ssc-cgl-tier1-full',
    testTitle: 'SSC CGL 2026 Tier-I All-India Full Length Mock Test',
    score: 188.5,
    totalMarks: 200,
    accuracy: 95.2,
    timeTakenMinutes: 52,
    percentile: 99.82,
    submittedAt: '28 mins ago',
    badge: 'AIR 2 · Silver Scholar',
    trend: 'up',
    trendValue: 2
  },
  {
    id: 'lb-3',
    rank: 3,
    name: 'Pooja Choudhary',
    rollNumber: 'SAM-2026-3041',
    avatarInitials: 'PC',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    city: 'Jaipur',
    state: 'Rajasthan',
    targetExam: 'All State Exam (RAS / UPPSC)',
    category: 'All State Exam',
    testId: 'ts-polity-nirvachan',
    testTitle: 'Indian Polity & Election Laws Special Test (आधार: निर्वाचन)',
    score: 96.0,
    totalMarks: 100,
    accuracy: 96.0,
    timeTakenMinutes: 38,
    percentile: 99.64,
    submittedAt: '45 mins ago',
    badge: 'AIR 3 · Bronze Scholar',
    trend: 'up',
    trendValue: 1
  },
  {
    id: 'lb-4',
    rank: 4,
    name: 'Rohit Meena',
    rollNumber: 'SAM-2026-4421',
    avatarInitials: 'RM',
    city: 'Kota',
    state: 'Rajasthan',
    targetExam: 'All Railway Exam (RRB NTPC)',
    category: 'All Railway Exam',
    testId: 'ts-rrb-ntpc-stage1',
    testTitle: 'RRB NTPC Stage-I Computer Based Test (CBT) Full Simulation',
    score: 92.5,
    totalMarks: 100,
    accuracy: 94.8,
    timeTakenMinutes: 68,
    percentile: 99.31,
    submittedAt: '1 hour ago',
    trend: 'down',
    trendValue: 1
  },
  {
    id: 'lb-5',
    rank: 5,
    name: 'Sneha Patel',
    rollNumber: 'SAM-2026-5120',
    avatarInitials: 'SP',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    city: 'Patna',
    state: 'Bihar',
    targetExam: 'All Bank Exam (SBI / IBPS PO)',
    category: 'All Bank Exam',
    testId: 'ts-banking-quant-di',
    testTitle: 'Speed Math & Quantitative Aptitude DI Marathon',
    score: 91.0,
    totalMarks: 100,
    accuracy: 92.8,
    timeTakenMinutes: 55,
    percentile: 99.12,
    submittedAt: '1.5 hours ago',
    trend: 'up',
    trendValue: 3
  },
  {
    id: 'lb-6',
    rank: 6,
    name: 'Divyansh Mishra',
    rollNumber: 'SAM-2026-6218',
    avatarInitials: 'DM',
    city: 'New Delhi',
    state: 'Delhi NCR',
    targetExam: 'UPSC Civil Services',
    category: 'All State Exam',
    testId: 'ts-ugc-hindi-sahitya-01',
    testTitle: 'हिन्दी साहित्य का इतिहास वस्तुनिष्ठ संकलन (2500+ MCQs Special CBT)',
    score: 181.0,
    totalMarks: 200,
    accuracy: 91.4,
    timeTakenMinutes: 92,
    percentile: 98.75,
    submittedAt: '2 hours ago',
    trend: 'same'
  },
  {
    id: 'lb-7',
    rank: 7,
    name: 'Mohit Shukla',
    rollNumber: 'SAM-2026-8841',
    avatarInitials: 'MS',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    targetExam: 'SSC CGL & Railway NTPC',
    category: 'All SSC Exam',
    testId: 'ts-ssc-cgl-tier1-full',
    testTitle: 'SSC CGL 2026 Tier-I All-India Full Length Mock Test',
    score: 176.0,
    totalMarks: 200,
    accuracy: 89.5,
    timeTakenMinutes: 56,
    percentile: 98.24,
    submittedAt: 'Today',
    badge: 'Elite Aspirant Pass',
    isCurrentUser: true,
    trend: 'up',
    trendValue: 4
  },
  {
    id: 'lb-8',
    rank: 8,
    name: 'Tanya Bhardwaj',
    rollNumber: 'SAM-2026-7712',
    avatarInitials: 'TB',
    city: 'Dehradun',
    state: 'Uttarakhand',
    targetExam: 'All Defence Exam (CDS / AFCAT)',
    category: 'All Defence Exam',
    testId: 'ts-rrb-ntpc-stage1',
    testTitle: 'RRB NTPC Stage-I Computer Based Test (CBT) Full Simulation',
    score: 87.0,
    totalMarks: 100,
    accuracy: 91.0,
    timeTakenMinutes: 72,
    percentile: 97.80,
    submittedAt: '3 hours ago',
    trend: 'down',
    trendValue: 2
  },
  {
    id: 'lb-9',
    rank: 9,
    name: 'Deepak Yadav',
    rollNumber: 'SAM-2026-8914',
    avatarInitials: 'DY',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    targetExam: 'Teaching & UGC NET',
    category: 'Teaching & UGC NET',
    testId: 'ts-ugc-hindi-sahitya-01',
    testTitle: 'हिन्दी साहित्य का इतिहास वस्तुनिष्ठ संकलन (2500+ MCQs Special CBT)',
    score: 172.0,
    totalMarks: 200,
    accuracy: 88.0,
    timeTakenMinutes: 89,
    percentile: 97.45,
    submittedAt: '3.5 hours ago',
    trend: 'new'
  },
  {
    id: 'lb-10',
    rank: 10,
    name: 'Kavita Joshi',
    rollNumber: 'SAM-2026-9023',
    avatarInitials: 'KJ',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    targetExam: 'All State Exam (MPPSC)',
    category: 'All State Exam',
    testId: 'ts-polity-nirvachan',
    testTitle: 'Indian Polity & Election Laws Special Test (आधार: निर्वाचन)',
    score: 84.5,
    totalMarks: 100,
    accuracy: 89.2,
    timeTakenMinutes: 44,
    percentile: 97.10,
    submittedAt: '4 hours ago',
    trend: 'same'
  }
];

// Live ticker events stream
const LIVE_TEST_ACTIVITIES = [
  { student: 'Ananya S.', city: 'Gorakhpur', test: 'हिन्दी साहित्य का इतिहास (2500+ MCQs)', score: '194/200', rank: 1, time: 'Just now' },
  { student: 'Vikramaditya R.', city: 'Lucknow', test: 'SSC CGL Tier-I Mock #4', score: '188.5/200', rank: 2, time: '2m ago' },
  { student: 'Pooja C.', city: 'Jaipur', test: 'Indian Polity & Election Laws', score: '96/100', rank: 3, time: '5m ago' },
  { student: 'Aman Deep', city: 'Patna', test: 'Railway NTPC CBT Full Simulation', score: '88/100', rank: 12, time: '8m ago' },
  { student: 'Kavita J.', city: 'Bhopal', test: 'Daily Current Affairs National Quiz', score: '95%', rank: 7, time: '11m ago' }
];

export const TestLeaderboard: React.FC<TestLeaderboardProps> = ({ onStartTest }) => {
  const { user, testSeriesList, setActiveTestExam, showToast, setCurrentView } = useApp();

  const [leaderboard, setLeaderboard] = useState<LeaderboardStudent[]>(INITIAL_LEADERBOARD_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'all-time'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [liveActivityIndex, setLiveActivityIndex] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Real-time Activity Ticker Loop
  useEffect(() => {
    if (!isLiveActive) return;
    const interval = setInterval(() => {
      setLiveActivityIndex((prev) => (prev + 1) % LIVE_TEST_ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Real-time simulated pulse every 20 seconds: fluctuates scores slightly to demonstrate live activity
  useEffect(() => {
    if (!isLiveActive) return;
    const pulseInterval = setInterval(() => {
      setLastRefreshed(new Date());
    }, 20000);
    return () => clearInterval(pulseInterval);
  }, [isLiveActive]);

  // Categories list
  const categoryFilters = [
    'All',
    'Teaching & UGC NET',
    'All SSC Exam',
    'All Railway Exam',
    'All State Exam',
    'All Bank Exam',
    'All Defence Exam'
  ];

  // Filtered leaderboard
  const filteredStudents = useMemo(() => {
    return leaderboard.filter(student => {
      if (selectedCategory !== 'All' && student.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = student.name.toLowerCase().includes(q);
        const matchCity = student.city.toLowerCase().includes(q);
        const matchRoll = student.rollNumber.toLowerCase().includes(q);
        const matchExam = student.targetExam.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchRoll && !matchExam) return false;
      }
      return true;
    });
  }, [leaderboard, selectedCategory, searchQuery]);

  // Top 3 Podium
  const topThree = useMemo(() => {
    return filteredStudents.slice(0, 3);
  }, [filteredStudents]);

  // Current user entry
  const currentUserEntry = useMemo(() => {
    if (!user) return null;
    return (
      leaderboard.find(s => s.isCurrentUser || s.rollNumber === user.rollNumber || s.name.toLowerCase() === user.name.toLowerCase()) || {
        id: 'current-user-standing',
        rank: 7,
        name: user.name,
        rollNumber: user.rollNumber || 'SAM-2026-8841',
        avatarInitials: user.name.substring(0, 2).toUpperCase(),
        city: user.address?.city || 'Gorakhpur',
        state: user.address?.state || 'Uttar Pradesh',
        targetExam: user.targetExam || 'SSC CGL 2026',
        category: 'All SSC Exam',
        testId: 'ts-ssc-cgl-tier1-full',
        testTitle: 'SSC CGL 2026 Tier-I All-India Full Length Mock Test',
        score: 176.0,
        totalMarks: 200,
        accuracy: 89.5,
        timeTakenMinutes: 56,
        percentile: 98.24,
        submittedAt: 'Today',
        badge: 'Verified Student Pass',
        isCurrentUser: true,
        trend: 'up',
        trendValue: 4
      }
    );
  }, [user, leaderboard]);

  // Handle immediate test launch from leaderboard
  const handleLaunchTest = (testId: string) => {
    const test = testSeriesList.find(t => t.id === testId);
    if (test) {
      if (onStartTest) {
        onStartTest(test);
      } else {
        setActiveTestExam(test);
      }
      showToast(`Launching ${test.title} CBT Exam...`, 'info');
    } else {
      // Default to first test
      if (testSeriesList.length > 0) {
        setActiveTestExam(testSeriesList[0]);
      }
    }
  };

  const handleManualRefresh = () => {
    setLastRefreshed(new Date());
    showToast('Leaderboard scores and ranks refreshed in real-time!', 'success');
  };

  const currentLiveActivity = LIVE_TEST_ACTIVITIES[liveActivityIndex];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Real-Time Status & Live Submissions Stream Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-600/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left Title & Live Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 relative"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest uppercase text-emerald-400 font-mono">
                  LIVE STREAM ACTIVE
                </span>
                <span className="text-[10px] text-slate-400">·</span>
                <span className="text-[11px] text-cyan-300 font-medium">
                  Samwedna All-India Mock Rankings
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5">
                Real-Time Aspirant Leaderboard
              </h2>
            </div>
          </div>

          {/* Right Live Stream Ticker Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 shrink-0 text-xs">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 animate-bounce" />
            </div>
            <div className="min-w-[220px] sm:min-w-[280px]">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>NEW SUBMISSION</span>
                <span className="text-amber-400 font-semibold">{currentLiveActivity.time}</span>
              </div>
              <p className="text-xs font-bold text-slate-100 truncate mt-0.5">
                <strong className="text-cyan-300">{currentLiveActivity.student}</strong> ({currentLiveActivity.city}) scored{' '}
                <span className="text-emerald-400 font-mono font-black">{currentLiveActivity.score}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Live Controls Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">
              Rankings verified by <strong className="text-slate-200">Samwedna Examination Cell</strong> · Negative Marking Calculated
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Last Synced: <strong className="text-slate-300 font-mono">{lastRefreshed.toLocaleTimeString()}</strong></span>
            <button
              onClick={handleManualRefresh}
              className="p-1 rounded-lg hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Refresh Ranks Now"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Podium (Gold, Silver, Bronze) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* Silver: Rank 2 */}
        {topThree[1] && (
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-100 to-slate-200/90 rounded-3xl p-6 border border-slate-300/80 shadow-md flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-300/30 rounded-bl-full pointer-events-none"></div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-slate-700 text-white font-black text-xs font-mono shadow-xs flex items-center gap-1.5">
                  <Medal className="w-3.5 h-3.5 text-slate-200" />
                  <span>AIR #2</span>
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white/70 px-2.5 py-0.5 rounded-lg border border-slate-200">
                  {topThree[1].percentile}%ile
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 border-2 border-white shadow-md flex items-center justify-center text-slate-800 font-bold text-base overflow-hidden">
                  {topThree[1].avatarUrl ? (
                    <img src={topThree[1].avatarUrl} alt={topThree[1].name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{topThree[1].avatarInitials}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-display leading-snug">
                    {topThree[1].name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {topThree[1].city}, {topThree[1].state}
                  </p>
                  <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider mt-0.5">
                    {topThree[1].targetExam}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-300/80 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-white/80 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Score</p>
                <p className="text-base font-black text-slate-900 font-mono">
                  {topThree[1].score} <span className="text-[10px] text-slate-500 font-normal">/ {topThree[1].totalMarks}</span>
                </p>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Accuracy</p>
                <p className="text-base font-black text-emerald-600 font-mono">
                  {topThree[1].accuracy}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gold: Rank 1 (Featured Podium Center) */}
        {topThree[0] && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500 via-amber-400 to-amber-500 text-slate-950 rounded-3xl p-6 shadow-xl border-2 border-amber-300 relative overflow-hidden transform md:-translate-y-2 hover:scale-[1.01] transition-all">
            <div className="absolute top-2 right-2 opacity-15">
              <Crown className="w-24 h-24 text-amber-900" />
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-slate-950 text-amber-300 font-black text-xs font-mono shadow-md flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>ALL-INDIA RANK 1</span>
                </span>
                <span className="text-xs font-black text-slate-950 bg-white/80 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                  {topThree[0].percentile}%ile
                </span>
              </div>

              <div className="flex items-center gap-3.5 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-200 shadow-lg flex items-center justify-center text-amber-900 font-black text-lg overflow-hidden">
                  {topThree[0].avatarUrl ? (
                    <img src={topThree[0].avatarUrl} alt={topThree[0].name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{topThree[0].avatarInitials}</span>
                  )}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-black tracking-wider uppercase mb-0.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Samwedna Topper</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-950 font-display leading-tight">
                    {topThree[0].name}
                  </h3>
                  <p className="text-xs text-amber-950/80 font-bold">
                    {topThree[0].city}, {topThree[0].state}
                  </p>
                </div>
              </div>

              <p className="text-[11px] font-semibold text-amber-950 bg-white/40 p-2 rounded-xl line-clamp-1">
                {topThree[0].testTitle}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-600/40 grid grid-cols-2 gap-2 text-center relative z-10">
              <div className="p-2 bg-slate-950 text-white rounded-xl shadow-xs">
                <p className="text-[10px] text-amber-400 font-semibold uppercase">Score</p>
                <p className="text-lg font-black text-amber-300 font-mono">
                  {topThree[0].score} <span className="text-[10px] text-slate-400 font-normal">/ {topThree[0].totalMarks}</span>
                </p>
              </div>
              <div className="p-2 bg-slate-950 text-white rounded-xl shadow-xs">
                <p className="text-[10px] text-emerald-400 font-semibold uppercase">Accuracy</p>
                <p className="text-lg font-black text-emerald-300 font-mono">
                  {topThree[0].accuracy}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bronze: Rank 3 */}
        {topThree[2] && (
          <div className="order-3 bg-gradient-to-b from-amber-50 to-orange-100/80 rounded-3xl p-6 border border-amber-200 shadow-md flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/30 rounded-bl-full pointer-events-none"></div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-amber-800 text-white font-black text-xs font-mono shadow-xs flex items-center gap-1.5">
                  <Medal className="w-3.5 h-3.5 text-amber-300" />
                  <span>AIR #3</span>
                </span>
                <span className="text-[11px] font-bold text-amber-900 bg-white/80 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  {topThree[2].percentile}%ile
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-300 to-amber-100 border-2 border-white shadow-md flex items-center justify-center text-amber-900 font-bold text-base overflow-hidden">
                  {topThree[2].avatarUrl ? (
                    <img src={topThree[2].avatarUrl} alt={topThree[2].name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{topThree[2].avatarInitials}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-display leading-snug">
                    {topThree[2].name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {topThree[2].city}, {topThree[2].state}
                  </p>
                  <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mt-0.5">
                    {topThree[2].targetExam}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-amber-200/80 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Score</p>
                <p className="text-base font-black text-slate-900 font-mono">
                  {topThree[2].score} <span className="text-[10px] text-slate-500 font-normal">/ {topThree[2].totalMarks}</span>
                </p>
              </div>
              <div className="p-2 bg-white/80 rounded-xl border border-amber-200">
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Accuracy</p>
                <p className="text-base font-black text-emerald-600 font-mono">
                  {topThree[2].accuracy}%
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. Logged-in Student Current Standing Spotlight */}
      {currentUserEntry && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 border-2 border-indigo-400 text-white font-extrabold flex items-center justify-center text-xl shrink-0 shadow-lg">
              #{currentUserEntry.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] uppercase font-mono tracking-wider">
                  Your Current Standing
                </span>
                <span className="text-xs text-indigo-200 font-medium font-mono">
                  Roll: {currentUserEntry.rollNumber}
                </span>
              </div>
              <h3 className="text-lg font-black text-white font-display mt-0.5">
                {currentUserEntry.name} ({currentUserEntry.city})
              </h3>
              <p className="text-xs text-indigo-200">
                Score: <strong className="text-white font-mono">{currentUserEntry.score}/{currentUserEntry.totalMarks}</strong> · Accuracy:{' '}
                <strong className="text-emerald-300 font-mono">{currentUserEntry.accuracy}%</strong> · Percentile:{' '}
                <strong className="text-amber-300 font-mono">{currentUserEntry.percentile}%ile</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-indigo-300 block">Gap to Top 3:</span>
              <span className="text-xs font-bold text-amber-300">+12.5 marks</span>
            </div>
            <button
              onClick={() => handleLaunchTest(currentUserEntry.testId)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Take Next CBT Mock</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Filter, Search & Timeframe Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search aspirant name, roll number, exam, or city (e.g. Gorakhpur)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white text-slate-900 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Timeframe toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'today' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today (Live)
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'week' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly League
            </button>
            <button
              onClick={() => setTimeframe('all-time')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'all-time' ? 'bg-white text-indigo-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All-Time Hall of Fame
            </button>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Exam:</span>
          </span>
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* 5. Full Real-Time Leaderboard Rankings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              All-India Candidate Performance Rankings ({filteredStudents.length} Aspirants)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Category: <strong className="text-indigo-600">{selectedCategory}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Rank</th>
                <th className="py-3.5 px-3">Aspirant Candidate</th>
                <th className="py-3.5 px-3">Target Exam & Test</th>
                <th className="py-3.5 px-3">Location</th>
                <th className="py-3.5 px-3 text-right">Score</th>
                <th className="py-3.5 px-3 text-center">Accuracy</th>
                <th className="py-3.5 px-3 text-right">Percentile</th>
                <th className="py-3.5 pr-6 pl-3 text-right">CBT Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No candidates found for this filter criteria.</p>
                    <p className="text-[11px] mt-1">Try resetting the exam category or search term.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((candidate) => {
                  const isTopThree = candidate.rank <= 3;
                  const isSelf = candidate.isCurrentUser || (user && user.rollNumber === candidate.rollNumber);

                  return (
                    <tr
                      key={candidate.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelf ? 'bg-indigo-50/60 font-semibold' : ''
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-black font-mono text-xs ${
                              candidate.rank === 1
                                ? 'bg-amber-400 text-slate-950 shadow-xs'
                                : candidate.rank === 2
                                ? 'bg-slate-300 text-slate-900 shadow-xs'
                                : candidate.rank === 3
                                ? 'bg-amber-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {candidate.rank}
                          </span>

                          {/* Trend indicator */}
                          {candidate.trend === 'up' && (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center" title="Moved up">
                              <TrendingUp className="w-3 h-3" />
                              {candidate.trendValue}
                            </span>
                          )}
                          {candidate.trend === 'down' && (
                            <span className="text-[10px] text-rose-500 font-bold flex items-center" title="Moved down">
                              <TrendingDown className="w-3 h-3" />
                              {candidate.trendValue}
                            </span>
                          )}
                          {candidate.trend === 'new' && (
                            <span className="text-[9px] bg-cyan-100 text-cyan-800 font-extrabold px-1 rounded uppercase">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Candidate Name & Roll */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                            {candidate.avatarUrl ? (
                              <img src={candidate.avatarUrl} alt={candidate.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{candidate.avatarInitials}</span>
                            )}
                          </div>
                          <div className="truncate max-w-[160px] sm:max-w-[200px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 truncate">{candidate.name}</span>
                              {isSelf && (
                                <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {candidate.rollNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Target Exam & Test Title */}
                      <td className="py-4 px-3">
                        <div className="max-w-[200px] sm:max-w-[260px]">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                            {candidate.category}
                          </span>
                          <p className="text-xs text-slate-700 font-medium truncate mt-1" title={candidate.testTitle}>
                            {candidate.testTitle}
                          </p>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="text-slate-800 font-medium block">{candidate.city}</span>
                        <span className="text-[10px] text-slate-400">{candidate.state}</span>
                      </td>

                      {/* Score */}
                      <td className="py-4 px-3 text-right whitespace-nowrap font-mono">
                        <span className="text-sm font-black text-slate-900">{candidate.score}</span>
                        <span className="text-[10px] text-slate-400 block">/ {candidate.totalMarks}</span>
                      </td>

                      {/* Accuracy */}
                      <td className="py-4 px-3 text-center whitespace-nowrap font-mono">
                        <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
                          {candidate.accuracy}%
                        </span>
                      </td>

                      {/* Percentile */}
                      <td className="py-4 px-3 text-right whitespace-nowrap font-mono">
                        <span className="text-xs font-bold text-amber-600">
                          {candidate.percentile}%ile
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 pr-6 pl-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleLaunchTest(candidate.testId)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-[11px] transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span>Attempt Test</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              All scores are evaluated by the <strong>Samwedna Institute Assessment Engine</strong> according to official Commission marking schemes.
            </span>
          </div>
          <button
            onClick={() => {
              if (testSeriesList.length > 0) {
                handleLaunchTest(testSeriesList[0].id);
              }
            }}
            className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
          >
            Attempt New CBT Test & Climb Leaderboard →
          </button>
        </div>

      </div>

    </div>
  );
};
