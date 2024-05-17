<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

const subMenu:ModelRef<any> = defineModel()
</script>

<template>
  <div><input v-model="subMenu.label"/></div>
  <input v-model="subMenu" hidden/>
</template>

<style lang="stylus" scoped>
</style>
