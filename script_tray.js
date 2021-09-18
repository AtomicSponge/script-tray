/*
 * Filename:  docker_tray.js
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

	icon: 'assets/.png',
	debug: true
}

/*
 * imports
 */
const fs = require('fs')
const shell = require('shelljs')
const AutoLaunch = require('auto-launch')
const { app, Menu, Tray, dialog } = require('electron')
const path = require('path')

const nodePath = (shell.which('node').toString())
shell.config.execPath = nodePath

if(!shell.which('docker')) {
	dialog.showErrorBox(appConfig.name, 'Error:  Docker not found!')
	app.quit()
}

/*
 * auto launch
 */
const dockertrayAutoLauncher = new AutoLaunch({ name: appConfig.name })
{(dockertrayAutoLauncher.isEnabled()) ?
	dockertrayAutoLauncher.disable() :
	dockertrayAutoLauncher.enable()}

/*
 * get docker image list
 */
const dockerCmds = {
	/*
	 *
	 */
	getImages: () => {
		const res = shell.exec('docker images', {silent:true})
		if(res.code !== 0) throw 'Error: Docker command failed'
		return res
	}
}

/*
 * 
 */
const buildMenu = {
	/*
	 * 
	 */
	Main: () => {
		return [
			{ type: 'separator' },
			{ label: 'Start at login', type: 'checkbox' },
			{ type: 'separator' },
			{ label: 'About Docker Tray', role: 'about' },
			{ label: 'Close Docker Tray', role: 'quit' }
		]
	},

	/*
	 * 
	 */
	ImageList: (input) => {
		let total = []
		input.substring(input.indexOf('\n') + 1)
		.split('\n').filter(String).forEach((item) => {
			item = item.split('   ')
			let subtotal = []
			item.forEach((item, index, arr) => { subtotal.push(item.trim()) })
			let temp = {}
			temp.label = '   •  ' + subtotal[0]
			temp.submenu = []
			total.push(temp)
		})
		if(total === undefined || total.length === 0)
			throw 'Error: Docker Images is empty'
		let menu = { label: 'Docker Images' }
		menu['submenu'] = total
		let res = []
		res.push(menu)
		return res
	}
}

/*
 * create about window
 */
const aboutDockerTray = () => {
	dialog.showMessageBox({
		type: 'info',
		title: 'About ' + appConfig.name,
		message: appConfig.name + '    ver:  ' + appConfig.version,
		detail: appConfig.git,
		icon: appConfig.icon
	})
}

/*
 * build the main menu
 */
const buildDockerTrayMenu = () => {
	try {
		var mainList = buildMenu.Main()
		var imgList = buildMenu.ImageList(dockerCmds.getImages())
	} catch(err) {
		dialog.showErrorBox(appConfig.name, err)
		app.quit()
	}
	return imgList.concat(mainList)
}

const menu = buildDockerTrayMenu()
if(appConfig.debug) console.log(menu)
const contextMenu = Menu.buildFromTemplate(menu)

/*
 * run electron app 
 */
app.whenReady().then(() => {
	tray = new Tray(appConfig.icon)
	tray.setToolTip(appConfig.name)
	tray.setTitle(appConfig.name)
	tray.setContextMenu(contextMenu)
	aboutDockerTray()
})
