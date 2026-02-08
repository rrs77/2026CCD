# Vercel API Routes

This directory contains serverless functions for Vercel.

## Routes

### `/api/generate-pdf`
Generates a PDF from HTML content and uploads it to Supabase Storage, returning a public URL.

**Required Environment Variables (set in Vercel Dashboard):**
- `PDFBOLT_API_KEY` or `VITE_PDFBOLT_API_KEY` - Your PDFBolt API key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (from Supabase Dashboard → Project Settings → API)
- `SUPABASE_URL` or `VITE_SUPABASE_URL` - Your Supabase project URL (optional, has default)

**Request:**
```json
{
  "html": "base64-encoded-html-content",
  "footerTemplate": "base64-encoded-footer-html",
  "fileName": "shared-pdfs/timestamp_lesson.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://...supabase.co/storage/v1/object/public/lesson-pdfs/...",
  "path": "shared-pdfs/timestamp_lesson.pdf"
}
```

## Deployment

1. Ensure `api/generate-pdf.js` exists in your project
2. Deploy to Vercel (git push or Vercel CLI)
3. Set environment variables in Vercel Dashboard:
   - Go to Project → Settings → Environment Variables
   - Add: `PDFBOLT_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`
4. Redeploy after adding environment variables

## Testing

After deployment, test the route:
```bash
curl -X POST https://your-app.vercel.app/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"html":"<base64-encoded-html>"}'
```

## Troubleshooting

**404 Error:**
- Ensure the route is deployed (check Vercel deployment logs)
- Verify `api/generate-pdf.js` exists in your repository
- Check that the deployment completed successfully

**500 Error:**
- Check environment variables are set in Vercel
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (service role, not anon key)
- Check Vercel function logs for detailed error messages

**Storage Error:**
- Ensure the `lesson-pdfs` bucket exists in Supabase Storage
- Verify the bucket is public
- Check that `SUPABASE_SERVICE_ROLE_KEY` has storage permissions
