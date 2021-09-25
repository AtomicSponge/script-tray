const { ipcRenderer } = require('electron')

document.onload = () => {
    const editor = new JSONEditor(document.getElementById("jsonEditor"), {})

    ipcRenderer.on('send-json-data', (event, message) => {
        editor.set(message)
    })

    document.querySelector('#donebtn').addEventListener('click', () => {
        ipcRenderer.send('recieve-json-data', [])
        //ipcRenderer.send('recieve-json-data', editor.get())
    })
}
