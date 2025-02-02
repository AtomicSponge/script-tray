import path from 'node:path'
import { defineConfig } from 'vite'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [ renderer(), vue(), vuetify({ autoImport: true }) ],
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
