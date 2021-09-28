/*
 * Filename:  script_tray.js
 * See README.md for usage information.
 * See LICENSE.md for copyright information.
 */

/*
 * App Information
 */
const appInfo = {
	name: 'Script Tray',
	version: '092721',
	author: 'Matthew Evans',
	contact: 'contact@wtfsystems.net',
	website: 'https://www.wtfsystems.net',
	git: 'https://github.com/wtfsystems/script_tray',
	license: 'MIT',
	licenseURL: 'https://mit-license.org',
	icon: 'assets/robot.png'
}

/*
 * Imports & initialization
 */
const path = require('path')
const shell = require('shelljs')
const AutoLaunch = require('auto-launch')
const storage = require('electron-json-storage')
const { app, dialog, ipcMain, Tray, Menu, MenuItem, BrowserWindow } = require('electron')

//  Set path to node for shelljs
const nodePath = (shell.which('node').toString())
shell.config.execPath = nodePath

const autoLauncher = new AutoLaunch({ name: appInfo.name.trim() })
storage.setDataPath()

/*
 * Settings
 */
const Settings = {
	encoding: 'uft8',
	appList: [],
	launchCmds: [],
	debug: false,
	/*
	 * Load settings (wip - issue loading)
	 */
	load: () => {
		[
			{ label: 'encoding', default: 'uft8', data: (inData) => {
				Settings.encoding = inData
				console.log(Settings.encoding)
			} },
			{ label: 'appList', default: [], data: (inData) => { Settings.appList = inData } },
			{ label: 'launchCmds', default: [], data: (inData) => { Settings.launchCmds = inData } },
			{ label: 'debug', default: false, data: (inData) => { Settings.debug = inData } }
		].forEach((setting) => {
			try {
				storage.has(setting.label, (error, hasKey) => {
					if(error) throw error
					if(hasKey) {
						storage.get(setting.label, (error, savedData) => {
							if(error) throw error
							setting.data(savedData)
						})
					} else setting.data(setting.default)
				})
			} catch(error) {
				dialog.showErrorBox(`${appInfo.name}`,
					`Error loading setting ${setting.label}.\n\n${error}`)
			}
		})
		console.log(Settings)
	},

	/*
	 * Save settings
	 */
	save: () => {
		try {
			storage.set('encoding', Settings.encoding, (error) => { if(error) throw error })
			storage.set('appList', Settings.appList, (error) => { if(error) throw error })
			storage.set('launchCmds', Settings.launchCmds, (error) => { if(error) throw error })
			storage.set('debug', Settings.debug, (error) => { if(error) throw error })
		} catch(error) {
			dialog.showErrorBox(`${appInfo.name}`,
				`Error saving settings.\n\n${error}`)
		}
	},

	/*
	 * Reset settings
	 */
	reset: () => {
		try {
			storage.clear((error) => { if(error) throw error })
		} catch(error) {
			dialog.showErrorBox(`${appInfo.name}`,
				`Error clearing settings.\n\n${error}`)
		}
		Settings.encoding = 'utf8'
		Settings.appList = []
		Settings.launchCmds = []
		Settings.debug = false
		Settings.save()
	}
}

/*
 * Window for the settings editor
 */
let settingsWin = null
const showSettingsEditor = (data) => {
	settingsWin = new BrowserWindow({
		title: `${appInfo.name} - Editing ${data.label}`,
		width: 600,
		height: 600,
		fullscreen: false,
		fullscreenable: false,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			nativeWindowOpen: true,
			preload: path.join(__dirname, 'assets/settings.js')
		}
	})
	settingsWin.on('close', (event) => {
		settingsWin.destroy()
	})
	settingsWin.webContents.on('dom-ready', () => {
		settingsWin.webContents.send('send-json-data', data)
	})
	settingsWin.loadFile('assets/settings.html')
}

let appTray = null
/*
 * Event handler for receiving settings
 */
ipcMain.on('recieve-json-data', (event, data) => {
	if(data.old !== data.new) {
		//  Ask to save if data changed
		if(dialog.showMessageBoxSync(settingsWin, {
			type: 'question',
			title: 'Confirm',
			buttons: ['Yes', 'No'],
			message: 'Save changes?'
		}) === 0) {
			if(data.label === 'appList') Settings.appList = data.new
			if(data.label === 'launchCmds') Settings.launchCmds = data.new
			Settings.save()
			appTray.setContextMenu(buildMenu())
		}
	}
	settingsWin.destroy()
})

/*
 * Window for a simple input box
 */
let inputWin = null
let promiseResolver = {}
let promiseRejecter = {}
let dataPromise = {}
const showInputWindow = (data) => {
	dataPromise = new Promise((resolve, reject) => {
		promiseResolver = resolve
		promiseRejecter = reject
	})
	inputWin = new BrowserWindow({
		title: `${appInfo.name} - ${data.label}`,
		width: 400,
		height: 100,
		fullscreen: false,
		fullscreenable: false,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			nativeWindowOpen: true,
			preload: path.join(__dirname, 'assets/inputbox.js')
		}
	})
	inputWin.on('close', (event) => {
		promiseRejecter('closed')
		inputWin.destroy()
	})
	inputWin.webContents.on('dom-ready', () => {
		inputWin.webContents.send('send-input-data', data)
	})
	inputWin.loadFile('assets/inputbox.html')
}

/*
 * Event handler for receiving data from the input box
 */
ipcMain.on('recieve-input-data', (event, data) => {
	if(data.label === 'encoding') {
		if(data.old !== data.new) {
			if(dialog.showMessageBoxSync(settingsWin, {
				type: 'question',
				title: 'Confirm',
				buttons: ['Yes', 'No'],
				message: 'Save changes?'
			}) === 0) {
				Settings.encoding = data.new
				Settings.save()
			}
		}
		promiseRejecter('na')
		dataPromise.then(() => {}, () => {})
	} else {
		promiseResolver(data)
	}
	inputWin.destroy()
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
		tempItem.label = 'Settings'
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
	 * Build the options (settings) menu part
	 */
	const Options = (menu) => {
		menu.append(new MenuItem({
			label: 'Reset settings',
			click: () => {
				if(dialog.showMessageBoxSync({
					type: 'question',
					title: `${appInfo.name} - Confirm`,
					buttons: ['Yes', 'No'],
					message: 'Are you sure you want to reset settings?'
				}) === 0) {
					Settings.reset()
					appTray.setContextMenu(buildMenu())
				}
			}
		}))
		menu.append(new MenuItem({
			label: 'Enable debugging',
			type: 'checkbox',
			checked: (Settings.debug) ? true : false,
			click: (item) => {
				{ (item.checked) ? Settings.debug = true : Settings.debug = false }
				Settings.save()
			}
		}))
		menu.append(new MenuItem({ type: 'separator' }))
		menu.append(new MenuItem({
			label: 'Change encoding setting',
			click: () => {
				showInputWindow({
					label: 'encoding', data: Settings.encoding
				})
			}
		}))
		menu.append(new MenuItem({
			label: 'Edit App Verification List',
			click: () => {
				showSettingsEditor({
					label: 'appList', json: Settings.appList
				})
			}
		}))
		menu.append(new MenuItem({
			label: 'Edit Command Menu',
			click: () => {
				showSettingsEditor({
					label: 'launchCmds', json: Settings.launchCmds
				})
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
					return
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
						if(Settings.debug) {
							dialog.showMessageBox({
								type: 'info',
								title: appInfo.name,
								message: `Running command '${item.label}'`,
								detail: `Command:  ${item.cmd}`,
								icon: appInfo.icon
							})
						}
						let runCmd = item.cmd
						if(item.args !== undefined)
							item.args.forEach((arg) => {
								showInputWindow({ label: arg, command: item.cmd })
								dataPromise.then(
									(data) => {  // resolved
										runCmd += ' ' + data.new
									},
									() => {}     // rejected
								)
							})
						shell.exec(runCmd, {
							silent: !Settings.debug,
							encoding: Settings.encoding,
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
		})
	}

	/*
	 * Generate the complete menu
	 */
	const menu = new Menu()
	Launcher(menu, Settings.launchCmds)
	Main(menu)
	if(Settings.debug) console.log(menu)
	return menu
}

/*
 * Close tray and windows on exit
 */
app.on('before-quit', () => { 
	settingsWin.destroy()
	inputWin.destroy()
	appTray.destroy()
})

/*
 * Make sure app doesn't quit when no windows are open
 */
app.on('window-all-closed', () => {
	//
})

/*
 * Run the Script Tray Electron app 
 */
app.whenReady().then(() => {
	//  Load settings & verify apps exist
	Settings.load()
	Settings.appList.forEach((appCheck) => {
		if(!shell.which(appCheck))
			dialog.showErrorBox(appInfo.name, `Error:  ${appCheck} not found!`)
	})
	//  Set up app tray
	appTray = new Tray(appInfo.icon)
	appTray.setToolTip(appInfo.name)
	appTray.setTitle(appInfo.name)
	appTray.setContextMenu(buildMenu())
})
