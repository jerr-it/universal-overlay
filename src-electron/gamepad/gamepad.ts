import EvdevReader, { Evdev } from "evdev";
import { Udev } from "./udev";

export class Gamepad {
  private readonly evdevReader: EvdevReader;
  private readonly udev: any;
  private currentGamepadDevicePath: any;
  private readonly BLACKLIST = [
    "LED"
    ];

  constructor(autoConnect = true) {
    this.evdevReader = new EvdevReader();
    this.udev = new Udev();
    this.currentGamepadDevicePath = null;

    if(autoConnect) {
      this.udev.onAdd((device: any) => {
        console.log("udev add");

        if(this.currentGamepadDevicePath === null) {
          this.tryOpenAvailableGamepad();
        }
      });
    }

    this.udev.onRemove((device: any) => {
      if(!!device.DEVLINKS && typeof device.DEVLINKS === "string") {
        const split: string[] = device.DEVLINKS.split(" ");
        const isCurrentGamepad = split.some((path) => path === this.currentGamepadDevicePath)
        if(isCurrentGamepad) {
          console.log("udev remove current")
          this.closeGamepad();
          this.tryOpenAvailableGamepad();
        }
      }
    });

    this.tryOpenAvailableGamepad();
  }

  public searchGamepad(dir = "/dev/input/by-id", reg = "event-joystick"): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.evdevReader.search(dir, reg, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
  }

  public openGamepad(file: string) {
    this.evdevReader.open(file);
    this.currentGamepadDevicePath = file;
  }

  public tryOpenAvailableGamepad() {
    this.searchGamepad().then((files: string[]) => {
      const filtered = files.filter((file) => {
        return !this.BLACKLIST.some((blacklist) => file.includes(blacklist));
      });


      if(filtered.length > 0) {
        this.openGamepad(filtered[0]);
        console.log("Gamepad connected");
        console.log(this.currentGamepadDevicePath);
      }
    });
  }

  public closeGamepad() {
    //this.evdevReader.close();
    this.currentGamepadDevicePath = null;
  }

  public onEvent(event: EvdevEventType, callback: (data: Evdev.Event) => void) {
    this.evdevReader.on(event, callback);
  }
}

export enum EvdevEventType {
  KEYS = 'EV_KEY',
  ABSOLUTE_AXIS = 'EV_ABS',
  RELATIVE_AXIS = 'EV_REL',
}
