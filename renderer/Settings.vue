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
const _menuSelect = ref(1)
const _encoding_types = ref([
  'utf8', 'ascii', 'base64', 'base64url', 'hex', 'ucs2', 'utf16le', 'binary', 'latin1'
])

/** Reset settings button action */
const resetSettings = ():void => { window.settingsAPI.resetSettings() }
/** Save settings button action */
const saveSettings = ():void => { window.settingsAPI.saveSettings(parseData()) }

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

/** Add a new item to the launch menu */
const addItem = ():void => {
  switch(Number(_menuSelect.value)) {
    case 1:
      _launchMenu.value.push({
        label: 'New Label', command: 'New Command',
        args: [], cwd: 'default'
      })
      return
    case 2:
      _launchMenu.value.push({ label: 'New Sub Menu', sub: [] })
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
        <option v-for="item in _encoding_types" :value=item>{{ item }}</option>
      </select>
    </div>
    <div class="right">
      <button @click="resetSettings">Reset Settings</button>
      &nbsp;
      <button @click="saveSettings">Save Settings</button>
    </div>
  </header>
  <div id="menuContents"><MenuBuilder v-model="_launchMenu"/></div>
  <footer>
    <div class="left">
      <select id="menuSelect" v-model="_menuSelect">
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
