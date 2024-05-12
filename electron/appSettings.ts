/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import { dialog } from 'electron'
import storage from 'electron-json-storage'

import { appInfo } from './appInfo'

interface settingsJSON {
  launchMenu:Array<any>
  bufferSize:number
  startup:boolean
  debug:boolean
}

interface IappSettings {
  launchMenu:Array<any>
  bufferSize:number
  startup:boolean
  debug:boolean
  config():void
  load():void
  save():void
  reset():void
  get getJSON():settingsJSON
  set setJSON(data:settingsJSON)
}

/** App settings */
export const appSettings:IappSettings = {
  /** Tree of commands to build menu from */
  launchMenu: [],
  /** Buffer size */
  bufferSize: 100,
  /** Load on startup */
  startup: false,
  /** Debug mode */
  debug: false,

  /** Configure app settings - called at launch */
  config():void {
    storage.setDataPath()
    this.load()
  },

  /** Load settings */
  load():void {
    try {
      storage.has('settings', (error, hasKey) => {
        if (error) throw error
        if (hasKey) {
          const temp = <settingsJSON>storage.getSync('settings')
          appSettings.launchMenu = temp.launchMenu
          appSettings.bufferSize = temp.bufferSize
          appSettings.startup = temp.startup
          appSettings.debug = temp.debug
        }
      })
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error loading settings!\n\n${error.message}`)
    }
  },

  /** Save settings */
  save():void {
    try {
      storage.set('settings', {
        launchMenu: appSettings.launchMenu,
        startup: appSettings.startup,
        debug: appSettings.debug
      }, (error) => { if (error) throw error })
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error saving settings!\n\n${error.message}`)
    }
  },

  /** Reset settings */
  reset():void {
    appSettings.launchMenu = []
    appSettings.bufferSize = 100
    appSettings.startup = false
    appSettings.debug = false
  },

  /** Get the settings as a JSON object */
  get getJSON():settingsJSON {
    return {
      launchMenu: appSettings.launchMenu,
      bufferSize: appSettings.bufferSize,
      startup: appSettings.startup,
      debug: appSettings.debug
    }
  },

  /** Set the settings by using a JSON object */
  set setJSON(data:settingsJSON) {
    if(data === undefined || data === null) return
    appSettings.launchMenu = data.launchMenu
    appSettings.bufferSize = data.bufferSize
    appSettings.startup = data.startup
    appSettings.debug = data.debug
  }
}
