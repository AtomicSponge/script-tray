/*
 * Filename:  script_tray.js
 */

/*
 * app config
 */
const appConfig = {
	name: 'Script Tray',
	version: '091821',
	git: 'https://github.com/wtfsystems/script_tray',
	license: 'MIT',
	licenseURL: 'https://mit-license.org',
	author: 'Matthew Evans',
	contact: 'contact@wtfsystems.net',
	website: 'https://www.wtfsystems.net',

	icon: 'assets/robot.png',
	debug: true
}

/*
 * imports
 */
const fs = require('fs')
const shell = require('shelljs')
const AutoLaunch = require('auto-launch')
const { app, Menu, Tray, dialog, MenuItem } = require('electron')
const path = require('path')
const { createPublicKey } = require('crypto')

const nodePath = (shell.which('node').toString())
shell.config.execPath = nodePath

const appList = []
const launchCommands = [
	{ label: 'sysbak', cmd: 'sysbak', silent: true, encoding: 'utf8' }
]

appList.forEach((appCheck) => {
	if(!shell.which(appCheck)) {
		dialog.showErrorBox(appConfig.name, 'Error:  ' + appCheck + ' not found!')
		app.quit()
	}
})

/*
 * auto launch
 */
const scripttrayAutoLauncher = new AutoLaunch({ name: appConfig.name })
{(scripttrayAutoLauncher.isEnabled()) ?
	scripttrayAutoLauncher.disable() :
	scripttrayAutoLauncher.enable()}

/*
 * 
 */
const buildMenu = {
	/*
	 * 
	 */
	Main: (menu) => {
		menu.append(new MenuItem({ type: 'separator' }))
		menu.append(new MenuItem({
			label: 'Start at login', type: 'checkbox'
		}))
		menu.append(new MenuItem({ type: 'separator' }))
		menu.append(new MenuItem({
			label: 'About ' + appConfig.name,
			click() {
				dialog.showMessageBox({
					type: 'info',
					title: 'About ' + appConfig.name,
					message: appConfig.name + '    ver:  ' + appConfig.version,
					detail: appConfig.git,
					icon: appConfig.icon
				})
			}
		}))
		menu.append(new MenuItem({
			label: 'Close ' + appConfig.name, role: 'quit'
		}))
	},

	/*
	 * 
	 */
	Launcher: (menu) => {
		launchCommands.forEach((cmd) => {
			menu.append(new MenuItem({
				label: cmd.label,
				click() { 
					shell.exec(cmd.cmd, {
						silent: cmd.silent, encoding: cmd.encoding, async: true
					}, (code, stdout, stderr) => {
						if(code !== 0) throw 'Error: ' + cmd.label + ': command failed'
					})
				}
			}))
		})
		menu.append(new MenuItem({ type: 'separator' }))
	},

	/*
	 * 
	 */
	Build: () => {
		const menu = new Menu()
		try {
			buildMenu.Launcher(menu)
			buildMenu.Main(menu)
		} catch(err) {
			dialog.showErrorBox(appConfig.name, err)
			app.quit()
		}
		return menu
	}
}

/*
 * run electron app 
 */
app.whenReady().then(() => {
	tray = new Tray(appConfig.icon)
	tray.setToolTip(appConfig.name)
	tray.setTitle(appConfig.name)
	tray.setContextMenu(buildMenu.Build())
})
