const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const packageJson = require("../package.json");
const { autoUpdater, AppUpdater } = require("electron-updater");

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Send the version number to the renderer process
ipcMain.handle("get-app-version", () => {
  return packageJson.version;
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdates();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


/*New Update Available*/
autoUpdater.on("update-available", (info) => {
  // show dialog to user as new update is available
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "New Update Available",
    message: "A new update is available. Do you want to restart?",
    detail: "A new update is available. Do you want to restart?",
  };

  // download the update
  autoUpdater.downloadUpdate();
});

autoUpdater.on("update-not-available", (info) => {

});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Installation Complete",
    message: "A new update has just been installed!",
    detail: "A new update has just been installed!",
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on("error", (info) => {
  console.log(info);
});