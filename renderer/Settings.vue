<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
window.onload = () => {
  const testTemp = <HTMLDivElement>document.getElementById('contents')
  testTemp.innerText = window.traySettings.data
}
</script>

<template>
  <div>Settings</div>
  <div id="contents">replace me</div>
  <div id="footer">Footer</div>
</template>

<style lang="stylus" scoped>
#footer
  position fixed
  bottom 0
  width 100%
</style>
