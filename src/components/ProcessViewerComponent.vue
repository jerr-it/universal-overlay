<template>
  <q-page>
        <q-table
          square
          :rows="processes"
          :columns="columns"
          row-key="pid"
          style="min-height: inherit"
          virtual-scroll
          :rows-per-page-options="[0]"
          :pagination="{sortBy: 'cpu', descending: true}"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="pid" :props="props">
                {{ props.row.pid }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.command }}
              </q-td>
              <q-td key="cpu" :props="props">
                {{ props.row.cpu }}%
              </q-td>
              <q-td key="memory" :props="props">
                {{ (props.row.memory / 1000).toFixed(2) }} MB
              </q-td>
              <q-td key="action" :props="props">
                  <q-btn
                    color="negative"
                    flat
                    dense
                    icon="close"
                    @click="quitProcess(props.row.pid)"
                  >
                    Quit
                  </q-btn>
                <q-btn
                  color="negative"
                  flat
                  dense
                  icon="close"
                  @click="killProcess(props.row.pid)"
                >
                  Force Quit
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, Ref, ref } from 'vue';
import { onMounted } from 'vue'
import {Process} from 'app/src-electron/process-viewer/process-viewer';

const processes: Ref<Process[]> = ref([])
let getProcessesIntervalId: NodeJS.Timeout | null = null

const columns = [
  {
    name: 'pid',
    label: 'PID',
    field: 'pid',
    align: 'left',
    sortable: true
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'cpu',
    label: 'CPU',
    field: 'cpu',
    sortable: true
  },
  {
    name: 'memory',
    label: 'Memory',
    field: 'memory',
    sortable: true
  },
  {
    name: 'action',
    label: 'Action',
    field: 'action',
    sortable: false
  },
]

function killProcess(pid: number) {
  window.ps.killProcess(pid)
}

function quitProcess(pid: number) {
  window.ps.quitProcess(pid)
}

onMounted(() => {
  processes.value = window.ps.getProcesses()

  getProcessesIntervalId = setInterval(() => {
    processes.value = window.ps.getProcesses()
  }, 5000)
})

onBeforeUnmount(() => {
  if (getProcessesIntervalId) {
    clearInterval(getProcessesIntervalId)
  }
})

</script>

<style scoped>

</style>
