/*
 * Filename:  settings.js
 * See README.md for usage information.
 * See LICENSE.md for copyright information.
 */

const { contextBridge, ipcRenderer } = require('electron')

let data = {}

ipcRenderer.on('send-json-data', (event, message) => {
    data.label = message.label
    data.old = message.json
    //  Trigger json data set
})

contextBridge.exposeInMainWorld(
    'settingsEditor',
    {
        submit: (jsonData) => {
            data.new = jsonData
            ipcRenderer.send('recieve-json-data', data)
        },

        jsonData: data.old
    }
)
