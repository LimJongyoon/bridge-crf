const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// init.sql 실행해서 테이블 생성
const fs = require('fs');
const initSQL = fs.readFileSync('./init.sql', 'utf-8');
db.exec(initSQL, (err) => {
    if (err) {
        console.error('❌ Error initializing database:', err.message);
    } else {
        console.log('✅ Database initialized');
    }
});

// CORS 허용 (Next.js랑 통신 가능하게)
app.use(cors());
app.use(express.json());

// 테스트용 API
app.get('/', (req, res) => {
    res.send('👋 BRIDGE API is running!');
});

// POST /api/patient → 초진 데이터 저장
app.post('/api/patient', (req, res) => {
    const data = req.body;
    console.log('📥 New patient data received:', data);

    const stmt = db.prepare(`
    INSERT INTO patient (
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

// GET /api/get-patient-name → patientId로 이름 조회
app.get('/api/get-patient-name', (req, res) => {
  const patientId = req.query.patientId;
  db.get('SELECT name FROM patient WHERE patientId = ?', [patientId], (err, row) => {
    if (err) {
      console.error('❌ Error fetching patient name:', err.message);
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Patient not found' });
    } else {
      res.json({ name: row.name });
    }
  });
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


// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
