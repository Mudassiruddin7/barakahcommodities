import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    // The 3D stack is large but entirely deferred; the warning would
    // only ever fire for that chunk, which is by design.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;

          // three + R3F + drei travel together and load behind Stage.
          if (
            id.includes('/three/') ||
            id.includes('@react-three') ||
            id.includes('/three-mesh-bvh/') ||
            id.includes('/three-stdlib/')
          ) {
            return 'three';
          }

          if (id.includes('/gsap/')) return 'gsap';
          if (id.includes('framer-motion') || id.includes('/motion-dom/')) return 'motion';
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) {
            return 'react';
          }
        },
      },
    },
  },
});
