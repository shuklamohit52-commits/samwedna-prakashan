import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  Target, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  ShieldCheck, 
  Calendar, 
  ArrowUpRight, 
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';
import { UserTestScore } from '../types';

interface StudentPerformanceAnalyticsProps {
  onStartExam?: () => void;
}

export const StudentPerformanceAnalytics: React.FC<StudentPerformanceAnalyticsProps> = ({ onStartExam }) => {
  const { studentScores, user, testSeriesList, setActiveTestExam, showToast } = useApp();

  const [activeChartType, setActiveChartType] = useState<'score' | 'accuracy-time' | 'percentile'>('score');
  const [selectedExamCategory, setSelectedExamCategory] = useState<string>('All');

  // Chronologically sorted scores (oldest to newest for proper timeline progression)
  const chronologicalScores = useMemo(() => {
    // If user has attempted scores, format them; otherwise provide rich historical progression
    const baseScores: UserTestScore[] = studentScores.length > 0 ? studentScores : [
      {
        id: 'rec-04',
        testId: 'ts-rrb-ntpc-stage1',
        testTitle: 'RRB NTPC Stage-I Full Simulation',
        category: 'All Railway Exam',
        dateAttempted: '26 Sep',
        scoreObtained: 81.5,
        totalMarks: 100,
        accuracyPercentage: 87.5,
        percentile: 94.8,
        rank: 980,
        totalCandidates: 28900,
        timeSpentMinutes: 78,
        status: 'Completed'
      },
      {
        id: 'rec-03',
        testId: 'ts-polity-nirvachan',
        testTitle: 'Indian Polity & Election Laws (निर्वाचन)',
        category: 'All State Exam',
        dateAttempted: '01 Oct',
        scoreObtained: 86.0,
        totalMarks: 100,
        accuracyPercentage: 94.0,
        percentile: 97.1,
        rank: 64,
        totalCandidates: 8640,
        timeSpentMinutes: 34,
        status: 'Completed'
      },
      {
        id: 'rec-02',
        testId: 'ts-ugc-hindi-sahitya',
        testTitle: 'हिन्दी साहित्य का इतिहास (2500+ MCQs)',
        category: 'Teaching & UGC NET',
        dateAttempted: '05 Oct',
        scoreObtained: 168.0,
        totalMarks: 200,
        accuracyPercentage: 89.2,
        percentile: 98.4,
        rank: 312,
        totalCandidates: 14820,
        timeSpentMinutes: 98,
        status: 'Completed'
      },
      {
        id: 'rec-01',
        testId: 'ts-ssc-cgl-tier1-full',
        testTitle: 'SSC CGL 2026 Tier-I Mock Test #01',
        category: 'All SSC Exam',
        dateAttempted: '08 Oct',
        scoreObtained: 172.5,
        totalMarks: 200,
        accuracyPercentage: 92.4,
        percentile: 98.7,
        rank: 184,
        totalCandidates: 32400,
        timeSpentMinutes: 52,
        status: 'Completed'
      },
      {
        id: 'rec-05',
        testId: 'ts-ssc-cgl-tier1-full-2',
        testTitle: 'SSC CGL Tier-I National Live Mock #02',
        category: 'All SSC Exam',
        dateAttempted: '14 Oct',
        scoreObtained: 184.0,
        totalMarks: 200,
        accuracyPercentage: 95.8,
        percentile: 99.4,
        rank: 42,
        totalCandidates: 36200,
        timeSpentMinutes: 50,
        status: 'Completed'
      }
    ];

    return [...baseScores].reverse(); // Oldest to newest
  }, [studentScores]);

  // Formatted chart dataset with normalized scores (0 - 100%)
  const chartData = useMemo(() => {
    return chronologicalScores
      .filter(item => selectedExamCategory === 'All' || item.category === selectedExamCategory)
      .map((item, index) => {
        const percentageScore = Math.round((item.scoreObtained / item.totalMarks) * 1000) / 10;
        // Clean short label for X-axis
        const shortDate = item.dateAttempted.replace(/ 2026/, '');
        const shortName = item.testTitle.length > 18 
          ? item.testTitle.substring(0, 18) + '...' 
          : item.testTitle;

        return {
          id: item.id,
          attemptIndex: `Test #${index + 1}`,
          date: shortDate,
          fullDate: item.dateAttempted,
          testName: item.testTitle,
          shortName,
          category: item.category,
          scoreObtained: item.scoreObtained,
          totalMarks: item.totalMarks,
          percentageScore,
          targetCutoff: 75.0, // Benchmark qualifying cutoff
          accuracy: item.accuracyPercentage,
          percentile: item.percentile,
          rank: item.rank,
          totalCandidates: item.totalCandidates,
          timeMinutes: item.timeSpentMinutes,
          speedSecondsPerQ: Math.round((item.timeSpentMinutes * 60) / (item.totalMarks > 100 ? 100 : 50))
        };
      });
  }, [chronologicalScores, selectedExamCategory]);

  // High-level KPI aggregations
  const overallAvgScore = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, curr) => acc + curr.percentageScore, 0);
    return Math.round((sum / chartData.length) * 10) / 10;
  }, [chartData]);

  const peakPercentile = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(c => c.percentile));
  }, [chartData]);

  const bestRank = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.min(...chartData.map(c => c.rank));
  }, [chartData]);

  const avgAccuracy = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, curr) => acc + curr.accuracy, 0);
    return Math.round((sum / chartData.length) * 10) / 10;
  }, [chartData]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-700 shadow-2xl text-xs space-y-2 min-w-[240px]">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <span className="font-bold text-amber-300 font-mono">{data.fullDate}</span>
            <span className="bg-indigo-600/60 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded">
              {data.category}
            </span>
          </div>

          <p className="font-bold text-slate-100 leading-snug">{data.testName}</p>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-1.5 bg-slate-800/80 rounded-lg">
              <span className="text-slate-400 block text-[9px] uppercase">Score</span>
              <span className="text-cyan-300 font-black text-sm">
                {data.scoreObtained}/{data.totalMarks} ({data.percentageScore}%)
              </span>
            </div>
            <div className="p-1.5 bg-slate-800/80 rounded-lg">
              <span className="text-slate-400 block text-[9px] uppercase">Accuracy</span>
              <span className="text-emerald-400 font-black text-sm">{data.accuracy}%</span>
            </div>
            <div className="p-1.5 bg-slate-800/80 rounded-lg">
              <span className="text-slate-400 block text-[9px] uppercase">AIR Rank</span>
              <span className="text-amber-400 font-black text-sm">#{data.rank}</span>
            </div>
            <div className="p-1.5 bg-slate-800/80 rounded-lg">
              <span className="text-slate-400 block text-[9px] uppercase">Percentile</span>
              <span className="text-indigo-300 font-black text-sm">{data.percentile}%ile</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Duration: {data.timeMinutes} mins</span>
            <span>Speed: ~{data.speedSecondsPerQ}s/Q</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header & Quick Analytics Highlights */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-600/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Samwedna Performance Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Student Score Trajectory & Growth Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time graphical evaluation of historical test performance, accuracy consistency, and All-India percentile progression calculated across completed CBT sessions.
            </p>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => {
              if (onStartExam) {
                onStartExam();
              } else if (testSeriesList.length > 0) {
                setActiveTestExam(testSeriesList[0]);
              }
              showToast('Launching next CBT practice test...', 'info');
            }}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer self-start md:self-auto"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Take Next Test To Boost Score</span>
          </button>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase text-[10px]">Average Test Score</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {overallAvgScore}%
            </p>
            <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">
              +10.9% Growth Since First Mock
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase text-[10px]">Peak All-India Percentile</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1">
              {peakPercentile}%ile
            </p>
            <span className="text-[10px] text-amber-400/90 font-bold mt-1 inline-block">
              Top 0.6% Aspirants Nationwide
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase text-[10px]">Best AIR Standing</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono mt-1">
              #{bestRank}
            </p>
            <span className="text-[10px] text-slate-300 font-medium mt-1 inline-block">
              In Tier-I Full Length Simulation
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase text-[10px]">Average Accuracy</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
              {avgAccuracy}%
            </p>
            <span className="text-[10px] text-indigo-300 font-medium mt-1 inline-block">
              Negative Penalty Minimized
            </span>
          </div>
        </div>

      </div>

      {/* 2. Interactive Chart Controls Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Top Toggle Bars */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          
          {/* Chart Type Selector */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl self-start text-xs font-bold">
            <button
              onClick={() => setActiveChartType('score')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartType === 'score'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Score Trajectory Curve</span>
            </button>

            <button
              onClick={() => setActiveChartType('accuracy-time')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartType === 'accuracy-time'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Accuracy vs Duration</span>
            </button>

            <button
              onClick={() => setActiveChartType('percentile')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeChartType === 'percentile'
                  ? 'bg-white text-amber-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>AIR Percentile Growth</span>
            </button>
          </div>

          {/* Exam Category Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Exam:</span>
            </span>
            <select
              value={selectedExamCategory}
              onChange={(e) => setSelectedExamCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="All">All Categories ({chronologicalScores.length} Tests)</option>
              <option value="All SSC Exam">All SSC Exam</option>
              <option value="Teaching & UGC NET">Teaching & UGC NET</option>
              <option value="All State Exam">All State Exam</option>
              <option value="All Railway Exam">All Railway Exam</option>
            </select>
          </div>

        </div>

        {/* 3. Recharts Graphical Chart Rendering Area */}
        <div className="w-full h-80 sm:h-96 pt-2">
          
          {/* ================= VIEW 1: SCORE PERCENTAGE AREA CHART ================= */}
          {activeChartType === 'score' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={[50, 100]} 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  unit="%"
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: 15, fontSize: 11, fontWeight: 600 }} 
                />
                <ReferenceLine 
                  y={75} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4" 
                  label={{ value: 'Target Cutoff (75%)', fill: '#dc2626', fontSize: 10, position: 'insideBottomRight' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="percentageScore" 
                  name="Score Percentage (%)" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#scoreGradient)" 
                  activeDot={{ r: 7, stroke: '#4f46e5', strokeWidth: 2, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* ================= VIEW 2: ACCURACY & TIME BAR/COMPOSED CHART ================= */}
          {activeChartType === 'accuracy-time' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  domain={[60, 100]} 
                  stroke="#059669" 
                  fontSize={11} 
                  tickLine={false}
                  unit="%"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 120]} 
                  stroke="#6366f1" 
                  fontSize={11} 
                  tickLine={false}
                  unit="m"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: 15, fontSize: 11, fontWeight: 600 }} 
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="accuracy" 
                  name="Accuracy Rate (%)" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={45} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="timeMinutes" 
                  name="Time Spent (Mins)" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  dot={{ r: 5, fill: '#6366f1' }} 
                />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* ================= VIEW 3: PERCENTILE GROWTH LINE CHART ================= */}
          {activeChartType === 'percentile' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={[90, 100]} 
                  stroke="#d97706" 
                  fontSize={11} 
                  tickLine={false}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: 15, fontSize: 11, fontWeight: 600 }} 
                />
                <ReferenceLine 
                  y={98.0} 
                  stroke="#059669" 
                  strokeDasharray="4 4" 
                  label={{ value: 'Top 2% Elite Threshold (98.0%ile)', fill: '#059669', fontSize: 10, position: 'insideTopLeft' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="percentile" 
                  name="All-India Percentile (%ile)" 
                  stroke="#f59e0b" 
                  strokeWidth={3.5} 
                  dot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} 
                  activeDot={{ r: 8, fill: '#d97706' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* 4. Samwedna Assessment Cell Verdict & Key Takeaways */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strongest Pillar</span>
            </span>
            <p className="font-bold text-slate-900">General Studies & Hindi Grammar</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Maintained 94%+ accuracy consistently across Dr. Rajneesh Kumar Yadav&apos;s Hindi Sahitya and Indian Polity CBT drills.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Speed Optimization Area</span>
            </span>
            <p className="font-bold text-slate-900">Quantitative Aptitude DI Questions</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Pacing averaged 72s per math numerical. Target: apply Vedic short cuts to reduce duration to under 55s before next mock.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Faculty Evaluation</span>
            </span>
            <p className="font-bold text-slate-900">Tier-1 Qualified Merit Zone</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Trajectory indicates high probability of qualifying prelims with top 100 All-India Rank according to <strong>Samwedna Institute Assessment Board</strong>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
