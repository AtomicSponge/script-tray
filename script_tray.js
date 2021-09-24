/*
 * Filename:  script_tray.js
 */

/*
 * App Information
 */
const appInfo = {
	name: 'Script Tray',
	version: '092021',
	author: 'Matthew Evans',
	contact: 'contact@wtfsystems.net',
	website: 'https://www.wtfsystems.net',
	git: 'https://github.com/wtfsystems/script_tray',
	license: 'MIT',
	licenseURL: 'https://mit-license.org',
	icon: 'assets/robot.png'
}

/*
 * Imports
 */
const path = require('path')
const shell = require('shelljs')
const AutoLaunch = require('auto-launch')
const { app, dialog, ipcMain, Tray, Menu, MenuItem, BrowserWindow } = require('electron')
const storage = require('electron-json-storage')

//  Set path to node for shelljs
const nodePath = (shell.which('node').toString())
shell.config.execPath = nodePath

const autoLauncher = new AutoLaunch({ name: appInfo.name.trim() })

/*
 * Settings class
 */
class Settings {
	/*
	 * Construct Settings object
	 */
	constructor() {
		if(!Settings.instance) {
			Settings.instance = this
			storage.setDataPath()
			this.encoding = 'utf8'
			this.appList = []
			this.launchCmds = []
			this.debug = false
			this.load()
		}
		return Settings.instance
	}

	/*
	 * Load settings
	 */
	load() {
		try {
			storage.has('encoding', (error, hasKey) => {
				if(error) throw error
				if(hasKey) 
					storage.get('encoding', (error, data) => {
						if(error) throw error
						this.encoding = data
					})
			})
			storage.has('appList', (error, hasKey) => {
				if(error) throw error
				if(hasKey) 
					storage.get('appList', (error, data) => {
						if(error) throw error
						this.appList = data
					})
			})
			storage.has('launchCmds', (error, hasKey) => {
				if(error) throw error
				if(hasKey) 
					storage.get('launchCmds', (error, data) => {
						if(error) throw error
						this.launchCmds = data
					})
			})
			storage.has('debug', (error, hasKey) => {
				if(error) throw error
				if(hasKey) 
					storage.get('debug', (error, data) => {
						if(error) throw error
						this.debug = data
					})
			})
		} catch(error) {
			dialog.showErrorBox(`${appInfo.name}`,
				`Error loading settings.\n\n${error}`)
		}
	}

	/*
	 * Save settings
	 */
	save() {
		try {
			storage.set('encoding', this.encoding, (error) => { if(error) throw error })
			storage.set('appList', this.appList, (error) => { if(error) throw error })
			storage.set('launchCmds', this.launchCmds, (error) => { if(error) throw error })
			storage.set('debug', this.debug, (error) => { if(error) throw error })
		} catch(error) {
			dialog.showErrorBox(`${appInfo.name}`,
				`Error saving settings.\n\n${error}`)
		}
	}

	/*
	 * Reset settings
	 */
	reset() {
		try {
			storage.clear((error) => { if(error) throw error })
		} catch(error) {
			dialog.showErrorBox(`${appInfo.name}`,
				`Error clearing settings.\n\n${error}`)
		}
		this.encoding = 'utf8'
		this.appList = []
		this.launchCmds = []
		this.debug = false
	}
}

const settings = new Settings()

/*
 * Verify apps exist
 */
settings.appList.forEach((appCheck) => {
	if(!shell.which(appCheck)) {
		dialog.showErrorBox(appInfo.name,
			`Error:  ${appCheck} not found!`)
		app.quit()
	}
})

/*
 * Window for the settings editor
 */
let appTray = null
let settingsWin = null
const showSettingsEditor = (data) => {
	settingsWin = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: true,
			nativeWindowOpen: true,
			preload: path.join(__dirname, 'assets/preload.js')
		}
	})
	settingsWin.loadFile('assets/index.html')
	settingsWin.webContents.on('did-finish-load', () => {
		settingsWin.webContents.send('send-json-data', data)
	})
	if(settings.debug) settingsWin.webContents.openDevTools()

	// todo:  remove
	//win.hide()
}

/*
 *
 */
ipcMain.handle('recieve-json-data', async(returned_data) => {
	if(data !== returned_data) {
		const res = dialog.showMessageBoxSync(win, {
			type: 'question',
			title: 'Confirm',
			buttons: ['Yes', 'No'],
			message: "Save changes?"
		})
		if(res === 0) {
			settings.save()
			appTray.setContextMenu(buildMenu())
		}
	}
	settingsWin.hide()
})

/*
 * About message box
 */
const showAboutBox = () => {
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

/*
 * Builds the system tray menu
 */
const buildMenu = () => {
	/*
	 * Build the main menu part 
	 */
	const Main = (menu) => {
		menu.append(new MenuItem({ type: 'separator' }))
		{const optionsMenu = new Menu()
		Options(optionsMenu)
		let tempItem = {}
		tempItem.label = 'Options'
		tempItem.submenu = optionsMenu
		menu.append(new MenuItem(tempItem))}
		menu.append(new MenuItem({ type: 'separator' }))
		menu.append(new MenuItem({
			label: `About ${appInfo.name}`,
			click: () => { showAboutBox() }
		}))
		menu.append(new MenuItem({
			label: `Close ${appInfo.name}`, role: 'quit'
		}))
	}

	/*
	 * Build the options menu part
	 */
	const Options = (menu) => {
		menu.append(new MenuItem({
			label: 'Enable debugging',
			type: 'checkbox',
			checked: (settings.debug) ? true : false,
			click: (item) => {
				(item.checked) ? settings.debug = true : settings.debug = false
				settings.save()
			}
		}))
		menu.append(new MenuItem({ type: 'separator' }))
		menu.append(new MenuItem({
			label: 'Change encoding setting',
			click: () => {
				showSettingsEditor(settings.encoding)
			}
		}))
		menu.append(new MenuItem({
			label: 'Edit App Verification List',
			click: () => {
				showSettingsEditor(settings.appList)
			}
		}))
		menu.append(new MenuItem({
			label: 'Edit Command Menu',
			click: () => {
				showSettingsEditor(settings.launchCmds)
			}
		}))
		menu.append(new MenuItem({ type: 'separator' }))
		menu.append(new MenuItem({
			label: 'Start at login',
			type: 'checkbox',
			checked: (autoLauncher.isEnabled()) ? true : false,
			click: (item) => {
				(item.checked) ?
					autoLauncher.enable() :
					autoLauncher.disable()
			}
		}))
	}

	/*
	 * Build the launcher menu part
	 */
	const Launcher = (menu, collection) => {
		collection.forEach((item) => {
			if(Array.isArray(item)) {  //  Item is a sub menu
				const menuTitle = item.shift()  //  Get the title item
				if(menuTitle.menu === undefined) {
					dialog.showErrorBox(`${appInfo.name}`,
						`Error building menu, incorrect title menu item.\n\n${Object.keys(item)}`)
					app.quit()
				}
				const tempMenu = new Menu()
				Launcher(tempMenu, item)  //  Recursive call to keep building menus
				//  Add the generated sub menu
				let tempItem = {}
				tempItem.label = menuTitle.menu
				tempItem.submenu = tempMenu
				menu.append(new MenuItem(tempItem))
				return  //  Next item
			}
			if(item.separator !== undefined) {  //  Item is a seperator
				menu.append(new MenuItem({ type: 'separator' }))
				return  //  Next item
			}
			if(item.label !== undefined && item.cmd !== undefined) {  //  Item is a command
				menu.append(new MenuItem({
					label: item.label,
					click: () => {
						shell.exec(item.cmd, {
							silent: !settings.debug,
							encoding: settings.encoding,
							async: true
						}, (code, stdout, stderr) => {
							if(code !== 0)  //  Error processing command
								dialog.showErrorBox(`${appInfo.name} - ${item.label}`,
									`Command:  ${item.cmd}\nReturn Code:  ${code}\nError:  ${stderr}`)
							else {  //  Command executed
								//  do something else?  ¯\_(ツ)_/¯
							}
						})
					}
				}))
				return  //  Next item
			}
			//  Item wasn't processed, so there's a problem with the format
			dialog.showErrorBox(`${appInfo.name}`,
				`Error building menu, incorrect menu item.\n\n` +
				`${Object.keys(item)}\n${Object.values(item)}`)
			app.quit()
		})
	}

	/*
	 * Generate the complete menu
	 */
	const menu = new Menu()
	Launcher(menu, settings.launchCmds)
	Main(menu)
	if(settings.debug) console.log(menu)
	return menu
}

/*
 * Close tray on exit
 */
app.on('quit', () => { 
	appTray.destroy()
})

/*
 * Run the Script Tray Electron app 
 */
app.whenReady().then(() => {
	appTray = new Tray(appInfo.icon)
	appTray.setToolTip(appInfo.name)
	appTray.setTitle(appInfo.name)
	appTray.setContextMenu(buildMenu())
})
