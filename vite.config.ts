import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En GitHub Actions, GITHUB_REPOSITORY permite servir desde /<nombre-repo>/ (GitHub Pages).
const repoBase = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repoBase ? `/${repoBase}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
