const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

const patientRoutes = require('./routes/patients');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static('public'));  // 사진 static 폴더

// Routes
app.use('/patients', patientRoutes);

app.get('/', (req, res) => {
  res.send('👋 BRIDGE API is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ 백엔드 오픈 http://localhost:${PORT}`);
});
