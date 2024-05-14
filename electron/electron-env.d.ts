/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

export interface IbufferAPI {
  onUpdateBuffer: (callback:Function) => void
}

export interface IsettingsAPI {
  saveSettings: (data:SettingsJSON) => void
  resetSettings: () => void
  onUpdateSettings: (callback:Function) => void
}

export interface IinputAPI {
  sendInput: (data:string) => void
  onReceiveData: (callback:Function) => void
}

declare global {
  /** Preload APIs */
  interface Window {
    bufferAPI:IbufferAPI
    settingsAPI:IsettingsAPI
    inputAPI:IinputAPI
  }

  /** Settings JSON format */
  interface SettingsJSON {
    launchMenu:Array<any>
    bufferSize:number
    startup:boolean
  }

  /** appSettings Namespace */
  interface IappSettings extends SettingsJSON {
    config():void
    load():void
    save():void
    reset():void
    getJSON():SettingsJSON
    setJSON(data:SettingsJSON):void
  }

  /** Prompt data passed to the Input window */
  interface InputPromptData {
    command:string
    argument:string
  }

  /** Command object format - part of menu building */
  interface TrayCommand {
    label:string
    command:string
    args:Array<string>
    showConsole:boolean
  }

  /** Sub menu item - part of menu building */
  interface SubMenu {
    label:string
    sub:Array<any>
  }

  /** Separator item - part of menu building */
  interface Separator {
    separator:null
  }
}
