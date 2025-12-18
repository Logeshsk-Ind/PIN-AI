import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      }
    },
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            'gemini': ['@google/genai'],
            'ui': ['react', 'react-dom', 'react-markdown', 'lucide-react'],
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@google/genai', 'react', 'react-dom', 'react-markdown', 'lucide-react']
    }
  };
});
