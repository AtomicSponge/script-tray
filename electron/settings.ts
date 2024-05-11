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
  debug:boolean
}

/** App settings */
export class settings {
  /** Tree of commands to build menu from */
  static launchMenu:Array<any>
  /** Debug mode */
  static debug:boolean

  constructor() {
    settings.launchMenu = []
    settings.debug = false
    storage.setDataPath()
    return false
  }

  /** Load settings */
  static load = ():void => {
    try {
      storage.has('settings', (error, hasKey) => {
        if(error) throw error
        if (hasKey) {
          const temp = <settingsJSON>storage.getSync('settings')
          settings.launchMenu = temp.launchMenu
          settings.debug = temp.debug
        } else {
          settings.launchMenu = []
          settings.debug = false
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
        launchMenu: settings.launchMenu,
        debug: settings.debug
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
    settings.launchMenu = []
    settings.debug = false
    settings.save()
  }
}
