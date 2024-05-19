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
    <div v-for="item in _buffer" class="bufferView">
      <table>
        <tr>
          <th>{{ item.command }}</th>
        </tr>
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
            <span v-html="item.out"></span>
          </td>
        </tr>
        <tr>
          <td>
            <div class="highlight">Error:</div>
            <span v-html="item.err"></span>
          </td>
        </tr>
      </table>
    </div>
  </section>
</template>

<style lang="stylus" scoped>
section
  overflow auto

table
  width 100%
  border-collapse collapse
  border 1px solid rgb(100, 100, 100, 0.1)

.highlight
  font-weight bold

.bufferView
  font-size smaller
  padding-top 2px
  padding-left 4px
  padding-right 4px
  padding-bottom 0px
</style>
