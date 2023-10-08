<template>
  <div class="column" style="padding: 10px">
    <q-list bordered class="rounded-borders">
      <q-expansion-item v-for="device in bt_devices" :key="device"
        expand-separator
        :label="device.properties['Name']"
        :caption="device.mac_address"
        :icon="btIconMap[device.properties['Icon']]"
      >
        <a>Lorem ipsum</a>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import DeviceInfo from "app/src-electron/bluetooth/device-info";
import btIconMap from "app/src-electron/bluetooth/icon-map";

let bt_available = ref<boolean>(false);
let bt_devices = ref<DeviceInfo[]>([]);

const intervalID = setInterval(async () => {
  if (!bt_available.value) {
    return;
  }

  bt_devices.value = await window.bluetooth.getDevices();
}, 5000);

onMounted(async () => {
  bt_available.value = await window.bluetooth.isAvailable();
  if (!bt_available.value) {
    return;
  }

  await window.bluetooth.scanOn();
  bt_devices.value = await window.bluetooth.getDevices();
});

onUnmounted(async () => {
  if (bt_available.value){
    await window.bluetooth.scanOff();
  }
  clearInterval(intervalID);
});

</script>

<style scoped>

</style>
