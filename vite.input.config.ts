import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [ vue() ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: path.join(__dirname, 'html/input.html'),
    },
  },
})
