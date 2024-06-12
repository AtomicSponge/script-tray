/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import fs from 'node:fs'
import path from 'node:path'
import { exec } from 'node:child_process'

import { app, dialog, session, ipcMain, BrowserWindow, Menu, MenuItem, Tray } from 'electron'
import AutoLaunch from 'auto-launch'
import { asyncForEach } from '@spongex/async-for-each'
import { AsyncResolver } from '@spongex/async-resolver'
import { __locale } from '@spongex/system-locale'

import { formatDate } from './lib/formatDate'
import { AppSettings } from './lib/AppSettings'
import { ScriptBuffer } from './lib/ScriptBuffer'
import { ProcessManager } from './lib/ProcessManager'

process.env.APP_ROOT = path.join(__dirname, '..')
const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

/** Process command arguments */
const flags = { trayData: true, bufferData: true }
process.argv.forEach(arg => {
  if(arg === '--no-load-traydata') flags.trayData = false
  if(arg === '--no-load-bufferdata') flags.bufferData = false
})

/** App information */
const appInfo = {
  name: 'Script Tray',
  version: '2.0.0',
  author: 'Matthew Evans',
  websiteURL: 'https://scripttray.wtfsystems.net/',
  githubURL: 'https://github.com/AtomicSponge/script-tray',
  license: 'MIT',
  licenseURL: 'https://mit-license.org',
  icon: path.join(process.env.VITE_PUBLIC, 'icon-512x512.png'),
  iconURL: 'http://www.onlinewebfonts.com',
  iconLicenseURL: 'https://creativecommons.org/licenses/by/4.0/'
}

const autoLauncher:AutoLaunch = new AutoLaunch({ name: 'script-tray' })
const appSettings:AppSettings = (() => {
  try {
    return new AppSettings(flags.trayData)
  } catch (error:any) {
    console.error(`Unable to load settings!  ${error.message}`)
    console.error(`Try running with the --no-load-traydata flag.`)
    process.exit(1)
  }
})()
const resBuff:ScriptBuffer = (() => {
  try {
    return new ScriptBuffer(flags.bufferData, appSettings.bufferSize)
  } catch (error:any) {
    console.error(`Unable to load previous buffer!  ${error.message}`)
    console.error(`Try running with the --no-load-bufferdata flag.`)
    process.exit(1)
  }
})()
const runningJobs:ProcessManager = new ProcessManager()
let resolveInputWin:AsyncResolver = new AsyncResolver()

//  Windows & tray objects
let bufferWin:BrowserWindow | null
let settingsWin:BrowserWindow | null
let inputWin:BrowserWindow | null
let jobMgrWin:BrowserWindow | null
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
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      images: false,
      webgl: false,
      enableWebSQL: false,
      spellcheck: false,
      preload: path.join(MAIN_DIST, 'preload.js')
    }
  })
  bufferWin.webContents.on('did-finish-load', () => {
    bufferWin?.webContents.send('send-buffer-data', resBuff.read())
  })

  //  Send when the buffer updates
  resBuff.on('script-buffer-updated', () => {
    bufferWin?.webContents.send('send-buffer-data', resBuff.read())
  })
  resBuff.on('error', (error:any) => {
    dialog.showErrorBox(`${appInfo.name}`, `Buffer Event Error:  ${error.message}`)
  })

  {(process.env.VITE_DEV_SERVER_URL) ?
    bufferWin.loadURL(path.posix.join(process.env.VITE_DEV_SERVER_URL, 'html/buffer.html')) :
    bufferWin.loadFile(path.join(RENDERER_DIST, 'html', 'buffer.html'))}
}

/** Window for editing settings */
const settingsEditorWindow = ():void => {
  settingsWin = new BrowserWindow({
    icon: appInfo.icon,
    title: `${appInfo.name} - Settings`,
    width: 940,
    height: 740,
    fullscreen: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      images: false,
      webgl: false,
      enableWebSQL: false,
      spellcheck: false,
      preload: path.join(MAIN_DIST, 'preload.js')
    }
  })
  settingsWin.webContents.on('did-finish-load', () => {
    settingsWin?.webContents.send('send-settings-data', appSettings.getData())
  })
  settingsWin.on('close', (_event) => {
    if (flags.trayData) {
      try {
        appSettings.load()
      } catch (error:any) {
        dialog.showErrorBox(`${appInfo.name}`,
          `Error loading settings!\n\n${error.message}`)
      }
    }
  })
  {(process.env.VITE_DEV_SERVER_URL) ?
    settingsWin.loadURL('http://localhost:5174/html/settings.html') :
    settingsWin.loadFile(path.join(RENDERER_DIST, 'html', 'settings.html'))}
}

/* Event handler for saving settings */
ipcMain.on('save-settings-data', (_event, data) => {
  if (dialog.showMessageBoxSync(<BrowserWindow>settingsWin, {
    type: 'question',
    title: `${appInfo.name} - Confirm`,
    icon: `${appInfo.icon}`,
    buttons: [ 'Yes', 'No' ],
    message: 'Do you want to save changes?'
  }) === 0) {
    try {
      appSettings.setData(data)
      appSettings.save()
      resBuff.size = appSettings.bufferSize
      {(appSettings.startup) ? autoLauncher.enable() : autoLauncher.disable() }
      appTray?.setContextMenu(buildMenu())
      settingsWin?.webContents.send('send-settings-data', appSettings.getData())
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error saving settings!\n\n${error.message}`)
    }
  }
})

/* Event handler for resetting settings */
ipcMain.on('reset-settings-data', (_event, data) => {
  if (!data) return  //  Data should be 'true'
  if (dialog.showMessageBoxSync(<BrowserWindow>settingsWin, {
    type: 'question',
    title: `${appInfo.name} - Confirm`,
    icon: `${appInfo.icon}`,
    buttons: [ 'Yes', 'No' ],
    message: 'Are you sure you want to reset settings?'
  }) === 0) {
    appSettings.reset()
    settingsWin?.webContents.send('send-settings-data', appSettings.getData())
  }
})

/** Event handler for verifying a current working directory */
ipcMain.on('verify-cwd', (_event, data) => {
  /**
   * Dialog box for the CWD verification
   * @param message Message to display
   * @param type Dialog box type
   */
  const verifyDialog = (message:string, type:string):void => {
    dialog.showMessageBoxSync(<BrowserWindow>settingsWin, {
      title: `${appInfo.name}`,
      icon: `${appInfo.icon}`,
      type: <any>type,
      message: message
    })
  }

  try {
    fs.lstatSync(data).isDirectory() ?
      verifyDialog(`Path "${data}" exists.`, `info`) :
      verifyDialog(`"${data}" is not a directory!`, `warning`)
  } catch (error:any) {
    verifyDialog(`Path "${data}" does not exist!`, `warning`)
  }
})

/** Window for argument input */
const inputWindow = (data:InputPromptData):void => {
  resolveInputWin = new AsyncResolver()
  inputWin = new BrowserWindow({
    icon: appInfo.icon,
    title: `${appInfo.name} - ${data.label}: ${data.argument}`,
    width: 400,
    height: 128,
    fullscreen: false,
    fullscreenable: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      images: false,
      webgl: false,
      enableWebSQL: false,
      spellcheck: false,
      preload: path.join(MAIN_DIST, 'preload.js')
    }
  })
  inputWin.on('close', (_event) => {
    resolveInputWin.reject(true)
  })
  inputWin.webContents.on('did-finish-load', () => {
    inputWin?.webContents.send('send-input-data', data)
  })
  {(process.env.VITE_DEV_SERVER_URL) ?
    inputWin.loadURL('http://localhost:5175/html/arg-input.html') :
    inputWin.loadFile(path.join(RENDERER_DIST, 'html', 'arg-input.html'))}
}

/* Event handler for receiving data from the input box */
ipcMain.on('recieve-input-data', (_event, data) => {
  inputWin?.destroy()
  resolveInputWin.resolve(data)
})

/** Window for Job Manager */
const jobManagerWindow = ():void => {
  jobMgrWin = new BrowserWindow({
    icon: appInfo.icon,
    title: `${appInfo.name} - Job Manager`,
    width: 840,
    height: 500,
    fullscreen: false,
    fullscreenable: false,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      images: false,
      webgl: false,
      enableWebSQL: false,
      spellcheck: false,
      preload: path.join(MAIN_DIST, 'preload.js')
    }
  })
  jobMgrWin.webContents.on('did-finish-load', () => {
    jobMgrWin?.webContents.send('send-job-data', runningJobs.read())
  })

  //  Send when the buffer updates
  runningJobs.on('process-manager-updated', () => {
    jobMgrWin?.webContents.send('send-job-data', runningJobs.read())
  })
  runningJobs.on('error', (error:any) => {
    dialog.showErrorBox(`${appInfo.name}`, `Job Manager Event Error:  ${error.message}`)
  })

  {(process.env.VITE_DEV_SERVER_URL) ?
    jobMgrWin.loadURL('http://localhost:5176/html/jobmgr.html') :
    jobMgrWin.loadFile(path.join(RENDERER_DIST, 'html', 'jobmgr.html'))}
}

/* Event handler for process termination */
ipcMain.on('send-term-process', (_event, data) => {
  if (dialog.showMessageBoxSync(<BrowserWindow>jobMgrWin, {
    type: 'question',
    title: `${appInfo.name} - Confirm`,
    icon: `${appInfo.icon}`,
    buttons: [ 'Yes', 'No' ],
    message: `Are you sure you want to terminate running process ${data}?`
  }) === 0) {
    runningJobs.term(data)
    jobMgrWin?.webContents.send('send-job-data', runningJobs.read())
  }
})

/** Builds the system tray menu */
const buildMenu = ():Menu => {
  /**
   * Build the main menu part
   * @param menu Menu item to append to
   */
  const buildMain = (menu:Menu):void => {
    menu.append(new MenuItem({ type: 'separator' }))

    const bufferMenu = new Menu()
    bufferMenu.append(new MenuItem({
      label: `Show Output Buffer`,
      click: () => { bufferWindow() }
    }))
    bufferMenu.append(new MenuItem({ type: 'separator' }))

    bufferMenu.append(new MenuItem({
      label: `Save as JSON`,
      click: async () => {
        const savePath = path.join(app.getPath('documents'),
          `script-tray-buffer-${ formatDate(new Date()) }.json`)
        const { canceled, filePath } = await dialog.showSaveDialog({
          title: `${appInfo.name} - Saving Buffer JSON`,
          defaultPath: savePath,
          filters: [ { name: 'JSON', extensions: [ 'json' ] } ],
          properties: [ 'createDirectory', 'showOverwriteConfirmation' ]
        })
        if (canceled) return
        try {
          resBuff.saveJSON(filePath, appSettings.encoding)
        } catch (error:any) {
          dialog.showErrorBox(`${appInfo.name}`,
            `Error saving buffer!\n\n${error.message}`)
        }
      }
    }))

    bufferMenu.append(new MenuItem({
      label: `Save as Log`,
      click: async () => {
        const savePath = path.join(app.getPath('documents'),
          `script-tray-buffer-${ formatDate(new Date()) }.log`)
        const { canceled, filePath } = await dialog.showSaveDialog({
          title: `${appInfo.name} - Saving Buffer Log`,
          defaultPath: savePath,
          filters: [
            { name: 'Log', extensions: [ 'log' ] },
            { name: 'Text', extensions: [ 'txt' ] } ],
          properties: [ 'createDirectory', 'showOverwriteConfirmation' ]
        })
        if (canceled) return
        try {
          resBuff.saveLog(filePath, appSettings.encoding)
        } catch (error:any) {
          dialog.showErrorBox(`${appInfo.name}`,
            `Error saving buffer!\n\n${error.message}`)
        }
      }
    }))
    bufferMenu.append(new MenuItem({ type: 'separator' }))

    bufferMenu.append(new MenuItem({
      label: 'Clear Buffer',
      click: async () => {
        const { response } = await dialog.showMessageBox({
          type: 'question',
          title: `${appInfo.name} - Confirm`,
          icon: `${appInfo.icon}`,
          buttons: [ 'Yes', 'No' ],
          message: 'Are you sure you want to clear the buffer?'
        })
        if (response === 0) {
          resBuff.emit('script-buffer-clear')
          bufferWin?.webContents.send('send-buffer-data', resBuff.read())
        }
      }
    }))

    menu.append(new MenuItem({ label: `Output Buffer`, submenu: bufferMenu}))
    menu.append(new MenuItem({
      label: `Job Manager`,
      click: () => { jobManagerWindow() }
    }))
    menu.append(new MenuItem({ label: 'Settings',
      click: () => { settingsEditorWindow() }
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: `About ${appInfo.name}`,
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: `About ${appInfo.name}`,
          message: `${appInfo.name}\nVersion:  ${appInfo.version}`,
          detail:
            `Author:  ${appInfo.author}\n` +
            `${appInfo.websiteURL}\n${appInfo.githubURL}\n\n` +
            `License:  ${appInfo.license}\n` +
            `${appInfo.licenseURL}\n\n` +
            `Icon:  ${appInfo.iconURL}\n` +
            `License:  ${appInfo.iconLicenseURL}`,
          icon: appInfo.icon
        })
      }
    }))
    menu.append(new MenuItem({ label: `Close ${appInfo.name}`, role: 'quit' }))
  }

  /**
   * Build the launcher menu part
   * @param menu Menu item to append to
   * @param collection Menu items to process
   */
  const buildLauncher = (menu:Menu, collection:Array<any>):void => {
    /**
     * Function to run a command
     * @param execCmd Command to run
     * @param item Menu item calling the run
     */
    const CommandRunner = (execCmd:string, item:TrayCommand):void => {
      const cmdCwd = (() => {
        if (fs.existsSync(item.cwd)) return item.cwd
        else return process.cwd()
      })()
      const execOpts = {
        encoding: appSettings.encoding,
        cwd: cmdCwd,
        windowsHide: true
      }
      const startDate = new Date().toLocaleString(__locale, { timeZoneName: 'short' })
      const startTime = performance.now()
      const job = exec(execCmd, execOpts, (error, stdout, stderr) => {
        const endTime = performance.now()
        const endDate = new Date().toLocaleString(__locale, { timeZoneName: 'short' })
        if (error) {
          dialog.showErrorBox(`${appInfo.name} - ${item.command}`,
            `Command:  ${execCmd}\nError:  ${error.message}`)
        }
        resBuff.emit('script-buffer-write', {
          command: execCmd,
          start: startDate,
          stop: endDate,
          duration: (endTime - startTime).toFixed(3),
          out: stdout,
          err: stderr
        })
      })
      runningJobs.emit('process-manager-add', {
        label: item.label,
        command: execCmd,
        start: startDate,
        pid: job.pid
      }, job)
      job.on('close', () => {
        runningJobs.emit('process-manager-remove', job.pid)
      })
    }

    collection.forEach((item:any) => {
      //  Item is a sub menu
      if (item.hasOwnProperty('label') && item.label !== '' &&
          item.hasOwnProperty('sub') && Array.isArray(item.sub)) {
        const tempMenu = new Menu()
        buildLauncher(tempMenu, item.sub)  //  Build submenu
        menu.append(new MenuItem({ label: item.label, submenu: tempMenu}))
        return  //  Next item
      }
      //  Item is a seperator
      if (item.hasOwnProperty('separator') && item.separator === null) {
        menu.append(new MenuItem({ type: 'separator' }))
        return  //  Next item
      }
      //  Item is a command
      if (item.hasOwnProperty('label') && item.label !== '' &&
          item.hasOwnProperty('command') && item.command !== '' &&
          item.hasOwnProperty('args') && Array.isArray(item.args)) {
        menu.append(new MenuItem({
          label: item.label,
          click: () => {
            const args = item.command.match(/(?<=\?<\|)(.*?)(?=\|>)/g)
            if (args === null) CommandRunner(<string>item.command, item)
            else {
              (async () => {
                let runCanceled = false
                let runCmd = <string>item.command
                await asyncForEach(<Array<string>>args, async (arg:string) => {
                  if (runCanceled) return
                  inputWindow({ label: <string>item.label, argument: arg.trim() })
                  await resolveInputWin.promise.then(res => {
                    runCmd = runCmd.replace(`?<|${arg}|>`, res)
                  }).catch(res => { runCanceled = res })
                })
                if (runCanceled) {
                  dialog.showMessageBox({
                    type: 'info',
                    title: appInfo.name,
                    icon: appInfo.icon,
                    message: `Command '${item.label}' canceled!`,
                    detail: `Command:  ${runCmd}`
                  })
                } else CommandRunner(runCmd, item)
              })()
            }
          }
        }))
        return  //  Next item
      }
      //  Item wasn't processed, so there's a problem with the format
      let outErrStr = `Error building menu, incorrect menu item!\n\n`
      for (const key in item) {
        if (item.hasOwnProperty(key)) outErrStr += `${key} - ${item[key]}\n`
      }
      dialog.showErrorBox(`${appInfo.name}`, outErrStr)
    })
  }

  /* Generate the complete menu */
  const menu = new Menu()
  buildLauncher(menu, appSettings.launchMenu)
  buildMain(menu)
  return menu
}

/* Make sure app doesn't quit when no windows are open */
app.on('window-all-closed', () => {})

/* Run Script Tray app */
app.whenReady().then(() => {
  //  Verify auto launch is enabled if it should be
  autoLauncher.isEnabled().then((enabled) => {
    if (enabled) return
    if (appSettings.startup) autoLauncher.enable()
  }).catch((error:any) => {
    dialog.showErrorBox(`${appInfo.name}`,
      `Error enabling auto launcher!\n\n${error.message}`)
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `default-src 'self'; script-src 'self'; style-src 'unsafe-inline'; font-src 'self'; frame-src 'self'`
        ]
      }
    })
  })

  appTray = new Tray(appInfo.icon)
  appTray.setToolTip(appInfo.name)
  appTray.setTitle(appInfo.name)
  appTray.setContextMenu(buildMenu())
})
