import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Port séparé pour la sécurité
    host: '192.168.1.19'
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Configuration optimisée pour Railway
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0'
  }
}) 