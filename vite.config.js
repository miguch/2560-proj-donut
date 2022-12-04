import vue from '@vitejs/plugin-vue2'
import path from "path";
import glob from "glob";

export default {
  root: path.join(__dirname, "frontend"),
  publicDir: path.join(__dirname, "frontend/public"),
  build: {
    outDir: path.join(__dirname, "frontend/dist"),
    rollupOptions: {
      input: path.join(__dirname, "frontend/src/main.js"),
    },
  },
  plugins: [vue()]
}
