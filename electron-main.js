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
      contextIsolation: true, // 보안
    },
  });

  win.loadURL('http://localhost:3000'); 
}

app.whenReady().then(() => {
  console.log('🚀 Starting Express server...');

  // 1️⃣ Express 서버 실행
  serverProcess = spawn('node', ['bridge-crf-backend/server.js'], {
    stdio: 'inherit',
    shell: true,
  });

  setTimeout(() => {
    console.log('🟢 Launching app window...');
    createWindow();
  }, 2000); // 2초대기 404 방지 

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
//걍 창끄면 다 종료
    if (serverProcess) {
    console.log('🛑 Stopping Express server...');
    serverProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
