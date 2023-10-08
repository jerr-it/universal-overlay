<template>
  <div class="column" style="padding: 10px; width: 100%">
    <div v-for="category in categories" :key="category" style="margin-bottom: 5px">
      <div class="row">
        <q-icon :name="category[1]" class="text-primary" style="margin-right: 10px" size="20px"/>
        <div class="q-body-1">{{category[0]}}</div>
      </div>
      <q-list bordered class="rounded-borders" style="width: 100%; margin-bottom: 5px;">
        <q-item v-for="device in category[2]()" :key="device.mac_address">
          <q-item-section avatar>
            <q-icon :name="btIconMap[device.properties['Icon']]" class="primary" size="30px"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{device.properties['Name']}}</q-item-label>
            <q-item-label caption>{{device.mac_address}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row">
              <q-btn v-if="category[0] == 'Connected'" color="red" icon="bluetooth_disabled" label="Disconnect" style="margin-left: 5px"/>
              <q-btn v-if="category[0] == 'Paired' || category[0] == 'Available'" color="primary" icon="bluetooth" label="Connect" style="margin-left: 5px"/>
              <q-btn v-if="category[0] == 'Blocked'" color="primary" icon="settings_input_antenna" label="Unblock" style="margin-left: 5px"/>
              <q-btn v-else color="red" icon="block" label="Block" style="margin-left: 5px"/>
            </div>
          </q-item-section>
        </q-item>
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

const categories: [string, string, () => DeviceInfo[]][] = [
  ['Connected', 'bluetooth_connected', get_connected_devices],
  ['Paired', 'link', get_paired_devices],
  ['Available', 'bluetooth_searching', get_unpaired_devices],
  ['Blocked', 'block', get_blocked_devices],
];

function get_connected_devices(): DeviceInfo[] {
  return bt_devices.value.filter((device) => device.properties['Connected'] === 'yes');
}

function get_paired_devices(): DeviceInfo[] {
  return bt_devices.value.filter((device) => device.properties['Paired'] === 'yes' && device.properties['Connected'] === 'no');
}

function get_unpaired_devices(): DeviceInfo[] {
  return bt_devices.value.filter((device) => device.properties['Paired'] === 'no');
}

function get_blocked_devices(): DeviceInfo[] {
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
