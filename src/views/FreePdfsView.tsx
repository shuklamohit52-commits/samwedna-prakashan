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
  TrendingUp
} from 'lucide-react';

export const FreePdfsView: React.FC = () => {
  const { freePdfs, user, bookmarkPdf, setReadingPdf, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Teaching & UGC NET', 'UPSC & Civil Services', 'All SSC Exam', 'All Railway Exam', 'All Bank Exam'];

  const filteredPdfs = freePdfs.filter(pdf => {
    const matchSearch = pdf.title.toLowerCase().includes(search.toLowerCase()) || 
                        pdf.subject.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Free Public Student Resource Bank</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Free PDFs & E-Books Repository
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            High-yield revision capsules, NCERT summaries, Hindi literature key notes, speed arithmetic charts, and constitutional articles. Free to read online or download.
          </p>
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

            return (
              <div 
                key={pdf.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                      {pdf.category}
                    </span>

                    <button
                      onClick={() => bookmarkPdf(pdf.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Bookmarked' : 'Bookmark to Dashboard'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {pdf.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{pdf.subject}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {pdf.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>{pdf.pages} Pages • {pdf.fileSize}</span>
                    <span className="text-emerald-700 font-semibold">{pdf.downloadsCount.toLocaleString()} Downloads</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setReadingPdf({ title: pdf.title, url: pdf.downloadUrl, pages: pdf.pages })}
                    className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Online</span>
                  </button>

                  <button
                    onClick={() => handleDownload(pdf.title, pdf.downloadUrl)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Download Free PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
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
