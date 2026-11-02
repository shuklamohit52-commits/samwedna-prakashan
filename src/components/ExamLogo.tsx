import React from 'react';

interface ExamLogoProps {
  examId?: string;
  category?: string;
  customLogoUrl?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ExamLogo: React.FC<ExamLogoProps> = ({
  examId = '',
  category = '',
  customLogoUrl,
  logoUrl,
  size = 'md',
  className = ''
}) => {
  const effectiveLogoUrl = logoUrl || customLogoUrl;
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-13 h-13 text-sm',
    xl: 'w-16 h-16 text-base'
  };

  if (effectiveLogoUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden bg-white p-1 border border-slate-200/80 shadow-xs shrink-0 flex items-center justify-center ${className}`}>
        <img src={effectiveLogoUrl} alt="Exam Logo" className="w-full h-full object-contain" />
      </div>
    );
  }

  const id = examId.toLowerCase();
  const cat = category.toLowerCase();

  // 1. Staff Selection Commission (SSC)
  if (id.includes('ssc') || cat.includes('ssc')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-950 text-white p-1 shadow-md shadow-blue-500/20 border border-blue-400/40 shrink-0 flex flex-col items-center justify-center relative overflow-hidden group ${className}`}>
        <div className="absolute inset-0 bg-blue-400/10 backdrop-blur-xs"></div>
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
          <circle cx="50" cy="50" r="46" stroke="#fbbf24" strokeWidth="4" />
          <circle cx="50" cy="50" r="40" fill="#1e3a8a" />
          {/* Ashoka Chakra & Star */}
          <path d="M50 16 L53 26 L64 26 L55 33 L58 44 L50 37 L42 44 L45 33 L36 26 L47 26 Z" fill="#fbbf24" />
          <text x="50" y="66" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="900" fontFamily="sans-serif">SSC</text>
          <text x="50" y="78" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="700" letterSpacing="1">GOVT OF INDIA</text>
        </svg>
      </div>
    );
  }

  // 2. Indian Railways & RRB
  if (id.includes('rrb') || id.includes('railway') || cat.includes('railway')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-red-600 via-rose-700 to-red-950 text-white p-1 shadow-md shadow-red-500/20 border border-red-400/40 shrink-0 flex flex-col items-center justify-center relative overflow-hidden ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
          <circle cx="50" cy="50" r="46" stroke="#fbbf24" strokeWidth="4" />
          <circle cx="50" cy="50" r="40" fill="#991b1b" />
          {/* Locomotive steam wheel emblem */}
          <circle cx="50" cy="42" r="16" stroke="#ffffff" strokeWidth="3" fill="#dc2626" />
          <circle cx="50" cy="42" r="5" fill="#fbbf24" />
          <path d="M38 42 L62 42 M50 30 L50 54 M41 33 L59 51 M41 51 L59 33" stroke="#ffffff" strokeWidth="2" />
          <text x="50" y="72" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="900" fontFamily="sans-serif">RRB</text>
          <text x="50" y="83" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="800">INDIAN RAILWAYS</text>
        </svg>
      </div>
    );
  }

  // 3. State Bank of India (SBI)
  if (id.includes('sbi')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white p-1 shadow-md shadow-sky-500/20 border border-sky-300/40 shrink-0 flex items-center justify-center relative overflow-hidden ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#0284c7" />
          {/* SBI Keyhole */}
          <circle cx="50" cy="45" r="22" fill="#ffffff" />
          <rect x="44" y="45" width="12" height="35" fill="#0284c7" />
          <circle cx="50" cy="45" r="8" fill="#0284c7" />
        </svg>
      </div>
    );
  }

  // 4. IBPS (Institute of Banking Personnel Selection)
  if (id.includes('ibps')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-blue-800 to-indigo-900 text-white p-1 shadow-md shadow-blue-500/20 border border-blue-400/40 shrink-0 flex items-center justify-center relative overflow-hidden ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#f97316" strokeWidth="4" />
          <circle cx="50" cy="50" r="38" fill="#172554" />
          <path d="M28 35 L50 22 L72 35 L72 65 L50 78 L28 65 Z" stroke="#38bdf8" strokeWidth="3" fill="#1e40af" />
          <text x="50" y="56" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">IBPS</text>
          <text x="50" y="68" textAnchor="middle" fill="#fb923c" fontSize="8" fontWeight="800">BANKING</text>
        </svg>
      </div>
    );
  }

  // 5. Reserve Bank of India (RBI)
  if (id.includes('rbi')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white p-1 shadow-md shadow-amber-500/20 border border-amber-300/40 shrink-0 flex items-center justify-center relative overflow-hidden ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#78350f" stroke="#fbbf24" strokeWidth="4" />
          {/* Palm Tree & Seal */}
          <path d="M50 25 L50 60 M50 25 Q35 32 30 45 M50 25 Q65 32 70 45 M50 35 Q30 40 25 55 M50 35 Q70 40 75 55" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
          <text x="50" y="74" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="900">RBI</text>
          <text x="50" y="85" textAnchor="middle" fill="#fde047" fontSize="7" fontWeight="800">CENTRAL BANK</text>
        </svg>
      </div>
    );
  }

  // 6. Civil Services & UPSC
  if (id.includes('upsc') || id.includes('ias') || id.includes('pcs') || id.includes('bpsc') || cat.includes('civil')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-800 to-emerald-950 text-white p-1 shadow-md shadow-emerald-500/20 border border-emerald-400/40 shrink-0 flex items-center justify-center relative overflow-hidden ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#fbbf24" strokeWidth="4" />
          {/* Ashoka Lion Crest representation */}
          <path d="M42 22 Q50 16 58 22 L62 38 L38 38 Z" fill="#fbbf24" />
          <rect x="36" y="38" width="28" height="18" rx="3" fill="#ffffff" />
          <circle cx="50" cy="47" r="6" stroke="#1d4ed8" strokeWidth="2" />
          <text x="50" y="72" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="900">UPSC</text>
          <text x="50" y="83" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="800">CIVIL SERVICES</text>
        </svg>
      </div>
    );
  }

  // 7. Teaching & UGC NET (BooksBoon Bestseller)
  if (id.includes('ugc') || id.includes('net') || id.includes('ctet') || id.includes('tgt') || cat.includes('teaching')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-amber-600 via-orange-700 to-amber-950 text-white p-1 shadow-md shadow-orange-500/20 border border-amber-300/40 shrink-0 flex items-center justify-center relative overflow-hidden ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#7c2d12" stroke="#fde047" strokeWidth="4" />
          {/* Open Book with Flame */}
          <path d="M50 42 Q35 34 22 36 L22 62 Q35 60 50 68 Q65 60 78 62 L78 36 Q65 34 50 42 Z" fill="#ffffff" stroke="#fde047" strokeWidth="2" />
          <path d="M50 20 Q54 28 50 34 Q46 28 50 20 Z" fill="#f59e0b" />
          <text x="50" y="80" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">UGC NET</text>
        </svg>
      </div>
    );
  }

  // 8. Defence (NDA / CDS / AFCAT)
  if (id.includes('nda') || id.includes('cds') || id.includes('afcat') || cat.includes('defence')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-zinc-800 via-slate-900 to-black text-white p-1 shadow-md shadow-slate-500/20 border border-zinc-500/40 shrink-0 flex items-center justify-center relative overflow-hidden ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#eab308" strokeWidth="4" />
          {/* Crossed Swords & Anchor / Wings */}
          <path d="M28 28 L72 72 M72 28 L28 72" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="14" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
          <text x="50" y="55" textAnchor="middle" fill="#18181b" fontSize="12" fontWeight="900">NDA</text>
          <text x="50" y="82" textAnchor="middle" fill="#eab308" fontSize="8" fontWeight="800">ARMED FORCES</text>
        </svg>
      </div>
    );
  }

  // 9. Police & Law Enforcement (UP Police, Delhi Police)
  if (id.includes('police') || cat.includes('police')) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-yellow-700 via-amber-800 to-yellow-950 text-white p-1 shadow-md shadow-yellow-500/20 border border-yellow-400/40 shrink-0 flex items-center justify-center relative overflow-hidden ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="46" fill="#713f12" stroke="#facc15" strokeWidth="4" />
          {/* Shield Badge & 2 Stars */}
          <path d="M50 20 L76 30 L76 56 Q76 74 50 84 Q24 74 24 56 L24 30 Z" fill="#ca8a04" stroke="#ffffff" strokeWidth="2" />
          <path d="M42 42 L50 36 L58 42 L55 50 L45 50 Z" fill="#ffffff" />
          <text x="50" y="68" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">POLICE</text>
        </svg>
      </div>
    );
  }

  // 10. Default General Institute Exam Badge
  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-1 shadow-md shadow-indigo-500/20 border border-indigo-400/40 shrink-0 flex items-center justify-center relative overflow-hidden ${className}`}>
      <span className="font-black font-display tracking-tight uppercase">
        {examId ? examId.slice(0, 3).toUpperCase() : 'EXAM'}
      </span>
    </div>
  );
};
