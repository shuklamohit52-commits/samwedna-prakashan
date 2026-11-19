import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useApp } from '../context/AppContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  BookOpen,
  Download,
  Lock,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  FileText,
  Sparkles,
  Share2
} from 'lucide-react';
import { triggerPdfOfflineDownload } from '../utils/bookHelpers';

// Configure PDF.js worker via Vite static asset URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export const EbookReaderModal: React.FC = () => {
  const {
    readingEbook,
    setReadingEbook,
    readingPdf,
    setReadingPdf,
    booksCatalog,
    isAdmin,
    hasPurchasedBook,
    buyDigitalBookNow,
    shareBookLink,
    showToast
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(110);
  const [theme, setTheme] = useState<'dark' | 'light' | 'sepia'>('dark');
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [detectedPages, setDetectedPages] = useState<number>(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isRenderingPage, setIsRenderingPage] = useState(false);
  const [pdfLoadFailed, setPdfLoadFailed] = useState(false);
  const [showPaywallOverlay, setShowPaywallOverlay] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  // Resolve the active document context from either readingEbook or readingPdf
  const resolvedBook = readingEbook
    ? booksCatalog.find(b => b.id === readingEbook.bookId)
    : readingPdf?.book || (readingPdf?.bookId ? booksCatalog.find(b => b.id === readingPdf.bookId) : undefined);

  const activeDoc = readingEbook
    ? {
        title: readingEbook.title,
        author: readingEbook.author,
        totalPages: readingEbook.totalPages || resolvedBook?.pages || 50,
        url: readingEbook.pdfUrl || resolvedBook?.pdfUrl || resolvedBook?.samplePdfUrl || '/samples/sample.pdf',
        fileName: readingEbook.pdfFileName || resolvedBook?.pdfFileName || `${readingEbook.title}.pdf`,
        book: resolvedBook,
        isAdminView: Boolean(isAdmin),
        isFullUnlocked: true, // Items inside Student Library are already owned/unlocked
        allowDownload: true,
        maxPreviewPages: undefined as number | undefined,
        format: readingEbook.format || ('E-Book' as const),
        price: resolvedBook?.ebookPrice ?? 19
      }
    : readingPdf
    ? (() => {
        const isFreeResource = !readingPdf.bookId && !readingPdf.book && readingPdf.maxPreviewPages === undefined;
        const purchased = readingPdf.bookId ? hasPurchasedBook(readingPdf.bookId) : false;
        const adminMode = Boolean(readingPdf.isAdminView || isAdmin);
        const fullUnlocked = isFreeResource || adminMode || purchased || Boolean(readingPdf.isFullUnlocked);
        const previewLimit = fullUnlocked ? undefined : (readingPdf.maxPreviewPages || resolvedBook?.previewPagesLimit || 5);
        return {
          title: readingPdf.title,
          author: readingPdf.author || resolvedBook?.author || 'Samwedna Publications',
          totalPages: readingPdf.pages || resolvedBook?.pages || 50,
          url: readingPdf.url || resolvedBook?.pdfUrl || '/samples/sample.pdf',
          fileName: readingPdf.fileName || resolvedBook?.pdfFileName || `${readingPdf.title}.pdf`,
          book: resolvedBook,
          isAdminView: adminMode,
          isFullUnlocked: fullUnlocked,
          allowDownload: isFreeResource || adminMode || purchased || Boolean(readingPdf.allowDownload),
          maxPreviewPages: previewLimit,
          format: readingPdf.format || (isFreeResource ? 'Free PDF' : 'E-Book'),
          price: readingPdf.price ?? resolvedBook?.ebookPrice ?? 19
        };
      })()
    : null;

  const docUrl = activeDoc?.url || '';
  const hasRealPdfSource = Boolean(docUrl && docUrl !== '/samples/sample.pdf');

  // Load PDF document whenever the active document changes
  useEffect(() => {
    let cancelled = false;

    setCurrentPage(1);
    setShowPaywallOverlay(false);
    setPdfDoc(null);
    setDetectedPages(0);
    setPdfLoadFailed(false);

    if (!activeDoc || !hasRealPdfSource) {
      setIsLoadingPdf(false);
      return;
    }

    let activeLoadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;

    const loadPdf = async () => {
      setIsLoadingPdf(true);
      try {
        let loadingTask: pdfjsLib.PDFDocumentLoadingTask;

        if (docUrl.startsWith('data:')) {
          const response = await fetch(docUrl);
          const buffer = await response.arrayBuffer();
          loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        } else {
          loadingTask = pdfjsLib.getDocument({ url: docUrl, withCredentials: false });
        }

        activeLoadingTask = loadingTask;
        const doc = await loadingTask.promise;
        if (cancelled) {
          loadingTask.destroy().catch(() => {});
          return;
        }
        setPdfDoc(doc);
        setDetectedPages(doc.numPages);
      } catch (err) {
        console.warn('PDF.js load fallback notice:', err);
        if (!cancelled) {
          setPdfLoadFailed(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPdf(false);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
      if (activeLoadingTask) {
        activeLoadingTask.destroy().catch(() => {});
      }
    };
  }, [docUrl, Boolean(activeDoc)]);

  const effectiveTotalPages = detectedPages > 0 ? detectedPages : (activeDoc?.totalPages || 25);
  const previewCap = activeDoc && !activeDoc.isFullUnlocked
    ? Math.min(effectiveTotalPages, activeDoc.maxPreviewPages || 5)
    : effectiveTotalPages;

  // Render active page onto high-DPI canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || showPaywallOverlay) return;
    if (currentPage > previewCap) {
      setShowPaywallOverlay(true);
      return;
    }

    let cancelled = false;

    const renderPage = async () => {
      setIsRenderingPage(true);
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore
          }
        }
        const page = await pdfDoc.getPage(currentPage);
        if (cancelled || !canvasRef.current) return;

        const baseScale = (zoom / 100) * 1.25;
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: baseScale });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const renderContext = {
          canvasContext: ctx,
          viewport,
          transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined
        };

        const task = page.render(renderContext as any);
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('PDF page render notice:', err);
        }
      } finally {
        if (!cancelled) {
          setIsRenderingPage(false);
        }
      }
    };

    renderPage();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage, zoom, previewCap, showPaywallOverlay]);

  if (!activeDoc) return null;

  const handleClose = () => {
    setReadingEbook(null);
    setReadingPdf(null);
  };

  const handleGoToPage = (targetPage: number) => {
    if (targetPage < 1) return;
    if (!activeDoc.isFullUnlocked && targetPage > previewCap) {
      setShowPaywallOverlay(true);
      return;
    }
    if (targetPage > effectiveTotalPages) return;
    setShowPaywallOverlay(false);
    setCurrentPage(targetPage);
  };

  const handleOfflineDownload = async () => {
    if (!activeDoc.allowDownload) {
      if (activeDoc.book) {
        showToast(`Purchase this ${activeDoc.format} (₹${activeDoc.price}) to download the complete PDF offline.`, 'info');
        setShowPaywallOverlay(true);
      }
      return;
    }

    if (!hasRealPdfSource) {
      showToast('PDF file is not uploaded yet for this item. Please ask Admin to upload the PDF.', 'info');
      return;
    }

    setIsDownloading(true);
    const res = await triggerPdfOfflineDownload(activeDoc.url, activeDoc.title, activeDoc.fileName);
    setIsDownloading(false);
    if (res.ok) {
      showToast(`Downloading "${activeDoc.title}" PDF for offline reading!`, 'success');
    } else {
      showToast(res.error || 'Could not download PDF file.', 'error');
    }
  };

  const themeBg =
    theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : theme === 'sepia'
      ? 'bg-[#f4ecd8] text-[#3d3122]'
      : 'bg-slate-100 text-slate-900';

  const pageCardBg =
    theme === 'dark'
      ? 'bg-slate-900 border-slate-800 text-slate-200'
      : theme === 'sepia'
      ? 'bg-[#fdf6e3] border-[#e6dabf] text-[#433422]'
      : 'bg-white border-slate-200 text-slate-900';

  const quickPageNumbers = Array.from(
    { length: Math.min(effectiveTotalPages, activeDoc.isFullUnlocked ? 12 : Math.min(effectiveTotalPages, (activeDoc.maxPreviewPages || 5) + 3)) },
    (_, i) => i + 1
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/98 backdrop-blur-md animate-fadeIn select-none"
      onContextMenu={(e) => {
        if (!activeDoc.allowDownload) e.preventDefault();
      }}
    >
      {/* Top Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white shadow-xl">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold truncate max-w-[200px] sm:max-w-md">{activeDoc.title}</h3>
              {activeDoc.isAdminView ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Full View ({effectiveTotalPages}p)
                </span>
              ) : activeDoc.isFullUnlocked ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Full PDF Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  <Lock className="w-3 h-3" />
                  Free Preview: First {previewCap} of {effectiveTotalPages} Pages
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {activeDoc.author} · {activeDoc.format}
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Zoom Controls */}
          <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setZoom(Math.max(75, zoom - 15))}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-200 tabular-nums">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 15))}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded text-xs cursor-pointer ${theme === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${theme === 'sepia' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Sepia Theme"
            >
              Sepia
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded text-xs cursor-pointer ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Share button if linked to a Book */}
          {activeDoc.book && (
            <button
              onClick={() => shareBookLink(activeDoc.book!)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer"
              title="Share Direct Product Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Download Offline OR Buy Unlock CTA */}
          {activeDoc.allowDownload ? (
            <button
              onClick={handleOfflineDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Download Offline PDF</span>
              <span className="sm:hidden">Download</span>
            </button>
          ) : activeDoc.book ? (
            <button
              onClick={() => buyDigitalBookNow(activeDoc.book!)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors cursor-pointer tabular-nums"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Unlock Full PDF · ₹{activeDoc.price}</span>
            </button>
          ) : null}

          <button
            onClick={handleClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close Reader"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Cap Info Strip for Non-Purchased Students */}
      {!activeDoc.isFullUnlocked && activeDoc.book && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              You are viewing the <strong className="text-white">Free {previewCap}-Page Student Preview</strong>. Buy once for{' '}
              <strong className="text-amber-300 tabular-nums">₹{activeDoc.price}</strong> to read all {effectiveTotalPages} pages online &amp; download offline PDF!
            </span>
          </div>
          <button
            onClick={() => buyDigitalBookNow(activeDoc.book!)}
            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] cursor-pointer shrink-0 tabular-nums"
          >
            Buy Now (₹{activeDoc.price})
          </button>
        </div>
      )}

      {/* Main Reader Viewport */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center ${themeBg}`}>
        {/* Paywall Overlay when student reaches beyond Page 5 */}
        {showPaywallOverlay && !activeDoc.isFullUnlocked && activeDoc.book ? (
          <div className="my-auto w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-400/40 p-6 sm:p-8 text-center text-white shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                {previewCap}-Page Free Preview Complete
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Unlock Complete {activeDoc.format} ({effectiveTotalPages} Pages)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Purchase <strong className="text-white">{activeDoc.title}</strong> to read every page online inside BooksBoon.com AND download the full PDF offline to your device permanently.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">One-Time Digital Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-300 tabular-nums">₹{activeDoc.price}</span>
                  <span className="text-xs text-emerald-400 font-semibold">Instant Unlock · No Shipping Fee</span>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-300 space-y-0.5">
                <div className="flex items-center gap-1 justify-end text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Read Online
                </div>
                <div className="flex items-center gap-1 justify-end text-emerald-400 font-bold">
                  <Download className="w-3.5 h-3.5" /> Offline PDF
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => buyDigitalBookNow(activeDoc.book!)}
                className="flex-1 py-3.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer transition-colors tabular-nums"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Full PDF — ₹{activeDoc.price}</span>
              </button>
              <button
                onClick={() => {
                  setShowPaywallOverlay(false);
                  setCurrentPage(previewCap);
                }}
                className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer transition-colors"
              >
                Back to Page {previewCap}
              </button>
            </div>
          </div>
        ) : isLoadingPdf ? (
          <div className="my-auto flex flex-col items-center gap-3 py-16">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            <p className="text-sm font-semibold">Loading PDF Document...</p>
            <p className="text-xs opacity-70">Preparing high-resolution pages</p>
          </div>
        ) : pdfDoc && !pdfLoadFailed ? (
          <div className="flex flex-col items-center gap-4 max-w-full">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-white">
              {isRenderingPage && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
                </div>
              )}
              <canvas ref={canvasRef} className="block max-w-full h-auto" />
            </div>

            {/* Inline prompt at bottom of last free preview page */}
            {!activeDoc.isFullUnlocked && currentPage === previewCap && activeDoc.book && (
              <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-amber-400/40 p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase">
                    <Lock className="w-3.5 h-3.5" /> End of {previewCap}-Page Free Preview
                  </div>
                  <p className="text-xs text-slate-300">
                    {effectiveTotalPages - previewCap > 0
                      ? `${effectiveTotalPages - previewCap} more pages available in full edition.`
                      : 'Unlock full edition for unlimited online reading & offline PDF download.'}
                  </p>
                </div>
                <button
                  onClick={() => buyDigitalBookNow(activeDoc.book!)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shrink-0 cursor-pointer tabular-nums"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Unlock Full PDF (₹{activeDoc.price})</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Structured Academic Fallback Preview (for legacy catalog items where Admin hasn't uploaded a real PDF yet) */
          <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl p-6 sm:p-10 space-y-6 ${pageCardBg}`}>
            <div className="flex items-center justify-between text-xs pb-4 border-b border-current/15 opacity-75">
              <span className="font-mono uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                BooksBoon Digital Reader
              </span>
              <span className="font-mono tabular-nums">
                Page {currentPage} of {effectiveTotalPages}
              </span>
            </div>

            {pdfLoadFailed && hasRealPdfSource && (
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span>
                  External PDF host blocked inline canvas rendering due to CORS headers.
                  {activeDoc.allowDownload ? ' You can open or download the full PDF directly.' : ` Purchase for ₹${activeDoc.price} to unlock direct offline download.`}
                </span>
                {activeDoc.allowDownload && (
                  <button
                    onClick={handleOfflineDownload}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Open / Download PDF
                  </button>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="inline-block px-2.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 text-[11px] font-bold uppercase">
                Sample Page {currentPage} · {activeDoc.format}
              </div>
              <h1 className="text-xl sm:text-2xl font-black leading-snug">{activeDoc.title}</h1>
              <p className="text-xs opacity-70">By {activeDoc.author}</p>

              <p className="text-sm leading-relaxed opacity-90">
                {activeDoc.book?.description ||
                  'Comprehensive Samwedna Prakashan study material engineered for competitive examination excellence with solved previous year papers, analytical commentary, and high-yield revision tables.'}
              </p>

              {activeDoc.book?.hindiDescription && (
                <p className="text-sm leading-relaxed opacity-90 border-l-4 border-amber-500 pl-4 py-1">
                  {activeDoc.book.hindiDescription}
                </p>
              )}

              {activeDoc.book?.tableOfContents && activeDoc.book.tableOfContents.length > 0 && (
                <div className="p-4 rounded-xl bg-current/5 border border-current/10 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider opacity-80">
                    Inside This Publication (Preview Excerpt — Page {currentPage})
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {activeDoc.book.tableOfContents.map((chap, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{chap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!hasRealPdfSource && activeDoc.isAdminView && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200">
                  Admin Notice: No PDF file has been uploaded for this publication yet. Go to Admin Panel → BooksBoon Store → Edit this book to upload the complete PDF file.
                </div>
              )}
            </div>

            {!activeDoc.isFullUnlocked && currentPage === previewCap && activeDoc.book && (
              <div className="pt-4 border-t border-current/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs">
                  <strong className="text-amber-400">Free {previewCap}-Page Preview Limit Reached.</strong> Purchase to unlock all {effectiveTotalPages} pages &amp; offline PDF download.
                </div>
                <button
                  onClick={() => buyDigitalBookNow(activeDoc.book!)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 cursor-pointer tabular-nums"
                >
                  Unlock Full PDF · ₹{activeDoc.price}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Page Navigation Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGoToPage(currentPage - 1)}
            disabled={currentPage <= 1 && !showPaywallOverlay}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-mono px-2 text-slate-300 tabular-nums">
            {showPaywallOverlay ? `Locked (6–${effectiveTotalPages})` : `Page ${currentPage} / ${effectiveTotalPages}`}
          </span>

          <button
            onClick={() => handleGoToPage(currentPage + 1)}
            disabled={activeDoc.isFullUnlocked && currentPage >= effectiveTotalPages}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              !activeDoc.isFullUnlocked && currentPage >= previewCap
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                : 'bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white'
            }`}
          >
            {!activeDoc.isFullUnlocked && currentPage >= previewCap ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Page {previewCap + 1}+</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Quick Page Switcher Pills (clearly marking locked pages beyond page 5) */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
          {quickPageNumbers.map((pageNum) => {
            const isLockedPage = !activeDoc.isFullUnlocked && pageNum > previewCap;
            const isActive = !showPaywallOverlay && currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => handleGoToPage(pageNum)}
                className={`min-w-[28px] h-7 px-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-0.5 cursor-pointer transition-colors tabular-nums ${
                  isActive
                    ? 'bg-amber-400 text-slate-950'
                    : isLockedPage
                    ? 'bg-slate-800/80 text-slate-500 border border-slate-700 hover:border-amber-400/50 hover:text-amber-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title={isLockedPage ? `Page ${pageNum} (Purchase to Unlock)` : `Go to Page ${pageNum}`}
              >
                {isLockedPage && <Lock className="w-2.5 h-2.5" />}
                <span>{pageNum}</span>
              </button>
            );
          })}
          {effectiveTotalPages > quickPageNumbers.length && (
            <span className="text-[11px] text-slate-500 px-1.5 font-mono">… {effectiveTotalPages}</span>
          )}
        </div>
      </div>
    </div>
  );
};
