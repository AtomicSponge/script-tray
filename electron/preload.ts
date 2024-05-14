/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('bufferAPI', {
  onUpdateBuffer: (callback:Function):void => {
    ipcRenderer.on('send-buffer-data', (_event, value) => callback(value))
  }
})

contextBridge.exposeInMainWorld('settingsAPI', {
  saveSettings: (data:SettingsIpc):void => {
    ipcRenderer.send('save-settings-data', data)
  },
  resetSettings: ():void => {
    ipcRenderer.send('reset-settings-data', true)
  },
  onUpdateSettings: (callback:Function):void => {
    ipcRenderer.on('send-settings-data', (_event, value) => callback(value))
  }
})

contextBridge.exposeInMainWorld('inputAPI', {
  sendInput: (data:string):void => {
    ipcRenderer.send('recieve-input-data', data)
  },
  onReceiveData: (callback:Function):void => {
    ipcRenderer.on('send-input-data', (_event, value) => callback(value))
  }
})
