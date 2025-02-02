<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref } from 'vue'
import type { ModelRef } from 'vue'

/** Model for the tray command reference  */
const _trayCommand:ModelRef<TrayCommand> = defineModel({ required: true })

/** Reference for displaying the duplicate variable command warning */
const _showCmdWarn = ref(false)

/** Check the command field to make sure multiple variable names are not used */
const checkCmd = () => {
  if (_trayCommand.value.command !== '') {
    const args = _trayCommand.value.command.match(/(?<=\?<\|)(.*?)(?=\|>)/g)
    if (args !== null) {
      args.forEach((arg, idx, array) => { array[idx] = arg.trim() })
      if ((new Set(args)).size !== args.length) _showCmdWarn.value = true
      else _showCmdWarn.value = false
    }
  }
}

/** Tooltip strings used in tray cmd display */
const _tooltips = {
  command: 'Enter running command\n\nTo prompt for input arguments, use the variable format:\n?<| varname |>',
  cwd: 'Location to run script in'
}

/** Verify the current working directory */
const verifyCwd = () => {
  window.settingsAPI.verifyCwd(_trayCommand.value.cwd)
}
</script>

<template>
  <v-container>
    <v-row>
      <v-text-field
        label="Label"  
        v-model="_trayCommand.label"></v-text-field>
    </v-row>
    <v-row>
      <v-text-field
        label="Command"
        :title="_tooltips.command"
        v-model="_trayCommand.command"
        @input="checkCmd"></v-text-field>
    </v-row>
    <v-row v-show="_showCmdWarn">
      <v-sheet color="error">
        Warning:  Duplicate variable names detected in command!
      </v-sheet>
    </v-row>
    <v-row>
      <v-text-field
        label="Working Directory"
        :title="_tooltips.cwd"
        v-model="_trayCommand.cwd"></v-text-field>
      <v-btn @click="verifyCwd">Verify</v-btn>
    </v-row>
  </v-container>
</template>
