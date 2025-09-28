const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'favicon.ico'),
    titleBarStyle: 'default',
    show: false,
    backgroundColor: '#1a1a1a'
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Start backend services
  startBackendServices();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    stopBackendServices();
  });
}

// Start backend services
function startBackendServices() {
  if (isDev) return; // In dev mode, backend runs separately

  const backendPath = path.join(__dirname, '../../backend/main.py');
  const pythonPath = process.platform === 'win32'
    ? 'python'
    : 'python3';

  if (fs.existsSync(backendPath)) {
    backendProcess = spawn(pythonPath, [backendPath], {
      cwd: path.join(__dirname, '../../backend'),
      stdio: 'pipe',
      env: { ...process.env, PYTHONPATH: path.join(__dirname, '../../backend') }
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
    });
  }
}

// Stop backend services
function stopBackendServices() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Recipe',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-recipe');
          }
        },
        { type: 'separator' },
        {
          label: 'Import Data',
          click: () => {
            dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Excel Files', extensions: ['xlsx', 'xls'] },
                { name: 'CSV Files', extensions: ['csv'] }
              ]
            }).then(result => {
              if (!result.canceled) {
                mainWindow.webContents.send('import-file', result.filePaths[0]);
              }
            });
          }
        },
        {
          label: 'Export Data',
          click: () => {
            dialog.showSaveDialog(mainWindow, {
              filters: [
                { name: 'Excel Files', extensions: ['xlsx'] },
                { name: 'CSV Files', extensions: ['csv'] },
                { name: 'PDF Reports', extensions: ['pdf'] }
              ]
            }).then(result => {
              if (!result.canceled) {
                mainWindow.webContents.send('export-file', result.filePath);
              }
            });
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            require('electron').shell.openExternal('https://chef-suite-docs.brenhamcc.com');
          }
        },
        {
          label: 'Support',
          click: () => {
            require('electron').shell.openExternal('mailto:support@brenhamcc.com');
          }
        },
        { type: 'separator' },
        {
          label: 'About Chef Suite',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Chef Suite Professional',
              message: 'Chef Suite Professional v1.0.0',
              detail: 'Culinary Operations Management System\n© 2025 Brenham Country Club\nAll rights reserved.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  return await dialog.showSaveDialog(mainWindow, options);
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  return await dialog.showOpenDialog(mainWindow, options);
});

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  stopBackendServices();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle app updates in production
if (!isDev) {
  app.setAppUserModelId('com.brenhamcc.chefsuite');
}