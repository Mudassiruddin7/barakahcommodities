import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;

          if (id.includes('/gsap/') || id.includes('@gsap') || id.includes('/lenis/')) return 'motion';
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) {
            return 'react';
          }
        },
      },
    },
  },
});
