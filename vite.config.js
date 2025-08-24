import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Port séparé pour la sécurité
    host: '192.168.1.19'
  },
  publicDir: 'public'
}) 