##  Script Tray

Run scripts or programs from a system tray icon.

[NPM Package](https://www.npmjs.com/package/script_tray)

#### Features:
- Custom menus and sub menus via json
- Runs from the system tray
- Run any command using [shelljs](https://www.npmjs.com/package/shelljs)
- Launch at system start
- Debug mode

#### Requirements:
- [electron](https://www.npmjs.com/package/electron)
- [shelljs](https://www.npmjs.com/package/shelljs)
- [auto-launch](https://www.npmjs.com/package/auto-launch)
- [jsoneditor](https://www.npmjs.com/package/jsoneditor)
- [electron-json-storage](https://www.npmjs.com/package/electron-json-storage)

-----

### Menu Format

```
[
    {
        label: 'System Backup',
        cmd: 'sysbak'
    },
    [
        {
            menu: 'test menu'
        },
        [
            {
                menu: 'test menu 2'
            },
            {
                label: 'test2',
                cmd: 'test2'
            }
        ],
        {
            label: 'testa',
            cmd: 'testa',
            args: [ 'exampleA', 'exampleB' ]
        },
        {
            separator: null
        },
        {
            label: 'testb',
            cmd: 'testb',
            args: [ 'example' ]
        }
    ],
    {
        label: 'test1',
        cmd: 'test1'
    }
]
```
