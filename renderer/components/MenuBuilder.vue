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

const _menuSelect = ref()

defineProps<{ menuId:number }>()

/**
 * Delete an item from the menu
 * @param item Item object to delete
 * @param idx Item index
 */
const deleteItem = (item:any, idx:number):void => {
  if(item.hasOwnProperty('label') && item.hasOwnProperty('sub')) {
    if(window.confirm(`Are you sure you want to delete sub-menu '${item.label}' and all of its content?`))
      _launchMenu.value.splice(idx, 1)
    return
  }
  if(item.hasOwnProperty('label') && item.hasOwnProperty('command')) {
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

/**
 * Move an item from one menu to another
 * @param to Menu ID to move to
 * @param idx Item index to move
 */
 const moveMenus = (idx:number):void => {
  if(_menuSelect.value === Number.MAX_SAFE_INTEGER)
    window.alert(`main idx ${idx}`)
  else
    window.alert(`moving ${_menuList.value[_menuSelect.value].label} idx ${idx}`)
}
</script>

<template>
<table>
  <tr v-for="(item, idx) in _launchMenu" :key=idx class="itemrow">
    <td v-if="item.hasOwnProperty('id') && item.hasOwnProperty('sub')" class="item">
      <hr class="subDiv"/>
      <SubMenu v-model="_launchMenu[idx]"/>
      <hr class="subDiv"/>
      <MenuBuilder
        v-model:launch-menu="_launchMenu[idx].sub"
        v-model:menu-list="_menuList"
        :menu-id=_launchMenu[idx].id>
      </MenuBuilder>
    </td>
    <td v-else-if="item.hasOwnProperty('label') && item.hasOwnProperty('command')" class="item">
      <TrayCommand v-model="_launchMenu[idx]"/>
    </td>
    <td v-else-if="item.hasOwnProperty('separator')" class="item">
      <Separator v-model="_launchMenu[idx]"/>
    </td>
    <td v-else class="item">&nbsp;</td>  <!-- render error handling -->
    <td class="delBtn">
      <div>
        <button v-show="idx !== 0" @click="moveUp(idx)">&#8593;</button>
        <button v-show="idx !== (_launchMenu.length - 1)" @click="moveDown(idx)">&#8595;</button>
        <button @click="deleteItem(_launchMenu[idx], idx)">Delete</button>
      </div>
      <div v-show="_menuList.length > 0" class="moveMenu">
        <button @click="moveMenus(idx)">Move</button>
        <!-- Render select for a submenu item - WIP:  not working in main (shows own menu) -->
        <select v-if="item.hasOwnProperty('id') && item.hasOwnProperty('sub')" id="moveSelect" v-model="_menuSelect">
          <option v-for="(item, idx) in _menuList" v-show="item.id !== menuId && item.id !== _launchMenu[idx].id" :key=idx :value=idx>
            {{ item.label }}
          </option>
        </select>
        <!-- Render select for all other non submenu items -->
        <select v-else id="moveSelect" v-model="_menuSelect">
          <option v-for="(item, idx) in _menuList" v-show="item.id !== menuId" :key=idx :value=idx>
            {{ item.label }}
          </option>
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
