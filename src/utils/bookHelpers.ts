import { Book, CartItem } from '../types';

export type ResolvedProductType = 'hardcopy' | 'ebook' | 'magazine' | 'both';

/**
 * Resolves the canonical product type for both new and legacy books.
 */
export const getBookProductType = (book: Book): ResolvedProductType => {
  if (book.productType) return book.productType;
  if (book.isMagazine) return 'magazine';
  if (book.isHardCopyOnly) return 'hardcopy';
  if (book.pdfUrl && (!book.paperbackPrice || book.paperbackPrice <= 0)) return 'ebook';
  if (book.ebookAvailable || book.pdfUrl || (typeof book.ebookPrice === 'number' && book.ebookPrice > 0)) {
    return 'both';
  }
  return 'hardcopy';
};

/**
 * True when the book has a digital E-Book or Magazine PDF version.
 */
export const hasDigitalVersion = (book: Book): boolean => {
  const type = getBookProductType(book);
  return (
    type === 'ebook' ||
    type === 'magazine' ||
    type === 'both' ||
    Boolean(book.pdfUrl) ||
    Boolean(book.isMagazine) ||
    (Boolean(book.ebookAvailable) && !book.isHardCopyOnly)
  );
};

/**
 * True when the book is sold as a physical printed hard copy.
 */
export const hasHardCopyVersion = (book: Book): boolean => {
  const type = getBookProductType(book);
  if (type === 'ebook') return false;
  if (type === 'magazine' && book.pdfUrl && (!book.paperbackPrice || book.paperbackPrice === book.ebookPrice)) {
    return false;
  }
  return type === 'hardcopy' || type === 'both' || (type === 'magazine' && !book.pdfUrl);
};

/**
 * Returns the cart format label for a book's digital version.
 */
export const getDigitalFormatForBook = (book: Book): 'E-Book' | 'Magazine' => {
  if (book.isMagazine || book.productType === 'magazine') return 'Magazine';
  return 'E-Book';
};

/**
 * Returns the admin-configured digital price (e.g. ₹9 or ₹19) with safe fallback.
 */
export const getBookDigitalPrice = (book: Book): number => {
  if (typeof book.ebookPrice === 'number' && !Number.isNaN(book.ebookPrice) && book.ebookPrice > 0) {
    return Math.round(book.ebookPrice);
  }
  if (book.isMagazine || book.productType === 'magazine') {
    if (book.paperbackPrice > 0 && book.paperbackPrice <= 99) return Math.round(book.paperbackPrice);
    return 19;
  }
  if (book.paperbackPrice > 0) {
    return Math.max(9, Math.round(book.paperbackPrice * 0.45));
  }
  return 19;
};

/**
 * Returns the accurate unit price for any cart item format.
 */
export const getBookUnitPrice = (book: Book, format: 'Paperback' | 'E-Book' | 'Magazine'): number => {
  if (format === 'Paperback') {
    return Math.max(1, Math.round(book.paperbackPrice || book.originalPrice || 199));
  }
  if (format === 'E-Book') {
    return getBookDigitalPrice(book);
  }
  // Magazine: prefer admin-set ebookPrice if configured, else paperbackPrice
  if (typeof book.ebookPrice === 'number' && !Number.isNaN(book.ebookPrice) && book.ebookPrice > 0) {
    return Math.round(book.ebookPrice);
  }
  return Math.max(9, Math.round(book.paperbackPrice || 19));
};

/**
 * True when a cart item is a digital download (no courier delivery needed).
 */
export const isDigitalCartItem = (item: CartItem): boolean => {
  if (item.format === 'E-Book') return true;
  if (item.format === 'Magazine') {
    return (
      Boolean(item.book.pdfUrl) ||
      item.book.productType === 'magazine' ||
      typeof item.book.ebookPrice === 'number' ||
      Boolean(item.book.ebookAvailable)
    );
  }
  return false;
};

/**
 * True when ALL items in cart are digital PDFs (E-Books / Digital Magazines).
 */
export const isDigitalOnlyCart = (cart: CartItem[]): boolean => {
  return cart.length > 0 && cart.every(isDigitalCartItem);
};

/**
 * Builds the canonical direct share URL for any book/ebook/magazine.
 */
export const getBookShareUrl = (bookId: string): string => {
  if (typeof window === 'undefined') return `https://booksboon.com/?book=${encodeURIComponent(bookId)}`;
  const url = new URL(window.location.href);
  url.searchParams.set('book', bookId);
  return url.toString();
};

/**
 * Collects all product gallery slides for a book (Front Cover, Back Cover, Interior Pages).
 */
export interface BookGallerySlide {
  id: string;
  label: string;
  url: string;
  kind: 'front' | 'back' | 'page';
}

export const getBookGallerySlides = (book: Book): BookGallerySlide[] => {
  const slides: BookGallerySlide[] = [];
  if (book.bannerImage) {
    slides.push({
      id: 'front-cover',
      label: 'Front Cover',
      url: book.bannerImage,
      kind: 'front'
    });
  }
  if (book.backCoverImage) {
    slides.push({
      id: 'back-cover',
      label: 'Back Cover',
      url: book.backCoverImage,
      kind: 'back'
    });
  }
  if (Array.isArray(book.galleryImages)) {
    book.galleryImages
      .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
      .slice(0, 4)
      .forEach((img, idx) => {
        slides.push({
          id: `page-${idx + 1}`,
          label: `Inside Page ${idx + 1}`,
          url: img,
          kind: 'page'
        });
      });
  }
  return slides;
};

/**
 * Triggers a reliable offline PDF download for both Data URLs (base64) and remote HTTP URLs.
 */
export const triggerPdfOfflineDownload = async (
  pdfUrl: string,
  title: string,
  fileName?: string
): Promise<{ ok: boolean; error?: string }> => {
  const safeBase = (fileName || title || 'booksboon-ebook')
    .replace(/[^\w\s\u0900-\u097F-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 80);
  const finalName = safeBase.toLowerCase().endsWith('.pdf') ? safeBase : `${safeBase || 'booksboon-ebook'}.pdf`;

  try {
    if (!pdfUrl || pdfUrl === '/samples/sample.pdf') {
      return { ok: false, error: 'Full PDF file has not been uploaded for this publication yet.' };
    }

    // Handle Base64 Data URL -> convert to Blob for reliable offline saving
    if (pdfUrl.startsWith('data:')) {
      const res = await fetch(pdfUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);
      return { ok: true };
    }

    // Handle Remote HTTP(S) URL: attempt CORS blob fetch for clean offline download, fallback to direct anchor
    try {
      const response = await fetch(pdfUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = finalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);
        return { ok: true };
      }
    } catch {
      // Fallback below when remote host does not send CORS headers
    }

    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = finalName;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return { ok: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
};
