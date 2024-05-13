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

/** App settings */
export const appSettings:IappSettings = {
  /** Tree of commands to build menu from */
  launchMenu: [],
  /** Buffer size */
  bufferSize: 100,
  /** Load on startup */
  startup: false,

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
          const temp = <SettingsJSON>storage.getSync('settings')
          this.launchMenu = temp.launchMenu
          this.bufferSize = temp.bufferSize
          this.startup = temp.startup
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
      storage.set('settings', this.getJSON(),
        (error) => { if (error) throw error })
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error saving settings!\n\n${error.message}`)
    }
  },

  /** Reset settings */
  reset():void {
    this.launchMenu = []
    this.bufferSize = 100
    this.startup = false
  },

  /** Get the settings as a JSON object */
  getJSON():SettingsJSON {
    return {
      launchMenu: this.launchMenu,
      bufferSize: this.bufferSize,
      startup: this.startup
    }
  },

  /** Set the settings by using a JSON object */
  setJSON(data:SettingsJSON):void {
    if(data === undefined || data === null) return
    if(!data.hasOwnProperty('launchMenu') || !(data.launchMenu instanceof Array)) return
    if(!data.hasOwnProperty('bufferSize')) return
    if(!data.hasOwnProperty('startup')) return
    this.launchMenu = data.launchMenu
    this.bufferSize = data.bufferSize
    this.startup = data.startup
  }
}
