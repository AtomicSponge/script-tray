require('electron').ipcRenderer.on('jsondata', (event, message) => {
    console.log(message)
})

document.querySelector('#donebtn').addEventListener('click', () => {
    //
})
