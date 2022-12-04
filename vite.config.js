import vue from '@vitejs/plugin-vue2'
import path from "path";
import glob from "glob";

const port = parseInt(process.env.PORT) || 3000;

export default {
  root: path.join(__dirname, "frontend"),
  publicDir: path.join(__dirname, "frontend/public"),
  build: {
    outDir: path.join(__dirname, "frontend/dist"),
    rollupOptions: {
      input: path.join(__dirname, "frontend/src/main.js"),
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },
  server: {
    port: port,
    strictPort: true,
    proxy: {
      '/api': {
        target: {
          host: 'localhost',
          port: port + 1,
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}
