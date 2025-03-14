// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// All of the Node.js APIs are available in the preload process.

// bridge to the display the update from main id = update_available
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('bridge', {
    updateAvailable: () => {
      console.log('Sending update_available event...');
      ipcRenderer.send('update_available');
    },
    onUpdateAvailable: (callback) => {
      console.log('Listening for update_available event...');
      ipcRenderer.on('update_available', callback);
    }
  });
  