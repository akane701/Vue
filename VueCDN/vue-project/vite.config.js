import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    hmr: {
      host: 'localhost',
   },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // devServer: {
  //   proxy: {
  //     '^/backend-express-db': {
  //       target: 'http://localhost:3000/backend-express-db',
  //       changeOrigin: true,
  //       pathRewrite: { "^/backend-express-db": "/backend-express-db" }
  //     },
  //     // '^/backend-express-db/delete': {
  //     //   target: 'http://localhost:3000/backend-express-db/delete',
  //     //   changeOrigin: true,
  //     //   pathRewrite: { "^/backend-express-db/delete": "/backend-express-db/delete" }
  //     // },
  //   }
  // }
})
