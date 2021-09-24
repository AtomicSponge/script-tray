const editor = new JSONEditor(document.getElementById("jsonEditor"), {})

require('electron').ipcRenderer.on('send-json-data', (event, message) => {
    editor.set(JSON.parse(message))
})

/*document.querySelector('#donebtn').addEventListener('click', () => {
    require('electron').ipcRenderer.invoke('recieve-json-data', (event, message) => {
        console.log(message)
    })
})*/
