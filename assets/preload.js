let data = {}

document.onload = () => {
    const editor = new JSONEditor(document.getElementById("jsonEditor"), {})
    editor.set(message.json)

    document.querySelector('#donebtn').addEventListener('click', () => {
        //data.new = editor.get()
        data.new = 'somenewdata'
        console.log(data)
        require('electron').ipcRenderer.send('recieve-json-data', data)
    })
}

require('electron').ipcRenderer.on('send-json-data', (event, message) => {
    console.log(message)
    data.label = message.label
    data.old = message.json
})
