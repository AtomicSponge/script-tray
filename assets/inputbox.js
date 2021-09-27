/*
 * Filename:  inputbox.js
 * See README.md for usage information.
 * See LICENSE.md for copyright information.
 */

const { contextBridge, ipcRenderer } = require('electron')

let data = {}
let promiseFiller = {}
const dataPromise = new Promise((resolve, reject) => {
    promiseFiller = resolve
})

/*
 * Receive data from the main app
 */
ipcRenderer.on('send-input-data', (event, message) => {
    { (message.label === undefined) ? data.label = 'arg' : data.label = message.label }
    { (message.command === undefined) ? data.command = undefined : data.command = message.command }
    { (message.data === undefined) ? data.old = '' : data.old = message.data }
    promiseFiller(data)
})

/*
 * Send data to renderer
 */
contextBridge.exposeInMainWorld(
    'inputBridge',
    {
        /*
         * Receive data from renderer and send to main app
         */
        submit: (inData) => {
            data.new = inData
            ipcRenderer.send('recieve-input-data', data)
        },

        inputPromise: dataPromise
    }
)
