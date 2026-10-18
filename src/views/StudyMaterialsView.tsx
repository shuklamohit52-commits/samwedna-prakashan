import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Download, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Compass, 
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { StudyMaterialItem } from '../types';

export const StudyMaterialsView: React.FC = () => {
  const { studyMaterials, setReadingPdf, showToast } = useApp();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [search, setSearch] = useState('');

  const types = ['All', 'Mindmap', 'Formula Sheet', 'Handwritten Notes', 'Syllabus Breakdown'];

  const filteredMaterials = studyMaterials.filter(item => {
    const matchType = selectedType === 'All' || item.type === selectedType;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        item.subject.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleDownload = (title: string, url: string) => {
    showToast(`Downloading "${title}" study material...`, 'success');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Learning Blueprints & High-Yield Charts</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Study Materials & Concept Mindmaps
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Consolidated subject roadmaps, handwritten topper notes, formula cheat sheets, and visual flowcharts engineered to maximize study efficiency and question recall.
          </p>
        </div>
      </div>

      {/* Type Filter & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mindmaps, formulas..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
          />
        </div>
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMaterials.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                  {item.type}
                </span>

                {item.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                    ★ {item.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-indigo-600 font-semibold mt-1">
                  {item.subject} • {item.category}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {/* Highlights */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Key Features</span>
                {item.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-emerald-700 font-mono">₹0 FREE</span>
                  <span className="text-xs line-through text-slate-400 font-bold">₹299</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                    0 Fees Launch Offer
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  {item.pages} Pages • {item.fileSize} • Standard fee ₹299 applies later
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReadingPdf({ title: item.title, url: item.downloadUrl, pages: item.pages })}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleDownload(item.title, item.downloadUrl)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Free</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
