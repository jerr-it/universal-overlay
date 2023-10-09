const NAME_PATTERN = /Name: (.+)/;
const ALIAS_PATTERN = /Alias: (.+)/;

const CLASS_PATTERN = /Class: (.+)/;
const ICON_PATTERN = /Icon: (.+)/;

const PAIRED_PATTERN = /Paired: (.+)/;
const TRUSTED_PATTERN = /Trusted: (.+)/;
const BLOCKED_PATTERN = /Blocked: (.+)/;
const CONNECTED_PATTERN = /Connected: (.+)/;
const LEGACY_PAIRING_PATTERN = /LegacyPairing: (.+)/;

const UUID_PATTERN = /(UUID: .+?)\s+\(([\da-fA-F-]+)\)/g;

class DeviceInfo {
    public readonly mac_address: string;
    public readonly name: string;
    public readonly alias: string;

    public readonly class: string;

    public readonly icon: string;

    public readonly paired: boolean;
    public readonly trusted: boolean;
    public readonly blocked: boolean;
    public readonly connected: boolean;
    public readonly legacy_pairing: boolean;

    public readonly uuids: { [key: string]: string } = {};

    constructor(mac_address: string, cli_output: string) {
        this.mac_address = mac_address;

        this.name = NAME_PATTERN.exec(cli_output)?.[1] ?? 'unknown'
        this.alias = ALIAS_PATTERN.exec(cli_output)?.[1] ?? 'unknown';

        this.class = CLASS_PATTERN.exec(cli_output)?.[1] ?? 'unknown';

        this.icon = ICON_PATTERN.exec(cli_output)?.[1] ?? 'unknown';

        this.paired = PAIRED_PATTERN.exec(cli_output)?.[1] === 'yes' || false;
        this.trusted = TRUSTED_PATTERN.exec(cli_output)?.[1] === 'yes' || false;
        this.blocked = BLOCKED_PATTERN.exec(cli_output)?.[1] === 'yes' || false;
        this.connected = CONNECTED_PATTERN.exec(cli_output)?.[1] === 'yes' || false;
        this.legacy_pairing = LEGACY_PAIRING_PATTERN.exec(cli_output)?.[1] === 'yes' || false;

        const matches = cli_output.matchAll(UUID_PATTERN);
        if (matches) {
            this.uuids = {};
            for (const match of matches) {
                this.uuids[match[1]] = match[2];
            }
        }
    }
}

export default DeviceInfo;
