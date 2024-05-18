<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

const _trayCommand:ModelRef<any> = defineModel({ required: true })

/** Add a new argument */
const addArgument = () => {
  _trayCommand.value.args.push('new arg')
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
      <td class="args">Args <button @click="addArgument()">Add</button></td>
      <td>
        <ul>
          <li v-for="(_arg, idx) in _trayCommand.args">
            <input type="text" v-model="_trayCommand.args[idx]"/>
            <button @click="deleteArgument(idx)">Delete</button>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td>
        <label for="showConsole">Show console:</label>
        <input type="checkbox" id="showConsole" v-model="_trayCommand.showConsole"/>
      </td>
    </tr>
  </table>
  </section>
</template>

<style lang="stylus" scoped>
#cmdLabel
  width 180px
#cmdCommand
  width 280px
.args
  vertical-align top
button
  vertical-align top
  font-size 0.6em
</style>
