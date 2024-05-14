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
  saveSettings: (data:SettingsInterface) => void
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

  /** Settings data format */
  interface SettingsData {
    launchMenu:Array<Object>
    bufferSize:number
    startup:boolean
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
    sub:Array<Object>
  }

  /** Separator item - part of menu building */
  interface Separator {
    separator:null
  }
}
