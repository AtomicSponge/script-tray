<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

/** Model for the tray command reference  */
const _trayCommand:ModelRef<TrayCommand> = defineModel({ required: true })

/** Add a new argument */
const addArgument = () => {
  _trayCommand.value.args.push({ label: 'new arg', variable: 'variable_name' })
}

/**
 * Remove an argument by index
 * @param idx Index of argument to remove
 */
const deleteArgument = (idx:number) => {
  _trayCommand.value.args.splice(idx, 1)
}
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
  <tr>
    <td class="args">Args <button @click="addArgument">Add</button></td>
    <td>
      <ul>
        <li v-for="(_arg, idx) in _trayCommand.args">
          <table>
            <tr>
              <td><label for="argLabel">Label:</label></td>
              <td><input type="text" v-model="_trayCommand.args[idx].label" id="argLabel"/></td>
              <td rowspan="2">
                <button @click="deleteArgument(idx)">Delete</button>
              </td>
            </tr>
            <tr>
              <td><label for="argVariable">Variable:</label></td>
              <td><input type="text" v-model="_trayCommand.args[idx].variable" id="argVariable"/></td>
            </tr>
          </table>
          <hr v-show="idx < (_trayCommand.args.length - 1)"/>
        </li>
      </ul>
    </td>
  </tr>
</table>
</section>
</template>

<style lang="stylus" scoped>
table
  table-layout fixed
hr
  border 1px solid rgb(100, 100, 100, 0.1)
#cmdLabel
  width 200px
#cmdCommand
  width 320px
#cmdCwd
  width 200px
#argLabel
  width 180px
#argVariable
  width 180px
.args
  vertical-align top
button
  vertical-align top
  font-size 0.6em
</style>
