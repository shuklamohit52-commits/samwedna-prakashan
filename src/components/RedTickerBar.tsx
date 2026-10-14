import React from 'react';
import { Sparkles, Flame, ArrowRight, Zap, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BOOKS_DATA } from '../data/mockData';
import { Book } from '../types';

interface RedTickerBarProps {
  className?: string;
  speed?: 'normal' | 'fast';
}

export const RedTickerBar: React.FC<RedTickerBarProps> = ({ 
  className = '',
  speed = 'normal'
}) => {
  const { setSelectedBook, setCurrentView, addToCart } = useApp();

  // Featured new releases to display in the ticker
  const newReleaseBooks = BOOKS_DATA.slice(0, 5);

  const tickerItems = [
    {
      badge: '🔥 2026 NEW RELEASE',
      title: 'हिन्दी साहित्य का इतिहास (2500+ MCQs, द्वितीय संस्करण)',
      author: 'डॉ. रजनीश कुमार यादव (JNU/BHU)',
      price: '₹395',
      originalPrice: '₹480',
      bookId: 'hindi-sahitya-itihas-rajneesh',
      tag: 'Teaching & UGC NET'
    },
    {
      badge: '✨ NEW RELEASE',
      title: 'अंतर्मन (जीविका पथ से सामाजिक सरोकार तक)',
      author: 'जगदीश नारायण श्रीवास्तव',
      price: '₹350',
      originalPrice: '₹420',
      bookId: 'antarman-jagdish-narayan',
      tag: 'UPSC / Civil Services'
    },
    {
      badge: '⚡ NEW RELEASE',
      title: 'डिस्कवरी ऑफ डेमोक्रेसी (\'डिस्कवरी ऑफ इंडिया\' से आगे)',
      author: 'राघवेन्द्र दुबे \'भाऊ\'',
      price: '₹495',
      originalPrice: '₹595',
      bookId: 'discovery-of-democracy-raghvendra-dubey',
      tag: 'Polity & Democracy'
    },
    {
      badge: '🗳️ NEW RELEASE',
      title: 'निर्वाचन (लोकतंत्र का आधार)',
      author: 'डा. अरुण प्रताप सिंह',
      price: '₹275',
      originalPrice: '₹350',
      bookId: 'nirvachan-loktantra-ka-aadhar-arun-singh',
      tag: 'Election Commission Guide'
    },
    {
      badge: '📚 NEW RELEASE',
      title: 'हिन्दी साहित्य का इतिहास (प्रथम संस्करण)',
      author: 'डॉ. रजनीश कुमार यादव',
      price: '₹395',
      originalPrice: '₹480',
      bookId: 'hindi-sahitya-itihas-rajneesh-ed1',
      tag: 'Bestseller Compendium'
    }
  ];

  const handleBookClick = (bookId: string) => {
    const book = BOOKS_DATA.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
    }
  };

  const handleQuickBuy = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    const book = BOOKS_DATA.find(b => b.id === bookId);
    if (book) {
      addToCart(book, 'Paperback');
      setCurrentView('cart');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside 
      aria-label="New Releases Announcements"
      className={`relative w-full bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white overflow-hidden shadow-lg border-y border-red-500/60 z-30 select-none ${className}`}
    >
      {/* Background ambient glow line */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 pointer-events-none" />

      <div className="relative flex items-center h-11 sm:h-12">
        {/* Left Fixed Red Badge */}
        <div className="shrink-0 z-10 flex items-center gap-2 px-3 sm:px-5 h-full bg-red-800 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase border-r border-red-500 shadow-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
          <Flame className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
          <span className="font-display font-black tracking-widest text-white whitespace-nowrap">
            NEW RELEASE
          </span>
        </div>

        {/* Moving Marquee Across Full Width */}
        <div className="overflow-hidden flex-1 h-full flex items-center relative group">
          <div className={`${speed === 'fast' ? 'animate-marquee-fast' : 'animate-marquee'} flex items-center gap-6 sm:gap-10 pl-4`}>
            
            {/* First sequence of ticker items */}
            {tickerItems.map((item, idx) => (
              <div
                key={`item-1-${idx}`}
                onClick={() => handleBookClick(item.bookId)}
                className="inline-flex items-center gap-3 cursor-pointer hover:bg-white/15 px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm"
              >
                <span className="bg-amber-300 text-red-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs uppercase font-mono tracking-wider">
                  {item.badge}
                </span>

                <span className="font-bold text-white tracking-wide hover:underline drop-shadow-xs">
                  {item.title}
                </span>

                <span className="text-red-100 text-[11px] sm:text-xs font-medium opacity-90 hidden sm:inline">
                  ({item.author})
                </span>

                <span className="font-mono font-extrabold text-amber-200 text-xs sm:text-sm bg-black/20 px-2 py-0.5 rounded">
                  {item.price}
                </span>

                <span className="text-[10px] text-red-200 line-through hidden md:inline">
                  {item.originalPrice}
                </span>

                <button
                  type="button"
                  onClick={(e) => handleQuickBuy(e, item.bookId)}
                  className="px-2 py-0.5 bg-white text-red-700 hover:bg-amber-100 font-bold text-[10px] sm:text-xs rounded shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Quick Buy"
                >
                  <ShoppingBag className="w-2.5 h-2.5" />
                  <span>Order Now</span>
                </button>

                <span className="text-white/40 font-bold ml-2">✦</span>
              </div>
            ))}

            {/* Helpline Item */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 rounded-lg text-xs whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold text-white">
                📦 Fast Home Delivery Across India | Call / WhatsApp: +91 9792903247 / +91 8115374644
              </span>
              <span className="text-white/40 font-bold ml-2">✦</span>
            </div>

            {/* Duplicate sequence for seamless infinite loop */}
            {tickerItems.map((item, idx) => (
              <div
                key={`item-2-${idx}`}
                onClick={() => handleBookClick(item.bookId)}
                className="inline-flex items-center gap-3 cursor-pointer hover:bg-white/15 px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm"
              >
                <span className="bg-amber-300 text-red-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs uppercase font-mono tracking-wider">
                  {item.badge}
                </span>

                <span className="font-bold text-white tracking-wide hover:underline drop-shadow-xs">
                  {item.title}
                </span>

                <span className="text-red-100 text-[11px] sm:text-xs font-medium opacity-90 hidden sm:inline">
                  ({item.author})
                </span>

                <span className="font-mono font-extrabold text-amber-200 text-xs sm:text-sm bg-black/20 px-2 py-0.5 rounded">
                  {item.price}
                </span>

                <span className="text-[10px] text-red-200 line-through hidden md:inline">
                  {item.originalPrice}
                </span>

                <button
                  type="button"
                  onClick={(e) => handleQuickBuy(e, item.bookId)}
                  className="px-2 py-0.5 bg-white text-red-700 hover:bg-amber-100 font-bold text-[10px] sm:text-xs rounded shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Quick Buy"
                >
                  <ShoppingBag className="w-2.5 h-2.5" />
                  <span>Order Now</span>
                </button>

                <span className="text-white/40 font-bold ml-2">✦</span>
              </div>
            ))}

            {/* Duplicate Helpline Item */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 rounded-lg text-xs whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold text-white">
                📦 Fast Home Delivery Across India | Call / WhatsApp: +91 9792903247 / +91 8115374644
              </span>
              <span className="text-white/40 font-bold ml-2">✦</span>
            </div>

          </div>
        </div>

        {/* Right view catalog button */}
        <button
          onClick={() => {
            setCurrentView('product');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 hidden md:flex items-center gap-1 px-4 h-full bg-red-900/90 hover:bg-red-950 text-white font-bold text-xs uppercase tracking-wider border-l border-red-500/80 transition-colors cursor-pointer"
          title="View All Books in Catalog"
        >
          <span>All Releases</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
