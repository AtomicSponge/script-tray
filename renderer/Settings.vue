<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
window.onload = () => {
  const testTemp = <HTMLDivElement>document.getElementById('contents')
  window.settingsAPI.onUpdateSettings((settingsData:JSON) => {
    testTemp.innerText = settingsData.toString()
  })
}
</script>

<template>
  <div>
    Settings
    <button onclick="window.settingsAPI.resetSettings">Reset Settings</button>
    <button onclick="window.settingsAPI.saveSettings">Save Settings</button>
  </div>
  <div id="contents">replace me</div>
  <div id="footer">Footer</div>
</template>

<style lang="stylus" scoped>
#footer
  position fixed
  bottom 0
  width 100%
</style>
