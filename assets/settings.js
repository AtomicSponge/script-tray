/*
 * Filename:  settings.js
 * See README.md for usage information.
 * See LICENSE.md for copyright information.
 */

const { contextBridge, ipcRenderer } = require('electron')

let data = {}
let dataPromise = {}

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
    { (isJson(message.json)) ? data.old = message.json : data.old = [] }
    //  Trigger json data set
    //dataPromise = new Promise((resolve, reject) => {
        //resolve = () => { return message.json }
    //})
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
            { (isJson(jsonData)) ? data.new = jsonData : data.new = data.old }
            ipcRenderer.send('recieve-json-data', data)
        },

        dataPromise: Promise.resolve(data.old)
    }
)
