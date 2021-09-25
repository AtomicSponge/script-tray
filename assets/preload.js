let data = {}

document.onload = () => {
    const editor = new JSONEditor(document.getElementById("jsonEditor"), {})

    require('electron').ipcRenderer.on('send-json-data', (event, message) => {
        editor.set(message.json)
        data.label = message.label
        data.old = message
    })

    document.querySelector('#donebtn').addEventListener('click', () => {
        data.new = editor.get()
        require('electron').ipcRenderer.send('recieve-json-data', data)
    })
}
