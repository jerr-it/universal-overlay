import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';
import os from 'os';
import { EvdevEventType, Gamepad } from "app/src-electron/gamepad/gamepad";
import Bluetoothctl from 'app/src-electron/bluetooth/bluetoothctl';


// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;
let tray: Tray | null = null;
let visible = true;
let gamepad: Gamepad | null = null;

const bluetoothctl = new Bluetoothctl();

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1920,
    height: 1080,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      //contextIsolation: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  toggleVisibility();
  gamepad = new Gamepad()
  gamepad.on(EvdevEventType.KEYS, (data) => {
    if(data.code === 'BTN_MODE' && data.value === 1) {
      toggleVisibility();
    }
  });

}

function toggleVisibility() {
  if (visible) {
    mainWindow?.hide();
  } else {
    mainWindow?.show();
    //mainWindow?.setFullScreen(true);
  }
  visible = !visible;
}

app.whenReady().then(() => {
  ipcMain.handle('bt-available', () => {
    return bluetoothctl.available;
  });

  ipcMain.handle('bt-scan-on', () => {
    bluetoothctl.scanOn();
  });

  ipcMain.handle('bt-scan-off', () => {
    bluetoothctl.scanOff();
  });

  ipcMain.handle('bt-get-devices', () => {
    return bluetoothctl.getDevices();
  });

  createWindow();
});


app.whenReady().then(() => {
  tray = new Tray('src-electron/icons/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Hide/Show', click: () => toggleVisibility() },
    { label: 'Quit', click: () => {
      tray?.destroy();
      app.quit();
    } }
  ])
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Universal Overlay')
})

app.on('window-all-closed', () => {
  app.quit();
})

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
