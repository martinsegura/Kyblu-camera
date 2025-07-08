import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [topLevelAwait()],
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['@farcaster/miniapp-sdk'],
    }
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        'top-level-await': true,
      }
    }
  }
});
