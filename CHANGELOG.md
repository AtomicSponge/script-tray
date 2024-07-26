# Script Tray Changelog

## Development branch
  - Dependencies bump

## v2.0.2
  - Moved CSP to HTML
  - Added setting a zoom factor for the application
  - Dependencies bump
  - Added adjustable columns in the Job Manager
  - Disabled devTools in production mode
  - Removed Stylus for vanilla CSS
  - Removed stylus-loader (unnecessary)
  - Removed CSS injection plug-in for Vite
  - Added exception checking on AppSettings.getData
  - Added a save check on settings window close
  - Slight code optimizations

## v2.0.1
  - Removed `close` button from the input window to prevent accidental closure.
  - Added session Content Security to the app windows
  - Added Website URL to About popup
  - Added highlighting to the app icon to make it more visible on light desktop profiles
  - Removed extra window closures as it introduced an issue with Electron 31
  - Dependencies bump
  - Added Code of Conduct
  - Added Changelog

## v2.0.0
  - Initial release
