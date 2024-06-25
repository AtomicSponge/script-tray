/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import storage from 'electron-json-storage'

/** App Settings save data format */
interface AppSettingsSaveData {
  launchMenu:Array<Object>
  bufferSize:number
  encoding:string
  startup:boolean
}

export class AppSettings {
  /** Tree of commands to build menu from */
  static #launchMenu:Array<Object> = []
  /** Buffer size */
  static #bufferSize:number = 100
  /** System encoding */
  static #encoding:string = 'utf8'
  /** Load on startup */
  static #startup:boolean = false

  /**
   * Create a new AppSettings object
   * @param load Load data or not
   */
  constructor(load:boolean) {
    if (load) {
      try {
        this.load()
      } catch (error:any) {
        throw error
      }
    }
  }

  /**
   * Load settings from storage
   * @throws Error on load
   */
  load():void {
    try {
      storage.has('settings', (error, hasKey) => {
        if (error) throw error
        if (hasKey) {
          const temp = <AppSettingsSaveData>storage.getSync('settings')
          if (temp.hasOwnProperty('launchMenu')) AppSettings.#launchMenu = temp.launchMenu
          if (temp.hasOwnProperty('bufferSize')) AppSettings.#bufferSize = temp.bufferSize
          if (temp.hasOwnProperty('encoding')) AppSettings.#encoding = temp.encoding
          if (temp.hasOwnProperty('startup')) AppSettings.#startup = temp.startup
        }
      })
    } catch (error:any) { throw new AppSettingsError(error.message, this.load) }
  }

  /**
   * Save settings to storage
   * @throws Error on save
   */
  save():void {
    try {
      storage.set('settings', {
        'launchMenu': AppSettings.#launchMenu,
        'bufferSize': AppSettings.#bufferSize,
        'encoding': AppSettings.#encoding,
        'startup': AppSettings.#startup
      }, (error) => { if (error) throw error })
    } catch (error:any) { throw new AppSettingsError(error.message, this.save) }
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
    const tempData = (()=>{
      try {
        return JSON.stringify(AppSettings.#launchMenu)
      } catch (error:any) {
        throw new AppSettingsError(error.message, this.getData)
      }
    })()
    return {
      launchMenu: tempData,
      bufferSize: AppSettings.#bufferSize,
      encoding: AppSettings.#encoding,
      startup: AppSettings.#startup,
      check: false
    }
  }

  /**
   * Set entire settings from an object
   * Launch menu converted back from string to JSON
   * @param data Data to parse for settings
   * @throws Errors setting the data
   */
  setData(data:SettingsIpc):void {
    try {
      AppSettings.#checkData(data)
      AppSettings.#launchMenu = JSON.parse(data.launchMenu)
      AppSettings.#bufferSize = data.bufferSize
      AppSettings.#encoding = data.encoding
      AppSettings.#startup = data.startup
    } catch (error:any) {
      throw new AppSettingsError(error.message, this.setData)
    }
  }

  /**
   * Compares passed data to the current data to see if it was changed
   * @param data Data to compare
   * @returns True if the data is the same, else false
   * @throws Error if problems with the data format
   */
  compareData(data:SettingsIpc):boolean {
    try {
      AppSettings.#checkData(data)
      if (JSON.stringify(AppSettings.#launchMenu) !== data.launchMenu) return false
    } catch (error:any) {
      throw new AppSettingsError(error.message, this.compareData)
    }
    if (AppSettings.#bufferSize !== data.bufferSize) return false
    if (AppSettings.#encoding !== data.encoding) return false
    if (AppSettings.#startup !== data.startup) return false
    return true
  }

  /**
   * Checks an object for valid app settings format
   * @param data Data to check
   * @throws Error if problems with the data format
   */
  static #checkData(data:SettingsIpc):void {
    try {
      if (data === undefined || data === null)
        throw new Error('No data received!')
      if (!data.hasOwnProperty('launchMenu') || typeof data.launchMenu !== 'string')
        throw new Error('Invalid data format! Missing or incorrect Launch Menu!')
      if (!data.hasOwnProperty('bufferSize') || typeof data.bufferSize !== 'number')
        throw new Error('Invalid data format! Missing or incorrect Buffer Size!')
      if (!data.hasOwnProperty('encoding') || typeof data.encoding !== 'string')
        throw new Error('Invalid data format! Missing or incorrect System Encoding!')
      if (!data.hasOwnProperty('startup') || typeof data.startup !== 'boolean')
        throw new Error('Invalid data format! Missing or incorrect Startup flag!')
    } catch (error:any) {
      throw error
    }
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

/**
 * Class for handling App Settings errors
 * @extends Error
 */
class AppSettingsError extends Error {
  message:string
  code:Object
  exitCode:number

  /**
   * Constructs the AppSettingsError class
   * @param message Error message
   * @param code Error code
   * @param exitCode Exit code
   */
  constructor(message:string, code:Object, exitCode?:number) {
    super()

    this.name = this.constructor.name
    this.message = message
    this.code = code
    this.exitCode = exitCode || 1

    this.stack = new Error().stack
  }
}
