<template>
  <div class="column" style="padding: 10px; width: 100%">
    <div v-for="category in categories" :key="category">
      <div class="q-body-1">{{category[0]}}</div>
      <q-list bordered class="rounded-borders" style="width: 100%">
        <q-expansion-item v-for="device in category[1]()" :key="device"
                          expand-separator
                          :label="device.properties['Name']"
                          :caption="device.mac_address"
                          :icon="btIconMap[device.properties['Icon']]"
        >
          <a>Lorem ipsum</a>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import DeviceInfo from "app/src-electron/bluetooth/device-info";
import btIconMap from "app/src-electron/bluetooth/icon-map";

let bt_available = ref<boolean>(false);
let bt_devices = ref<DeviceInfo[]>([]);

const categories: [string, () => DeviceInfo[]][] = [
  ['Connected', get_connected_devices],
  ['Paired', get_paired_devices],
  ['Available', get_unpaired_devices],
  ['Blocked', get_blocked_devices],
];

function get_connected_devices() {
  return bt_devices.value.filter((device) => device.properties['Connected'] === 'yes');
}

function get_paired_devices() {
  return bt_devices.value.filter((device) => device.properties['Paired'] === 'yes' && device.properties['Connected'] === 'no');
}

function get_unpaired_devices() {
  return bt_devices.value.filter((device) => device.properties['Paired'] === 'no');
}

function get_blocked_devices() {
  return bt_devices.value.filter((device) => device.properties['Blocked'] === 'yes');
}

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
