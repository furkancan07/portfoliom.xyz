import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': 'https://portfoliom-is7q.onrender.com', // Bu proxy ayarı yerel geliştirme için geçerli
    },
    // Vercel'de, `server` kısmı genellikle yerel geliştirme için olduğu için
    // burada proxy ayarlarını koruyabilirsiniz.
  },

  build: {
    target: 'es2020',  // Vercel ile uyumlu olması için target'ı güncel tutmak gerekebilir
    outDir: 'dist',  // Vercel, dist klasörünü bekler
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
