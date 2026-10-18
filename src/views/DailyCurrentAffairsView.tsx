import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Bookmark, 
  Check, 
  HelpCircle, 
  Share2, 
  Download, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  ChevronRight, 
  Languages,
  BookOpen,
  ArrowRight,
  Flame
} from 'lucide-react';
import { CurrentAffairArticle } from '../types';

export const DailyCurrentAffairsView: React.FC = () => {
  const { currentAffairs, user, bookmarkCurrentAffair, showToast, setReadingPdf } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('All');
  const [activeLanguage, setActiveLanguage] = useState<'EN' | 'HI'>('HI');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Polity & Constitution', 'Economy & Banking', 'Science & Technology', 'Environment', 'National'];
  
  // Unique dates from current affairs
  const availableDates = Array.from(new Set(currentAffairs.map(a => a.date)));

  const filteredArticles = currentAffairs.filter(article => {
    const matchCat = selectedCategory === 'All' || article.category === selectedCategory;
    const matchDate = selectedDate === 'All' || article.date === selectedDate;
    return matchCat && matchDate;
  });

  const handleSelectMcq = (articleId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [articleId]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [articleId]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Samwedna Institute Daily Exam Capsule 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Daily Current Affairs & Analysis
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Curated daily for UPSC Civil Services, UPPSC, SSC CGL, Banking, and Teaching examinations. High-yield points, bilingual summaries, and instant retention MCQs.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveLanguage(l => l === 'EN' ? 'HI' : 'EN')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>Display Language: {activeLanguage === 'HI' ? 'हिन्दी (Hindi)' : 'English'}</span>
            </button>

            <button
              onClick={() => {
                showToast('Today’s complete 14 October 2026 Current Affairs PDF downloaded!', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Today&apos;s PDF Digest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date & Category Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-600">Archive:</span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Recent Dates</option>
            {availableDates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Articles Stream */}
      <div className="space-y-8">
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No articles found matching the selected category and date.</p>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isBookmarked = user?.savedCurrentAffairs?.includes(article.id);
            const userAns = selectedAnswers[article.id];
            const showExp = showExplanation[article.id];

            return (
              <article 
                key={article.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 sm:p-8 space-y-6"
              >
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{article.readTime}</span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => bookmarkCurrentAffair(article.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title={isBookmarked ? 'Saved to Student Dashboard' : 'Save for Revision'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span>{isBookmarked ? 'Saved to Dashboard' : 'Save Article'}</span>
                  </button>
                </div>

                {/* Topic Image Banner */}
                {(article.imageUrl || article.bannerImage) && (
                  <div className="relative w-full h-48 sm:h-60 rounded-2xl overflow-hidden bg-slate-900 group shadow-sm border border-slate-100">
                    <img 
                      src={article.imageUrl || article.bannerImage} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-[11px]">
                        Topic Digest: {article.category}
                      </span>
                      <span className="text-[11px] text-slate-200 font-medium">
                        Samwedna Institute Editorial Analysis
                      </span>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display leading-snug">
                    {activeLanguage === 'HI' && article.hindiTitle ? article.hindiTitle : article.title}
                  </h2>
                  {activeLanguage === 'HI' && (
                    <p className="text-xs text-slate-400 mt-1 italic">{article.title}</p>
                  )}
                </div>

                {/* Summary Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p className="font-medium">
                    {activeLanguage === 'HI' && article.hindiSummary ? article.hindiSummary : article.summary}
                  </p>
                </div>

                {/* Key Points / Exam Takeaways */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Key Takeaways for Competitive Exams</span>
                  </h3>
                  <ul className="space-y-2">
                    {article.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Full Context */}
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                  <p>{article.fullContent}</p>
                </div>

                {/* Attached Instant MCQ Retention Test */}
                {article.relatedMcq && (
                  <div className="mt-6 pt-6 border-t border-slate-100 bg-gradient-to-br from-indigo-50/60 to-slate-50 p-5 rounded-2xl border border-indigo-100 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      <span>Instant Exam MCQ Retention Check</span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      {article.relatedMcq.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {article.relatedMcq.options.map((opt, optIdx) => {
                        const isChosen = userAns === optIdx;
                        const isCorrect = optIdx === article.relatedMcq?.correctIndex;
                        let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';

                        if (showExp) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 font-bold';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-indigo-100 border-indigo-500 text-indigo-900 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectMcq(article.id, optIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {showExp && isCorrect && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {showExp && (
                      <div className="p-3.5 bg-white rounded-xl border border-indigo-200 text-xs text-slate-700 space-y-1">
                        <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Detailed Solution & Analysis:</span>
                        </div>
                        <p className="leading-relaxed">{article.relatedMcq.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {article.tags.map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: article.title,
                          text: article.summary,
                          url: window.location.href
                        }).catch(() => {});
                      } else {
                        showToast('Article link copied to clipboard!', 'info');
                      }
                    }}
                    className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-semibold cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

              </article>
            );
          })
        )}
      </div>

    </div>
  );
};
