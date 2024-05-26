<!--
  script-tray
  By:  Matthew Evans
  See LICENSE.md
-->

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/** Reference for storing a list of running jobs */
const _runningJobs = ref()

/**
 * Terminate running job button
 * @param pid Process ID to terminate
 */
const termJob = (pid:number) => {
  window.jobMgrAPI.termProcess(pid)
}

onMounted(() => {
  window.jobMgrAPI.onReceiveData((runningJobs:ProcessManagerData) => {
    _runningJobs.value = runningJobs
  })
})
</script>

<template>
  <section>
    <table>
      <tr>
        <th class="pid">PID</th>
        <th class="label">Label</th>
        <th>Command</th>
        <th class="time">Start time</th>
        <th class="term">&nbsp;</th>
      </tr>
      <tr v-for="item in _runningJobs">
        <td>{{ item.pid }}</td>
        <td>{{ item.label }}</td>
        <td>{{ item.command }}</td>
        <td>{{ item.start }}</td>
        <td>
          <button @click="termJob(item.pid)">TERM</button>
        </td>
      </tr>
    </table>
  </section>
</template>

<style lang="stylus" scoped>
section
  overflow auto
  padding-top 4px
  padding-left 4px
  padding-right 4px
  padding-bottom 4px
table
  width 100%
  border-collapse collapse
  border 1px solid rgb(100, 100, 100, 0.1)
th
  padding 4px
  background-color rgb(80, 80, 80, 0.1)
  text-align left
.pid
  width 60px
.label
  width 20%
.time
  width 20%
.term
  width 50px
tr:nth-child(odd)
  background-color rgb(60, 60, 60, 0.1)
td
  padding 4px
button
  vertical-align top
  font-size 0.6em
</style>
