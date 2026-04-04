const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadModel, getMyModels, getModelById, updateCameraState, deleteModel } = require('../controllers/modelController');
const { protect } = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); // Use absolute path — 'uploads/' is relative and can break on some hosts
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB — matches the frontend validation
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.glb') {
      return cb(new Error('Only .glb files are allowed. Please convert .gltf to .glb to include textures.'));
    }
    cb(null, true);
  },
});

// Multer error handler — must be defined here to wrap the upload middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'File too large. Maximum allowed size is 2 MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

router.route('/')
  .post(protect, upload.single('modelFile'), handleUploadError, uploadModel)
  .get(protect, getMyModels);

router.route('/:id')
  .get(protect, getModelById)
  .put(protect, updateCameraState)
  .delete(protect, deleteModel);

module.exports = router;