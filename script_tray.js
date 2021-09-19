/*
 * Filename:  script_tray.js
 */

/*
 * app config
 */
const appInfo = {
	name: 'Script Tray',
	version: '091821',
	git: 'https://github.com/wtfsystems/script_tray',
	license: 'MIT',
	licenseURL: 'https://mit-license.org',
	author: 'Matthew Evans',
	contact: 'contact@wtfsystems.net',
	website: 'https://www.wtfsystems.net',
	icon: 'assets/robot.png'
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

const autoLauncher = new AutoLaunch({ name: appInfo.name })

/*
 * 
 */
const settings = {
	encoding: 'utf8',
	appList: [ 'sysbak' ],
	launchCmds: [
		{ label: 'sysbak', cmd: 'sysbak' }
	]
}

/*
 * 
 */
settings.appList.forEach((appCheck) => {
	if(!shell.which(appCheck)) {
		dialog.showErrorBox(
			appInfo.name,
			`Error:  ${appCheck} not found!`)
		app.quit()
	}
})

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
			label: 'Start at login',
			type: 'checkbox',
			checked: (autoLauncher.isEnabled()) ? false : true,
			click: (item) => {
				{(item.checked) ?
					autoLauncher.disable() :
					autoLauncher.enable()}
			}
		}))
		menu.append(new MenuItem({ type: 'separator' }))
		menu.append(new MenuItem({
			label: `About ${appInfo.name}`,
			click: () => {
				dialog.showMessageBox({
					type: 'info',
					title: `About ${appInfo.name}`,
					message: `${appInfo.name}\tver:  ${appInfo.version}`,
					detail:
						`${appInfo.git}\n\n` +
						`Author:  ${appInfo.author}\n` +
						`${appInfo.contact}\n` +
						`${appInfo.website}\n\n` +
						`License:  ${appInfo.license}\n` +
						`${appInfo.licenseURL}`,
					icon: appInfo.icon
				})
			}
		}))
		menu.append(new MenuItem({
			label: `Close ${appInfo.name}`, role: 'quit'
		}))
	},

	/*
	 * 
	 */
	Launcher: (menu) => {
		settings.launchCmds.forEach((cmd) => {
			menu.append(new MenuItem({
				label: cmd.label,
				click: () => {
					shell.exec(cmd.cmd, {
						silent: true,
						encoding: settings.encoding,
						async: true
					}, (code, stdout, stderr) => {
						if(code !== 0) {
							dialog.showErrorBox(`${appInfo.name} - ${cmd.label}`, stderr)
						} else {
							// do other stuff
						}
					})
				}
			}))
		})
	},

	/*
	 * 
	 */
	Build: () => {
		const menu = new Menu()
		buildMenu.Launcher(menu)
		buildMenu.Main(menu)
		return menu
	}
}

/*
 * run electron app 
 */
app.whenReady().then(() => {
	tray = new Tray(appInfo.icon)
	tray.setToolTip(appInfo.name)
	tray.setTitle(appInfo.name)
	tray.setContextMenu(buildMenu.Build())
})
