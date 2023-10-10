import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import Bluetoothctl from 'app/src-electron/bluetooth/bluetoothctl';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;

const bluetoothctl = new Bluetoothctl();

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
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

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
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

  ipcMain.handle('bt-try-connect', (event, mac_address) => {
    return bluetoothctl.try_connect(mac_address);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
