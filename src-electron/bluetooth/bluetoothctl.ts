import process from 'child_process';
import DeviceInfo from 'app/src-electron/bluetooth/device-info';

class Bluetoothctl {
  private readonly isAvailable: boolean = false;
  private scan_process: process.ChildProcessWithoutNullStreams | undefined = undefined;
  private connect_attempts = 4;

  constructor() {
    const systemctl_status_proc = process.spawnSync('systemctl', ['status', 'bluetooth']);
    const output = systemctl_status_proc.stdout.toString();

    if (!output.includes('Active: active (running)')) {
      return;
    }

    const proc = process.spawnSync('bluetoothctl', ['list']);
    for (const line of proc.stdout.toString().split('\n')) {
      if (line.startsWith('Controller')) {
        this.isAvailable = true;
        return;
      }
    }
  }

  public get available(): boolean {
    return this.isAvailable;
  }

  public scanOn(): void {
    if (this.scan_process === undefined) {
      this.scan_process = process.spawn('bluetoothctl', ['scan', 'on']);
    }
  }

  public scanOff(): void {
    if (this.scan_process) {
      this.scan_process.kill('SIGTERM');
      this.scan_process = undefined;
    }
  }

  public getDevices(): DeviceInfo[] {
    const proc = process.spawnSync('bluetoothctl', ['devices']);

    const devices: DeviceInfo[] = [];
    for (const line of proc.stdout.toString().split('\n')) {
      if (line.startsWith('Device')) {
        const [_, mac_address, name] = line.split(' ');
        if (mac_address === name.replaceAll('-', ':')) {
          continue;
        }

        const device_data = process.spawnSync('bluetoothctl', ['info', mac_address]);
        devices.push(new DeviceInfo(mac_address, device_data.stdout.toString()));
      }
    }

    return devices;
  }

  public async try_connect(mac_address: string): Promise<void> {
    const proc = process.spawn('bluetoothctl', ['connect', mac_address]);

    for (let i = 0; i < this.connect_attempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (!proc.stdout) {
        continue;
      }

      const proc_output: string[] = proc.stdout.read().toString().split('\n');

      for (const line of proc_output) {
        if (line.includes('Connection successful')) {
          proc.kill('SIGKILL');
          return Promise.resolve();
        }
      }
    }

    proc.kill('SIGKILL');
    return Promise.reject("Failed to connect to device");
  }
}

export default Bluetoothctl;
