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

export interface IjobMgrAPI {
  termProcess: (data:number) => void
  onReceiveData: (callback:Function) => void
}

declare global {
  /** Preload APIs */
  interface Window {
    bufferAPI:IbufferAPI
    settingsAPI:IsettingsAPI
    inputAPI:IinputAPI
    jobMgrAPI:IjobMgrAPI
  }

  /** Settings data format */
  interface SettingsData {
    launchMenu:Array<Object>
    bufferSize:number
    encoding:string
    startup:boolean
  }

  /** Script Buffer data format */
  interface ScriptBufferData {
    command:string
    start:string
    stop:string
    duration:number
    out:string
    err:string
  }

  /** Process manager data format */
  interface ProcessManagerData {
    label:string
    command:string
    start:string
    pid:number
  }

  /** Settings data format for Electron Ipc */
  interface SettingsIpc {
    launchMenu:string
    bufferSize:number
    encoding:string
    startup:boolean
  }

  /** Prompt data passed to the Input window */
  interface InputPromptData {
    label:string
    argument:string
  }

  /** Command object used in menu building */
  interface TrayCommand {
    label:string
    command:string
    args:Array<string>
    showConsole:boolean
  }

  //  Min & max types for the Script Buffer
  type ScriptBufferMin = 10
  type ScriptBufferMax = 500
}
