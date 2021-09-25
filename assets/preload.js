/*
 * Filename:  preload.js
 * See README.md for usage information.
 * See LICENSE.md for copyright information.
 */

const { contextBridge, ipcRenderer } = require('electron')
//const fs = require('fs')

let data = {}

ipcRenderer.on('send-json-data', (event, message) => {
    data.label = message.label
    data.old = message.json
    console.log(data)

    //const editor = new JSONEditor(document.getElementById("jsonEditor"), {})
    //editor.set(message.json)
})

//const editor = new JSONEditor(document.getElementById("jsonEditor"), {})
//editor.set(message.json)

contextBridge.exposeInMainWorld(
    'settingsEditor',
    {
        submit: () => {
            //data.new = editor.get()
            data.new = 'somenewdata'
            console.log(data)
            ipcRenderer.send('recieve-json-data', data)
        }
    }
)
