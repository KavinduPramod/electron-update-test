const { app, BrowserWindow, ipcMain, dialog } = require('electron'); // Added dialog import
const path = require('node:path');
const packageJson = require("../package.json");
const { autoUpdater } = require("electron-updater");

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

// New Update Available
autoUpdater.on("update-available", (info) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Download", "Later"],
    title: "New Update Available",
    message: "A new update is available. Do you want to Download?",
    detail: "A new update is available. Do you want to Download?",
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on("update-not-available", (info) => {
  console.log("No updates are available.");
  const dialogOpts = {
    type: "info",
    buttons: ["OK"],
    title: "No Updates Available",
    message: "No updates are available.",
    detail: "No updates are available.",
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    // do nothing
  });
});

// Download Completion Message
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

autoUpdater.on("error", (error) => {
  console.error("Error during update:", error);
  dialog.showErrorBox("Update Error", error == null ? "unknown" : (error.stack || error).toString());
});

