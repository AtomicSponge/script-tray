<!--
  script_tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref } from 'vue'

const displayData:InputPromptData = {
  command: '',
  argument: ''
}

const _argInput = ref('')

/** Send input back to main app */
const sendData = ():void => { window.inputAPI.sendInput(_argInput.value) }

/** Cancel running command */
const cancelCmd = ():void => { window.close() }

window.onload = () => {
  window.inputAPI.onReceiveData((inputData:InputPromptData) => {
    displayData.command = inputData.command
    displayData.argument = inputData.argument
  })
}
</script>

<template>
  Command: {{ displayData.command }}<br/>
  <label for="argInput">Enter argument {{ displayData.argument }}:</label>
  <input type="text" id="argInput" v-model="_argInput"/>
  <button @click="sendData">Submit</button>
  <br/>
  <button @click="cancelCmd">Cancel Command</button>
</template>

<style lang="stylus" scoped>
</style>
