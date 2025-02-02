<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

/** Model for the submenu reference */
const _subMenu:ModelRef<SubMenu> = defineModel({ required: true })
</script>

<template>
  <v-container>
    <v-row>
      <v-text-field
        label="Submenu Label"
        v-model="_subMenu.label"></v-text-field>
    </v-row>
  </v-container>
</template>
