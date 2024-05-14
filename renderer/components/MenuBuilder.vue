<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import TrayCommand from './TrayCommand.vue'
import SubMenu from './SubMenu.vue'
import Spacer from './Spacer.vue'

const _launchMenu = defineModel()
</script>

<template>
  <div>{{ _launchMenu }}</div>
  <input v-model="_launchMenu" hidden/>
</template>

<style lang="stylus" scoped>
</style>
