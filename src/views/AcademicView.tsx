import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowRight, BookOpen, Award, FileText } from 'lucide-react';

export const AcademicView: React.FC = () => {
  const { setCurrentView, setPortalMode } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 font-display">
        Samwedna Complete Student Preparation
      </h1>
      <p className="text-sm text-slate-600 max-w-lg mx-auto">
        We have transitioned our resources into free digital study materials, daily current affairs digests, and CBT mock test series.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => {
            setPortalMode('institute');
            setCurrentView('current-affairs');
          }}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Daily Current Affairs</span>
        </button>

        <button
          onClick={() => {
            setPortalMode('institute');
            setCurrentView('test-series');
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>CBT Test Series</span>
        </button>
      </div>
    </div>
  );
};
