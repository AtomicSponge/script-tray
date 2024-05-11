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
import { scriptbuffer } from './scriptbuffer'
import type { settingsJSON } from './settings'

contextBridge.exposeInIsolatedWorld(4201, 'bufferAPI', {
  getData: ():string => {
    return scriptbuffer.read()
  }
})

contextBridge.exposeInMainWorld('settingsAPI', {
  saveSettings: (data:settingsJSON):void => {
    ipcRenderer.send('save-settings-data', data)
  },
  resetSettings: ():void => {
    ipcRenderer.send('reset-settings-data', true)
  },
  data: settings.getJSON
})

contextBridge.exposeInIsolatedWorld(4203, 'inputAPI', {
  //
})
