import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served at the root of the Vercel project domain
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    allowedHosts: ['liff-swart.vercel.app', 'unrarefied-eugenic-azaria.ngrok-free.dev'],
  },
});
