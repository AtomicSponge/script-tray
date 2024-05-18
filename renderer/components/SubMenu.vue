<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

const subMenu:ModelRef<any> = defineModel({ required: true })
</script>

<template>
  <section>
    <label for="submenu">Submenu:</label>
    <input type="text" v-model="subMenu.label" id="submenu"/>
  </section>
</template>

<style lang="stylus" scoped>
section
  margin-top 2px
  margin-left 2px
#submenu
  margin-left 12px
  width: 200px
</style>
