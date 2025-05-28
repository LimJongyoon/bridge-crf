const express = require('express');
const multer = require('multer');
const router = express.Router();

// multer로 이미지 저장 경로 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const patientId = req.params.id;
    cb(null, `public/${patientId}`);  // 예: public/12345/
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);  // 업로드된 파일명 그대로 저장
  }
});
const upload = multer({ storage: storage });

// 환자 등록 (임시)
router.post('/', (req, res) => {
  console.log('📥 New patient registered:', req.body);
  res.status(201).json({ message: '환자 등록 성공' });
});


// 환자 정보 불러오기 (임시)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, message: 'Patient info (mock)' });
});

// 환자 정보 수정 (임시)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, message: 'Patient updated (mock)' });
});

// 사진 업로드
router.post('/:id/images', upload.array('images', 10), (req, res) => {
  res.json({ message: 'Images uploaded', files: req.files });
});

module.exports = router;
