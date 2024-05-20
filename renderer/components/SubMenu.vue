<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

const _subMenu:ModelRef<SubMenu> = defineModel({ required: true })
</script>

<template>
  <div class="submenu">
    <label for="submenu">Submenu:</label>
    <input type="text" v-model="_subMenu.label" id="submenu"/>
  </div>
</template>

<style lang="stylus" scoped>
.submenu
  margin-top 2px
  margin-left 2px
#submenu
  margin-left 12px
  width: 200px
</style>
