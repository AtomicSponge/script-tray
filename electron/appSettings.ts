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

export interface settingsJSON {
  launchMenu:Array<any>
  startup:boolean
  debug:boolean
}

/** App settings */
export class appSettings {
  /** Tree of commands to build menu from */
  static launchMenu:Array<any>
  /** Load on startup */
  static startup:boolean
  /** Debug mode */
  static debug:boolean

  constructor() {
    appSettings.launchMenu = []
    appSettings.startup = false
    appSettings.debug = false
    storage.setDataPath()
    return false
  }

  /** Load settings */
  static load = ():void => {
    try {
      storage.has('settings', (error, hasKey) => {
        if (error) throw error
        if (hasKey) {
          const temp = <settingsJSON>storage.getSync('settings')
          appSettings.launchMenu = temp.launchMenu
          appSettings.startup = temp.startup
          appSettings.debug = temp.debug
        } else {
          appSettings.launchMenu = []
          appSettings.startup = false
          appSettings.debug = false
        }
      })
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error loading settings!\n\n${error.message}`)
    }
  }

  /** Save settings */
  static save = ():void => {
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
  }

  /** Reset settings */
  static reset = ():void => {
    try {
      storage.clear((error) => { if (error) throw error })
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error clearing settings!\n\n${error.message}`)
    }
    appSettings.launchMenu = []
    appSettings.startup = false
    appSettings.debug = false
    appSettings.save()
  }

  /** Get the settings as a JSON object */
  static get getJSON():settingsJSON {
    return {
      launchMenu: appSettings.launchMenu,
      startup: appSettings.startup,
      debug: appSettings.debug
    }
  }

  /** Set the settings by using a JSON object */
  static set setJSON(data:settingsJSON) {
    appSettings.launchMenu = data.launchMenu
    appSettings.startup = data.startup
    appSettings.debug = data.debug
  }
}
