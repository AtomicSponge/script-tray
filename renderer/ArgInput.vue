<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const displayData:InputPromptData = {
  command: '',
  argument: ''
}

const _argInput = ref('')

/** Send input back to main app */
const sendData = ():void => {
  if (_argInput.value === '') {
    window.alert('Please enter a value!')
    return
  }
  window.inputAPI.sendInput(_argInput.value)
}

/** Cancel running command */
const cancelCmd = ():void => { window.close() }

onMounted(() => {
  window.inputAPI.onReceiveData((inputData:InputPromptData) => {
    displayData.command = inputData.command
    displayData.argument = inputData.argument
  })
})
</script>

<template>
<section>
  <div>
    Command: <span class="highlight">{{ displayData.command }}</span>
  </div>
  <div>
    <label for="argInput">
      Enter value for <span class="highlight">{{ displayData.argument }}</span>:
    </label>
  </div>
  <div>
    <input type="text" id="argInput" v-model="_argInput" @keyup.enter="sendData()"/>
  </div>
  <div>
    <button @click="sendData()" class="left">Submit</button>
    <button @click="cancelCmd()" class="right">Cancel Command</button>
  </div>
</section>
</template>

<style lang="stylus" scoped>
section
  display flex
  flex-flow column
  align-items stretch
  height 100vh
div
  padding-top 2px
  padding-left 4px
  padding-right 8px
  padding-bottom 4px
#argInput
  width 98%
.highlight
  font-weight bold
.left
  float left
.right
  float right
</style>
