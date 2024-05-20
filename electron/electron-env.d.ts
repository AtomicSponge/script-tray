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
     * │ │ ├── main.ts
     * │ │ └── preload.ts
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

  /** Script Buffer data format */
  interface ScriptBufferData {
    command:string
    start:string
    stop:string
    duration:number
    out:string
    err:string
  }

  /** Min type for the Script Buffer */
  type ScriptBufferMin = 10
  /** Max type for the Script Buffer */
  type ScriptBufferMax = 500

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
    cwd:string
    args:Array<string>
  }

  /** Sub menu object used in menu building */
  interface SubMenu {
    label:string
    sub:Array<Object>
  }

  /** Separator type used in menu building */
  type Separator = null
}
