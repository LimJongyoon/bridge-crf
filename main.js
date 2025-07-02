const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const waitOn = require("wait-on");

let serverProcess = null;
let frontendProcess = null;
let win = null;

// 📁 폴더 선택 IPC
ipcMain.handle("dialog:openFolder", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  return result.canceled ? null : result.filePaths[0];
});

// 🪟 Electron 창 생성
function createWindow(url) {
  win = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  console.log("로드 시도중:", url);
  win.loadURL(url);

  win.webContents.on("did-finish-load", () => {
    console.log("로드 완료 URL:", win.webContents.getURL());
  });

  // win.webContents.openDevTools();
}

// ⚙️ 프로세스 시작 함수
function startProcesses() {
  console.log("백엔드 서버켜짐 3001");
  serverProcess = spawn("node", ["backend/server.js"], {
    cwd: __dirname,
    shell: true,
    stdio: "inherit",
  });

  serverProcess.on("error", (err) => {
    console.error("백엔드 꺼짐", err.message);
  });

  console.log("프론트 서버켜짐 (3000)");
  frontendProcess = spawn("npx", ["next", "start"], {
    cwd: path.join(__dirname, "frontend"),
    shell: true,
    stdio: "inherit",
  });

  frontendProcess.on("error", (err) => {
    console.error("프론트 꺼짐", err.message);
  });

  // 고정 포트로 대기
  waitOn({ resources: ["http://localhost:3000"], timeout: 15000 })
    .then(() => {
      console.log("🟢 프론트 접속 성공, 창 열기");
      createWindow("http://localhost:3000");
    })
    .catch(() => {
      console.error("❌ 프론트 서버 접속 실패");
    });
}

// 🧼 종료 처리 함수
function stopProcesses() {
  console.log("🛑 Stopping processes...");
  if (serverProcess) serverProcess.kill("SIGTERM");
  if (frontendProcess) frontendProcess.kill("SIGTERM");
}

// ✅ 앱 시작
app.whenReady().then(() => {
  startProcesses();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0 && win === null) {
      createWindow("http://localhost:3000");
    }
  });
});

// ❌ 모든 창 닫힘 시 종료
app.on("window-all-closed", () => {
  stopProcesses();
  if (process.platform !== "darwin") app.quit();
});
