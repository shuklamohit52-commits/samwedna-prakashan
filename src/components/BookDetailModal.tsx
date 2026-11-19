import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  BookOpen,
  FileText,
  ShoppingCart,
  CheckCircle,
  Download,
  ShieldCheck,
  Clock,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Lock,
  Sparkles,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { BookImage } from './BookImage';
import {
  getBookGallerySlides,
  getBookDigitalPrice,
  getDigitalFormatForBook,
  hasDigitalVersion,
  hasHardCopyVersion,
  triggerPdfOfflineDownload
} from '../utils/bookHelpers';

export const BookDetailModal: React.FC = () => {
  const {
    selectedBook,
    setSelectedBook,
    addToCart,
    setCurrentView,
    isAdmin,
    hasPurchasedBook,
    openBookPdfReader,
    buyDigitalBookNow,
    shareBookLink,
    showToast
  } = useApp();

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    setActiveSlideIdx(0);
    setIsLightboxOpen(false);
    setLinkCopied(false);
  }, [selectedBook?.id]);

  if (!selectedBook) return null;

  const slides = getBookGallerySlides(selectedBook);
  const activeSlide = slides[activeSlideIdx] || null;
  const supportsHardCopy = hasHardCopyVersion(selectedBook);
  const supportsDigital = hasDigitalVersion(selectedBook);
  const digitalFormat = getDigitalFormatForBook(selectedBook);
  const digitalPrice = getBookDigitalPrice(selectedBook);
  const isPurchased = hasPurchasedBook(selectedBook.id);
  const canAccessFullPdf = Boolean(isAdmin || isPurchased);
  const previewPagesLimit = selectedBook.previewPagesLimit || 5;

  const discountPercentage =
    selectedBook.originalPrice > selectedBook.paperbackPrice && selectedBook.paperbackPrice > 0
      ? Math.round(((selectedBook.originalPrice - selectedBook.paperbackPrice) / selectedBook.originalPrice) * 100)
      : 0;

  const handleShare = async () => {
    await shareBookLink(selectedBook);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2400);
  };

  const handleDownloadOfflinePdf = async () => {
    const pdfSource = selectedBook.pdfUrl || selectedBook.samplePdfUrl;
    if (!pdfSource || pdfSource === '/samples/sample.pdf') {
      showToast('Full PDF file is being prepared by BooksBoon Editorial. Please try again shortly.', 'info');
      return;
    }
    setIsDownloadingPdf(true);
    const res = await triggerPdfOfflineDownload(pdfSource, selectedBook.title, selectedBook.pdfFileName);
    setIsDownloadingPdf(false);
    if (res.ok) {
      showToast(`Downloading "${selectedBook.title}" PDF for offline reading!`, 'success');
    } else {
      showToast(res.error || 'Could not download PDF file.', 'error');
    }
  };

  const goPrevSlide = () => {
    if (slides.length <= 1) return;
    setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNextSlide = () => {
    if (slides.length <= 1) return;
    setActiveSlideIdx((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={() => setSelectedBook(null)}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Controls */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 shadow-sm text-xs font-bold transition-colors cursor-pointer"
            title="Share direct product link"
          >
            {linkCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{linkCopied ? 'Link Copied' : 'Share Link'}</span>
          </button>
          <button
            onClick={() => setSelectedBook(null)}
            className="p-2 rounded-full bg-white/95 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-sm cursor-pointer"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Left Column: Interactive Book Cover, Back Cover & Interior Pages Gallery */}
            <div className="lg:col-span-5 flex flex-col space-y-3.5">
              {/* Main Active Image Stage */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md group aspect-[3/4]">
                {activeSlide ? (
                  <img
                    src={activeSlide.url}
                    alt={`${selectedBook.title} - ${activeSlide.label}`}
                    referrerPolicy="no-referrer"
                    onClick={() => setIsLightboxOpen(true)}
                    className="w-full h-full object-contain bg-slate-50 cursor-zoom-in transition-transform duration-300"
                  />
                ) : (
                  <BookImage
                    book={selectedBook}
                    aspectRatio="aspect-[3/4]"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                )}

                {/* Active View Label Pill */}
                {activeSlide && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activeSlide.label}</span>
                    <span className="text-slate-300 font-mono text-[10px]">
                      ({activeSlideIdx + 1}/{slides.length})
                    </span>
                  </div>
                )}

                {/* Zoom Trigger */}
                {activeSlide && (
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/75 hover:bg-slate-950 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title="View Full Page Image"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                )}

                {/* Prev / Next Navigation Arrows */}
                {slides.length > 1 && (
                  <>
                    <button
                      onClick={goPrevSlide}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md border border-slate-200 cursor-pointer transition-all"
                      aria-label="Previous book image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={goNextSlide}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-md border border-slate-200 cursor-pointer transition-all"
                      aria-label="Next book image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip (Front Cover, Back Cover, Inside Pages 1–4) */}
              {slides.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
                  {slides.map((slide, idx) => {
                    const isSelected = idx === activeSlideIdx;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlideIdx(idx)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer text-left bg-slate-50 ${
                          isSelected
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-[3/4] w-full overflow-hidden">
                          <img
                            src={slide.url}
                            alt={slide.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="px-1.5 py-1 bg-slate-900/90 text-white text-[9px] font-bold text-center truncate">
                          {slide.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick Preview PDF Button under Gallery */}
              {supportsDigital && (
                <button
                  onClick={() => openBookPdfReader(selectedBook)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>
                    {isAdmin
                      ? `Admin Full PDF Preview (All ${selectedBook.pages} Pages)`
                      : isPurchased
                      ? 'Open Full Purchased PDF Online'
                      : `Preview First ${previewPagesLimit} Pages Free (PDF)`}
                  </span>
                </button>
              )}

              {/* Publication Specifications (Unboxed clean hairline grid) */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pages</span>
                  <span className="text-xs font-extrabold text-slate-800 tabular-nums">{selectedBook.pages}</span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Medium</span>
                  <span className="text-xs font-extrabold text-slate-800">{selectedBook.language}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Edition</span>
                  <span className="text-xs font-extrabold text-slate-800">{selectedBook.patternYear || '2026'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Details, Pricing Cards & Instant Purchase Actions */}
            <div className="lg:col-span-7 flex flex-col space-y-5 pr-0 lg:pr-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-md">
                    {selectedBook.category}
                  </span>
                  {selectedBook.isMagazine || selectedBook.productType === 'magazine' ? (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-md">
                      Magazine Edition
                    </span>
                  ) : null}
                  {selectedBook.pdfUrl && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                      PDF Ready
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold ml-auto sm:ml-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="tabular-nums">{selectedBook.rating}</span>
                    <span className="text-slate-400 font-normal">({selectedBook.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display leading-snug">
                  {selectedBook.title}
                </h2>
                {selectedBook.hindiTitle && (
                  <p className="text-sm font-bold text-indigo-800 mt-1">{selectedBook.hindiTitle}</p>
                )}
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  By <span className="font-semibold text-slate-700">{selectedBook.author}</span>
                  {selectedBook.hindiAuthor ? ` · ${selectedBook.hindiAuthor}` : ''}
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{selectedBook.description}</p>
              {selectedBook.hindiDescription && (
                <p className="text-xs text-slate-600 bg-amber-50/50 border-l-2 border-amber-400 pl-3 py-1.5 leading-relaxed">
                  {selectedBook.hindiDescription}
                </p>
              )}

              {/* Purchase Options Grid: Hard Copy + E-Book/Magazine PDF */}
              <div className="space-y-3">
                {/* 1. Hard Copy Paperback Option */}
                {supportsHardCopy && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                          Printed Hard Copy (Paperback)
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-2xl font-black text-slate-900 tabular-nums">
                            ₹{selectedBook.paperbackPrice}
                          </span>
                          {selectedBook.originalPrice > selectedBook.paperbackPrice && (
                            <span className="text-sm text-slate-400 line-through tabular-nums">
                              ₹{selectedBook.originalPrice}
                            </span>
                          )}
                          {discountPercentage > 0 && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md tabular-nums">
                              Save {discountPercentage}%
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        In Stock · India Post Dispatch
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => {
                          addToCart(selectedBook, 'Paperback');
                          setSelectedBook(null);
                          setCurrentView('checkout');
                        }}
                        className="flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Buy Hard Copy (₹{selectedBook.paperbackPrice})</span>
                      </button>
                      <button
                        onClick={() => addToCart(selectedBook, 'Paperback')}
                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Digital E-Book / Magazine PDF Option (5-Page Preview + Admin-Set Price + Offline Download) */}
                {supportsDigital && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">
                            Digital {digitalFormat} PDF
                          </span>
                          {isPurchased && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase">
                              <CheckCircle className="w-3 h-3" /> Purchased
                            </span>
                          )}
                          {isAdmin && !isPurchased && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                              <ShieldCheck className="w-3 h-3" /> Admin Access
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-2xl font-black text-indigo-950 tabular-nums">₹{digitalPrice}</span>
                          <span className="text-xs text-indigo-700 font-semibold">
                            Read Online + Offline PDF Download
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                        {canAccessFullPdf ? (
                          <span className="text-emerald-700 font-bold">All {selectedBook.pages} Pages Unlocked</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                            <Lock className="w-3 h-3" /> Free {previewPagesLimit}-Page Preview
                          </span>
                        )}
                      </div>
                    </div>

                    {canAccessFullPdf ? (
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={() => openBookPdfReader(selectedBook)}
                          className="flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{isAdmin ? 'Read Complete PDF (Admin)' : 'Read Complete PDF Online'}</span>
                        </button>
                        <button
                          onClick={handleDownloadOfflinePdf}
                          disabled={isDownloadingPdf}
                          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                        >
                          <Download className="w-4 h-4" />
                          <span>{isDownloadingPdf ? 'Downloading...' : 'Download Offline PDF'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={() => buyDigitalBookNow(selectedBook)}
                          className="flex-1 min-w-[170px] py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer tabular-nums"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Buy {digitalFormat} PDF (₹{digitalPrice})</span>
                        </button>
                        <button
                          onClick={() => openBookPdfReader(selectedBook)}
                          className="py-2.5 px-4 rounded-xl bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Preview {previewPagesLimit} Pages</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Key Features & Syllabus */}
              {selectedBook.features && selectedBook.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Key Highlights &amp; Features
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedBook.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Table of Contents */}
              {selectedBook.tableOfContents && selectedBook.tableOfContents.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Table of Contents
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
                    {selectedBook.tableOfContents.map((chap, idx) => (
                      <div key={idx} className="text-xs text-slate-600 py-1 border-b border-slate-200/60 last:border-0">
                        {chap}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs text-slate-500">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Official Publisher
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-indigo-500" /> Instant PDF Unlock
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{linkCopied ? 'Product Link Copied!' : 'Share This Product'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox for Inspecting Front/Back Cover & Interior Book Pages */}
      {isLightboxOpen && activeSlide && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/95 flex flex-col items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(false);
          }}
        >
          <div className="w-full max-w-4xl flex items-center justify-between text-white mb-3">
            <span className="text-xs sm:text-sm font-bold">
              {selectedBook.title} — <span className="text-amber-300">{activeSlide.label}</span> ({activeSlideIdx + 1}/{slides.length})
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div
            className="relative max-w-4xl max-h-[82vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeSlide.url}
              alt={activeSlide.label}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl"
            />
            {slides.length > 1 && (
              <>
                <button
                  onClick={goPrevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goNextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
