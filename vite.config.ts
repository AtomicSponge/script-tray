import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import multiple from 'vite-plugin-multiple'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig(() => {
  fs.rmSync(path.join(__dirname, 'dist-electron'), { recursive: true, force: true })

  return {
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
      electron({
        main: { entry: 'electron/main.ts' },
        preload: { input: path.join(__dirname, 'electron/preload.ts') }
      }),
      multiple([
        {
          name: 'buffer',
          config: 'vite.buffer.config.ts',
        },
        {
          name: 'input',
          config: 'vite.arg-input.config.ts',
        },
        {
          name: 'jobmgr',
          config: 'vite.jobmgr.config.ts',
        }
      ])
    ],
    build: {
      rollupOptions: { input: path.join(__dirname, 'html/settings.html') }
    }
  }
})
