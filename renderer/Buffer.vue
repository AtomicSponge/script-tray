<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref } from 'vue'

const _buffer = ref()

/**
 * Format text to HTML
 * @param text Unformatted text
 * @returns Formatted text
 */
const formatText = (text:string):string => {
  text = text.replace(/(?:\r\n|\r|\n)/g, '<br>')
  return text
}

window.onload = () => {
  window.bufferAPI.onUpdateBuffer((bufferData:string) => {
    _buffer.value = formatText(bufferData)
  })
}
</script>

<template>
  <div class="buffer-view">
    <span v-html="_buffer"></span>
  </div>
</template>

<style lang="stylus" scoped>
.buffer-view
  font-size smaller
  padding-top 2px
  padding-left 4px
  padding-right 4px
  padding-bottom 2px
</style>
