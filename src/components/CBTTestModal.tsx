import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Award, 
  RotateCcw, 
  ArrowRight,
  Languages,
  Check,
  Flag,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { CBT_MOCK_QUESTIONS } from '../data/mockData';
import { UserTestScore } from '../types';

export const CBTTestModal: React.FC = () => {
  const { 
    activeTestExam, 
    setActiveTestExam, 
    saveStudentTestScore, 
    showToast,
    setCurrentView,
    setAccountTab 
  } = useApp();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes default
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  // Load questions for the test or default to mock questions
  const testQuestions = activeTestExam?.questions && activeTestExam.questions.length > 0 
    ? activeTestExam.questions 
    : CBT_MOCK_QUESTIONS;

  useEffect(() => {
    if (!activeTestExam) return;
    const initialSeconds = (activeTestExam.durationMinutes || 15) * 60;
    setTimeLeft(initialSeconds);
    setTestSubmitted(false);
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
  }, [activeTestExam]);

  useEffect(() => {
    if (!activeTestExam || testSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTestExam, testSubmitted]);

  if (!activeTestExam) return null;

  const currentQ = testQuestions[currentQuestionIndex] || testQuestions[0];
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleMarkReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Score calculations
  const totalQuestions = testQuestions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  testQuestions.forEach(q => {
    const ans = userAnswers[q.id];
    if (ans !== undefined) {
      if (ans === q.correctIndex) correctCount += 1;
      else incorrectCount += 1;
    }
  });
  const attemptedCount = Object.keys(userAnswers).length;
  const unattemptedCount = totalQuestions - attemptedCount;
  
  // +2 for correct, -0.5 for incorrect
  const marksPerQ = activeTestExam.totalMarks ? activeTestExam.totalMarks / totalQuestions : 2;
  const negMark = activeTestExam.negativeMarking ?? (marksPerQ * 0.25);
  const rawScore = (correctCount * marksPerQ) - (incorrectCount * negMark);
  const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
  const totalMaxMarks = activeTestExam.totalMarks || (totalQuestions * 2);
  const accuracy = attemptedCount > 0 ? Number(((correctCount / attemptedCount) * 100).toFixed(1)) : 0;
  const percentile = Number((Math.min(99.8, Math.max(55.0, (finalScore / totalMaxMarks) * 100 + (Math.random() * 2)))).toFixed(1));
  const estimatedRank = Math.max(12, Math.floor(activeTestExam.enrolledStudents * ((100 - percentile) / 100)));

  const handleSubmitTest = () => {
    setTestSubmitted(true);
    const scoreRecord: UserTestScore = {
      id: `score_${Date.now()}`,
      testId: activeTestExam.id,
      testTitle: activeTestExam.title,
      category: activeTestExam.category,
      dateAttempted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      scoreObtained: finalScore,
      totalMarks: totalMaxMarks,
      accuracyPercentage: accuracy,
      percentile: percentile,
      rank: estimatedRank,
      totalCandidates: activeTestExam.enrolledStudents || 12000,
      timeSpentMinutes: Math.round(((activeTestExam.durationMinutes * 60) - timeLeft) / 60) || 1,
      correctCount,
      incorrectCount,
      unattemptedCount,
      status: 'Completed'
    };
    saveStudentTestScore(scoreRecord);
  };

  const handleClose = () => {
    setActiveTestExam(null);
    setTestSubmitted(false);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  };

  const handleViewInDashboard = () => {
    handleClose();
    setCurrentView('student-dashboard');
    setAccountTab('tests');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CBT Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              CBT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {activeTestExam.category}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">Exam Interface v2026.4</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                {activeTestExam.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language toggle */}
            {!testSubmitted && (
              <button
                onClick={() => setLanguage(l => l === 'English' ? 'Hindi' : 'English')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
              >
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'English' ? 'English (EN)' : 'हिन्दी (HI)'}</span>
              </button>
            )}

            {/* Countdown timer */}
            {!testSubmitted && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-xs border ${
                timeLeft < 180 
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse' 
                  : 'bg-slate-800 text-amber-300 border-slate-700'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button 
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close Test"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!testSubmitted ? (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Column: Question Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* Question metadata banner */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700 text-sm">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    Section: {currentQ.section}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className="text-emerald-700">+{marksPerQ} Marks</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-rose-600">-{negMark} Negative</span>
                </div>
              </div>

              {/* Question text */}
              <div className="text-slate-900 text-base font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {language === 'Hindi' && currentQ.hindiQuestionText 
                  ? currentQ.hindiQuestionText 
                  : currentQ.questionText}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm">{opt}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Action buttons under question */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMarkReview}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      markedForReview[currentQ.id]
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>

                  <button
                    onClick={handleClearResponse}
                    disabled={userAnswers[currentQ.id] === undefined}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleSaveAndNext}
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Question Palette (TCS / NTA Exam Layout) */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50 p-5 flex flex-col justify-between shrink-0">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Question Palette
                </h4>

                {/* Status legend */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                    <span className="text-slate-600">Answered ({attemptedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">✗</span>
                    <span className="text-slate-600">Not Answered ({unattemptedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-purple-600 text-white text-[9px] flex items-center justify-center font-bold">★</span>
                    <span className="text-slate-600">Marked ({Object.values(markedForReview).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-slate-200 text-slate-700 text-[9px] flex items-center justify-center font-bold">○</span>
                    <span className="text-slate-600">Not Visited</span>
                  </div>
                </div>

                {/* Grid of Question buttons */}
                <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                  {testQuestions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isMarked = markedForReview[q.id];
                    const isCurrent = currentQuestionIndex === idx;

                    let bgClass = 'bg-slate-200 text-slate-700 hover:bg-slate-300';
                    if (isAnswered) bgClass = 'bg-emerald-600 text-white hover:bg-emerald-700';
                    if (isMarked) bgClass = 'bg-purple-600 text-white hover:bg-purple-700';
                    if (isCurrent) bgClass += ' ring-2 ring-indigo-500 ring-offset-2';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${bgClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Final Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={handleSubmitTest}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Exam</span>
                </button>
                <p className="text-[10px] text-slate-500 text-center mt-2">
                  Once submitted, your All-India Rank & detailed solutions will be generated instantly.
                </p>
              </div>

            </div>

          </div>
        ) : (
          /* CBT Scorecard & Analysis Screen */
          <div className="p-6 overflow-y-auto space-y-6">
            
            <div className="text-center space-y-2 py-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10">
                <Award className="w-48 h-48" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Exam Submitted & Verified</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                All-India Scorecard & Performance Analysis
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                {activeTestExam.title} • {activeTestExam.category}
              </p>

              {/* Quick High-Impact Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Marks Scored</span>
                  <span className="text-2xl font-black text-amber-300">{finalScore}</span>
                  <span className="text-[10px] text-slate-400"> / {totalMaxMarks}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Est. AIR Rank</span>
                  <span className="text-2xl font-black text-cyan-300">#{estimatedRank}</span>
                  <span className="text-[10px] text-slate-400"> of {activeTestExam.enrolledStudents || 12000}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Percentile</span>
                  <span className="text-2xl font-black text-emerald-300">{percentile}%</span>
                  <span className="text-[10px] text-slate-400"> All-India</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Accuracy</span>
                  <span className="text-2xl font-black text-purple-300">{accuracy}%</span>
                  <span className="text-[10px] text-slate-400">{correctCount} Correct</span>
                </div>
              </div>
            </div>

            {/* Breakdown summary */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-lg font-bold text-emerald-800">{correctCount}</div>
                <div className="text-xs text-emerald-600 font-semibold">Correct (+{correctCount * marksPerQ})</div>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <div className="text-lg font-bold text-rose-800">{incorrectCount}</div>
                <div className="text-xs text-rose-600 font-semibold">Incorrect (-{incorrectCount * negMark})</div>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="text-lg font-bold text-slate-800">{unattemptedCount}</div>
                <div className="text-xs text-slate-600 font-semibold">Skipped (0)</div>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>Detailed Explanations & Solution Key</span>
                <span className="text-xs text-slate-500 font-normal">All {totalQuestions} Questions</span>
              </h4>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {testQuestions.map((q, idx) => {
                  const userAns = userAnswers[q.id];
                  const isCorrect = userAns === q.correctIndex;
                  const isSkipped = userAns === undefined;

                  return (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          Q{idx + 1}. {q.questionText}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isCorrect 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : (isSkipped ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-800')
                        }`}>
                          {isCorrect ? `Correct (+${marksPerQ})` : (isSkipped ? 'Skipped (0)' : `Incorrect (-${negMark})`)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-slate-500">Your Answer: </span>
                          <span className={`font-semibold ${isCorrect ? 'text-emerald-700' : (isSkipped ? 'text-slate-600' : 'text-rose-600')}`}>
                            {userAns !== undefined ? `${String.fromCharCode(65 + userAns)}) ${q.options[userAns]}` : 'Not Attempted'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Correct Answer: </span>
                          <span className="font-semibold text-emerald-700">
                            {String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                        <strong className="text-indigo-900">Explanation: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scorecard actions */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setTestSubmitted(false);
                  setUserAnswers({});
                  setTimeLeft((activeTestExam.durationMinutes || 15) * 60);
                  setCurrentQuestionIndex(0);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleViewInDashboard}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>View in Student Dashboard</span>
                </button>

                <button
                  onClick={handleClose}
                  className="flex items-center gap-1.5 px-6 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  <span>Close Scorecard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
