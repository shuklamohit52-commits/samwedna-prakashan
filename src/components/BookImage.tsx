import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Book } from '../types';

interface BookImageProps {
  book: Book;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export const BookImage: React.FC<BookImageProps> = ({
  book,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  aspectRatio = 'aspect-3/4',
}) => {
  const [loadError, setLoadError] = useState(false);
  const [useRawFallback, setUseRawFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If a bannerImage is provided, compute raw github fallback if jsdelivr fails
  const getRawFallback = (url: string) => {
    if (url.includes('cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/')) {
      return url.replace(
        'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/',
        'https://raw.githubusercontent.com/luckymohittiwari52-oss/quiz-assets/main/'
      );
    }
    return url;
  };

  const imageSrc = book.bannerImage
    ? useRawFallback
      ? getRawFallback(book.bannerImage)
      : book.bannerImage
    : null;

  const handleImageError = () => {
    if (!useRawFallback && book.bannerImage) {
      // First fallback to raw.githubusercontent.com
      setUseRawFallback(true);
    } else {
      // If raw github also fails, fallback to CSS stylized cover
      setLoadError(true);
    }
  };

  if (!imageSrc || loadError) {
    return (
      <div
        className={`${aspectRatio} w-full rounded-lg bg-gradient-to-br ${
          book.coverGradient || 'from-indigo-950 via-slate-900 to-indigo-900'
        } p-4 text-white flex flex-col justify-between shadow-inner relative overflow-hidden select-none ${containerClassName}`}
      >
        <div className="flex items-center justify-between text-[9px] font-bold tracking-wider text-cyan-300 uppercase">
          <span>Samwedna</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono">{book.language || 'Hindi'}</span>
        </div>
        <div className="my-auto py-2">
          <BookOpen className="w-5 h-5 text-amber-400 mb-1" />
          <h4 className="text-xs font-bold leading-tight line-clamp-2">{book.title}</h4>
          <p className="text-[10px] text-slate-300 mt-1 line-clamp-1">{book.author}</p>
        </div>
        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/20">
          <span className="font-mono text-emerald-400 font-bold">₹{book.paperbackPrice}</span>
          <span className="text-slate-300 text-[9px]">{book.pages}p</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-slate-600 animate-bounce" />
        </div>
      )}

      <img
        src={imageSrc}
        alt={book.title}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
