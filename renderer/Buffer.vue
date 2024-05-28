<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

/** Reference for storing the buffer */
const _buffer = ref()

/**
 * Format buffer text to HTML
 * @param bufferData Buffer contents
 */
const formatText = (bufferData:Array<ScriptBufferData>):void => {
  /**
   * Format console escape codes to HTML
   * @param data String to format
   * @returns Modified string
   */
  const formatTermColors = (data:string):string => {
    const colors = [
      //  Foreground Colors
      { code: `\x1b[30m]`, rgb: `rgb(0, 0, 0)` },        //  Black
      { code: `\x1b[31m]`, rgb: `rgb(170, 0, 0)` },      //  Red
      { code: `\x1b[32m]`, rgb: `rgb(0, 170, 0)` },      //  Green
      { code: `\x1b[33m]`, rgb: `rgb(170, 85, 0)` },     //  Yellow
      { code: `\x1b[34m]`, rgb: `rgb(0, 0, 170)` },      //  Blue
      { code: `\x1b[35m]`, rgb: `rgb(170, 0, 170)` },    //  Magenta
      { code: `\x1b[36m]`, rgb: `rgb(0, 170, 170)` },    //  Cyan
      { code: `\x1b[37m]`, rgb: `rgb(170, 170, 170)` },  //  White
      { code: `\x1b[90m]`, rgb: `rgb(85, 85, 85)` },     //  Bright Black (Gray)
      { code: `\x1b[91m]`, rgb: `rgb(255, 85, 85)` },    //  Bright Red
      { code: `\x1b[92m]`, rgb: `rgb(85, 255, 85)` },    //  Bright Green
      { code: `\x1b[93m]`, rgb: `rgb(255, 255, 85)` },   //  Bright Yellow
      { code: `\x1b[94m]`, rgb: `rgb(85, 85, 255)` },    //  Bright Blue
      { code: `\x1b[95m]`, rgb: `rgb(255, 0, 255)` },    //  Bright Magenta
      { code: `\x1b[96m]`, rgb: `rgb(85, 255, 255)` },   //  Bright Cyan
      { code: `\x1b[97m]`, rgb: `rgb(255, 255, 255)` },  //  Bright White
      //  Background Colors
      { code: `\x1b[40m]`, rgb: `rgb(0, 0, 0)` },        //  Black
      { code: `\x1b[41m]`, rgb: `rgb(170, 0, 0)` },      //  Red
      { code: `\x1b[42m]`, rgb: `rgb(0, 170, 0)` },      //  Green
      { code: `\x1b[43m]`, rgb: `rgb(170, 85, 0)` },     //  Yellow
      { code: `\x1b[44m]`, rgb: `rgb(0, 0, 170)` },      //  Blue
      { code: `\x1b[45m]`, rgb: `rgb(170, 0, 170)` },    //  Magenta
      { code: `\x1b[46m]`, rgb: `rgb(0, 170, 170)` },    //  Cyan
      { code: `\x1b[47m]`, rgb: `rgb(170, 170, 170)` },  //  White
      { code: `\x1b[100m]`, rgb: `rgb(85, 85, 85)` },    //  Bright Black (Gray)
      { code: `\x1b[101m]`, rgb: `rgb(255, 85, 85)` },   //  Bright Red
      { code: `\x1b[102m]`, rgb: `rgb(85, 255, 85)` },   //  Bright Green
      { code: `\x1b[103m]`, rgb: `rgb(255, 255, 85)` },  //  Bright Yellow
      { code: `\x1b[104m]`, rgb: `rgb(85, 85, 255)` },   //  Bright Blue
      { code: `\x1b[105m]`, rgb: `rgb(255, 0, 255)` },   //  Bright Magenta
      { code: `\x1b[106m]`, rgb: `rgb(85, 255, 255)` },  //  Bright Cyan
      { code: `\x1b[107m]`, rgb: `rgb(255, 255, 255)` }  //  Bright White
    ]

    //<span class="color: ;background-color: ;"> ... </span>
    colors.forEach(item => {
      //
    })

    return data
  }

  bufferData.forEach((data:ScriptBufferData) => {
    data.out = data.out.replace(/(?:\r\n|\r|\n)/g, '<br>')
    data.err = data.err.replace(/(?:\r\n|\r|\n)/g, '<br>')
    data.out = formatTermColors(data.out)
    data.err = formatTermColors(data.err)
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
