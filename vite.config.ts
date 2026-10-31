import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function diskStoragePlugin(): Plugin {
  const handler = (req: any, res: any, next: any) => {
    const url = req.url?.split('?')[0];
    if (url === '/api/kata-storage') {
      const filePath = path.resolve(__dirname, 'kata_data.json');
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        if (fs.existsSync(filePath)) {
          try {
            return res.end(fs.readFileSync(filePath, 'utf-8'));
          } catch (e) {
            return res.end(JSON.stringify(null));
          }
        }
        return res.end(JSON.stringify(null));
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          try {
            fs.writeFileSync(filePath, body, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true }));
          } catch (e) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: String(e) }));
          }
        });
        return;
      }
    } else if (url === '/api/forge-storage') {
      const filePath = path.resolve(__dirname, 'forge_data.json');
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        if (fs.existsSync(filePath)) {
          try {
            return res.end(fs.readFileSync(filePath, 'utf-8'));
          } catch (e) {
            return res.end(JSON.stringify(null));
          }
        }
        return res.end(JSON.stringify(null));
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          try {
            fs.writeFileSync(filePath, body, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true }));
          } catch (e) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: String(e) }));
          }
        });
        return;
      }
    }
    next();
  };

  return {
    name: 'disk-storage-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), diskStoragePlugin()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-utils': ['canvas-confetti', 'zustand']
        }
      }
    }
  }
});
