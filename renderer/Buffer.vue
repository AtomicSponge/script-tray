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
      { code: `0`, style: `</span>` },
      { code: `1`, style: `font-weight: bold;` },
      { code: `2`, style: `filter: brightness(50%);` },
      { code: `3`, style: `font-style: italic;` },
      { code: `4`, style: `text-decoration: underline;` },
      //  Foreground Colors
      { code: `30`, style: `rgb(0, 0, 0)` },          //  Black
      { code: `31`, style: `rgb(170, 0, 0)` },        //  Red
      { code: `32`, style: `rgb(0, 170, 0)` },        //  Green
      { code: `33`, style: `rgb(170, 85, 0)` },       //  Yellow
      { code: `34`, style: `rgb(0, 0, 170)` },        //  Blue
      { code: `35`, style: `rgb(170, 0, 170)` },      //  Magenta
      { code: `36`, style: `rgb(0, 170, 170)` },      //  Cyan
      { code: `37`, style: `rgb(170, 170, 170)` },    //  White
      { code: `90`, style: `rgb(85, 85, 85)` },       //  Bright Black (Gray)
      { code: `91`, style: `rgb(255, 85, 85)` },      //  Bright Red
      { code: `92`, style: `rgb(85, 255, 85)` },      //  Bright Green
      { code: `93`, style: `rgb(255, 255, 85)` },     //  Bright Yellow
      { code: `94`, style: `rgb(85, 85, 255)` },      //  Bright Blue
      { code: `95`, style: `rgb(255, 0, 255)` },      //  Bright Magenta
      { code: `96`, style: `rgb(85, 255, 255)` },     //  Bright Cyan
      { code: `97`, style: `rgb(255, 255, 255)` },    //  Bright White
      //  Background Colors
      { code: `40`, style: `rgb(0, 0, 0)` },          //  Black
      { code: `41`, style: `rgb(170, 0, 0)` },        //  Red
      { code: `42`, style: `rgb(0, 170, 0)` },        //  Green
      { code: `43`, style: `rgb(170, 85, 0)` },       //  Yellow
      { code: `44`, style: `rgb(0, 0, 170)` },        //  Blue
      { code: `45`, style: `rgb(170, 0, 170)` },      //  Magenta
      { code: `46`, style: `rgb(0, 170, 170)` },      //  Cyan
      { code: `47`, style: `rgb(170, 170, 170)` },    //  White
      { code: `100`, style: `rgb(85, 85, 85)` },      //  Bright Black (Gray)
      { code: `101`, style: `rgb(255, 85, 85)` },     //  Bright Red
      { code: `102`, style: `rgb(85, 255, 85)` },     //  Bright Green
      { code: `103`, style: `rgb(255, 255, 85)` },    //  Bright Yellow
      { code: `104`, style: `rgb(85, 85, 255)` },     //  Bright Blue
      { code: `105`, style: `rgb(255, 0, 255)` },     //  Bright Magenta
      { code: `106`, style: `rgb(85, 255, 255)` },    //  Bright Cyan
      { code: `107`, style: `rgb(255, 255, 255)` }    //  Bright White
    ]

    //<span class="color: ;background-color: ;"> ... </span>

    const res = data.match(/(?<=\\x1b\[)(.*?)(?=m)/gm)
    if(res === null) return data

    res.forEach(item => {
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
