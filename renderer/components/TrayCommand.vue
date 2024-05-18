<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

const trayCommand:ModelRef<any> = defineModel({ required: true })

const addArgument = () => {
  //
}
</script>

<template>
  <section>
  <table>
    <tr>
      <td><label for="cmdLabel">Label:</label></td>
      <td><input type="text" v-model="trayCommand.label" id="cmdLabel"/></td>
    </tr>
    <tr>
      <td><label for="cmdCommand">Command:</label></td>
      <td><input type="text" v-model="trayCommand.command" id="cmdCommand"/></td>
    </tr>
    <tr>
      <td>Args <button @click="addArgument()">Add</button></td>
      <td>...</td>
    </tr>
    <tr>
      <td></td>
      <td>
        <label for="showConsole">Show console:</label>
        <input type="checkbox" id="showConsole" v-model="trayCommand.showConsole"/>
      </td>
    </tr>
  </table>
  </section>
</template>

<style lang="stylus" scoped>
button
  vertical-align top
  font-size 0.6em
</style>
