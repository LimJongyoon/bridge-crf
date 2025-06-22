const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { ipcMain, dialog } = require("electron");

let serverProcess;
let win;


ipcMain.handle("dialog:openFolder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });

  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});


function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')  // 🔥 이 줄 꼭 필요함
    },
  });

  //win.loadURL('http://localhost:3000');
  win.loadFile(path.join(__dirname, 'frontend/out/index.html'));

}

app.whenReady().then(() => {
  console.log('🚀 Starting Express server...');

  serverProcess = spawn('node', ['backend/server.js'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname,
  });

  serverProcess.on('error', (err) => {
    console.error('❌ Failed to start server process:', err.message);
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
    serverProcess.kill('SIGTERM');
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
