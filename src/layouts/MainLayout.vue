<template>
  <div v-if="!config_pane_open" class="column window-height window-width justify-center items-center">
    <h2 style="color: white">Universal-Overlay</h2>
    <div class="row item_container">
      <div v-for="item in config_opts" :key="item.label" class="column justify-center items-center">
        <q-btn
          class="button_s"
          size="25px"
          :icon="item.icon"
          @click="showPane(item)"
        />
        <div class="q-body-2 text-center" style="margin-top: 10px">{{item.label}}</div>
      </div>
    </div>
  </div>
  <div v-if="config_pane_open">
    <div class="column window-width window-width justify-center items-center">
      <h2 style="color: white">{{config_pane_content.label}}</h2>
      <div class="config_pane">
        <component :is="config_pane_content.component"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import BluetoothComponent from 'app/src/components/BluetoothComponent.vue';
import ProcessViewerComponent from 'app/src/components/ProcessViewerComponent.vue';

const config_pane_open = ref(false);
const config_pane_content = ref(Object);

const config_opts = [
  {label: 'Bluetooth', icon: 'bluetooth', component: BluetoothComponent},
  {label: 'Process-Viewer', icon: 'list', component: ProcessViewerComponent},
];

function showPane(pane: any) {
  console.log(typeof pane);
  config_pane_open.value = true;
  config_pane_content.value = pane;
}
</script>

<style scoped>
  .config_pane {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(100px);
    width: 50%;
    height: 50%;
    border-radius: 50px;
    padding: 25px;
  }
  .item_container {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(100px);
    width: 50%;
    height: 50%;
    border-radius: 50px;
    justify-content: start;
    align-items: start;
    gap: 10%;
    row-gap: 20px;
    padding: 25px;
  }
  .button_s {
    border-radius: 25%;
    background-color: white;
    width: 75px;
    height: 75px;
  }
</style>
