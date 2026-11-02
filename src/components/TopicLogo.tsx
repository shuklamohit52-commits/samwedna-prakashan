import React, { useState } from 'react';
import { 
  Atom, 
  Landmark, 
  Scale, 
  Globe, 
  Shield, 
  Trophy, 
  BookOpen, 
  Sparkles,
  Zap
} from 'lucide-react';

export interface TopicLogoProps {
  imageUrl?: string;
  category?: string;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TopicLogo: React.FC<TopicLogoProps> = ({
  imageUrl,
  category = '',
  title = '',
  size = 'md',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  // Dimension sizes
  const sizeMap = {
    xs: 'w-10 h-10 min-w-10 min-h-10 text-[10px]',
    sm: 'w-12 h-12 min-w-12 min-h-12 text-xs',
    md: 'w-16 h-16 min-w-16 min-h-16 text-sm',
    lg: 'w-20 h-20 min-w-20 min-h-20 text-base',
    xl: 'w-24 h-24 min-w-24 min-h-24 text-lg'
  };

  const catLower = category.toLowerCase();
  const titleLower = title.toLowerCase();

  // If valid image URL provided and no load error, render HD framed image
  if (imageUrl && !imgError) {
    return (
      <div 
        className={`relative ${sizeMap[size]} p-[1.5px] rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-rose-400 shadow-xs shrink-0 group ${className}`}
      >
        <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900 relative">
          <img
            src={imageUrl}
            alt={title || category || 'Topic'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          
          {/* Subtle topic category badge in corner */}
          <div className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-slate-950/80 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white pointer-events-none shadow-xs">
            {catLower.includes('sci') || catLower.includes('tech') ? (
              <Atom className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-300" />
            ) : catLower.includes('eco') || catLower.includes('bank') ? (
              <Landmark className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
            ) : catLower.includes('polity') || catLower.includes('law') ? (
              <Scale className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-300" />
            ) : catLower.includes('env') || catLower.includes('eco') ? (
              <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
            ) : catLower.includes('defence') || catLower.includes('sec') ? (
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-300" />
            ) : (
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback high-tech vector emblem based on topic category
  // 1. Science, Space & Technology
  if (catLower.includes('sci') || catLower.includes('tech') || titleLower.includes('isro') || titleLower.includes('matsya')) {
    return (
      <div className={`relative ${sizeMap[size]} p-[1.5px] rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 shadow-xs shrink-0 ${className}`}>
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 flex flex-col items-center justify-center text-white relative overflow-hidden p-1">
          <div className="absolute inset-0 bg-radial from-cyan-500/20 to-transparent pointer-events-none" />
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="38" fill="#082f49" />
            {/* Orbital Rings */}
            <ellipse cx="50" cy="50" rx="32" ry="12" stroke="#06b6d4" strokeWidth="2" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="32" ry="12" stroke="#60a5fa" strokeWidth="2" transform="rotate(-30 50 50)" />
            {/* Core Nucleus / Rocket */}
            <circle cx="50" cy="50" r="9" fill="#38bdf8" />
            <circle cx="50" cy="50" r="5" fill="#ffffff" />
            <text x="50" y="80" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="900" letterSpacing="0.5">SCI-TECH</text>
          </svg>
        </div>
      </div>
    );
  }

  // 2. Economy & Banking / RBI
  if (catLower.includes('eco') || catLower.includes('bank') || titleLower.includes('rbi') || titleLower.includes('uli')) {
    return (
      <div className={`relative ${sizeMap[size]} p-[1.5px] rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-500 to-teal-600 shadow-xs shrink-0 ${className}`}>
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-slate-950 via-emerald-950 to-amber-950 flex flex-col items-center justify-center text-white relative overflow-hidden p-1">
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#fbbf24" strokeWidth="3" />
            <circle cx="50" cy="50" r="39" fill="#064e3b" />
            {/* Rupee / Banking Pillars */}
            <path d="M35 32 L65 32 M35 42 L60 42 M35 32 L35 52 C45 52 52 50 54 44 C56 38 48 32 40 32 M44 52 L62 72" stroke="#fde047" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="50" y="85" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="900" letterSpacing="0.5">FINANCE</text>
          </svg>
        </div>
      </div>
    );
  }

  // 3. Polity & Constitution / Law / Supreme Court
  if (catLower.includes('polity') || catLower.includes('const') || catLower.includes('law') || titleLower.includes('supreme court')) {
    return (
      <div className={`relative ${sizeMap[size]} p-[1.5px] rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 shadow-xs shrink-0 ${className}`}>
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-white relative overflow-hidden p-1">
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#818cf8" strokeWidth="3" />
            <circle cx="50" cy="50" r="39" fill="#1e1b4b" />
            {/* Scales of Justice */}
            <path d="M50 24 L50 64 M32 32 L68 32" stroke="#c7d2fe" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M32 32 L22 48 L42 48 Z" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1.5" />
            <path d="M68 32 L58 48 L78 48 Z" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1.5" />
            <path d="M40 64 L60 64" stroke="#c7d2fe" strokeWidth="4" strokeLinecap="round" />
            <text x="50" y="80" textAnchor="middle" fill="#c7d2fe" fontSize="9" fontWeight="900" letterSpacing="0.5">POLITY</text>
          </svg>
        </div>
      </div>
    );
  }

  // 4. Environment & Ecology / Climate
  if (catLower.includes('env') || catLower.includes('eco') || catLower.includes('climate')) {
    return (
      <div className={`relative ${sizeMap[size]} p-[1.5px] rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-green-600 shadow-xs shrink-0 ${className}`}>
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 flex flex-col items-center justify-center text-white relative overflow-hidden p-1">
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#34d399" strokeWidth="3" />
            <circle cx="50" cy="50" r="39" fill="#064e3b" />
            {/* Sprouting leaf with globe grid */}
            <circle cx="50" cy="46" r="18" stroke="#6ee7b7" strokeWidth="2" strokeDasharray="3 2" />
            <path d="M50 28 C38 34 38 52 50 64 C62 52 62 34 50 28 Z" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
            <path d="M50 34 L50 60" stroke="#ecfdf5" strokeWidth="2" strokeLinecap="round" />
            <text x="50" y="82" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="900" letterSpacing="0.5">ECOLOGY</text>
          </svg>
        </div>
      </div>
    );
  }

  // 5. Defence & Security
  if (catLower.includes('def') || catLower.includes('army') || catLower.includes('navy') || catLower.includes('air')) {
    return (
      <div className={`relative ${sizeMap[size]} p-[1.5px] rounded-2xl bg-gradient-to-tr from-red-500 via-amber-500 to-rose-600 shadow-xs shrink-0 ${className}`}>
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-slate-950 via-neutral-900 to-red-950 flex flex-col items-center justify-center text-white relative overflow-hidden p-1">
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#f87171" strokeWidth="3" />
            <circle cx="50" cy="50" r="39" fill="#450a0a" />
            {/* Shield & Star */}
            <path d="M50 24 L68 32 C68 50 50 64 50 64 C50 64 32 50 32 32 Z" fill="#991b1b" stroke="#fca5a5" strokeWidth="2" />
            <polygon points="50,34 53,42 62,42 55,47 57,56 50,51 43,56 45,47 38,42 47,42" fill="#fbbf24" />
            <text x="50" y="80" textAnchor="middle" fill="#fecaca" fontSize="9" fontWeight="900" letterSpacing="0.5">DEFENCE</text>
          </svg>
        </div>
      </div>
    );
  }

  // 6. National & Governance / All India
  if (catLower.includes('nat') || catLower.includes('gov') || catLower.includes('india')) {
    return (
      <div className={`relative ${sizeMap[size]} p-[1.5px] rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-400 to-emerald-500 shadow-xs shrink-0 ${className}`}>
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center text-white relative overflow-hidden p-1">
          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="50" cy="50" r="39" fill="#0f172a" />
            {/* Ashoka Chakra */}
            <circle cx="50" cy="46" r="16" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="50" cy="46" r="4" fill="#38bdf8" />
            {/* Spokes */}
            <path d="M50 30 L50 62 M34 46 L66 46 M39 35 L61 57 M39 57 L61 35" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="50" y="80" textAnchor="middle" fill="#fdba74" fontSize="9" fontWeight="900" letterSpacing="0.5">NATIONAL</text>
          </svg>
        </div>
      </div>
    );
  }

  // 7. General Default Emblem
  return (
    <div className={`relative ${sizeMap[size]} p-[1.5px] rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-purple-500 shadow-xs shrink-0 ${className}`}>
      <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-white relative overflow-hidden p-2">
        <Zap className="w-6 h-6 text-yellow-400 mb-0.5 animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-wider text-indigo-200">DAILY CA</span>
      </div>
    </div>
  );
};
