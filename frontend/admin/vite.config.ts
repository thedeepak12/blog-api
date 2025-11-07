import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/admin/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    open: '/admin/',
  },
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  }
}))
