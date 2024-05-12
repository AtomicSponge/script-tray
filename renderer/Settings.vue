<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
window.onload = () => {
  const testTemp = <HTMLDivElement>document.getElementById('menuContents')
  window.settingsAPI.onUpdateSettings((settingsData:SettingsJSON) => {
    testTemp.innerText = settingsData.toString()
  })
}
</script>

<template>
  <header>
    <div class="leftheader">
      <input type="checkbox">Load on startup</input>
      &nbsp;&nbsp;&nbsp;
      <input type="checkbox">Debug mode</input>
    </div>
    <div class="rightheader">
      <button onclick="window.settingsAPI.resetSettings()">Reset Settings</button>
      &nbsp;
      <button onclick="window.settingsAPI.saveSettings()">Save Settings</button>
    </div>
  </header>
  <div id="menuContents"></div>
  <footer>
    <select id="menu-select">
      <option value="1">Command Launcher</option>
      <option value="2">Sub Menu</option>
      <option value="3">Spacer</option>
    </select>
    <button>Add</button>
  </footer>
</template>

<style lang="stylus" scoped>
@import './styleVars.styl'

header
  background-color app_bg_color
  position fixed
  top 0
  width 100%
.leftheader
  float: left
.rightheader
  float right
footer
  background-color app_bg_color
  position fixed
  bottom 0
  width 100%
</style>
