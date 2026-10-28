import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Bookmark, 
  Check, 
  Share2, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Languages,
  Eye,
  FileText
} from 'lucide-react';
import { CurrentAffairArticle } from '../types';

export const DailyCurrentAffairsView: React.FC = () => {
  const { currentAffairs, user, bookmarkCurrentAffair, showToast, appLanguage, setAppLanguage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  
  // Selected article for complete view (on clicking title or thumbnail)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const categories = ['All', 'Polity & Constitution', 'Economy & Banking', 'Science & Technology', 'Environment', 'National', 'International Relations'];
  
  // Unique dates from current affairs
  const availableDates = Array.from(new Set(currentAffairs.map(a => a.date)));

  const filteredArticles = currentAffairs.filter(article => {
    const matchCat = selectedCategory === 'All' || article.category === selectedCategory;
    const matchDate = selectedDate === 'All' || article.date === selectedDate;
    return matchCat && matchDate;
  });

  const activeArticle = selectedArticleId 
    ? currentAffairs.find(a => a.id === selectedArticleId) || null 
    : null;

  const handleSelectMcq = (articleId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [articleId]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [articleId]: true }));
  };

  const openArticleDetail = (articleId: string) => {
    setSelectedArticleId(articleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to determine display text based on language preference
  const isHindiPreferred = appLanguage === 'HI';
  const isBilingual = appLanguage === 'BILINGUAL';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Samwedna Institute Daily Exam Capsule 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Daily Current Affairs &amp; Analysis
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Curated daily for UPSC Civil Services, UPPSC, SSC CGL, Banking, and Teaching examinations. Click any article to view complete editorial banner, HTML-formatted notes, and practice MCQs in Hindi &amp; English.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Medium Selector */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/20 text-xs font-bold">
              <span className="px-2 text-slate-300 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span>Medium:</span>
              </span>
              <button
                type="button"
                onClick={() => setAppLanguage('BILINGUAL')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'BILINGUAL' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                द्विभाषी / Bilingual
              </button>
              <button
                type="button"
                onClick={() => setAppLanguage('HI')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'HI' ? 'bg-amber-400 text-slate-950 font-black shadow-2xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setAppLanguage('EN')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  appLanguage === 'EN' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={() => {
                showToast('Today’s complete Current Affairs PDF downloaded!', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Today&apos;s PDF Digest</span>
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED ARTICLE VIEW (When an article is clicked) */}
      {activeArticle ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Back Button & Navigation Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <button
              onClick={() => setSelectedArticleId(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Current Affairs List</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                {activeArticle.date} • {activeArticle.readTime}
              </span>

              {/* Bookmark Button */}
              <button
                onClick={() => bookmarkCurrentAffair(activeArticle.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  user?.savedCurrentAffairs?.includes(activeArticle.id)
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${user?.savedCurrentAffairs?.includes(activeArticle.id) ? 'fill-amber-600 text-amber-600' : ''}`} />
                <span>{user?.savedCurrentAffairs?.includes(activeArticle.id) ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Complete Article Card */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
            
            {/* Meta Category & Date */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                {activeArticle.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                {activeArticle.date}
              </span>
              {activeArticle.tags?.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Complete Large High-Resolution Banner Image */}
            {(activeArticle.imageUrl || activeArticle.bannerImage) && (
              <div className="relative w-full h-64 sm:h-96 md:h-[440px] rounded-2xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200">
                <img 
                  src={activeArticle.imageUrl || activeArticle.bannerImage} 
                  alt={activeArticle.title}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white text-xs">
                  <span className="font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-xs">
                    Editorial Analysis: {activeArticle.category}
                  </span>
                  <span className="text-xs text-slate-200 font-medium">
                    Samwedna Institute Research Desk
                  </span>
                </div>
              </div>
            )}

            {/* Complete Title (Bilingual) */}
            <div className="space-y-2">
              {(isHindiPreferred || isBilingual) && activeArticle.hindiTitle ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display leading-snug">
                    {activeArticle.hindiTitle}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 font-medium">{activeArticle.title}</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display leading-snug">
                    {activeArticle.title}
                  </h2>
                  {activeArticle.hindiTitle && (
                    <p className="text-sm sm:text-base text-slate-500 font-medium">{activeArticle.hindiTitle}</p>
                  )}
                </>
              )}
            </div>

            {/* Summary Box */}
            <div className="space-y-3">
              {(isHindiPreferred || isBilingual) && activeArticle.hindiSummary && (
                <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-200 text-sm sm:text-base text-amber-950 leading-relaxed font-medium">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    हिन्दी सारांश (Key Summary)
                  </span>
                  <p>{activeArticle.hindiSummary}</p>
                </div>
              )}

              {(!isHindiPreferred || isBilingual || !activeArticle.hindiSummary) && (
                <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                    Executive Summary (English)
                  </span>
                  <p>{activeArticle.summary}</p>
                </div>
              )}
            </div>

            {/* FULL IN-DEPTH EDITORIAL CONTENT WITH HTML SUPPORT */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>In-Depth Editorial Analysis &amp; Policy Perspective</span>
              </h3>

              {/* Hindi Full Content */}
              {(isHindiPreferred || isBilingual) && activeArticle.hindiFullContent && (
                <div className="bg-amber-50/30 p-6 sm:p-8 rounded-2xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    सम्पूर्ण विश्लेषण (हिन्दी माध्यम)
                  </span>
                  <div 
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: activeArticle.hindiFullContent }}
                  />
                </div>
              )}

              {/* English Full Content */}
              {(!isHindiPreferred || isBilingual || !activeArticle.hindiFullContent) && (
                <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-2">
                  {isBilingual && (
                    <span className="text-xs font-bold text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                      Comprehensive Editorial (English Medium)
                    </span>
                  )}
                  <div 
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: activeArticle.fullContent || activeArticle.summary }}
                  />
                </div>
              )}
            </div>

            {/* Key Takeaways / Exam Points (Bilingual) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Complete Exam Takeaways &amp; Facts</span>
              </h3>

              {/* Hindi Key Points */}
              {(isHindiPreferred || isBilingual) && activeArticle.hindiKeyPoints && activeArticle.hindiKeyPoints.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-900">मुख्य परीक्षा बिंदु (हिन्दी):</span>
                  <ul className="space-y-2.5">
                    {activeArticle.hindiKeyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-800 leading-relaxed bg-amber-50/40 p-3.5 rounded-xl border border-amber-200">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* English Key Points */}
              {(!isHindiPreferred || isBilingual || !activeArticle.hindiKeyPoints) && (
                <div className="space-y-2">
                  {isBilingual && <span className="text-xs font-bold text-indigo-900">Key Facts &amp; Data Points (English):</span>}
                  <ul className="space-y-2.5">
                    {activeArticle.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Practice Retention MCQ (Bilingual) */}
            {activeArticle.relatedMcq && (
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50/40 border border-indigo-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Practice MCQ for Today&apos;s Topic (Bilingual)</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    Exam Standard
                  </span>
                </div>

                {/* MCQ Question text */}
                <div className="space-y-1">
                  {(isHindiPreferred || isBilingual) && activeArticle.relatedMcq.hindiQuestion && (
                    <p className="text-sm font-bold text-slate-900">
                      {activeArticle.relatedMcq.hindiQuestion}
                    </p>
                  )}
                  {(!isHindiPreferred || isBilingual || !activeArticle.relatedMcq.hindiQuestion) && (
                    <p className={`text-sm text-slate-900 ${isBilingual ? 'text-slate-600' : 'font-bold'}`}>
                      {activeArticle.relatedMcq.question}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeArticle.relatedMcq.options.map((opt, optIdx) => {
                    const hindiOpt = activeArticle.relatedMcq?.hindiOptions?.[optIdx];
                    const isChosen = selectedAnswers[activeArticle.id] === optIdx;
                    const isCorrect = optIdx === activeArticle.relatedMcq?.correctIndex;
                    const showExp = showExplanation[activeArticle.id];

                    let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700';
                    if (showExp) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isChosen) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 font-bold';
                      }
                    } else if (isChosen) {
                      btnStyle = 'bg-indigo-100 border-indigo-500 text-indigo-900 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectMcq(activeArticle.id, optIdx)}
                        className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="flex-1 space-y-0.5">
                          {(isHindiPreferred || isBilingual) && hindiOpt ? (
                            <>
                              <span className="block font-semibold">{hindiOpt}</span>
                              {isBilingual && <span className="block text-[11px] text-slate-500">{opt}</span>}
                            </>
                          ) : (
                            <span>{opt}</span>
                          )}
                        </div>
                        {showExp && isCorrect && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {showExplanation[activeArticle.id] && (
                  <div className="p-4 bg-white rounded-xl border border-indigo-200 text-xs sm:text-sm text-slate-700 space-y-2">
                    <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Detailed Solution &amp; Analysis:</span>
                    </div>
                    {activeArticle.relatedMcq?.hindiExplanation && (
                      <p className="leading-relaxed font-medium text-amber-950 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                        {activeArticle.relatedMcq.hindiExplanation}
                      </p>
                    )}
                    {activeArticle.relatedMcq?.explanation && (
                      <p className="leading-relaxed">{activeArticle.relatedMcq.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <button
                onClick={() => setSelectedArticleId(null)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Current Affairs Stream</span>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: activeArticle.title,
                      text: activeArticle.summary,
                      url: window.location.href
                    }).catch(() => {});
                  } else {
                    showToast('Article link copied to clipboard!', 'info');
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Article</span>
              </button>
            </div>

          </article>
        </div>
      ) : (
        /* LIST OF ARTICLES (Image icon, ONLY Title and Date) */
        <div className="space-y-6">
          
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

          <div className="space-y-3">
            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-sm text-slate-500">No articles found matching the selected category and date.</p>
              </div>
            ) : (
              filteredArticles.map((article) => {
                return (
                  <div 
                    key={article.id}
                    onClick={() => openArticleDetail(article.id)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all p-4 sm:p-5 flex items-center justify-between gap-4 group cursor-pointer"
                  >
                    {/* Left: Image Icon Thumbnail */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        {article.imageUrl || article.bannerImage ? (
                          <img 
                            src={article.imageUrl || article.bannerImage} 
                            alt={article.title}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-indigo-700 to-cyan-600 flex items-center justify-center text-white">
                            <FileText className="w-7 h-7" />
                          </div>
                        )}
                      </div>

                      {/* Center: ONLY Title & Date */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                            {article.category}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            {article.date}
                          </span>
                        </div>

                        {/* Title - clickable */}
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                          {isHindiPreferred && article.hindiTitle ? article.hindiTitle : article.title}
                        </h3>
                      </div>
                    </div>

                    {/* Right Action: Click to open full banner */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                        <span>Open Banner &amp; Read</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
};
