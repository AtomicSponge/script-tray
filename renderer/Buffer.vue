<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const _buffer = ref()

/**
 * Format buffer text to HTML
 * @param bufferData Buffer contents
 */
const formatText = (bufferData:Array<ScriptBufferData>):void => {
  bufferData.forEach((data:ScriptBufferData) => {
    data.out = data.out.replace(/(?:\r\n|\r|\n)/g, '<br>')
    data.err = data.err.replace(/(?:\r\n|\r|\n)/g, '<br>')
  })
}

onMounted(() => {
  window.bufferAPI.onUpdateBuffer((bufferData:Array<ScriptBufferData>) => {
    formatText(bufferData)
    _buffer.value = bufferData
    nextTick(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  })
})
</script>

<template>
  <section>
    <table v-for="item in _buffer">
      <tr><th>{{ item.command }}</th></tr>
      <tr>
        <td>
          <div>
            <span class="highlight">Start time:</span>
            {{ item.start }}
          </div>
          <div>
            <span class="highlight">Stop time:</span>
            {{ item.stop }}
          </div>
          <div>
            <span class="highlight">Duration:</span>
            {{ item.duration }} ms
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="highlight">Out:</div>
          <div class="console"><span v-html="item.out"></span></div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="highlight">Error:</div>
          <div class="console"><span v-html="item.err"></span></div>
        </td>
      </tr>
    </table>
  </section>
</template>

<style lang="stylus" scoped>
section
  overflow auto
  font-size smaller
  padding-top 4px
  padding-left 4px
  padding-right 4px
  padding-bottom 4px
table
  width 100%
  border-collapse collapse
  border 1px solid rgb(100, 100, 100, 0.1)
th
  padding 3px
td
  padding 2px
  padding-left 4px
.console
  padding-left 8px
.highlight
  font-weight bold
</style>
