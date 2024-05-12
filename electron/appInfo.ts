/**
 * 
 * @author Matthew Evans
 * @module script_tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import path from 'node:path'

process.env.APP_ROOT = path.join(__dirname, '..')
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

/** App information */
export const appInfo = {
  name: 'Script Tray',
  version: '1.9.9',
  author: 'Matthew Evans',
  websiteURL: 'https://github.com/AtomicSponge/script_tray',
  license: 'MIT',
  licenseURL: 'https://mit-license.org',
  icon: path.join(process.env.VITE_PUBLIC, 'robot.png')
}
