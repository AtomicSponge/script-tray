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

//  Receive data from the main app
ipcRenderer.on('send-input-data', (event, message) => {
  { (message.label === undefined) ? data.label = 'arg' : data.label = message.label }
  { (message.command === undefined) ? data.command = undefined : data.command = message.command }
  { (message.data === undefined) ? data.old = '' : data.old = message.data }
  promiseResolver(data)
})

//  Send data to renderer
contextBridge.exposeInMainWorld('input', {
  //  Receive data from renderer and send to main app
  submit: (inData) => {
    data.new = inData
    ipcRenderer.send('recieve-input-data', data)
  },
  inputPromise: dataPromise
})
