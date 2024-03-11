import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // https: true,
    host: "0.0.0.0",
    port: 3001,
    open: true,
    cors: true,
    secure: false,
    proxy: {
      "/api": {
        target: "https://owlto.finance",
        changeOrigin: true,
        secure: false,
      },
      "/multi-balance": {
        target: "https://owlto.finance",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),

    // Workaround
    {
      name: 'load+transform-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null;
        }

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic', // 👈 this is important
        });
      },
    },
    // End workaround

  ],

  // Workaround before renaming .js to .jsx
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
