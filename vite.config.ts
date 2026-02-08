import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: ['lucide-react'],
    esbuildOptions: {
      resolveExtensions: ['.jsx', '.js', '.ts', '.tsx'],
    },
  },
  build: {
    outDir: 'dist',
    // Vite automatically copies files from public/ to dist/ during build
    // This includes the _redirects file needed for Cloudflare Pages SPA routing
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    host: true, // listen on 0.0.0.0 so http://127.0.0.1:5173 and http://localhost:5173 both work
    port: 5173,
    strictPort: false,
    open: '/', // open browser when server starts (use npm run open-app if it doesn't)
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    // Proxy API routes to Vercel in development (for local testing)
    // In production, these routes are handled by Vercel serverless functions
    proxy: {
      '/api': {
        target: process.env.VITE_VERCEL_URL || 'https://your-vercel-app.vercel.app',
        changeOrigin: true,
        secure: true,
        // Only proxy in development if VERCEL_URL is set
        configure: (proxy, _options) => {
          // If no VERCEL_URL is set, the proxy will fail gracefully
          // and the app will try to use the relative path (which works in production)
        },
      },
    },
  },
});
