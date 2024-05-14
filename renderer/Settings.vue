<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref } from 'vue'

import MenuBuilder from './components/MenuBuilder.vue';

const _launchMenu = ref()
const _bufferSize = ref()
const _startup = ref()

const _menuSelect = ref(1)

/** Reset settings button action */
const resetSettings = ():void => { window.settingsAPI.resetSettings() }
/** Save settings button action */
const saveSettings = ():void => { window.settingsAPI.saveSettings(parseData()) }

/** Parse data from the settings window */
const parseData = ():SettingsInterface => {
  return {
    launchMenu: _launchMenu.value,
    bufferSize: Number(_bufferSize.value),
    startup: Boolean(_startup.value)
  }
}

/** Add a new item to the launch menu */
const addItem = ():void => {
  switch(Number(_menuSelect.value)) {
    case 1:
      break
    case 2:
      break
    case 3:
      break
    default:
      return
  }
}

window.onload = ():void => {
  window.settingsAPI.onUpdateSettings((settingsData:SettingsInterface) => {
    _launchMenu.value = settingsData.launchMenu
    _bufferSize.value = settingsData.bufferSize
    _startup.value = settingsData.startup
    console.log(settingsData)
  })
}
</script>

<template>
<section>
  <header>
    <div class="left">
      <input type="checkbox" id="startupInput" v-model="_startup"/>
      <label for="startupInput">Load on startup</label>
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
      <select id="menu-select" v-model="_menuSelect">
        <option value="1">Command Launcher</option>
        <option value="2">Sub Menu</option>
        <option value="3">Spacer</option>
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
#menuContents
  flex: auto
  overflow auto
footer
  padding 2px
.left
  float left
.right
  float right

#menu-select
  color inherit
  background-color inherit
  cursor pointer
  border none
  font-family inherit
  font-size medium
  margin-left 4px
  margin-right 6px
#menu-select:focus
  outline none
option
  color black
#bufferInput
  color inherit
  background-color inherit
  font-size large
  margin-left 4px
  margin-right 4px
#bufferInput:focus
  outline none
</style>
