<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

/** Model for the tray command reference  */
const _trayCommand:ModelRef<TrayCommand> = defineModel({ required: true })
</script>

<template>
<section>
<table>
  <tr>
    <td><label for="cmdLabel">Label:</label></td>
    <td><input type="text" v-model="_trayCommand.label" id="cmdLabel"/></td>
  </tr>
  <tr>
    <td><label for="cmdCommand">Command:</label></td>
    <td><input type="text" v-model="_trayCommand.command" id="cmdCommand"/></td>
  </tr>
  <tr>
    <td><label for="cmdCwd">CWD:</label></td>
    <td><input type="text" v-model="_trayCommand.cwd" id="cmdCwd"/></td>
  </tr>
</table>
</section>
</template>

<style lang="stylus" scoped>
table
  table-layout fixed
#cmdLabel
  width 200px
#cmdCommand
  width 320px
#cmdCwd
  width 200px
button
  vertical-align top
  font-size 0.6em
</style>
