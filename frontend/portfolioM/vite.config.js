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
  },

  build: {
    target: 'es2022',  // ES2022 olarak güncelledik
    outDir: 'dist',  // Vercel, dist klasörünü bekler
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
