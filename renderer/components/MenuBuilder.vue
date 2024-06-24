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

/** Main menu or submenu used to build each section of the recurision loop  */
const _launchMenu:ModelRef<any> = defineModel('launchMenu', { required: true })
/** The menu referenced passed unmodified to each MenuBuilder instance */
const _menuList:ModelRef<any> = defineModel('menuList', { required: true })
/** Select menu for moving an item to another menu */
const _moveMenuSelect = ref()

/**
 * Component properties
 * @prop menuId Reference ID to the current menu being built
 */
const props = defineProps<{ menuId:number }>()

/**
 * Event emitters
 * 'rebuild' - Sends event to rebuild the menu list
 */
const emit = defineEmits<{
  (e: 'rebuild'):void
}>()

/**
 * Delete an item from the menu
 * @param item Item object to delete
 * @param idx Item index
 */
const deleteItem = (item:any, idx:number):void => {
  if(item.hasOwnProperty('label') && item.hasOwnProperty('sub')) {
    if(window.confirm(`Are you sure you want to delete sub-menu '${item.label}' and all of its content?`)) {
      _launchMenu.value.splice(idx, 1)
      emit('rebuild')
    }
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
  if(idx <= 0) return
  const elem = _launchMenu.value.splice(idx, 1)[0]
  _launchMenu.value.splice(--idx, 0, elem)
}

/**
 * Move an item down in the array
 * @param idx Index of item to move
 */
const moveDown = (idx:number):void => {
  if(idx >= (_launchMenu.value.length - 1)) return
  const elem = _launchMenu.value.splice(idx, 1)[0]
  console.log(elem)
  _launchMenu.value.splice(++idx, 0, elem)
}

/**
 * Move an item from one menu to another
 * @param idx Index of item to move relative to current menu
 */
 const moveMenus = (idx:number):void => {
  const elem = _launchMenu.value.splice(idx, 1)[0]
  _menuList.value[_moveMenuSelect.value].sub.push(elem)
}
</script>

<template>
<table>
  <tr v-for="(item, idx) in _launchMenu" :key=idx class="itemrow">
    <td v-if="item.hasOwnProperty('id') && item.hasOwnProperty('sub')" class="item">
      <hr class="subDiv"/>
      <SubMenu v-model="_launchMenu[idx]"/>
      <hr class="subDiv"/>
      <!-- Recursion call for submenu building, passes emit back to parent -->
      <MenuBuilder
        v-model:launch-menu="_launchMenu[idx].sub"
        v-model:menu-list="_menuList"
        @rebuild="$emit('rebuild')"
        :menu-id=_launchMenu[idx].id>
      </MenuBuilder>
    </td>
    <td v-else-if="item.hasOwnProperty('label') && item.hasOwnProperty('command')" class="item">
      <TrayCommand v-model="_launchMenu[idx]"/>
    </td>
    <td v-else-if="item.hasOwnProperty('separator')" class="item">
      <Separator v-model="_launchMenu[idx]"/>
    </td>
    <td v-else class="item">&nbsp;</td>  <!-- Render error handling -->
    <td class="delBtn">
      <div>
        <button v-show="idx > 0" @click="moveUp(idx)">&#8593;</button>
        <button v-show="idx < (_launchMenu.length - 1)" @click="moveDown(idx)">&#8595;</button>
        <button @click="deleteItem(_launchMenu[idx], idx)">Delete</button>
      </div>
      <div v-show="_menuList.length > 0" class="moveMenu">
        <button @click="moveMenus(idx)">Move</button>
        <!-- Render select for a submenu item -->
        <select v-if="item.hasOwnProperty('id') && item.hasOwnProperty('sub')" id="moveSelect" v-model="_moveMenuSelect">
          <option v-for="(_item, _idx) in _menuList" v-show="_item.id !== props.menuId && _item.id !== _launchMenu[idx].id" :key=_idx :value=_idx>
            {{ _item.label }}
          </option>
        </select>
        <!-- Render select for all other non submenu items -->
        <select v-else id="moveSelect" v-model="_moveMenuSelect">
          <option v-for="(_item, _idx) in _menuList" v-show="_item.id !== props.menuId" :key=_idx :value=_idx>
            {{ _item.label }}
          </option>
        </select>
      </div>
    </td>
  </tr>
</table>
</template>

<style scoped>
button {
  font-size: 0.66em;
}
table {
  margin-left: 16px;
  border-collapse: collapse;
  border: 1px solid rgb(100, 100, 100, 0.1);
  border-left: 8px solid rgb(100, 100, 100, 0.1);
}
.itemrow {
  border: 1px solid rgb(100, 100, 100, 0.1);
}
.subDiv {
  border: 1px dashed rgba(255, 255, 255, 0.87);
}
.item {
  text-align: left;
  padding: 6px;
}
.delBtn {
  text-align: right;
  vertical-align: top;
  padding: 6px;
}
.moveMenu {
  padding-top: 2px;
  font-size: 0.66em;
}
#moveSelect {
  font-size: 0.96em;
}
</style>
