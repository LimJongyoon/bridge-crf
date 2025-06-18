const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  console.log('🚀 Starting Express server...');

  serverProcess = spawn('node', ['../backend/server.js'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  setTimeout(() => {
    console.log('🟢 Launching app window...');
    createWindow();
  }, 2000);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    console.log('🛑 Stopping Express server...');
    serverProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
