<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
window.onload = () => {
  const testTemp = <HTMLDivElement>document.getElementById('contents')
  window.bufferAPI.onUpdateBuffer((bufferData:string) => {
    testTemp.innerText = bufferData
  })
}
</script>

<template>
  <h1>Buffer</h1>
  <div id="contents"></div>
</template>

<style lang="stylus" scoped>
</style>
