<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ModelRef } from 'vue'

import TrayCommand from './TrayCommand.vue'
import SubMenu from './SubMenu.vue'
import Separator from './Separator.vue'

/** Main menu or submenu used to build each section of the recurision loop  */
const _launchMenu:ModelRef<any> = defineModel('launchMenu', { required: true })
/** The menu referenced passed unmodified to each MenuBuilder instance */
const _menuList:ModelRef<any> = defineModel('menuList', { required: true })
/** Select menu for moving an item to another menu */
const _moveMenuSelect = ref([])

/**
 * Component properties
 * @prop menuId Reference ID to the current menu being built
 */
const props = defineProps<{ menuId:number }>()

/** Computed menu list for a submenu item */
const _computedMenuListA = computed(() => {
  return (idx:number) => _menuList.value.filter((item:any) => item.id !== props.menuId && item.id !== _launchMenu.value[idx].id)
})

/** Computed menu list for other items */
const _computedMenuListB = computed(() => {
  return _menuList.value.filter((item:any) => item.id !== props.menuId)
})

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
  if (item.hasOwnProperty('label') && item.hasOwnProperty('sub')) {
    if (window.confirm(`Are you sure you want to delete sub-menu '${item.label}' and all of its content?`)) {
      _launchMenu.value.splice(idx, 1)
      emit('rebuild')
    }
    return
  }
  if (item.hasOwnProperty('label') && item.hasOwnProperty('command')) {
    if (window.confirm(`Delete command '${item.label}'?`))
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
  if (idx <= 0) return
  const elem = _launchMenu.value.splice(idx, 1)[0]
  _launchMenu.value.splice(--idx, 0, elem)
}

/**
 * Move an item down in the array
 * @param idx Index of item to move
 */
const moveDown = (idx:number):void => {
  if (idx >= (_launchMenu.value.length - 1)) return
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
  _menuList.value[_menuList.value.findIndex((obj:any) => { return obj.id === _moveMenuSelect.value[idx] })].sub.push(elem)
}
</script>

<template>
  <v-container v-for="(item, idx) in _launchMenu" :key=idx fluid>
    <v-row>
      <v-col v-if="item.hasOwnProperty('id') && item.hasOwnProperty('sub')">
        <SubMenu v-model="_launchMenu[idx]"/>
      </v-col>
      <v-col v-else-if="item.hasOwnProperty('label') && item.hasOwnProperty('command')">
        <TrayCommand v-model="_launchMenu[idx]"/>
      </v-col>
      <v-col v-else-if="item.hasOwnProperty('separator')">
        <Separator v-model="_launchMenu[idx]"/>
      </v-col>
      <v-col v-else>&nbsp;</v-col>  <!-- Render error handling -->
      <v-col>
        <v-sheet theme="dark">
          <v-btn v-show="idx > 0" @click="moveUp(idx)">&#8593;</v-btn>
          <v-btn v-show="idx < (_launchMenu.length - 1)" @click="moveDown(idx)">&#8595;</v-btn>
          <v-btn @click="deleteItem(_launchMenu[idx], idx)">Delete</v-btn>
        </v-sheet>
        <v-sheet v-show="_menuList.length > 1" theme="dark">
          <!-- Render select for a submenu item -->
          <v-select v-if="item.hasOwnProperty('id') && item.hasOwnProperty('sub')"
            :items="_computedMenuListA(idx)"
            :item-title="'label'"
            :item-value="'id'"
            :width="200"
            v-model="_moveMenuSelect[idx]"></v-select>
          <!-- Render select for all other non submenu items -->
          <v-select v-else
            :items="_computedMenuListB"
            :item-title="'label'"
            :item-value="'id'"
            :width="200"
            v-model="_moveMenuSelect[idx]"></v-select>
          <v-btn @click="moveMenus(idx)">Move</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-if="item.hasOwnProperty('id') && item.hasOwnProperty('sub')">
      <v-sheet :width="24" theme="light"></v-sheet>
      <v-col>
        <v-sheet color="rgb(48, 48, 48)" border="xl">
          <!-- Recursion call for submenu building, passes emit back to parent -->
          <MenuBuilder
            v-model:launch-menu="_launchMenu[idx].sub"
            v-model:menu-list="_menuList"
            @rebuild="$emit('rebuild')"
            :menu-id="_launchMenu[idx].id">
          </MenuBuilder>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
