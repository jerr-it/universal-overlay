

class DeviceInfo {
    private readonly mac_addr: string;
    public properties: { [key: string]: string };

    constructor(mac_address: string, cli_output: string) {
        this.mac_addr = mac_address;

        const lines: string[] = cli_output.split('\n').splice(0);

        this.properties = {};
        for (const line of lines) {
            const [key, value] = line.split(': ');
            this.properties[key.trim()] = value.trim();
        }
    }

    public get name(): string {
        return this.properties['Name'];
    }

    public get mac_address(): string {
        return this.mac_addr;
    }

    public get alias(): string {
        return this.properties['Alias'];
    }

    public get dev_class(): string {
        return this.properties['Class'];
    }

    public get icon(): string {
        return this.properties['Icon'];
    }

    public get paired(): boolean {
        return this.properties['Paired'] === 'yes';
    }

    public get trusted(): boolean {
        return this.properties['Trusted'] === 'yes';
    }

    public get blocked(): boolean {
        return this.properties['Blocked'] === 'yes';
    }

    public get connected(): boolean {
        return this.properties['Connected'] === 'yes';
    }
}

export default DeviceInfo;
