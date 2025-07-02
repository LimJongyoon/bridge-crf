const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

// ⚠️ Electron 환경 감지
const isElectron = !!process.versions.electron;
const electronApp = isElectron ? require('electron').app : null;

// 📦 config.json 경로 설정 (userData 디렉토리로)
const configPath = isElectron
  ? path.join(electronApp.getPath("userData"), "config.json")
  : path.resolve(__dirname, "..", "config.json");

// ✅ config.json 읽기
let config = { imageBasePath: "" };
try {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
} catch (err) {
  console.error("⚠️ config.json 읽기 실패:", err.message);
}

const imageBasePath = config.imageBasePath || path.join(__dirname, "..", "frontend", "public", "images");

// 📁 DB 연결
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// CORS 허용
app.use(cors());
app.use(express.json());

// 정적 이미지 서빙
app.use("/images", express.static(imageBasePath));

// // init.sql 실행해서 테이블 생성 및 초기화
// const fs = require('fs');
// const initSQL = fs.readFileSync('./init.sql', 'utf-8');
// db.exec(initSQL, (err) => {
//   if (err) {
//     console.error('❌ Error initializing database:', err.message);
//   } else {
//     console.log('✅ Database initialized');
//   }
// });

// multer 메모리 저장소
const upload = multer({ storage: multer.memoryStorage() });

// 📍 이미지 저장 경로 설정 API
app.post("/api/set-image-path", (req, res) => {
  try {
    const { imageBasePath } = req.body;
    if (!imageBasePath) return res.status(400).json({ error: "Missing path" });

    fs.writeFileSync(configPath, JSON.stringify({ imageBasePath }, null, 2));
    console.log("✅ Saved path:", imageBasePath);
    res.json({ imageBasePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📍 저장된 이미지 경로 불러오기
app.get("/api/get-image-path", (req, res) => {
  try {
    const content = fs.readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(content);
    res.json({ imageBasePath: parsed.imageBasePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📸 이미지 업로드 API
app.post("/api/upload-images", upload.array("images"), (req, res) => {
  const data = req.body.data ? JSON.parse(req.body.data) : req.body;
  const { patientId, name, uploadType } = data;
  const files = req.files;

  if (!patientId || !name || !uploadType || !files?.length) {
    return res.status(400).json({ error: "Missing data or files" });
  }

  const safeName = name.replace(/[^a-zA-Z0-9가-힣_]/g, "");
  const folderName = `${patientId}_${safeName}`;
  const baseDir = path.join(imageBasePath, folderName);

  try {
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
      console.log("📁 폴더 생성됨:", baseDir);
    }
  } catch (e) {
    console.error("❌ 폴더 생성 실패:", e.message);
    return res.status(500).json({ error: "폴더 생성 실패" });
  }

  const savedFiles = [];

  files.forEach((file, idx) => {
    const filename = `${patientId}_${safeName}_${uploadType}_(${idx + 1}).jpg`;
    const filepath = path.join(baseDir, filename);
    try {
      fs.writeFileSync(filepath, file.buffer);
      console.log("✅ 저장 완료:", filepath);

      const publicPath = `/images/${folderName}/${filename}`;
      savedFiles.push(publicPath);
    } catch (err) {
      console.error("❌ 파일 저장 실패:", err.message);
    }
  });

  res.json({ success: true, files: savedFiles });
});

// ✅ 백엔드 정상 작동 확인용
app.get('/', (req, res) => {
  res.send('👋 BRIDGE API is running!');
});

// 📥 초진 데이터 저장
app.post('/api/patient', (req, res) => {
  const data = req.body;
  console.log('📥 New patient data received:', data);

  const stmt = db.prepare(`
INSERT OR REPLACE INTO patient (
  patientId, name, surgeryDate, operationName, secondaryOperationName,
  ageAtSurgery, heightAtSurgery, weightAtSurgery, bmi,
  dm, ht, steroid, smoking, breastPtosis, laterality, stage,
  surgeryTech, axillary, removedWeight, endocrine, radiation, radiationTiming,
  reconstructionTiming, siliconePosition, siliconeCovering, siliconeImplantTypes,
  siliconeVolume, oncological, surgical, clinical
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`);

  stmt.run(
    data.patientId,
    data.name,
    data.surgeryDate,
    data.operationName,
    data.secondaryOperationName,
    data.ageAtSurgery,
    data.heightAtSurgery,
    data.weightAtSurgery,
    data.bmi,
    data.dm ? 1 : 0,
    data.ht ? 1 : 0,
    data.steroid ? 1 : 0,
    data.smoking ? 1 : 0,
    data.breastPtosis,
    data.laterality,
    data.stage,
    Array.isArray(data.surgeryTech) ? data.surgeryTech.join(',') : (data.surgeryTech || ''),
    data.axillary,
    data.removedWeight,
    data.endocrine,
    data.radiation,
    data.radiationTiming,
    data.reconstructionTiming,
    data.siliconePosition,
    data.siliconeCovering,
    Array.isArray(data.siliconeImplantTypes) ? data.siliconeImplantTypes.join(',') : (data.siliconeImplantTypes || ''),
    data.siliconeVolume,
    data.oncological,
    data.surgical,
    data.clinical,
    function (err) {
      if (err) {
        console.error('❌ Error inserting patient:', err.message);
        res.status(500).json({ success: false, message: err.message });
      } else {
        console.log(`✅ Patient inserted: patientId = ${data.patientId}`);
        res.json({ success: true });
      }
    }
  );

  stmt.finalize();
});

// 📥 재진 데이터 업데이트
app.post('/api/followup', (req, res) => {
  const data = req.body;
  console.log('📥 New followup data received:', data);

  const fields = Object.keys(data).filter(f => f !== 'patientId' && f !== 'name');
  if (fields.length === 0) return res.status(400).json({ error: 'No followup data provided.' });

  const assignments = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => data[field]);

  const sql = `UPDATE patient SET ${assignments} WHERE patientId = ?`;

  db.run(sql, [...values, data.patientId], function (err) {
    if (err) {
      console.error('❌ Error updating patient with followup data:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ Followup data updated for patientId: ${data.patientId}`);
      res.json({ success: true });
    }
  });
});

// 📄 특정 환자 기본 정보
app.get("/api/get-patient-info", (req, res) => {
  const { patientId } = req.query;

  db.get(
    `SELECT * FROM patient WHERE patientId = ?`,
    [patientId],
    (err, row) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!row) return res.status(404).json({ error: "Patient not found" });
      res.json(row);
    }
  );
});

// 🧾 재진 데이터 삽입
app.post("/api/post-followup", (req, res) => {
  const data = req.body;

  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data).map(() => "?").join(", ");
  const values = Object.values(data);

  db.run(
    `INSERT INTO followup (${columns}) VALUES (${placeholders})`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: "DB insert error" });
      res.json({ success: true, followupId: this.lastID });
    }
  );
});

// 📄 재진 목록 조회
app.get("/api/get-patient-followups", (req, res) => {
  const { patientId } = req.query;

  db.all(
    `SELECT * FROM followup WHERE patientId = ? ORDER BY followupId ASC`,
    [patientId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB select error" });
      res.json({ followups: rows });
    }
  );
});

// 📄 전체 환자 목록 조회
app.get('/api/get-all-patients', (req, res) => {
  db.all('SELECT * FROM patient', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ patients: rows });
  });
});

// 🗑️ 환자 삭제
app.delete("/api/delete-patient", (req, res) => {
  const { patientIds } = req.body;
  if (!Array.isArray(patientIds) || patientIds.length === 0) {
    return res.status(400).json({ error: "No patientIds provided." });
  }

  const placeholders = patientIds.map(() => '?').join(',');

  db.run(
    `DELETE FROM followup WHERE patientId IN (${placeholders})`,
    patientIds,
    function (err) {
      if (err) return res.status(500).json({ error: "DB delete error (followup)" });

      db.run(
        `DELETE FROM patient WHERE patientId IN (${placeholders})`,
        patientIds,
        function (err2) {
          if (err2) return res.status(500).json({ error: "DB delete error (patient)" });
          res.json({ success: true });
        }
      );
    }
  );
});

// 🚀 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
