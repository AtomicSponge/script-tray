import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import multiple from 'vite-plugin-multiple'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig(() => {
  fs.rmSync(path.join(__dirname, 'dist-electron'), { recursive: true, force: true })

  return {
    plugins: [
      vue(), cssInjectedByJsPlugin(),
      electron({
        main: { entry: 'electron/main.ts' },
        preload: { input: path.join(__dirname, 'electron/preload.ts') }
      }),
      multiple([
        {
          name: 'input',
          config: 'vite.arg-input.config.ts',
        },
        {
          name: 'settings',
          config: 'vite.settings.config.ts',
        },
        {
          name: 'jobmgr',
          config: 'vite.jobmgr.config.ts',
        }
      ])
    ],
    build: {
      rollupOptions: { input: path.join(__dirname, 'html/buffer.html') }
    }
  }
})
