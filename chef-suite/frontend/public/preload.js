const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // File dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),

  // Menu actions
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
  onImportFile: (callback) => ipcRenderer.on('import-file', callback),
  onExportFile: (callback) => ipcRenderer.on('export-file', callback),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // System info
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});

// Also expose some Node.js APIs for file operations
contextBridge.exposeInMainWorld('fs', {
  readFile: (filePath, options) => {
    return new Promise((resolve, reject) => {
      require('fs').readFile(filePath, options, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
});