import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Download, 
  BookOpen, 
  Search, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Eye, 
  Layers,
  ArrowRight,
  TrendingUp,
  Languages,
  ShieldCheck,
  Award
} from 'lucide-react';

export const FreePdfsView: React.FC = () => {
  const { freePdfs, user, bookmarkPdf, setReadingPdf, showToast, appLanguage, setAppLanguage } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Teaching & UGC NET', 'UPSC & Civil Services', 'All SSC Exam', 'All Railway Exam', 'All Bank Exam', 'All State Exam'];

  const filteredPdfs = freePdfs.filter(pdf => {
    const q = search.toLowerCase();
    const matchSearch = pdf.title.toLowerCase().includes(q) || 
                        (pdf.hindiTitle && pdf.hindiTitle.toLowerCase().includes(q)) ||
                        pdf.subject.toLowerCase().includes(q) ||
                        (pdf.hindiSubject && pdf.hindiSubject.toLowerCase().includes(q));
    const matchCat = selectedCategory === 'All' || pdf.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleDownload = (pdfTitle: string, url: string) => {
    showToast(`Downloading "${pdfTitle}"...`, 'success');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pdfTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isHindiPreferred = appLanguage === 'HI';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Free Public Student Resource Bank • Verified Content</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Free PDFs &amp; E-Books Repository
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            High-yield revision capsules, NCERT summaries, Hindi literature key notes, speed arithmetic charts, and constitutional articles. Free to read online or download directly in Hindi and English.
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
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
        
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

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PDF notes, subjects..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
          />
        </div>

      </div>

      {/* PDF Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPdfs.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            No PDF resources found for your query.
          </div>
        ) : (
          filteredPdfs.map((pdf) => {
            const isSaved = user?.bookmarkedPdfs?.includes(pdf.id);
            const primaryTitle = isHindiPreferred && pdf.hindiTitle ? pdf.hindiTitle : pdf.title;
            const secondaryTitle = isHindiPreferred && pdf.hindiTitle ? pdf.title : pdf.hindiTitle;
            const primarySubject = isHindiPreferred && pdf.hindiSubject ? pdf.hindiSubject : pdf.subject;
            const primaryDesc = isHindiPreferred && pdf.hindiDescription ? pdf.hindiDescription : pdf.description;

            return (
              <div 
                key={pdf.id}
                className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-indigo-500/80 shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Language Tag Badge */}
                <div className="absolute top-0 right-0">
                  <span className="inline-block bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs">
                    {pdf.language || 'PDF DOCUMENT'}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Category & Bookmark */}
                  <div className="flex items-center justify-between pr-24">
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-black border border-indigo-200 uppercase tracking-wider">
                      {pdf.category}
                    </span>

                    <button
                      onClick={() => bookmarkPdf(pdf.id)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Bookmarked' : 'Bookmark to Dashboard'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
                    </button>
                  </div>

                  {/* Header: Authentic Official Document Visual */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-rose-600 to-red-700 flex flex-col items-center justify-center text-white shrink-0 shadow-md border border-rose-800 relative">
                      <span className="text-[9px] font-black tracking-widest uppercase bg-white/20 w-full text-center py-0.5 rounded-t-lg">PDF</span>
                      <FileText className="w-5 h-5 my-auto" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h3 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {primaryTitle}
                      </h3>
                      {secondaryTitle && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-1">{secondaryTitle}</p>
                      )}
                      <p className="text-xs font-bold text-indigo-700 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <span>{primarySubject}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {primaryDesc}
                  </p>

                  {/* Specs & Scholarship Offer */}
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-emerald-700 font-mono text-sm">₹0 FREE</span>
                      <span className="line-through text-slate-400 font-semibold text-[11px] font-mono">₹199</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-md">
                        100% Free Pass
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px] font-medium font-mono">
                      {pdf.pages} Pages • {pdf.fileSize}
                    </span>
                  </div>
                </div>

                {/* Card Dual Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setReadingPdf({ title: primaryTitle, url: pdf.downloadUrl, pages: pdf.pages })}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-indigo-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Read Online / पढ़ें</span>
                  </button>

                  <button
                    onClick={() => handleDownload(primaryTitle, pdf.downloadUrl)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Download Free PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
