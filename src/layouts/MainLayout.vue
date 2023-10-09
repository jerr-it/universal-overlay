<template>
  <q-layout view="hHh Hpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Universal Overlay
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawer"
      bordered
    >
      <q-list separator padding>
        <q-item :to="conf.path_name" clickable v-for="conf in config_opts" :key="conf">
          <q-item-section>
            {{conf.label}}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';


const drawer = ref(true)
const config_opts: Ref<Array<object>> = ref([
  {label: 'Bluetooth', path_name: 'bluetooth'},
  {label: 'Process-Viewer', path_name: 'process_viewer'},
])
</script>
