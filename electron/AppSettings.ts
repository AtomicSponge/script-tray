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
export class AppSettings {
  /** Tree of commands to build menu from */
  #launchMenu:Array<any>
  /** Buffer size */
  #bufferSize:number
  /** Load on startup */
  #startup:boolean

  constructor() {
    this.#launchMenu = []
    this.#bufferSize = 100
    this.#startup = false

    storage.setDataPath()
    this.load()

    // test data
    this.#launchMenu = [
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
          const temp = <SettingsInterface>storage.getSync('settings')
          if(temp.launchMenu !== undefined) this.#launchMenu = temp.launchMenu
          if(temp.bufferSize !== undefined) this.#bufferSize = temp.bufferSize
          if(temp.startup !== undefined) this.#startup = temp.startup
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
    this.#launchMenu = []
    this.#bufferSize = 100
    this.#startup = false
  }

  /** Get entite settings */
  getData():SettingsInterface {
    return {
      launchMenu: this.#launchMenu,
      bufferSize: this.#bufferSize,
      startup: this.#startup
    }
  }

  /**
   * Set entire settings
   * @param data Data to parse
   */
  setData(data:SettingsInterface):void {
    if(data === undefined || data === null) return
    if(!data.hasOwnProperty('launchMenu') && !(data.launchMenu instanceof Array))
      return
    if(!data.hasOwnProperty('bufferSize')) return
    if(!data.hasOwnProperty('startup')) return
    this.#launchMenu = data.launchMenu
    this.#bufferSize = data.bufferSize
    this.#startup = data.startup
  }

  get launchMenu():Array<any> { return this.#launchMenu }
  get bufferSize():number { return this.#bufferSize }
  get startup():boolean { return this.#startup }
}
