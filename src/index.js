import { app, BrowserWindow } from 'electron';
import * as blockstack from 'blockstack';
import queryString from 'query-string';
import cp from 'child_process';

// Start process to serve manifest file
const server = cp.fork(__dirname + '/server.js');

// Quit server process if main app will quit
app.on('will-quit', () => {
  server.send('quit');
});

// Set default protocol client for redirect
app.setAsDefaultProtocolClient('electronblockstackdemo');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('open-url', function (ev, url) {
  ev.preventDefault();
  
  // Bring app window to front
  mainWindow.focus();

  const queryDict = queryString.parse(url);
  var token = queryDict["electronblockstackdemo://auth?authResponse"] ? queryDict["electronblockstackdemo://auth?authResponse"] : null;

  const tokenPayload = blockstack.decodeToken(token).payload

  const profileURL = tokenPayload.profile_url
  fetch(profileURL)
    .then(response => {
      if (!response.ok) {
        console.log("Error fetching user profile")
      } else {
        response.text()
        .then(responseText => JSON.parse(responseText))
        .then(wrappedProfile => blockstack.extractProfile(wrappedProfile[0].token))
        .then(profile => {
          mainWindow.webContents.send('displayUsername', profile);
        })
      }
    })

});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
