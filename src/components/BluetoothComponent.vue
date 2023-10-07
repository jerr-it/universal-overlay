<template>
<div style="display: flex; justify-content: center; align-items: center;">
  <div class="column">
    <!--TODO ask david-->
    <q-avatar icon="bluetooth" :color="bt_available ? 'blue': 'grey'" style="margin: 5px"></q-avatar>
    <q-btn v-for="device in bt_devices" :key="device.mac_address" color="primary" style="margin: 5px">
      {{ device.properties["Name"] }}
    </q-btn>
  </div>
</div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import DeviceInfo from "app/src-electron/bluetooth/device-info";

let bt_available = ref<boolean>(false);
let bt_devices = ref<DeviceInfo[]>([]);

const intervalID = setInterval(async () => {
  bt_devices.value = await window.bluetooth.getDevices();
}, 5000);

onMounted(async () => {
  bt_available.value = await window.bluetooth.isAvailable();
  await window.bluetooth.scanOn();
  bt_devices.value = await window.bluetooth.getDevices();
});

onUnmounted(async () => {
  await window.bluetooth.scanOff();
  clearInterval(intervalID);
});

</script>

<style scoped>

</style>
