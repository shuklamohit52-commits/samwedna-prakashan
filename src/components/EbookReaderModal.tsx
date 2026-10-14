import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ChevronLeft, ChevronRight, BookOpen, Bookmark, ZoomIn, ZoomOut, Download, FileText } from 'lucide-react';

export const EbookReaderModal: React.FC = () => {
  const { readingEbook, setReadingEbook, readingPdf, setReadingPdf, showToast } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [bookmarked, setBookmarked] = useState(false);

  const activeDoc = readingEbook ? {
    title: readingEbook.title,
    author: readingEbook.author,
    totalPages: readingEbook.totalPages,
    isPdf: false
  } : (readingPdf ? {
    title: readingPdf.title,
    author: 'Samvedna Research Team',
    totalPages: readingPdf.pages,
    isPdf: true
  } : null);

  if (!activeDoc) return null;

  const handleClose = () => {
    setReadingEbook(null);
    setReadingPdf(null);
    setCurrentPage(1);
  };

  const handleToggleBookmark = () => {
    setBookmarked(!bookmarked);
    showToast(bookmarked ? 'Bookmark removed' : `Page ${currentPage} bookmarked!`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-300 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Reader Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              {activeDoc.isPdf ? <FileText className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display truncate max-w-sm sm:max-w-md">
                {activeDoc.title}
              </h3>
              <p className="text-[11px] text-slate-400">By {activeDoc.author} · Digital Reader</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFontSize(f => f === 'normal' ? 'large' : 'normal')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Toggle Font Size"
            >
              {fontSize === 'normal' ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                bookmarked ? 'text-amber-400 bg-amber-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Bookmark Page"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-300 font-mono hidden sm:inline">
              Page {currentPage} of {activeDoc.totalPages}
            </span>

            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Content Page Viewport */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 bg-amber-50/20 max-w-3xl mx-auto w-full">
          <div className="bg-white p-8 sm:p-12 rounded-xl shadow-xs border border-slate-200/80 min-h-full space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs text-slate-400 font-mono">
              <span>SAMVEDNA INSTITUTE · REVISION EDITION</span>
              <span>SECTION II: HIGH YIELD CAPSULE</span>
            </div>

            <div className={`space-y-4 text-slate-800 leading-relaxed font-serif ${fontSize === 'large' ? 'text-lg' : 'text-sm'}`}>
              <h2 className="text-xl font-bold text-slate-900 font-display not-italic">
                Chapter {currentPage}: Conceptual Syntheses & Exam Shortcuts
              </h2>

              <p>
                In competitive examinations conducted by the Staff Selection Commission, State Public Service Commissions, and Railway Recruitment Boards, time optimization accounts for more than 40% of the final merit variance. 
              </p>

              <div className="p-4 bg-slate-50 border-l-2 border-indigo-600 rounded-r-lg font-sans text-xs space-y-1.5 not-italic">
                <p className="font-bold text-indigo-950">Quick Reference Exam Point 2.4:</p>
                <p className="text-slate-700">
                  When analyzing constitutional provisions, always remember that Article 32 is enforceable exclusively in the Supreme Court, while Article 226 has a wider jurisdiction extending to legal rights in High Courts.
                </p>
              </div>

              <p>
                Candidates must never calculate multi-variable formulas iteratively when standard shortcuts are available. Always review the detailed solutions provided in the Samvedna Institute CBT mock tests.
              </p>

              <h4 className="font-bold text-slate-900 font-sans not-italic text-sm pt-2">
                Sample Practice Exercise:
              </h4>

              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 font-sans text-xs space-y-2 not-italic">
                <p className="font-semibold text-slate-900">
                  Q. Which schedule of the Indian Constitution contains the languages recognized by the Constitution?
                </p>
                <p className="text-slate-600">
                  Solution: The <strong>Eighth Schedule</strong> contains 22 recognized official languages. Originally 14 were included; subsequent amendments added Sindhi (21st Amendment), Konkani, Manipuri, Nepali (71st), and Bodo, Dogri, Maithili, Santhali (92nd).
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="truncate max-w-xs">{activeDoc.title}</span>
              <span>Page {currentPage}</span>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-slate-200 shrink-0">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          <span className="text-xs font-semibold text-slate-700">
            Page {currentPage} of {activeDoc.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(activeDoc.totalPages, p + 1))}
            disabled={currentPage >= activeDoc.totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
