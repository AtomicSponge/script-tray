<table align="center">
<tr>
  <td>
    <img src="./public/icon-512x512.png" width="80"/>
  </td>
  <th>
    <h1>Script Tray</h1>
    Run commands from your system tray
  </th>
</tr>
</table>

__:wrench: Script Tray__ is a utility that sits in your system tray and allows you to run preconfigured scripts or commands from a click of a button.  Save yourself some keystrokes and run all your common commands from here!

*Note:  Only non-interactive scripts and commands can be used.*

<img src ="./.github/image/screenshot-traymenu.png" alt="Run commands directly from your system tray" width="300"/>

Written in [Electron](https://www.electronjs.org/) and [Vue](https://vuejs.org/), __Script Tray__ is cross platform and will run on Windows, Mac or Linux.  Check the [latest releases](https://github.com/AtomicSponge/script-tray/releases/latest) for binaries of each platform.

Or you can clone this repository with `git` by running:
```
git clone https://github.com/AtomicSponge/script-tray.git
```

Build by running:
```
cd script-tray
npm ci
npm run dist
```
This will compile a package for your platform.

# Features

## Settings Menu

<img src ="./.github/image/screenshot-settings.png" alt="Customizable via in-app settings" width="420"/>

Fully configurable commands with submenus and separators for organization.  Also allows for variables to be used within commands.  These will be prompted for durring script execution.  The format for these variables is:  `?<| example |>`

## Output Buffer

<img src ="./.github/image/screenshot-buffer.png" alt="View previously ran commands via an output buffer" width="420"/>

Viewable output buffer with ANSI styling!  Can also be saved to JSON or Log file *(.log or .txt)* from the tray menu.

## Job Manager

<img src ="./.github/image/screenshot-jobmgr.png" alt="View and manage currently running scripts via the job manager" width="420"/>

View running jobs and cancel running or hung scripts.

# Advanced Options
Optional command arguments to pass to __Script Tray__ at launch:

`--no-load-traydata` - Skips loading the application settings.

`--no-load-bufferdata` - Skips loading the script buffer.

-----

<sub><sup>
Created with :heart: and [Electron](https://www.electronjs.org/) | [Vue](https://vuejs.org/) | [Electron-Vite](https://electron-vite.github.io/) 
</sup></sub>

<sub><sup>
Robot icon made from [Web Fonts](http://www.onlinewebfonts.com)
is licensed by [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
</sup></sub>
