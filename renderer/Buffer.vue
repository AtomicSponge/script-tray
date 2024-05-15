<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

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

onMounted(() => {
  window.bufferAPI.onUpdateBuffer((bufferData:string) => {
    _buffer.value = formatText(bufferData)
    nextTick(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  })
})
</script>

<template>
  <section>
    <span v-html="_buffer"></span>
  </section>
</template>

<style lang="stylus" scoped>
section
  display flex
  flex-flow column
  align-items left
  height 100vh
  font-size smaller
  padding-top 2px
  padding-left 4px
  padding-right 4px
  padding-bottom 2px
</style>
