import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from 'vite-plugin-cloudflare';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      // Cloudflare Pages Functions configuration
      functionsDirectory: 'functions',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@functions': path.resolve('./functions'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    // Ensure we generate a clean build for Cloudflare Pages
    rollupOptions: {
      input: {
        main: path.resolve('./public/index.html'),
      },
    },
  },
  // Development server configuration
  server: {
    port: 3000,
    strictPort: true,
    open: true,
  },
}); 