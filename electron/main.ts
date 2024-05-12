/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

//import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'
import path from 'node:path'

import { app, dialog, ipcMain, BrowserWindow, Menu, MenuItem, Tray } from 'electron'
import AutoLaunch from 'auto-launch'

import { appInfo, __dirname } from './appInfo'
import { appSettings } from './appSettings'
import { scriptBuffer } from './scriptBuffer'

//const require = createRequire(import.meta.url)

const autoLauncher = new AutoLaunch({ name: 'script_tray' })
appSettings.load()  //  Load settings on startup

//  Verify auto launch is enabled if it should be
autoLauncher.isEnabled().then((enabled) => {
  if (enabled) return
  if (appSettings.startup) autoLauncher.enable()
}).catch((_error:any) => {})

//  Windows & tray objects
let bufferWin:BrowserWindow | null
let settingsWin:BrowserWindow | null
let inputWin:BrowserWindow | null
let appTray:Tray | null

/** Window for output buffer */
const bufferWindow = ():void => {
  bufferWin = new BrowserWindow({
    icon: appInfo.icon,
    title: `${appInfo.name} - Output Buffer`,
    width: 800,
    height: 600,
    fullscreen: false,
    fullscreenable: false,
    autoHideMenuBar: true
  })
  //bufferWin.webContents.send('send-buffer-data', scriptBuffer.read())
  bufferWin.on('close', (_event) => {
    bufferWin?.destroy()
  })
  {(process.env.VITE_DEV_SERVER_URL) ?
    bufferWin.loadURL(path.posix.join(process.env.VITE_DEV_SERVER_URL, 'html/buffer.html')) :
    bufferWin.loadFile(path.join(__dirname, '../dist/html/buffer.html'))}
}

/** Window for editing settings */
const settingsEditorWindow = ():void => {
  settingsWin = new BrowserWindow({
    icon: appInfo.icon,
    title: `${appInfo.name} - Editing Menu`,
    width: 800,
    height: 600,
    fullscreen: false,
    fullscreenable: false,
    autoHideMenuBar: true
  })
  settingsWin.on('close', (_event) => {
    settingsWin?.destroy()
  })
  {(process.env.VITE_DEV_SERVER_URL) ?
    settingsWin.loadURL('http://localhost:5174/html/settings.html') :
    settingsWin.loadFile(path.join(__dirname, '../dist/html/settings.html'))}
}

/* Event handler to send settings data to window */
ipcMain.handle('send-settings-data', () => { return appSettings.getJSON })

/* Event handler for receiving settings */
ipcMain.on('save-settings-data', async (_event, data) => {
  if (appSettings.getJSON !== data) {
    if (dialog.showMessageBoxSync(<BrowserWindow>settingsWin, {
      type: 'question',
      title: 'Confirm',
      buttons: ['Yes', 'No'],
      message: 'Save changes?'
    }) === 0) {
      appSettings.setJSON = data
      appSettings.save()
      appTray?.setContextMenu(buildMenu())
    }
  }
})

/* Event handler for resetting settings */
ipcMain.on('reset-settings-data', async () => {
  if (dialog.showMessageBoxSync({
    type: 'question',
    title: `${appInfo.name} - Confirm`,
    buttons: ['Yes', 'No'],
    message: 'Are you sure you want to reset settings?'
  }) === 0) {
    appSettings.reset()
    appTray?.setContextMenu(buildMenu())
  }
})

/** Wrapper to Promise class to access functions */
class Resolver {
  promise:Promise<any>
  reject:Function = () => {}
  resolve:Function = () => {}
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}
const resolveInputWin = new Resolver()

/** Data for the Input Window */
interface inputWinData {
  label:string    //  
  command:string  //
}

/** Window for argument input */
const inputWindow = (data:inputWinData):void => {
  inputWin = new BrowserWindow({
    icon: appInfo.icon,
    title: `${appInfo.name} - ${data.label}`,
    width: 400,
    height: 100,
    fullscreen: false,
    fullscreenable: false,
    autoHideMenuBar: true
  })
  inputWin.on('close', (_event) => {
    resolveInputWin.reject('winCanceledEvent')
    inputWin?.destroy()
  })
  inputWin.webContents.on('did-finish-load', () => {
    inputWin?.webContents.send('send-input-data', data)
  })
  {(process.env.VITE_DEV_SERVER_URL) ?
    inputWin.loadURL('http://localhost:5175/html/input.html') :
    inputWin.loadFile(path.join(__dirname, '../dist/html/input.html'))}
}

/* Event handler for receiving data from the input box */
ipcMain.on('recieve-input-data', (_event, data) => {
  resolveInputWin.resolve(data)
  inputWin?.destroy()
})

/** About message box */
const aboutMessageBox = ():void => {
  dialog.showMessageBox({
    type: 'info',
    title: `About ${appInfo.name}`,
    message: `${appInfo.name}\nVersion:  ${appInfo.version}`,
    detail:
      `Author:  ${appInfo.author}\n` +
      `${appInfo.websiteURL}\n\n` +
      `License:  ${appInfo.license}\n` +
      `${appInfo.licenseURL}`,
    icon: appInfo.icon
  })
}

/** Builds the system tray menu */
const buildMenu = ():Menu => {
  /**
   * Build the main menu part
   * @param menu Menu item to append to
   */
  const buildMain = (menu:Menu):void => {
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: `Show Output Buffer`,
      click: () => { bufferWindow() }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({ label: 'Settings',
      click: () => { settingsEditorWindow() }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: `About ${appInfo.name}`,
      click: () => { aboutMessageBox() }
    }))
    menu.append(new MenuItem({ label: `Close ${appInfo.name}`, role: 'quit' }))
  }

  /**
   * Build the launcher menu part
   * @param menu Menu item to append to
   * @param collection Menu items to process
   */
  const buildLauncher = (menu:Menu, collection:Array<any>):void => {
    interface commandItem {
      label:string
      cmd:string
      args?:Array<string>
    }
    /**
     * Function to run a command
     * @param item Menu item calling the run
     * @param cmd Command to run
     */
    const CommandRunner = (item:commandItem, cmd:string):void => {
      if (appSettings.debug)
        dialog.showMessageBox({
          type: 'info',
          title: appInfo.name,
          message: `Running command '${item.label}'`,
          detail: `Command:  ${cmd}`,
          icon: appInfo.icon
        })

      try {
        const cmdRes = execSync(cmd, { windowsHide: !appSettings.debug })
        scriptBuffer.write(`${cmd}\n` + cmdRes.toString())
      } catch (error:any) {
        dialog.showErrorBox(`${appInfo.name} - ${item.label}`,
          `Command:  ${item.cmd}\nError:  ${error.message}`)
        scriptBuffer.write(`Command:  ${item.cmd}\nError:  ${error.message}`)
      }
    }

    /**
     * Async version of forEach
     * @param array Array of items
     * @param callback Callback to run on each item
     */
    const asyncForEach = async (array:Array<any>, callback:Function):Promise<void> => {
      for (let index = 0; index < array.length; index++)
        await callback(array[index], index, array)
    }

    collection.forEach((item:any) => {
      if (Array.isArray(item)) {  //  Item is a sub menu
        const menuTitle = item.shift()  //  Get the title item
        if (menuTitle.menu === undefined) {
          dialog.showErrorBox(`${appInfo.name}`,
            `Error building menu, incorrect title menu item.\n\n${Object.keys(item)}`)
          return
        }
        const tempMenu = new Menu()
        buildLauncher(tempMenu, item)  //  Recursive call to keep building menus
        //  Add the generated sub menu
        menu.append(new MenuItem({ label: menuTitle.menu, submenu: tempMenu}))
        return  //  Next item
      }
      if (item.separator !== undefined) {  //  Item is a seperator
        menu.append(new MenuItem({ type: 'separator' }))
        return  //  Next item
      }
      if (item.label !== undefined && item.cmd !== undefined) {  //  Item is a command
        menu.append(new MenuItem({
          label: item.label,
          click: () => {
            if (item.args === undefined) CommandRunner(item, <string>item.cmd)
            else
              (async () => {
                let runCanceled:boolean = false
                let runCmd:string = <string>item.cmd
                await asyncForEach(<Array<string>>item.args, async (arg:string) => {
                  inputWindow({ label: arg, command: <string>item.cmd })
                  await resolveInputWin.promise.then(res => {
                    runCmd += ' ' + res.new
                  }).catch(_res => { runCanceled = true })
                })
                if (runCanceled) {
                  dialog.showMessageBox({
                    type: 'info',
                    title: appInfo.name,
                    message: `Command canceled '${item.label}'`,
                    detail: `Command:  ${item.cmd}\n${runCmd}`,
                    icon: appInfo.icon
                  })
                } else CommandRunner(item, runCmd)
              })()
          }
        }))
        return  //  Next item
      }
      //  Item wasn't processed, so there's a problem with the format
      dialog.showErrorBox(`${appInfo.name}`,
        `Error building menu, incorrect menu item.\n\n` +
        `${Object.keys(item)}\n${Object.values(item)}`)
    })
  }

  /* Generate the complete menu */
  const menu = new Menu()
  buildLauncher(menu, appSettings.launchMenu)
  buildMain(menu)
  if (appSettings.debug) console.log(menu)  //  Change to send to buffer
  return menu
}

/* Close tray and windows on exit */
app.on('before-quit', () => {
  bufferWin?.destroy()
  settingsWin?.destroy()
  inputWin?.destroy()
  appTray?.destroy()
})

/* Make sure app doesn't quit when no windows are open */
app.on('window-all-closed', () => {})

/* Run Script Tray app */
app.whenReady().then(async () => {
  appTray = new Tray(appInfo.icon)
  appTray.setToolTip(appInfo.name)
  appTray.setTitle(appInfo.name)
  appTray.setContextMenu(buildMenu())
})
