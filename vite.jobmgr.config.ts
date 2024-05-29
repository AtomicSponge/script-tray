import path from 'node:path'
import { defineConfig } from 'vite'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [ renderer(), vue(), cssInjectedByJsPlugin() ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    rollupOptions: { input: path.join(__dirname, 'html/jobmgr.html') }
  },
  esbuild: {
    target: 'esnext'
  }
})
