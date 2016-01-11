'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let ipcMain = electron.ipcMain;
const dialog = electron.dialog;

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 750,
    height: 640,
    resizable: false,
    title: 'โปรแกรมคำนวณ CV Risk',
    frame: true,
    autoHideMenuBar: true
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  ipcMain.on('open-file', (event, arg) => {
    let file = dialog.showOpenDialog({
      properties: [ 'openFile' ],
      filters: [{ name: 'Text File', extensions: ['txt'] }]
    });

    if (file) {
      event.returnValue = file;
    } else {
      event.returnValue = null;
    }

  })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
