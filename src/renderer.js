/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import packageJson from "../package.json";

console.log(
  '👋 This message is being logged by "renderer.js", included via Vite'
);

// function to display the version from package.jhson
function displayVersion() {
  const version = packageJson.version;
  const versionElement = document.getElementById("version");
  versionElement.innerText = "v" + version;

  // Listen for the custom event dispatched from the preload script
  window.bridge.onUpdateAvailable(() => {
    console.log('Update available!');
    updateAvailable();
  });
  
}

window.addEventListener("DOMContentLoaded", () => {
  displayVersion();
});

function updateAvailable() {
  const updateElement = document.getElementById("update");
  updateElement.innerText = "Update Available Close the app to update";
  updateElement.style.display = "block";
  updateElement.addEventListener("click", () => {
    window.bridge.updateAvailable();
  });
}
