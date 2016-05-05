'use strict';

const {app, BrowserWindow, Menu} = require('electron');
let mainWindow = null;

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);
app.once('ready', createMenu);
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

function createMenu() {
  if (Menu.getApplicationMenu()) {
    return;
  }

  var menuTemplate = require('./src/electron/menuTemplate.js');
  var menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Tradeshift API Explorer'
  });

  mainWindow.setProgressBar(-1); // hack: force icon refresh

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}
