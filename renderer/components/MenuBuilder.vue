<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref } from 'vue'
import type { ModelRef } from 'vue'

import TrayCommand from './TrayCommand.vue'
import SubMenu from './SubMenu.vue'
import Separator from './Separator.vue'

const _launchMenu:ModelRef<any> = defineModel('launchMenu', { required: true })
const _menuList:ModelRef<any> = defineModel('menuList', { required: true })

const _menuSelect = ref(0)

defineEmits<{
  (e: 'moveItem', from:number, to:number, idx:number):void
}>()

/**
 * Delete an item from the menu
 * @param item Item object to delete
 * @param idx Item index
 */
const deleteItem = (item:any, idx:number):void => {
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
  _launchMenu.value.splice(idx, 1)
}

/**
 * Move an item up in the array
 * @param idx Index of item to move
 */
const moveUp = (idx:number):void => {
  if(idx === 0) return
  const elem = _launchMenu.value.splice(idx, 1)[0]
  _launchMenu.value.splice(--idx, 0, elem)
}

/**
 * Move an item down in the array
 * @param idx Index of item to move
 */
const moveDown = (idx:number):void => {
  if(idx === (_launchMenu.value.length - 1)) return
  const elem = _launchMenu.value.splice(idx, 1)[0]
  console.log(elem)
  _launchMenu.value.splice(++idx, 0, elem)
}
</script>

<template>
<table>
  <tr v-for="(item, idx) in _launchMenu" :key="idx" class="itemrow">
    <td v-if="item.label !== undefined && item.sub !== undefined" class="item">
      <hr class="subDiv"/>
      <SubMenu v-model="_launchMenu[idx]"/>
      <hr class="subDiv"/>
      <MenuBuilder
        v-model:launch-menu="_launchMenu[idx].sub"
        v-model:menu-list="_menuList"
        @move-item="$emit('moveItem', 0, _menuSelect, idx)">
      </MenuBuilder>
    </td>
    <td v-else-if="item.label !== undefined && item.command !== undefined" class="item">
      <TrayCommand v-model="_launchMenu[idx]"/>
    </td>
    <td v-else-if="item.separator !== undefined" class="item">
      <Separator v-model="_launchMenu[idx]"/>
    </td>
    <td v-else class="item">&nbsp;</td>  <!-- render error handling -->
    <td class="delBtn">
      <div>
        <button v-show="idx !== 0" @click="moveUp(idx)">&#8593;</button>
        <button v-show="idx !== (_launchMenu.length - 1)" @click="moveDown(idx)">&#8595;</button>
        <button @click="deleteItem(_launchMenu[idx], idx)">Delete</button>
      </div>
      <div v-show="_menuList.length > 1" class="moveMenu">
        <button @click="$emit('moveItem', 0, _menuSelect, idx)">Move</button>
        <select id="moveSelect" v-model="_menuSelect">
          <option v-for="item in _menuList" :value=item.id>{{ item.label }}</option>
        </select>
      </div>
    </td>
  </tr>
</table>
</template>

<style lang="stylus" scoped>
button
  font-size 0.66em
table
  margin-left 16px
  border-collapse collapse
  border 1px solid rgb(100, 100, 100, 0.1)
  border-left 8px solid rgb(100, 100, 100, 0.1)
.itemrow
  border 1px solid rgb(100, 100, 100, 0.1)
.subDiv
  border 1px dashed rgba(255, 255, 255, 0.87)
.item
  text-align left
  padding 6px
.delBtn
  text-align right
  vertical-align top
  padding 6px
.moveMenu
  padding-top 2px
  font-size 0.66em
#moveSelect
  font-size 0.96em
</style>
