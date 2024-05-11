/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import { ipcRenderer, contextBridge } from 'electron'

let data = {}
let promiseResolver = {}
const dataPromise = new Promise((resolve, _reject) => {
  promiseResolver = resolve
})

//  Receive data from the main app
ipcRenderer.on('send-settings-data', (event, message) => {
  data.label = message.label
  data.old = message.json
  promiseResolver(data.old)
})

//  Send data to renderer
contextBridge.exposeInMainWorld(
  'settingsBridge',
  {
    //  Receive data from renderer and send to main app
    submit: (jsonData) => {
      data.new = jsonData
      ipcRenderer.send('recieve-settings-data', data)
    },
    jsonPromise: dataPromise
  }
)
