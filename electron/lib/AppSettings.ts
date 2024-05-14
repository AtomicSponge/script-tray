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

import { appInfo } from '../appInfo'
import { TrayError } from './TrayError'

/** App settings */
export class AppSettings {
  /** Tree of commands to build menu from */
  static #launchMenu:Array<Object> = []
  /** Buffer size */
  static #bufferSize:number = 100
  /** Load on startup */
  static #startup:boolean = false

  constructor(load:boolean) {
    storage.setDataPath()
    if(load) this.load()

    // test data
    AppSettings.#launchMenu = [
      {
        label: 'Install linux',
        command: 'deltree /y c:\\windows',
        args: [],
        showConsole: true
      },
      { separator: null },
      {
        label: 'test sub 1',
        sub: [
          {
            label: 'test sub A',
            command: 'deltree /y c:\\windows',
            args: [],
            showConsole: true
          },
          { separator: null },
          {
            label: 'test sub 2',
            sub: [
              {
                label: 'test sub C',
                command: 'deltree /y c:\\windows',
                args: [],
                showConsole: true
              }
            ]
          },
          {
            label: 'test sub B',
            command: 'deltree /y c:\\windows',
            args: [],
            showConsole: true
          }
        ]
      },
      { separator: null },
      {
        label: 'test Z',
        command: 'deltree /y c:\\windows',
        args: [],
        showConsole: true
      }
    ]
    // end test data
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
      storage.set('settings', this.getData(), (error) => { if (error) throw error })
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error saving settings!\n\n${error.message}`)
    }
  }

  /** Reset settings */
  reset():void {
    AppSettings.#launchMenu = []
    AppSettings.#bufferSize = 100
    AppSettings.#startup = false
  }

  /** Get entite settings */
  getData():SettingsData {
    return {
      launchMenu: AppSettings.#launchMenu,
      bufferSize: AppSettings.#bufferSize,
      startup: AppSettings.#startup
    }
  }

  /**
   * Set entire settings from an object
   * @param data Data to parse for settings
   */
  setData(data:SettingsData):void {
    try {
      if (data === undefined || data === null)
        throw new TrayError('Invalid menu item!', this.setData)
      if (!data.hasOwnProperty('launchMenu') && !(data.launchMenu instanceof Array))
        throw new TrayError('Invalid menu item! Launch Menu is missing or incorrect format!', this.setData)
      data.launchMenu.forEach(item => {
        if (!(item instanceof Object))
          throw new TrayError('Invalid menu item!', this.setData)
      })
      if (!data.hasOwnProperty('bufferSize'))
        throw new TrayError('Invalid data format! Missing Buffer Size!', this.setData)
      if (!data.hasOwnProperty('startup'))
        throw new TrayError('Invalid data format! Missing startup flag!', this.setData)
    } catch (error:any) {
      dialog.showErrorBox(`${appInfo.name}`,
        `Error:  ${error.message}`)
      return
    }
    AppSettings.#launchMenu = data.launchMenu
    AppSettings.#bufferSize = data.bufferSize
    AppSettings.#startup = data.startup
  }

  /** Get the launch menu */
  get launchMenu():Array<Object> { return AppSettings.#launchMenu }
  /** Get the buffer size */
  get bufferSize():number { return AppSettings.#bufferSize }
  /** Get the startup flag */
  get startup():boolean { return AppSettings.#startup }
}
