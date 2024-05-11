<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
window.onload = () => {
  const testTemp = <HTMLDivElement>document.getElementById('contents')
  testTemp.innerText = window.settings.testData
}
</script>

<template>
  <div>
    Settings
    <button onclick="window.settings.resetSettings()">Reset Settings</button>
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
