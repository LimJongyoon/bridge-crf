const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// CORS 허용 (Next.js랑 통신 가능하게)
app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "../public/images")));


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

const multer = require('multer');
const fs = require('fs');

// 메모리에 임시 저장 (또는 diskStorage 써도 됨)
const upload = multer({ storage: multer.memoryStorage() });

// 📦 사진 업로드 API
app.post("/api/upload-images", upload.array("images"), (req, res) => {
  const { patientId, name, uploadType } = req.body;
  const files = req.files;

  if (!patientId || !name || !uploadType || !files?.length) {
    return res.status(400).json({ error: "Missing data or files" });
  }

  const safeName = name.replace(/[^a-zA-Z0-9가-힣_]/g, "");
  const folderName = `${patientId}_${safeName}`;
  const baseDir = path.join(__dirname, "../public/images", folderName);

  // 폴더 없으면 생성
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


// 테스트용 API
app.get('/', (req, res) => {
  res.send('👋 BRIDGE API is running!');
});

// POST /api/patient → 초진 데이터 저장
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

// POST /api/followup → 재진 데이터 저장
app.post('/api/followup', (req, res) => {
  const data = req.body;
  console.log('📥 New followup data received:', data);

  // patientId는 WHERE 조건으로만 사용 (따라서 업데이트 대상 필드에서 제외)
  const fields = Object.keys(data).filter(f => f !== 'patientId' && f !== 'name');

  if (fields.length === 0) {
    res.status(400).json({ error: 'No followup data provided.' });
    return;
  }

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

app.get("/api/get-patient-info", (req, res) => {
  const { patientId } = req.query;

  db.get(
    `SELECT * FROM patient WHERE patientId = ?`,
    [patientId],
    (err, row) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "DB error" });
      }

      if (!row) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.json(row); // 그냥 patient 테이블 전체 row 반환
    }
  );
});  

app.post("/api/post-followup", (req, res) => {
  const data = req.body;

  // Build insert query dynamically
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data).map(() => "?").join(", ");
  const values = Object.values(data);

  db.run(
    `INSERT INTO followup (${columns}) VALUES (${placeholders})`,
    values,
    function (err) {
      if (err) {
        console.error("Error inserting followup:", err);
        return res.status(500).json({ error: "DB insert error" });
      }
      res.json({ success: true, followupId: this.lastID });
    }
  );
});

app.get("/api/get-patient-followups", (req, res) => {
  const { patientId } = req.query;

  db.all(
    `SELECT * FROM followup WHERE patientId = ? ORDER BY followupId ASC`,
    [patientId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching followups:", err);
        return res.status(500).json({ error: "DB select error" });
      }
      res.json({ followups: rows });
    }
  );
});

// GET /api/get-all-patients
app.get('/api/get-all-patients', (req, res) => {
  db.all('SELECT * FROM patient', [], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching all patients:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ patients: rows });
    }
  });
});

// DELETE /api/delete-patient
app.delete("/api/delete-patient", (req, res) => {
  const { patientIds } = req.body; // 배열로 받기

  if (!Array.isArray(patientIds) || patientIds.length === 0) {
    return res.status(400).json({ error: "No patientIds provided." });
  }

  const placeholders = patientIds.map(() => '?').join(',');

  // 1️⃣ Followup 먼저 삭제
  db.run(
    `DELETE FROM followup WHERE patientId IN (${placeholders})`,
    patientIds,
    function (err) {
      if (err) {
        console.error("Error deleting followups:", err);
        return res.status(500).json({ error: "DB delete error (followup)" });
      }

      // 2️⃣ Patient 삭제
      db.run(
        `DELETE FROM patient WHERE patientId IN (${placeholders})`,
        patientIds,
        function (err2) {
          if (err2) {
            console.error("Error deleting patients:", err2);
            return res.status(500).json({ error: "DB delete error (patient)" });
          }

          res.json({ success: true });
        }
      );
    }
  );
});


// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
