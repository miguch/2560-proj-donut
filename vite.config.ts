import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const port = parseInt(process.env.PORT) || 3000;

export default ({ mode }) => {
  // process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react()],

    server: {
      port: port,
      strictPort: true,
      proxy: {
        '/api': {
          target: {
            host: 'localhost',
            port: port + 1
          },
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
