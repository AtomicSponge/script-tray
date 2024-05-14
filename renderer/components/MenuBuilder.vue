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

/** */
const menuBuilder = (collection:Array<any>, _tabIdx:number = 0):void => {
  collection.forEach(item => {
    if (item.label !== undefined &&
        item.sub !== undefined &&
        Array.isArray(item.sub)) {
      //
      menuBuilder(item.sub, (_tabIdx++))
      return
    }
    if (item.separator !== undefined) {
      //
      return
    }
    if (item.label !== undefined &&
        item.cmd !== undefined &&
        item.args !== undefined &&
        item.showConsole !== undefined) {
      //
      return
    }
    // error with format
  })
}
</script>

<template>
  <div>{{ _launchMenu }}</div>
  <input v-model="_launchMenu" hidden/>
</template>

<style lang="stylus" scoped>
</style>
