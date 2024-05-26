<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

/** Separator model - should always be null */
const _separator:ModelRef<Separator> = defineModel({ required: true })
</script>

<template>
  <hr class="separator"/>
  <input v-model="_separator" hidden disabled/>
</template>

<style lang="stylus" scoped>
.separator
  border 4px solid rgb(100, 100, 100, 0.1)
</style>
