document.onload = () => {
    const editor = new JSONEditor(document.getElementById("jsonEditor"), {})

    require('electron').ipcRenderer.on('send-json-data', (event, message) => {
        editor.set(message)
    })

    document.querySelector('#donebtn').addEventListener('click', () => {
        require('electron').ipcRenderer.invoke('recieve-json-data', message).then((result) => {
            message = editor.get()
        })
    })
}
