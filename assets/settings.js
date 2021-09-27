/*
 * Filename:  settings.js
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
 * Test if data is json or not
 */
const isJson = (test) => {
    try { JSON.parse(test) } catch(e) { return false }
    return true
}

/*
 * Receive data from the main app
 */
ipcRenderer.on('send-json-data', (event, message) => {
    data.label = message.label
    //{ (isJson(message.json)) ? data.old = message.json : data.old = [] }
    data.old = message.json
    promiseFiller(data.old)
})

/*
 * Send data to renderer
 */
contextBridge.exposeInMainWorld(
    'settingsEditor',
    {
        /*
         * Receive data from renderer and send to main app
         */
        submit: (jsonData) => {
            //{ (isJson(jsonData)) ? data.new = jsonData : data.new = data.old }
            data.new = jsonData
            ipcRenderer.send('recieve-json-data', data)
        },

        jsonPromise: dataPromise
    }
)
