/*
 * Filename:  settings.js
 * See README.md for usage information.
 * See LICENSE.md for copyright information.
 */

const { contextBridge, ipcRenderer } = require('electron')

let data = {}
let dataPromise = {}

ipcRenderer.on('send-json-data', (event, message) => {
    data.label = message.label
    data.old = message.json
    //  Trigger json data set
    dataPromise = new Promise((resolve, reject) => {
        resolve = () => { return message.json }
    })
})

contextBridge.exposeInMainWorld(
    'settingsEditor',
    {
        submit: (jsonData) => {
            data.new = jsonData
            ipcRenderer.send('recieve-json-data', data)
        },

        jsonPromise: dataPromise
    }
)
