/**
 * Vercel Serverless Function: Generate lesson PDF and upload to Vercel Blob Storage.
 * Returns a public URL for the saved PDF (shortcut link for the lesson plan).
 *
 * POST body: { html: string (base64), footerTemplate?: string (base64), fileName?: string }
 * Env: VITE_PDFBOLT_API_KEY or PDFBOLT_API_KEY, BLOB_READ_WRITE_TOKEN (auto-created by Vercel)
 * 
 * Storage Options:
 * - Vercel Blob: 1 GB/month free, 2,000 uploads/month free (RECOMMENDED - integrated with Vercel)
 * - Cloudflare R2: 10 GB/month free, 1M uploads/month free (better free tier, requires Cloudflare account)
 */

import { put } from '@vercel/blob';

const PDFBOLT_API_URL = 'https://api.pdfbolt.com/v1/direct';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    // Log that the function was called (for debugging)
    console.log('[generate-pdf] Function called');
    
    const body = await request.json();
    const { html: encodedHtml, footerTemplate: encodedFooter, headerTemplate: encodedHeader, fileName } = body || {};

    if (!encodedHtml) {
      console.error('[generate-pdf] Missing html content');
      return jsonResponse({ error: 'Missing html content' }, 400);
    }

    const PDFBOLT_API_KEY = process.env.VITE_PDFBOLT_API_KEY || process.env.PDFBOLT_API_KEY;
    if (!PDFBOLT_API_KEY) {
      console.error('[generate-pdf] PDFBOLT_API_KEY not set');
      return jsonResponse({ error: 'PDFBOLT_API_KEY or VITE_PDFBOLT_API_KEY not set in Vercel environment variables' }, 500);
    }

    // Pass base64 HTML and footer directly to PDFBolt. Use emulateMediaType: 'screen' so
    // hyperlinks in the HTML (e.g. resource links) are preserved as clickable in the PDF.
    const pdfResponse = await fetch(PDFBOLT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API_KEY': PDFBOLT_API_KEY,
      },
      body: JSON.stringify({
        html: encodedHtml,
        printBackground: true,
        waitUntil: 'networkidle',
        format: 'A4',
        margin: { top: '15px', right: '20px', left: '20px', bottom: '55px' },
        displayHeaderFooter: true,
        footerTemplate: encodedFooter || '',
        headerTemplate: encodedHeader || '',
        emulateMediaType: 'screen',
      }),
    });

    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      console.error('PDFBolt error:', pdfResponse.status, errText);
      return jsonResponse({ error: `PDF generation failed: ${pdfResponse.status}` }, 500);
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    const storageFileName = fileName || `shared-pdfs/${Date.now()}_lesson.pdf`;

    // Use Vercel Blob Storage (free tier: 1 GB storage, 2,000 uploads/month)
    // BLOB_READ_WRITE_TOKEN is automatically created by Vercel when you create a Blob store
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!blobToken) {
      console.error('[generate-pdf] BLOB_READ_WRITE_TOKEN not set');
      return jsonResponse({ 
        error: 'BLOB_READ_WRITE_TOKEN not found. Please create a Blob store in Vercel Dashboard → Storage → Create Blob Store. The token is automatically created.' 
      }, 500);
    }
    
    console.log('[generate-pdf] Configuration OK, uploading to Vercel Blob...');

    try {
      // Upload to Vercel Blob Storage
      const blob = await put(storageFileName, pdfBuffer, {
        access: 'public', // Make the file publicly accessible
        contentType: 'application/pdf',
        addRandomSuffix: false, // Use exact filename (will overwrite if exists)
      });

      console.log('[generate-pdf] PDF uploaded successfully to Vercel Blob:', blob.url);

      return jsonResponse({
        success: true,
        url: blob.url, // Public URL from Vercel Blob
        path: storageFileName,
      });
    } catch (blobError) {
      console.error('[generate-pdf] Vercel Blob upload error:', blobError);
      return jsonResponse({ 
        error: `Upload to Vercel Blob failed: ${blobError.message || 'Unknown error'}` 
      }, 500);
    }
  } catch (err) {
    console.error('generate-pdf error:', err);
    return jsonResponse(
      { error: err.message || 'Internal server error' },
      500
    );
  }
}
