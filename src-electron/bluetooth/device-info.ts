

class DeviceInfo {
    private readonly mac_addr: string;
    public properties: { [key: string]: string };

    constructor(mac_address: string, cli_output: string) {
        this.mac_addr = mac_address;

        const lines: string[] = cli_output.split('\n');
        lines.shift();

        this.properties = {};
        for (const line of lines) {
            if (line === '') {
                continue;
            }

            const [key, value] = line.split(': ');
            this.properties[key.trim()] = value.trim();
        }
    }

    public get mac_address(): string {
        return this.mac_addr;
    }
}

export default DeviceInfo;
