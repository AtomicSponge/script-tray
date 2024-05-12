/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

export interface IbufferAPI {
  onUpdateBuffer: (callback:Function) => void
}

export interface IsettingsAPI {
  saveSettings: (data:JSON) => void
  resetSettings: () => void
  onUpdateSettings: (callback:Function) => void
}

export interface IinputAPI {
  //
}

declare global {
  interface Window {
    bufferAPI:IbufferAPI
    settingsAPI:IsettingsAPI
    inputAPI:IinputAPI
  }
}
