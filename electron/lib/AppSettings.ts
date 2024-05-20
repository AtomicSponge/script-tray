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
    if(load) {
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
          if (temp.launchMenu !== undefined) AppSettings.#launchMenu = temp.launchMenu
          if (temp.bufferSize !== undefined) AppSettings.#bufferSize = temp.bufferSize
          if (temp.encoding !== undefined) AppSettings.#encoding = temp.encoding
          if (temp.startup !== undefined) AppSettings.#startup = temp.startup
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
   * @returns A success flag and a result message in an object
   */
  setData(data:SettingsIpc):{ success:boolean, message:string } {
    try {
      if (data === undefined || data === null)
        throw new AppSettingsError('No data received!', this.setData)
      if (!data.hasOwnProperty('launchMenu') || typeof data.launchMenu !== 'string')
        throw new AppSettingsError('Invalid data format! Missing or incorrect Launch Menu!', this.setData)
      if (!data.hasOwnProperty('bufferSize') || typeof data.bufferSize !== 'number')
        throw new AppSettingsError('Invalid data format! Missing or incorrect Buffer Size!', this.setData)
      if (!data.hasOwnProperty('encoding') || typeof data.encoding !== 'string')
        throw new AppSettingsError('Invalid data format! Missing or incorrect System Encoding!', this.setData)
      if (!data.hasOwnProperty('startup') || typeof data.startup !== 'boolean')
        throw new AppSettingsError('Invalid data format! Missing or incorrect Startup flag!', this.setData)
      AppSettings.#launchMenu = JSON.parse(data.launchMenu)
    } catch (error:any) {
      return { success: false, message: error.message }
    }

    AppSettings.#bufferSize = data.bufferSize
    AppSettings.#encoding = data.encoding
    AppSettings.#startup = data.startup
    return { success: true, message: 'success' }
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
