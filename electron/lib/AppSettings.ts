/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import { dialog } from 'electron'
import storage from 'electron-json-storage'

import { appInfo } from '../appInfo'
import { TrayError } from './TrayError'

export class AppSettings {
  /** Tree of commands to build menu from */
  static #launchMenu:Array<Object> = []
  /** Buffer size */
  static #bufferSize:number = 100
  /** System encoding */
  static #encoding:string = 'utf8'
  /** Load on startup */
  static #startup:boolean = false

  constructor(load:boolean) {
    storage.setDataPath()
    if(load) this.load()
  }

  /** Load settings */
  load():void {
    try {
      storage.has('settings', (error, hasKey) => {
        if (error) throw error
        if (hasKey) {
          const temp = <SettingsData>storage.getSync('settings')
          if (temp.launchMenu !== undefined) AppSettings.#launchMenu = temp.launchMenu
          if (temp.bufferSize !== undefined) AppSettings.#bufferSize = temp.bufferSize
          if (temp.encoding !== undefined) AppSettings.#encoding = temp.encoding
          if (temp.startup !== undefined) AppSettings.#startup = temp.startup
        }
      })
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error loading settings!\n\n${error.message}`)
    }
  }

  /** Save settings */
  save():void {
    try {
      storage.set('settings', {
        'launchMenu': AppSettings.#launchMenu,
        'bufferSize': AppSettings.#bufferSize,
        'encoding': AppSettings.#encoding,
        'startup': AppSettings.#startup
      }, (error) => { if (error) throw error })
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error saving settings!\n\n${error.message}`)
    }
  }

  /** Reset settings */
  reset():void {
    AppSettings.#launchMenu = []
    AppSettings.#bufferSize = 100
    AppSettings.#encoding = 'utf8'
    AppSettings.#startup = false
  }

  /**
   * Get entire settings data
   * Launch menu seralized as string for Electron
   */
  getData():SettingsIpc {
    return {
      launchMenu: JSON.stringify(AppSettings.#launchMenu),
      bufferSize: AppSettings.#bufferSize,
      encoding: AppSettings.#encoding,
      startup: AppSettings.#startup
    }
  }

  /**
   * Set entire settings from an object
   * Launch menu converted back from string to JSON
   * @param data Data to parse for settings
   * @returns True if data successfully set, else false
   */
  setData(data:SettingsIpc):boolean {
    try {
      if (data === undefined || data === null)
        throw new TrayError('No data received!', this.setData)
      if (!data.hasOwnProperty('launchMenu') || typeof data.launchMenu !== 'string')
        throw new TrayError('Invalid data format! Missing or incorrect Launch Menu!', this.setData)
      if (!data.hasOwnProperty('bufferSize') || typeof data.bufferSize !== 'number')
        throw new TrayError('Invalid data format! Missing or incorrect Buffer Size!', this.setData)
      if (!data.hasOwnProperty('encoding') || typeof data.encoding !== 'string')
        throw new TrayError('Invalid data format! Missing or incorrect System Encoding!', this.setData)
      if (!data.hasOwnProperty('startup') || typeof data.startup !== 'boolean')
        throw new TrayError('Invalid data format! Missing or incorrect Startup flag!', this.setData)
      AppSettings.#launchMenu = JSON.parse(data.launchMenu)
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error:  ${error.message}`)
      return false
    }

    AppSettings.#bufferSize = data.bufferSize
    AppSettings.#encoding = data.encoding
    AppSettings.#startup = data.startup
    return true
  }

  /** Get the launch menu */
  get launchMenu():Array<Object> { return AppSettings.#launchMenu }
  /** Get the buffer size */
  get bufferSize():number { return AppSettings.#bufferSize }
  /** Get the system encoding */
  get encoding():BufferEncoding { return <BufferEncoding>AppSettings.#encoding }
  /** Get the startup flag */
  get startup():boolean { return AppSettings.#startup }
}
