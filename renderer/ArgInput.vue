<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/** Command display reference */
const _inputLabel = ref()
/** Argument display reference */
const _argumentLabel = ref()
/** Reference for argument input */
const _argInput = ref('')

/** Send input back to main app */
const sendData = ():void => {
  if (_argInput.value === '') {
    window.alert('Please enter a value!')
  } else window.inputAPI.sendInput(_argInput.value)
}

onMounted(() => {
  window.inputAPI.onReceiveData((inputData:InputPromptData) => {
    _inputLabel.value = inputData.label
    _argumentLabel.value = inputData.argument
  })
})
</script>

<template>
<section>
  <div>
    Command: <span class="highlight">{{ _inputLabel }}</span>
  </div>
  <div>
    <label for="argInput">
      Enter value for <span class="highlight">{{ _argumentLabel }}</span>:
    </label>
  </div>
  <div>
    <input type="text" id="argInput" v-model="_argInput" @keyup.enter="sendData" autofocus/>
  </div>
  <div>
    <button @click="sendData" class="left">Submit</button>
  </div>
</section>
</template>

<style scoped>
section {
  display: flex;
  flex-flow: column;
  align-items: stretch;
  height: 100vh;
}
div {
  padding-top: 2px;
  padding-left: 4px;
  padding-right: 8px;
  padding-bottom: 4px;
}
#argInput {
  width: 98%;
}
.highlight {
  font-weight: bold;
}
.left {
  float: left;
}
.right {
  float: right;
}
</style>
