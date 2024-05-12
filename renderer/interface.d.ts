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
  async getSettingsData: () => Promise<JSON>
}

declare global {
  interface Window {
    bufferAPI:IbufferAPI
    settingsAPI:IsettingsAPI
  }
}
