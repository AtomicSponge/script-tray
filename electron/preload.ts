/**
 * 
 * @author Matthew Evans
 * @module script-tray
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
  },
  verifyCwd: (data:string):void => {
    ipcRenderer.send('verify-cwd', data)
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

contextBridge.exposeInMainWorld('jobMgrAPI', {
  termProcess: (data:number):void => {
    ipcRenderer.send('send-term-process', data)
  },
  onReceiveData: (callback:Function):void => {
    ipcRenderer.on('send-job-data', (_event, value) => callback(value))
  }
})
