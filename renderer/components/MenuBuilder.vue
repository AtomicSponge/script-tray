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

/**
 * Delete an item from the menu
 * @param item Item object to delete
 * @param idx Item index
 */
const deleteItem = (item:any, idx:number) => {
  if(item.label !== undefined && item.sub !== undefined) {
    if(window.confirm(`Are you sure you want to delete sub-menu '${item.label}' and all of its content?`))
      _launchMenu.value.splice(idx, 1)
    return
  }
  if(item.label !== undefined && item.command !== undefined) {
    if(window.confirm(`Delete command '${item.label}'?`))
      _launchMenu.value.splice(idx, 1)
    return
  }
  if(item.separator !== undefined) _launchMenu.value.splice(idx, 1)
}
</script>

<template>
  <table>
    <tr v-for="(item, idx) in _launchMenu" :key="idx" class="itemrow">
      <td v-if="item.label !== undefined && item.sub !== undefined" class="item">
        <SubMenu v-model="_launchMenu[idx]"/>
        <MenuBuilder v-model="_launchMenu[idx].sub"/>
      </td>
      <td v-else-if="item.label !== undefined && item.command !== undefined" class="item">
        <TrayCommand v-model="_launchMenu[idx]"/>
      </td>
      <td v-else-if="item.separator !== undefined" class="item">
        <Separator v-model="_launchMenu[idx]"/>
      </td>
      <td v-else class="item">&nbsp;</td>  <!-- render error handling -->
      <td class="delBtn">
        <button @click="deleteItem(_launchMenu[idx], idx)">Delete</button>
      </td>
    </tr>
  </table>
</template>

<style lang="stylus" scoped>
@import './vars.styl'

table
  margin-left table_margin
  border-collapse collapse
.itemrow
  border table_border_size solid table_color
.item
  min-width min_width
  text-align left
  padding item_padding
.delBtn
  text-align right
  vertical-align top
  padding item_padding
</style>
