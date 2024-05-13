<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
window.onload = () => {
  window.settingsAPI.onUpdateSettings((settingsData:SettingsJSON) => {
    const startupInput = <HTMLInputElement>document.getElementById('startupInput')
    startupInput.checked = settingsData.startup
    const bufferInput = <HTMLInputElement>document.getElementById('bufferInput')
    bufferInput.value = `${settingsData.bufferSize}`
  })
}
</script>

<template><section>
  <header>
    <div class="left">
      <input type="checkbox" id="startupInput"/> Load on startup
    </div>
    <div class="right">
      <button onclick="window.settingsAPI.resetSettings()">Reset Settings</button>
      &nbsp;
      <button onclick="window.settingsAPI.saveSettings()">Save Settings</button>
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
      Buffer Size: <input type="text" id="bufferInput" size="3"/>&nbsp;
    </div>
  </footer>
</section></template>

<style lang="stylus" scoped>
@import './styleVars.styl'

section
  display flex
  flex-flow column
  align-items stretch
  height 100vh
header
  flex 0 1 auto
  background-color app_bg_color
#menuContents
  flex: 1 1 auto
  overflow-y auto
footer
  flex: 0 1
  background-color app_bg_color
.left
  float left
.right
  float right
</style>
