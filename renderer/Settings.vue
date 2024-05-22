<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { testNumeric } from '@spongex/regexps'

import MenuBuilder from './components/MenuBuilder.vue'

const _launchMenu = ref()
const _bufferSize = ref()
const _startup = ref()
const _encodingSelect = ref()
const _newItemSelect = ref(1)
const _menuList = ref()
const _encodingTypes = ref([
  'utf8', 'ascii', 'base64', 'base64url', 'hex', 'ucs2', 'utf16le', 'binary', 'latin1'
])

/** Build a list of menus and their IDs */
const buildMenuList = ():void => {
  _menuList.value = []
  _menuList.value.push({ id: 0, label: 'Main' })

  /**
   * Recursive function to build entire menu
   * @param menu Menu object to build from
   */
  const builder = (menu:Array<any>):void => {
    menu.forEach((item:SubMenu) => {
      if (item.hasOwnProperty('id') &&
          item.hasOwnProperty('label') &&
          item.hasOwnProperty('sub')) {
        _menuList.value.push({ id: item.id, label: item.label })
        builder(item.sub)
      }
    })
  }

  builder(_launchMenu.value)
}

/** Parse data from the settings window */
const parseData = ():SettingsIpc => {
  const minVal:ScriptBufferMin = 10
  const maxVal:ScriptBufferMax = 500
  if(_bufferSize.value < minVal) _bufferSize.value = minVal
  if(_bufferSize.value > maxVal) _bufferSize.value = maxVal
  return {
    launchMenu: JSON.stringify(_launchMenu.value),
    bufferSize: Number(_bufferSize.value),
    encoding: _encodingSelect.value,
    startup: Boolean(_startup.value)
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
const resetSettings = ():void => { window.settingsAPI.resetSettings() }
/** Save settings button action */
const saveSettings = ():void => { window.settingsAPI.saveSettings(parseData()) }

/**
 * Move an item from one menu to another
 * @param from Menu ID to move from
 * @param to Menu ID to move to
 * @param idx Item index to move
 */
const moveItem = (from:number, to:number, idx:number):void => {
  window.alert(`moving ${from} ${to} ${idx}`)
}

/** Add a new item to the launch menu */
const addItem = ():void => {
  switch(Number(_newItemSelect.value)) {
    case 1:
      _launchMenu.value.push({
        label: 'New Label', command: 'New Command',
        args: [], cwd: 'default'
      })
      return
    case 2:
      _launchMenu.value.push({
        id: randomFixedInteger(16),
        label: 'New Sub Menu', sub: []
      })
      buildMenuList()
      return
    case 3:
      _launchMenu.value.push({ separator: null })
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
    buildMenuList()
  })
})
</script>

<template>
<section>
  <header>
    <div class="left">
      <input type="checkbox" id="startupInput" v-model="_startup"/>
      <label for="startupInput">Load on startup</label>
      &emsp;&emsp;
      <label for="encodingSelect">System Encoding:</label>
      <select id="encodingSelect" v-model="_encodingSelect">
        <option v-for="item in _encodingTypes" :value=item>{{ item }}</option>
      </select>
    </div>
    <div class="right">
      <button @click="resetSettings">Reset Settings</button>
      &nbsp;
      <button @click="saveSettings">Save Settings</button>
    </div>
  </header>
  <div id="menuContents">
    <MenuBuilder
      v-model:launch-menu="_launchMenu"
      v-model:menu-list="_menuList"
      @move-item="moveItem">
    </MenuBuilder>
  </div>
  <footer>
    <div class="left">
      <select id="menuSelect" v-model="_newItemSelect">
        <option value="1">Command Launcher</option>
        <option value="2">Sub Menu</option>
        <option value="3">Separator</option>
      </select>
      <button @click="addItem">Add</button>
    </div>
    <div class="right">
      <label for="bufferInput">Buffer Size:</label>
      <input type="text" id="bufferInput" size="3" v-model="_bufferSize"/>
    </div>
  </footer>
</section>
</template>

<style lang="stylus" scoped>
section
  display flex
  flex-flow column
  align-items stretch
  height 100vh
header
  padding 2px
  padding-bottom 6px
#menuContents
  flex: auto
  overflow auto
footer
  padding 2px
  padding-top 4px
.left
  float left
.right
  float right
#menuSelect
  font-size medium
#bufferInput
  margin-left 4px
  margin-right 4px
</style>
