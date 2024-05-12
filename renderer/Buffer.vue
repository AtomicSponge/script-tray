<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
window.onload = () => {
  const testTemp = <HTMLDivElement>document.getElementById('bufferOutput')
  window.bufferAPI.onUpdateBuffer((bufferData:string) => {
    testTemp.innerText = bufferData
  })
}
</script>

<template>
  <div id="bufferOutput"></div>
</template>

<style lang="stylus" scoped>
</style>
