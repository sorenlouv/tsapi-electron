'use strict';

const {app, BrowserWindow, Menu} = require('electron');
let primaryWindow = null;
let secondaryWindow = null;

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function(){
  createSecondaryWindow();
  createPrimaryWindow();
});
app.once('ready', createMenu);
app.on('activate', function () {
  if (primaryWindow === null) {
    createPrimaryWindow();
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

function createPrimaryWindow() {
  primaryWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Tradeshift API Explorer'
  });

  primaryWindow.hide();
  primaryWindow.setProgressBar(-1); // hack: force icon refresh
  primaryWindow.loadURL('file://' + __dirname + '/src/primaryWindow.html');

  primaryWindow.webContents.on('did-finish-load', () => {
    primaryWindow.show();
    secondaryWindow.close();
  });

  // Open the DevTools.
  // primaryWindow.webContents.openDevTools();

  primaryWindow.on('closed', function () {
    primaryWindow = null;
  });
}

function createSecondaryWindow() {
  secondaryWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Loading Tradeshift API Explorer...'
  });

  secondaryWindow.loadURL('file://' + __dirname + '/src/secondaryWindow.html');

  secondaryWindow.on('closed', function () {
    secondaryWindow = null;
  });
}
