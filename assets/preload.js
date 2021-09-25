//const fs = require('fs')

let data = {}

require('electron').ipcRenderer.on('send-json-data', (event, message) => {
    data.label = message.label
    data.old = message.json
    console.log(data)

    //const editor = new JSONEditor(document.getElementById("jsonEditor"), {})
    //editor.set(message.json)
})

//const editor = new JSONEditor(document.getElementById("jsonEditor"), {})
//editor.set(message.json)

require('electron').contextBridge.exposeInMainWorld(
    'settingsEditor',
    {
        submit: () => {
            //data.new = editor.get()
            data.new = 'somenewdata'
            console.log(data)
            require('electron').ipcRenderer.send('recieve-json-data', data)
        }
    }
)
