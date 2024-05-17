<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
const trayCommand = defineModel()
</script>

<template>
  Command
  <input v-model="trayCommand" hidden/>
</template>

<style lang="stylus" scoped>
</style>
