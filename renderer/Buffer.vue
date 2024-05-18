<!--
  script-tray
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
    <div class="bufferView"><span v-html="_buffer"></span></div>
  </section>
</template>

<style lang="stylus" scoped>
section
  overflow auto

.bufferView
  font-size smaller
  padding-top 2px
  padding-left 4px
  padding-right 4px
  padding-bottom 0px
</style>
