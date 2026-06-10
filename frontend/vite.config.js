import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Serve on port 3000 during dev
    proxy: {
      '/auth': {
        target: 'http://localhost:5050',
        changeOrigin: true
      },
      '/conflicts': {
        target: 'http://localhost:5050',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:5050',
        changeOrigin: true
      },
      '/version': {
        target: 'http://localhost:5050',
        changeOrigin: true
      }
    }
  }
});
