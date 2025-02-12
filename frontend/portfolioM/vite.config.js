import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://portfoliom-is7q.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },

  // Add build options
  build: {
    sourcemap: false,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          pdf: ['pdfmake', 'pdfmake/build/vfs_fonts']
        }
      }
    }
  },

  // Add optimizations
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'pdfmake',
      'pdfmake/build/vfs_fonts'
    ]
  },

  // Modern JavaScript özelliklerini etkinleştir
  esbuild: {
    target: 'esnext'
  }
})