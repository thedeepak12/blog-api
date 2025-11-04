import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
    },
    server: {
      port: 5173,
      strictPort: true,
      open: true,
    },
    define: {
      'process.env': {}
    },
  };
});
