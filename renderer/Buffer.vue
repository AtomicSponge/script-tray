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
    const termStyleLookup = [
      //  Font formatting
      { code: `\x1b[1m`, style: `font-weight: bold;` },
      { code: `\x1b[2m`, style: `filter: brightness(50%);` },
      { code: `\x1b[3m`, style: `font-style: italic;` },
      { code: `\x1b[4m`, style: `text-decoration: underline;` },
      //  Foreground Colors
      { code: `\x1b[30m`, style: `color: rgb(0, 0, 0);` },        //  Black
      { code: `\x1b[31m`, style: `color: rgb(170, 0, 0);` },      //  Red
      { code: `\x1b[32m`, style: `color: rgb(0, 170, 0);` },      //  Green
      { code: `\x1b[33m`, style: `color: rgb(170, 85, 0);` },     //  Yellow
      { code: `\x1b[34m`, style: `color: rgb(0, 0, 170);` },      //  Blue
      { code: `\x1b[35m`, style: `color: r4gb(170, 0, 170);` },   //  Magenta
      { code: `\x1b[36m`, style: `color: rgb(0, 170, 170);` },    //  Cyan
      { code: `\x1b[37m`, style: `color: rgb(170, 170, 170);` },  //  White
      { code: `\x1b[90m`, style: `color: rgb(85, 85, 85);` },     //  Bright Black (Gray)
      { code: `\x1b[91m`, style: `color: rgb(255, 85, 85);` },    //  Bright Red
      { code: `\x1b[92m`, style: `color: rgb(85, 255, 85);` },    //  Bright Green
      { code: `\x1b[93m`, style: `color: rgb(255, 255, 85);` },   //  Bright Yellow
      { code: `\x1b[94m`, style: `color: rgb(85, 85, 255);` },    //  Bright Blue
      { code: `\x1b[95m`, style: `color: rgb(255, 0, 255);` },    //  Bright Magenta
      { code: `\x1b[96m`, style: `color: rgb(85, 255, 255);` },   //  Bright Cyan
      { code: `\x1b[97m`, style: `color: rgb(255, 255, 255);` },  //  Bright White
      //  Background Colors
      { code: `\x1b[40m`, style: `background-color: rgb(0, 0, 0);` },        //  Black
      { code: `\x1b[41m`, style: `background-color: rgb(170, 0, 0);` },      //  Red
      { code: `\x1b[42m`, style: `background-color: rgb(0, 170, 0);` },      //  Green
      { code: `\x1b[43m`, style: `background-color: rgb(170, 85, 0);` },     //  Yellow
      { code: `\x1b[44m`, style: `background-color: rgb(0, 0, 170);` },      //  Blue
      { code: `\x1b[45m`, style: `background-color: rgb(170, 0, 170);` },    //  Magenta
      { code: `\x1b[46m`, style: `background-color: rgb(0, 170, 170);` },    //  Cyan
      { code: `\x1b[47m`, style: `background-color: rgb(170, 170, 170);` },  //  White
      { code: `\x1b[100m`, style: `background-color: rgb(85, 85, 85);` },    //  Bright Black (Gray)
      { code: `\x1b[101m`, style: `background-color: rgb(255, 85, 85);` },   //  Bright Red
      { code: `\x1b[102m`, style: `background-color: rgb(85, 255, 85);` },   //  Bright Green
      { code: `\x1b[103m`, style: `background-color: rgb(255, 255, 85);` },  //  Bright Yellow
      { code: `\x1b[104m`, style: `background-color: rgb(85, 85, 255);` },   //  Bright Blue
      { code: `\x1b[105m`, style: `background-color: rgb(255, 0, 255);` },   //  Bright Magenta
      { code: `\x1b[106m`, style: `background-color: rgb(85, 255, 255);` },  //  Bright Cyan
      { code: `\x1b[107m`, style: `background-color: rgb(255, 255, 255);` }  //  Bright White
    ]

    const res = data.match(/\x1b\[.*?m/g)  //  Match escape sequences
    if(res === null) return data

    //  Do the close span elements first
    data = data.replace(/\x1b\[0m/g, '</span>')

    res.forEach(item => {
      termStyleLookup.forEach(style => {
        if(style.code === item)
          data = data.replace(item, `<span style="${style.style}">`)
      })
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
