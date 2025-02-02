<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { testNumeric } from '@spongex/regexps'

import MenuBuilder from './components/MenuBuilder.vue'

/** Allowed menu types - used in drop-down */
const _menuTypes = [
  'Command Launcher', 'Sub Menu', 'Separator'
]

/** Entire menu contents for displaying in settings */
const _launchMenu = ref()
/** Buffer size amount */
const _bufferSize = ref()
/** Launch on startup settings flag */
const _startup = ref()
/** Select menu for encoding type */
const _encodingSelect = ref()
/** Select menu for zoom factor */
const _zoomSelect = ref()
/** Select menu for adding a new item */
const _newItemSelect = ref(_menuTypes[0])
/** Select menu for menu option when adding a new item */
const _menuSelect = ref(Number.MAX_SAFE_INTEGER)
/** Array containing a reference to menu items */
const _menuList = ref()
/** Total count of all menu items */
const _itemCount = ref()

/** Tooltip strings used in menu display */
const _tooltips = {
  buffer: 'The number of processed commands to store in the buffer',
  newMenu: 'Add a new item to the selected menu'
}

/** Allowed encoding types */
const _encodingTypes = [
  'utf8', 'ascii', 'base64', 'base64url', 'hex', 'ucs2', 'utf16le', 'binary', 'latin1'
]

/** Allowed zoom factors */
const _zoomLevels = [ 1, 2, 3, 4 ]

/** Build a reference list of submenus */
const buildMenuList = ():void => {
  //  Reset
  _menuList.value = []
  _itemCount.value = 1

  //  Push a reference to the main menu
  _menuList.value.push({
    id: Number.MAX_SAFE_INTEGER,
    label: 'Main',
    sub: _launchMenu.value
  })

  /**
   * Recursive function to find all submenus
   * @param menu Menu object to parse
   */
  const buildMenu = (menu:Array<any>):void => {
    menu.forEach((item:any) => {
      _itemCount.value++
      if (item.hasOwnProperty('id') &&
          item.hasOwnProperty('label') &&
          item.hasOwnProperty('sub')) {
        _menuList.value.push(item)
        buildMenu(item.sub)
      }
    })
  }

  buildMenu(_launchMenu.value)
  //_menuSelect.value = 0
}

/** Parse data from the settings window */
const parseData = (event:any):SettingsIpc => {
  const minVal:ScriptBufferMin = 10
  const maxVal:ScriptBufferMax = 500
  if (_bufferSize.value < minVal) _bufferSize.value = minVal
  if (_bufferSize.value > maxVal) _bufferSize.value = maxVal
  return {
    launchMenu: JSON.stringify(_launchMenu.value),
    bufferSize: Number(_bufferSize.value),
    encoding: _encodingSelect.value,
    startup: Boolean(_startup.value),
    zoomFactor: Number(_zoomSelect.value),
    check: (event.type === 'beforeunload') ? true : false
  }
}

/**
 * Creates a random number with a fixed amount of digits
 * @param digits Number of digits to generate
 * @returns A random number of the specified length
 */
const randomFixedInteger = (digits:number):number => {
  return Math.floor(Math.pow(10, digits - 1) + Math.random() * (Math.pow(10, digits) - Math.pow(10, digits - 1) - 1))
}

/** Reset settings button action */
const resetSettings = ():void => {
  window.settingsAPI.resetSettings()
  buildMenuList()
}
/** Save settings button action */
const saveSettings = (event:any):void => {
  window.settingsAPI.saveSettings(parseData(event))
}

/** Add a new item to the launch menu */
const addItem = ():void => {
  //  Make sure array size will never equal MAX INT
  if(_itemCount.value >= Number.MAX_SAFE_INTEGER) {
    window.alert('Maximum items reached!')
    return
  }
  switch(_newItemSelect.value) {
    case _menuTypes[0]:
      _menuList.value[_menuList.value.findIndex((obj:any) => { return obj.id === _menuSelect.value})].sub.push({
        label: 'New Label', command: 'New Command',
        args: [], cwd: 'default'
      })
      return
    case _menuTypes[1]:
      _menuList.value[_menuList.value.findIndex((obj:any) => { return obj.id === _menuSelect.value})].sub.push({
        id: randomFixedInteger(16),
        label: 'New Sub Menu', sub: []
      })
      buildMenuList()
      return
    case _menuTypes[2]:
      _menuList.value[_menuList.value.findIndex((obj:any) => { return obj.id === _menuSelect.value})].sub.push({ separator: null })
      return
    default:
      return
  }
}

//  Make sure _bufferSize is a number
watch(_bufferSize, (newVal, oldVal) => {
  const maxVal:ScriptBufferMax = 500
  if (newVal !== '') {
    if (!testNumeric(newVal)) _bufferSize.value = oldVal
    if (newVal > maxVal) _bufferSize.value = maxVal
  }
})

//  Fetch data
onMounted(() => {
  window.settingsAPI.onUpdateSettings((settingsData:SettingsIpc) => {
    _launchMenu.value = JSON.parse(settingsData.launchMenu)
    _bufferSize.value = settingsData.bufferSize
    _encodingSelect.value = settingsData.encoding
    _startup.value = settingsData.startup
    _zoomSelect.value = settingsData.zoomFactor
    buildMenuList()
  })

  window.onbeforeunload = (event:any) => {
    window.settingsAPI.saveSettings(parseData(event))
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-checkbox label="Load on startup" v-model="_startup"></v-checkbox>
      <v-select label="System Encoding" :items="_encodingTypes" v-model="_encodingSelect"></v-select>
      <v-spacer></v-spacer>
      <v-btn @click="resetSettings">Reset Settings</v-btn>
      &nbsp;&nbsp;
      <v-btn @click="saveSettings">Save Settings</v-btn>
    </v-row>
  </v-container>

  <v-container>
    <v-row>
      <v-select label="Menu location" :items="_menuList" :item-title="'label'" :item-value="'id'" v-model="_menuSelect"></v-select>
      <v-select label="Item type" :items="_menuTypes" v-model="_newItemSelect"></v-select>
      <v-btn @click="addItem" :title="_tooltips.newMenu" data-toggle="tooltip">Add</v-btn>
      <v-spacer></v-spacer>
      <v-select label="Zoom Level" :items="_zoomLevels" v-model="_zoomSelect"></v-select>
      <v-text-field label="Buffer Size" v-model="_bufferSize" :title="_tooltips.buffer"></v-text-field>
    </v-row>
  </v-container>

  <v-container>
    <MenuBuilder
      v-model:launch-menu="_launchMenu"
      v-model:menu-list="_menuList"
      @rebuild="buildMenuList"
      :menu-id="Number.MAX_SAFE_INTEGER">  <!-- Main menu starts at MAX INT -->
    </MenuBuilder>
  </v-container>
</template>
