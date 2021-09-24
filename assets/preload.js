require('electron').ipcRenderer.on('send-data', (event, message) => {
    console.log(message)
})

document.querySelector('#donebtn').addEventListener('click', () => {
    require('electron').ipcRenderer.invoke('recieve-data', (event, message) => {
        console.log(message)
    })
})
