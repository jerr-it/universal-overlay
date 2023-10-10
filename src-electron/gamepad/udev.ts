
export class Udev {
  private readonly udev = require('udev');
  private readonly udevMonitor: any;
  constructor(udevSubystem = "input") {
    this.udevMonitor = this.udev.monitor(udevSubystem);
  }

  public onChange(callback: (device: any) => void) {
    this.udevMonitor.on('add', callback);
  }

  public onRemove(callback: (device: any) => void) {
    this.udevMonitor.on('remove', callback);
  }

  public onAdd(callback: (device: any) => void) {
    this.udevMonitor.on('add', callback);
  }
}
