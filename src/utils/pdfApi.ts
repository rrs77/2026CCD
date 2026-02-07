/**
 * PDF generation API URL for Vercel.
 * Uses same-origin /api/generate-pdf endpoint.
 */

const VERCEL_PDF_PATH = '/api/generate-pdf';

/**
 * Returns the URL to call for PDF generation (generate PDF + upload to storage).
 * Use this in useShareLesson when generating share links.
 */
export function getPdfApiUrl(): string {
  return VERCEL_PDF_PATH;
}
