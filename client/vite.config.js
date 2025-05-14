import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600, // Increased from default 500 KB to 600 KB
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group modules into chunks based on their path
          if (id.includes('node_modules')) {
            // Group major third-party libraries
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            
            if (id.includes('react-router-dom/')) {
              return 'vendor-router';
            }
            
            if (id.includes('@mui/') || id.includes('@emotion/') || id.includes('react-icons/')) {
              return 'vendor-ui';
            }
            
            if (id.includes('axios') || id.includes('crypto-js') || id.includes('react-toastify')) {
              return 'vendor-utils';
            }
            
            // Group all other node modules
            return 'vendor-misc';
          }
          
          // Group app code by feature/module
          if (id.includes('/pages/auth/')) {
            return 'auth';
          }
          
          if (id.includes('/pages/article/')) {
            return 'article';
          }
          
          if (id.includes('/pages/journal/')) {
            return 'journal';
          }
          
          if (id.includes('/pages/reviewer/')) {
            return 'reviewer';
          }
          
          // Keep components and utilities together
          if (id.includes('/components/')) {
            return 'components';
          }
          
          if (id.includes('/utils/')) {
            return 'utils';
          }
        }
      }
    },
    sourcemap: true,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // Enable brotli and gzip compression
  server: {
    open: true,
    cors: true
  },
  // Add image optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  }
})
