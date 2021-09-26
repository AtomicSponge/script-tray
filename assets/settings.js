/*
 * Filename:  settings.js
 * See README.md for usage information.
 * See LICENSE.md for copyright information.
 */

const { contextBridge, ipcRenderer } = require('electron')

let data = {}
let dataPromise = {}

/*
 *
 */
const isJson = (test) => {
    try { JSON.parse(test) } catch(e) { return false }
    return true
}

/*
 *
 */
ipcRenderer.on('send-json-data', (event, message) => {
    data.label = message.label
    data.old = message.json
    //  Trigger json data set
    dataPromise = new Promise((resolve, reject) => {
        resolve = () => { return message.json }
    })
})

/*
 *
 */
contextBridge.exposeInMainWorld(
    'settingsEditor',
    {
        submit: (jsonData) => {
            { (isJson(jsonData)) ? data.new = jsonData : data.new = data.old }
            ipcRenderer.send('recieve-json-data', data)
        },

        jsonPromise: dataPromise
    }
)
