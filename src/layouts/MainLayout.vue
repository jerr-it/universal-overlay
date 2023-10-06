<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Universal Overlay
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div style="display: flex; flex-direction: row;">
        <q-list bordered separator padding>
          <q-item :to="conf.path_name" clickable v-for="conf in config_opts" :key="conf">
            <q-item-section>
              {{conf.label}}
            </q-item-section>
          </q-item>
        </q-list>
        <router-view/>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';

const config_opts: Ref<Array<object>> = ref([
  {label: 'Bluetooth', path_name: 'bluetooth'},
  {label: 'Process-Viewer', path_name: 'process_viewer'},
])
</script>
