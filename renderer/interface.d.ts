/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

export interface IbufferAPI {
  getData: () => string
}

export interface IsettingsAPI {
  saveSettings: (data:JSON) => void
  resetSettings: () => void
  data:JSON
}

declare global {
  interface Window {
    bufferAPI:IbufferAPI
    settingsAPI:IsettingsAPI
  }
}
