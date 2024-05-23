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
const _itemCount = ref()
const _encodingTypes = ref([
  'utf8', 'ascii', 'base64', 'base64url', 'hex', 'ucs2', 'utf16le', 'binary', 'latin1'
])

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
const resetSettings = ():void => {
  window.settingsAPI.resetSettings()
  buildMenuList()
}
/** Save settings button action */
const saveSettings = ():void => {
  window.settingsAPI.saveSettings(parseData())
}

/** Add a new item to the launch menu */
const addItem = ():void => {
  switch(Number(_newItemSelect.value)) {
    case 1:
      if (_itemCount.value < Number.MAX_SAFE_INTEGER) {
        _launchMenu.value.push({
          label: 'New Label', command: 'New Command',
          args: [], cwd: 'default'
        })
      } else {
        window.alert('Maximum items reached!')
      }
      return
    case 2:
      //  Make sure array size will never equal MAX INT
      if (_menuList.value.length < Number.MAX_SAFE_INTEGER &&
          _itemCount.value < Number.MAX_SAFE_INTEGER) {
        _launchMenu.value.push({
          id: randomFixedInteger(16),
          label: 'New Sub Menu', sub: []
        })
        buildMenuList()
      } else {
        window.alert('Maximum items reached!')
      }
      return
    case 3:
      if(_itemCount.value < Number.MAX_SAFE_INTEGER)
        _launchMenu.value.push({ separator: null })
      else
        window.alert('Maximum items reached!')
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
      :menu-id=Number.MAX_SAFE_INTEGER>  <!-- Main menu starts at MAX INT -->
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
