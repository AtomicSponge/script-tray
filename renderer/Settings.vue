<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { testNumeric } from '@spongex/regexps'

import MenuBuilder from './components/MenuBuilder.vue'

/** Entire menu contents for displaying in settings */
const _launchMenu = ref()
/** Buffer size amount */
const _bufferSize = ref()
/** Launch on startup settings flag */
const _startup = ref()
/** Select menu for encoding type */
const _encodingSelect = ref()
/** Select menu for adding a new item */
const _newItemSelect = ref(1)
/** Select menu for menu option when adding a new item */
const _menuSelect = ref(0)
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
  _menuSelect.value = 0
}

/** Parse data from the settings window */
const parseData = (event:any):SettingsIpc => {
  const minVal:ScriptBufferMin = 10
  const maxVal:ScriptBufferMax = 500
  if(_bufferSize.value < minVal) _bufferSize.value = minVal
  if(_bufferSize.value > maxVal) _bufferSize.value = maxVal
  return {
    launchMenu: JSON.stringify(_launchMenu.value),
    bufferSize: Number(_bufferSize.value),
    encoding: _encodingSelect.value,
    startup: Boolean(_startup.value),
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
  switch(Number(_newItemSelect.value)) {
    case 1:
      if (_itemCount.value < Number.MAX_SAFE_INTEGER) {
        _menuList.value[_menuSelect.value].sub.push({
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
        _menuList.value[_menuSelect.value].sub.push({
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
      _menuList.value[_menuSelect.value].sub.push({ separator: null })
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

  window.onbeforeunload = (event:any) => {
    window.settingsAPI.saveSettings(parseData(event))
  }
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
      @rebuild="buildMenuList"
      :menu-id=Number.MAX_SAFE_INTEGER>  <!-- Main menu starts at MAX INT -->
    </MenuBuilder>
  </div>
  <footer>
    <div class="left">
      <select id="menuSelect" v-model="_menuSelect" :title="_tooltips.newMenu" data-toggle="tooltip">
        <option v-for="(_item, _idx) in _menuList" :key=_idx :value=_idx>
          {{ _item.label }}
        </option>
      </select>
      <select v-model="_newItemSelect" :title="_tooltips.newMenu" data-toggle="tooltip">
        <option value="1">Command Launcher</option>
        <option value="2">Sub Menu</option>
        <option value="3">Separator</option>
      </select>
      <button @click="addItem" :title="_tooltips.newMenu" data-toggle="tooltip">Add</button>
    </div>
    <div class="right">
      <label for="bufferInput" :title="_tooltips.buffer" data-toggle="tooltip">Buffer Size:</label>
      <input type="text" id="bufferInput" size="3" v-model="_bufferSize" :title="_tooltips.buffer" data-toggle="tooltip"/>
    </div>
  </footer>
</section>
</template>

<style scoped>
section {
  display: flex;
  flex-flow: column;
  align-items: stretch;
  height: 100vh;
}
header {
  padding: 2px;
  padding-bottom: 6px;
}
#menuContents {
  flex: auto;
  overflow: auto;
}
footer {
  padding: 2px;
  padding-top: 4px;
}
select {
  font-size: medium;
}
#menuSelect {
  width: 160px;
}
#bufferInput {
  margin-left: 4px;
  margin-right: 4px;
}
.left {
  float: left;
}
.right {
  float: right;
}
</style>
