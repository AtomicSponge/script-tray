<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { watch } from 'vue'
import type { ModelRef } from 'vue'

const _subMenu:ModelRef<any> = defineModel({ required: true })

watch(_subMenu.value.label, (_newVal, _oldVal) => {
  //
})
</script>

<template>
  <section>
    <label for="submenu">Submenu:</label>
    <input type="text" v-model="_subMenu.label" id="submenu"/>
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
