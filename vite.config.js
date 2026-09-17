import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3737,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            // Silently handle backend offline state so terminal is not spammed with ECONNREFUSED
            if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
              if (res && typeof res.writeHead === 'function' && !res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Backend server offline (port 3001). Using client mock data.' }));
              }
              return;
            }
          });
        }
      }
    }
  }
});
