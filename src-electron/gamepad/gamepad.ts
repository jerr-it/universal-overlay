import EvdevReader, { Evdev } from "evdev";

export class Gamepad {
  private readonly evdevReader: EvdevReader;
  constructor() {
    this.evdevReader = new EvdevReader();

    this.evdevReader.search("/dev/input/by-path","event-joystick", (err, files) => {
      console.log(err);
      this.evdevReader.open(files[0]);
    });
  }

  public on(event: EvdevEventType, callback: (data: Evdev.Event) => void) {
    this.evdevReader.on(event, callback);

  }
}

export enum EvdevEventType {
  KEYS = 'EV_KEY',
  ABSOLUTE_AXIS = 'EV_ABS',
  RELATIVE_AXIS = 'EV_REL',
}
