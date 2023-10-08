<template>
<div style="display: flex; justify-content: center; align-items: center;">
  <div>
    <q-list>
      <q-item v-for="process in processes" :key="process.pid">
        <q-item-section>{{ process.command }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { onMounted } from 'vue'
import * as process from "process";

const processes: Ref<any[]> = ref([])

onMounted(() => {
  processes.value = window.ps.getProcesses()
})

</script>

<style scoped>

</style>
