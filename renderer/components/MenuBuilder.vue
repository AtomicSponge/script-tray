<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import type { ModelRef } from 'vue'

import TrayCommand from './TrayCommand.vue'
import SubMenu from './SubMenu.vue'
import Separator from './Separator.vue'

const _launchMenu:ModelRef<any> = defineModel()
</script>

<template>
  <table>
    <tr v-for="(item, idx) in _launchMenu" :key="idx">
      <td v-if="item.sub !== undefined">
        <SubMenu v-model="_launchMenu[idx]"/>
        <MenuBuilder v-model="_launchMenu[idx].sub"/>
      </td>
      <td v-if="item.command !== undefined">
        <TrayCommand v-model="_launchMenu[idx]"/>
      </td>
      <td v-if="item.separator !== undefined">
        <Separator v-model="_launchMenu[idx]"/>
      </td>
    </tr>
  </table>
  <input v-model="_launchMenu" hidden/>
</template>

<style lang="stylus" scoped>
</style>
