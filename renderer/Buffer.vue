<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
window.onload = () => {
  window.bufferAPI.onUpdateBuffer((bufferData:string) => {
    const bufferOutput = <HTMLDivElement>document.getElementById('bufferOutput')
    bufferOutput.innerText = bufferData
  })
}
</script>

<template>
  <div id="bufferOutput"></div>
</template>

<style lang="stylus" scoped>
</style>
