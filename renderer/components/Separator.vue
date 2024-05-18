<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

const separator:ModelRef<null> = defineModel({ required: true })
</script>

<template>
  <hr class="separator"/>
  <input v-model="separator" hidden disabled/>
</template>

<style lang="stylus" scoped>
.separator
  border 4px solid rgb(100, 100, 100, 0.1)
</style>
