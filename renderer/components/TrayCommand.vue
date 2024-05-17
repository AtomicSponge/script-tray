<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

const trayCommand:ModelRef<any> = defineModel()
</script>

<template>
  <div><input v-model="trayCommand.label"/></div>
  <div><input v-model="trayCommand.command"/></div>
  <div>Args:</div>
  <div>
    <label for="showConsole">Show console:</label>
    <input type="checkbox" id="showConsole" v-model="trayCommand.showConsole"/>
  </div>
</template>

<style lang="stylus" scoped>
</style>
