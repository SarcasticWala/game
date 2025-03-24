import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}, // Define process.env to avoid the error
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});

