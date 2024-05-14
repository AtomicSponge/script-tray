<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref } from 'vue'

const launchMenu = ref()
const bufferSize = ref()
const startup = ref()

/** Reset settings button action */
const resetSettings = () => { window.settingsAPI.resetSettings() }
/** Save settings button action */
const saveSettings = () => { window.settingsAPI.saveSettings(parseData()) }

/** Parse data from the settings window */
const parseData = () => {
  return {
    launchMenu: launchMenu.value,
    bufferSize: bufferSize.value,
    startup: startup.value
  }
}

window.onload = () => {
  window.settingsAPI.onUpdateSettings((settingsData:SettingsJSON) => {
    launchMenu.value = settingsData.launchMenu
    bufferSize.value = settingsData.bufferSize
    startup.value = settingsData.startup
  })
}
</script>

<template><section>
  <header>
    <div class="left">
      <input type="checkbox" id="startupInput" v-model="startup"/>
      <label for="startupInput">Load on startup</label>
    </div>
    <div class="right">
      <button @click="resetSettings">Reset Settings</button>
      &nbsp;
      <button @click="saveSettings">Save Settings</button>
    </div>
  </header>
  <div id="menuContents"></div>
  <footer>
    <div class="left">
      <select id="menu-select">
        <option value="1">Command Launcher</option>
        <option value="2">Sub Menu</option>
        <option value="3">Spacer</option>
      </select>
      <button>Add</button>
    </div>
    <div class="right">
      <label for="bufferInput">Buffer Size:</label>
      <input type="text" id="bufferInput" size="3" v-model="bufferSize"/>&nbsp;
    </div>
  </footer>
</section></template>

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

input
  cursor pointer
</style>
