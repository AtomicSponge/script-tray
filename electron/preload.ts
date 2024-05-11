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

contextBridge.exposeInIsolatedWorld(4201, 'bufferAPI', {
  getData: ():string => {
    return scriptbuffer.read()
  }
})

contextBridge.exposeInMainWorld('settingsAPI', {
  saveSettings: (data:JSON):void => {
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
