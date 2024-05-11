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
import { settings } from './settings'
import { scriptbuffer } from './scriptbuffer'

//const require = createRequire(import.meta.url)

const autoLauncher = new AutoLaunch({ name: 'script_tray' })
settings.load()  //  Load settings on startup

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
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'buffer-preload.mjs'),
    }
  })
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
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'settings-preload.mjs'),
    }
  })
  settingsWin.on('close', (_event) => {
    settingsWin?.destroy()
  })
  settingsWin.webContents.on('did-finish-load', () => {
    settingsWin?.webContents.send('send-json-data', settings.launchMenu)
  })
  {(process.env.VITE_DEV_SERVER_URL) ?
    settingsWin.loadURL('http://localhost:5174/html/settings.html') :
    settingsWin.loadFile(path.join(__dirname, '../dist/html/settings.html'))}
}

/* Event handler for receiving settings */
ipcMain.on('recieve-settings-data', async (_event, data) => {
  if (data.old !== data.new) {
    //  Ask to save if data changed
    if (dialog.showMessageBoxSync(<BrowserWindow>settingsWin, {
      type: 'question',
      title: 'Confirm',
      buttons: ['Yes', 'No'],
      message: 'Save changes?'
    }) === 0) {
      settings.launchMenu = data.new
      settings.save()
      appTray?.setContextMenu(await buildMenu())
    }
  }
  settingsWin?.destroy()
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
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'input-preload.mjs'),
    }
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
const buildMenu = async ():Promise<Menu> => {
  /**
   * Build the main menu part
   * @param menu Menu item to append to
   */
  const Main = async (menu:Menu):Promise<void> => {
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: `Show Output Buffer`,
      click: () => { bufferWindow() }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    {
      const optionsMenu = new Menu()
      await Options(optionsMenu)
      menu.append(new MenuItem({label: 'Settings', submenu: optionsMenu}))
    }
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: `About ${appInfo.name}`,
      click: () => { aboutMessageBox() }
    }))
    menu.append(new MenuItem({ label: `Close ${appInfo.name}`, role: 'quit' }))
  }

  /**
   * Build the options (settings) menu part
   * @param menu Menu item to append to
   */
  const Options = async (menu:Menu):Promise<void> => {
    menu.append(new MenuItem({ label: 'Edit Command Menu',
      click: () => { settingsEditorWindow() }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: 'Start at login',
      type: 'checkbox',
      checked: (await autoLauncher.isEnabled()) ? true : false,
      click: (item) => { 
        try {
          (item.checked) ? autoLauncher.enable() : autoLauncher.disable()
        } catch (error:any) {
          dialog.showErrorBox(`${appInfo.name}`, `${error.message}`)
        }
      }
    }))
    menu.append(new MenuItem({
      label: 'Enable debugging',
      type: 'checkbox',
      checked: (settings.debug) ? true : false,
      click: (item) => {
        { (item.checked) ? settings.debug = true : settings.debug = false }
        settings.save()
      }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: 'Reset settings',
      click: async () => {
        if (dialog.showMessageBoxSync({
          type: 'question',
          title: `${appInfo.name} - Confirm`,
          buttons: ['Yes', 'No'],
          message: 'Are you sure you want to reset settings?'
        }) === 0) {
          settings.reset()
          appTray?.setContextMenu(await buildMenu())
        }
      }
    }))
  }

  /**
   * Build the launcher menu part
   * @param menu Menu item to append to
   * @param collection Menu items to process
   */
  const Launcher = (menu:Menu, collection:Array<any>):void => {
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
      if (settings.debug)
        dialog.showMessageBox({
          type: 'info',
          title: appInfo.name,
          message: `Running command '${item.label}'`,
          detail: `Command:  ${cmd}`,
          icon: appInfo.icon
        })

      try {
        const cmdRes = execSync(cmd, { windowsHide: !settings.debug })
        scriptbuffer.write(`${cmd}\n` + cmdRes.toString())
      } catch (error:any) {
        dialog.showErrorBox(`${appInfo.name} - ${item.label}`,
          `Command:  ${item.cmd}\nError:  ${error.message}`)
        scriptbuffer.write(`Command:  ${item.cmd}\nError:  ${error.message}`)
      }
    }

    /**
     * Async version of forEach
     * @param array Array of items
     * @param callback Callback to run on each item
     */
    const AsyncForEach = async (array:Array<any>, callback:Function):Promise<void> => {
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
        Launcher(tempMenu, item)  //  Recursive call to keep building menus
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
                await AsyncForEach(<Array<string>>item.args, async (arg:string) => {
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
  /*
   * Generate the complete menu
   */
  const menu = new Menu()
  Launcher(menu, settings.launchMenu)
  await Main(menu)
  if (settings.debug) console.log(menu)  //  Change to send to buffer
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
  appTray.setContextMenu(await buildMenu())
})
