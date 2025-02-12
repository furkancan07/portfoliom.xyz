import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Bu satırı ekliyoruz, modern JavaScript özellikleri için esnext kullanıyoruz
  },
  server: {
    proxy: {
      '/api': process || 'https://portfoliom-is7q.onrender.com'
    }
  },
})
