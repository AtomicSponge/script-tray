import path from 'node:path'
import { defineConfig } from 'vite'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [ renderer(), vue() ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    rollupOptions: { input: path.join(__dirname, 'html/arg-input.html') }
  },
  esbuild: {
    target: 'esnext'
  }
})
