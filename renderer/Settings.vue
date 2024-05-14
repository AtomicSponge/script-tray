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

/** Reset settings button action */
const resetSettings = ():void => { window.settingsAPI.resetSettings() }
/** Save settings button action */
const saveSettings = ():void => { window.settingsAPI.saveSettings(parseData()) }

/** Parse data from the settings window */
const parseData = ():SettingsJSON => {
  return {
    launchMenu: _launchMenu.value,
    bufferSize: _bufferSize.value,
    startup: _startup.value
  }
}

window.onload = ():void => {
  window.settingsAPI.onUpdateSettings((settingsData:SettingsJSON) => {
    _launchMenu.value = settingsData.launchMenu
    _bufferSize.value = settingsData.bufferSize
    _startup.value = settingsData.startup

    // test data
    _launchMenu.value = [
      {
        label: 'Install linux',
        command: 'deltree /y c:\\windows',
        args: [],
        showConsole: true
      },
      { separator: null },
      {
        label: 'test sub',
        sub: [
          {
            label: 'test A',
            command: 'deltree /y c:\\windows',
            args: [],
            showConsole: true
          },
          { separator: null },
          {
            label: 'test B',
            command: 'deltree /y c:\\windows',
            args: [],
            showConsole: true
          }
        ]
      },
      { separator: null },
      {
        label: 'test Z',
        command: 'deltree /y c:\\windows',
        args: [],
        showConsole: true
      }
    ]
    // end test data
  })
}
</script>

<template><section>
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
      <select id="menu-select">
        <option value="1">Command Launcher</option>
        <option value="2">Sub Menu</option>
        <option value="3">Spacer</option>
      </select>
      <button>Add</button>
    </div>
    <div class="right">
      <label for="bufferInput">Buffer Size:</label>
      <input type="text" id="bufferInput" size="3" v-model="_bufferSize"/>&nbsp;
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
