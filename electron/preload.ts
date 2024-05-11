/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import { ipcRenderer, contextBridge } from 'electron'

import { settings } from './settings'
import type { settingsJSON } from './settings'

contextBridge.exposeInMainWorld('traySettings', {
  saveSettings: (data:settingsJSON) => {
    ipcRenderer.send('save-settings-data', data)
  },
  resetSettings: () => {
    ipcRenderer.send('reset-settings-data', true)
  },
  data: settings.getJSON
})
