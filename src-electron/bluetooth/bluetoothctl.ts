import process from 'child_process';
import DeviceInfo from 'app/src-electron/bluetooth/device-info';

class Bluetoothctl {
    private readonly isAvailable: boolean = false;
    private scan_process: process.ChildProcessWithoutNullStreams | undefined = undefined;

    constructor() {
        const proc = process.spawnSync('bluetoothctl', ['list']);
        for (const line of proc.stdout.toString().split('\n')) {
            if (line.startsWith('Controller')) {
                this.isAvailable = true;
                break;
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
            this.scan_process.kill('SIGINT');
            this.scan_process = undefined;
        }
    }


    public getDevices(): DeviceInfo[] {
        const proc = process.spawnSync('bluetoothctl', ['devices']);

        const devices: DeviceInfo[] = [];
        for (const line of proc.stdout.toString().split('\n')) {
            if (line.startsWith('Device')) {
                const [_, mac_address, __] = line.split(' ');
                const device_data = process.spawnSync('bluetoothctl', ['info', mac_address]);
                devices.push(new DeviceInfo(mac_address, device_data.stdout.toString()));
            }
        }

        return devices;
    }
}

export default Bluetoothctl;
