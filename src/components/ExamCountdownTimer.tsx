import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Plus, 
  Maximize2, 
  Bell, 
  BellOff, 
  Calendar,
  Layers,
  ArrowRight,
  Zap,
  HelpCircle
} from 'lucide-react';
import { TestSeriesExam } from '../types';

interface ExamCountdownTimerProps {
  onStartExam?: (test: TestSeriesExam) => void;
  className?: string;
}

export const ExamCountdownTimer: React.FC<ExamCountdownTimerProps> = ({ 
  onStartExam,
  className = '' 
}) => {
  const { 
    activeTestExam, 
    setActiveTestExam, 
    testSeriesList, 
    showToast,
    saveStudentTestScore 
  } = useApp();

  // Selected test for active session (either activeTestExam or first test in catalog)
  const defaultTest = activeTestExam || (testSeriesList.length > 0 ? testSeriesList[0] : null);
  const [selectedSessionTest, setSelectedSessionTest] = useState<TestSeriesExam | null>(defaultTest);

  // Timer mode: 'active-session' (currently running timed test) or 'upcoming-national' (countdown to next scheduled All-India live exam)
  const [sessionActive, setSessionActive] = useState<boolean>(Boolean(activeTestExam));
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Time remaining in seconds for active session
  const initialDuration = ((selectedSessionTest?.durationMinutes || 60) * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(initialDuration);
  const [soundAlertEnabled, setSoundAlertEnabled] = useState<boolean>(true);

  // National Live Mega Mock scheduled countdown (next Sunday 10:00 AM)
  const [nationalCountdown, setNationalCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 1,
    hours: 14,
    minutes: 28,
    seconds: 45
  });

  // Sync if activeTestExam changes in global AppContext
  useEffect(() => {
    if (activeTestExam) {
      setSelectedSessionTest(activeTestExam);
      setSessionActive(true);
      setIsPaused(false);
      setSecondsLeft((activeTestExam.durationMinutes || 60) * 60);
    }
  }, [activeTestExam]);

  // Active exam countdown ticker
  useEffect(() => {
    if (!sessionActive || isPaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpired();
          return 0;
        }
        // Warning notification at 5 minutes mark
        if (prev === 300) {
          showToast('⚠️ 5 Minutes Remaining in Exam Session! Review marked questions.', 'error');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive, isPaused]);

  // National mock countdown loop
  useEffect(() => {
    const nationalInterval = setInterval(() => {
      setNationalCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(nationalInterval);
  }, []);

  // When timer hits 0
  const handleTimeExpired = () => {
    setSessionActive(false);
    showToast('Time Expired! Active CBT Exam has been auto-submitted.', 'error');
  };

  // Format seconds into HH:MM:SS
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const totalSessionSeconds = (selectedSessionTest?.durationMinutes || 60) * 60;
  const progressPercent = Math.max(0, Math.min(100, Math.round(((totalSessionSeconds - secondsLeft) / (totalSessionSeconds || 1)) * 100)));
  const isCritical = secondsLeft <= 300 && secondsLeft > 0; // less than 5 min
  const isModerate = secondsLeft <= 900 && secondsLeft > 300; // 5 to 15 min

  // Controls
  const handleStartPracticeSession = (durationMinutes: number) => {
    const targetTest = selectedSessionTest || testSeriesList[0];
    if (targetTest) {
      const customTest = { ...targetTest, durationMinutes };
      setSelectedSessionTest(customTest);
      setSecondsLeft(durationMinutes * 60);
      setSessionActive(true);
      setIsPaused(false);
      showToast(`Started ${durationMinutes}-Minute Timed Exam Session!`, 'success');
    }
  };

  const handleResumeCBT = () => {
    if (selectedSessionTest) {
      if (onStartExam) {
        onStartExam(selectedSessionTest);
      } else {
        setActiveTestExam(selectedSessionTest);
      }
      showToast(`Launching CBT test simulation for ${selectedSessionTest.title}...`, 'info');
    }
  };

  const handleAddFiveMinutes = () => {
    setSecondsLeft(prev => prev + 300);
    showToast('+5 Minutes added to exam timer buffer', 'info');
  };

  const handleResetTimer = () => {
    const baseDuration = (selectedSessionTest?.durationMinutes || 60) * 60;
    setSecondsLeft(baseDuration);
    setIsPaused(false);
    showToast('Exam session countdown timer reset to full duration', 'info');
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setIsPaused(false);
    showToast('Exam session concluded. Results recorded in student dashboard.', 'success');
  };

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 ${
      isCritical 
        ? 'border-red-500/80 shadow-red-950/50 animate-pulse' 
        : (isModerate ? 'border-amber-500/60 shadow-amber-950/30' : 'border-indigo-500/30')
    } relative overflow-hidden ${className}`}>
      
      {/* Background glow effects */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-md ${
            sessionActive 
              ? (isCritical ? 'bg-red-600 text-white animate-bounce' : 'bg-indigo-600 text-white')
              : 'bg-amber-500 text-slate-950'
          }`}>
            <Clock className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-mono ${
                sessionActive 
                  ? (isCritical ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40')
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {sessionActive ? (isPaused ? 'SESSION PAUSED' : 'ACTIVE EXAM SESSION') : 'NEXT LIVE NATIONAL MOCK'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                NTA / TCS CBT Synchronized
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black font-display text-white mt-0.5 truncate max-w-sm sm:max-w-md">
              {sessionActive 
                ? (selectedSessionTest?.title || 'Competitive Exam Full CBT Test') 
                : 'Samwedna All-India National Live Mega Mock Test 2026'}
            </h3>
          </div>
        </div>

        {/* Mode Toggle & Audio Alert button */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setSoundAlertEnabled(!soundAlertEnabled)}
            className={`p-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer border ${
              soundAlertEnabled 
                ? 'bg-white/10 border-white/20 text-cyan-300' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={soundAlertEnabled ? 'Timer Beep Alert Enabled' : 'Muted'}
          >
            {soundAlertEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-[11px]">{soundAlertEnabled ? '5-Min Alert On' : 'Alert Muted'}</span>
          </button>

          <button
            onClick={() => {
              if (sessionActive) {
                setSessionActive(false);
              } else {
                handleStartPracticeSession(60);
              }
            }}
            className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {sessionActive ? 'Switch to Upcoming Mock' : 'Start Active Session'}
          </button>
        </div>

      </div>

      {/* Main Content: Active Session Timer vs Upcoming National Mock */}
      {sessionActive ? (
        /* ================= ACTIVE EXAM COUNTDOWN HUD ================= */
        <div className="py-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Giant Monospace Digital Timer */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`}></span>
                <span>Time Remaining In This Test</span>
              </span>

              {/* Digital Numbers Box */}
              <div className="flex items-center gap-2 sm:gap-3 select-none">
                {/* Hours Box */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-center min-w-[72px] sm:min-w-[90px] shadow-inner">
                  <span className={`text-3xl sm:text-5xl font-black font-mono tracking-tight ${
                    isCritical ? 'text-red-400' : (isModerate ? 'text-amber-400' : 'text-cyan-400')
                  }`}>
                    {hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mt-1">Hours</span>
                </div>

                <span className="text-2xl sm:text-4xl font-mono font-bold text-slate-500 animate-pulse">:</span>

                {/* Minutes Box */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-center min-w-[72px] sm:min-w-[90px] shadow-inner">
                  <span className={`text-3xl sm:text-5xl font-black font-mono tracking-tight ${
                    isCritical ? 'text-red-400' : (isModerate ? 'text-amber-400' : 'text-cyan-400')
                  }`}>
                    {minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mt-1">Minutes</span>
                </div>

                <span className="text-2xl sm:text-4xl font-mono font-bold text-slate-500 animate-pulse">:</span>

                {/* Seconds Box */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-center min-w-[72px] sm:min-w-[90px] shadow-inner">
                  <span className={`text-3xl sm:text-5xl font-black font-mono tracking-tight ${
                    isCritical ? 'text-red-400' : (isModerate ? 'text-amber-400' : 'text-emerald-400')
                  }`}>
                    {seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mt-1">Seconds</span>
                </div>
              </div>

              {/* Urgency Notification Banner */}
              {isCritical && (
                <div className="p-2.5 bg-red-950/80 border border-red-500/60 rounded-xl text-red-200 text-xs flex items-center gap-2 mt-2 w-full max-w-md">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-semibold text-[11px]">Final 5 minutes! Finish pending questions and verify answers.</span>
                </div>
              )}
            </div>

            {/* Quick Session Stats & Controls */}
            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Exam Progression:</span>
                <span className="font-mono font-bold text-white">{progressPercent}% Elapsed</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCritical ? 'bg-red-500' : (isModerate ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-400 to-indigo-500')
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Pace Metric */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">Target Pace</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">54s / Question</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">Marking Rule</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono">+2 / -0.50</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                    isPaused 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500' 
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
                  }`}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'Resume Timer' : 'Pause Timer'}</span>
                </button>

                <button
                  onClick={handleAddFiveMinutes}
                  className="py-2 px-3 bg-white/10 hover:bg-white/15 border border-white/10 text-cyan-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Add 5 Minutes"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+5 Mins Buffer</span>
                </button>
              </div>

              {/* Primary Resume / Launch Button */}
              <button
                onClick={handleResumeCBT}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Open Full-Screen CBT Exam Interface</span>
              </button>

            </div>

          </div>

          {/* Quick Footer for active session */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px]">
                Timer synchronized with <strong>Samwedna Examination Server</strong>. Session auto-saves answers.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetTimer}
                className="hover:text-white transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Timer</span>
              </button>
              <button
                onClick={handleEndSession}
                className="text-rose-400 hover:text-rose-300 font-semibold transition-colors text-[11px] cursor-pointer"
              >
                End Session & Score →
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* ================= UPCOMING NATIONAL LIVE MOCK COUNTDOWN ================= */
        <div className="py-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* National Mock Countdown Display */}
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>All-India Live Mega Simulation</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black font-display text-white">
                Upcoming All-India Mega Mock Exam
              </h4>

              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Compete live against 25,000+ registered aspirants nationwide. Official NTA/TCS CBT simulation with instant All-India Rank, percentile report, and detailed question solutions by Samwedna Institute Faculty.
              </p>

              {/* Countdown Digits Grid */}
              <div className="flex items-center gap-2 sm:gap-3 pt-2 select-none">
                {/* Days */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-center min-w-[65px] sm:min-w-[75px] shadow-inner">
                  <span className="text-2xl sm:text-4xl font-black font-mono text-amber-300">
                    {nationalCountdown.days.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider mt-0.5">Days</span>
                </div>

                <span className="text-xl sm:text-2xl font-mono font-bold text-slate-500">:</span>

                {/* Hours */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-center min-w-[65px] sm:min-w-[75px] shadow-inner">
                  <span className="text-2xl sm:text-4xl font-black font-mono text-amber-300">
                    {nationalCountdown.hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider mt-0.5">Hours</span>
                </div>

                <span className="text-xl sm:text-2xl font-mono font-bold text-slate-500">:</span>

                {/* Mins */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-center min-w-[65px] sm:min-w-[75px] shadow-inner">
                  <span className="text-2xl sm:text-4xl font-black font-mono text-amber-300">
                    {nationalCountdown.minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider mt-0.5">Mins</span>
                </div>

                <span className="text-xl sm:text-2xl font-mono font-bold text-slate-500">:</span>

                {/* Secs */}
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-center min-w-[65px] sm:min-w-[75px] shadow-inner">
                  <span className="text-2xl sm:text-4xl font-black font-mono text-cyan-300">
                    {nationalCountdown.seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider mt-0.5">Secs</span>
                </div>
              </div>

            </div>

            {/* Launch Quick Timed Practice Drill */}
            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Don't wait for Sunday
                </span>
                <h5 className="text-sm font-bold text-white">Start a Timed Practice Drill Right Now</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Select a practice duration with real-time countdown timer:</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStartPracticeSession(15)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 text-center transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-indigo-300">15 Mins</span>
                  <span className="text-[10px] text-slate-400">Speed Drill</span>
                </button>

                <button
                  onClick={() => handleStartPracticeSession(30)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 text-center transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-indigo-300">30 Mins</span>
                  <span className="text-[10px] text-slate-400">Sectional</span>
                </button>

                <button
                  onClick={() => handleStartPracticeSession(60)}
                  className="p-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-500/50 text-center transition-all cursor-pointer group shadow-xs"
                >
                  <span className="text-xs font-bold text-amber-300 block">60 Mins</span>
                  <span className="text-[10px] text-indigo-200">Full Mock</span>
                </button>
              </div>

              <button
                onClick={() => handleStartPracticeSession(60)}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Timed Exam Session Now</span>
              </button>
            </div>

          </div>

          {/* Footer info banner */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px]">
                Exam Window: <strong>Sunday 10:00 AM – 1:00 PM IST</strong> · Verified by <strong>Samwedna Institute Assessment Board</strong>
              </span>
            </div>
            <div className="text-[11px] text-indigo-300 font-semibold">
              Free Access for All Samwedna Aspirants
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
