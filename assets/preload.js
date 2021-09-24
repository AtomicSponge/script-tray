const JSONEditor = require('../node_modules/jsoneditor/dist/jsoneditor.min.js')

require('electron').ipcRenderer.on('send-json-data', (event, message) => {
    const container = document.getElementById("jsonEditor")
    const options = {}
    const editor = new JSONEditor(container, options)

    editor.set(message)
})

/*document.querySelector('#donebtn').addEventListener('click', () => {
    require('electron').ipcRenderer.invoke('recieve-json-data', (event, message) => {
        console.log(message)
    })
})*/
