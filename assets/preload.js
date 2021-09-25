const { ipcRenderer } = require('electron')

let data = {}

document.onload = () => {
    const editor = new JSONEditor(document.getElementById("jsonEditor"), {})

    ipcRenderer.on('send-json-data', (event, message) => {
        editor.set(message.json)
        data.label = message.label
        data.old = message
    })

    document.querySelector('#donebtn').addEventListener('click', () => {
        data.new = editor.get()
        ipcRenderer.send('recieve-json-data', data)
    })
}
