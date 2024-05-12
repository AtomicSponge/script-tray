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
  saveSettings: (data:JSON) => void
  resetSettings: () => void
  onUpdateSettings: (callback:Function) => void
}

export interface IinputAPI {
  sendInput: (data:string) => void
  onReceiveData: (callback:Function) => void
}

declare global {
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
    debug:boolean
  }
  
  /** Data for the Input Window */
  interface InputWinData {
    label:string
    command:string
  }
}
