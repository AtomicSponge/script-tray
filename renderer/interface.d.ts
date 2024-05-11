/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

export interface IsettingsAPI {
  saveSettings: (data:settingsJSON) => void
  resetSettings: () => void
  data:JSON
}

declare global {
  interface Window {
    settingsAPI:IsettingsAPI
  }
}
