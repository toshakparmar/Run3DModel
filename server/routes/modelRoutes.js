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
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.glb') {
      return cb(new Error('Only .glb files are allowed. Please convert .gltf to .glb to include textures.'));
    }
    cb(null, true);
  }
});

router.route('/')
  .post(protect, upload.single('modelFile'), uploadModel)
  .get(protect, getMyModels);

router.route('/:id')
  .get(protect, getModelById)
  .put(protect, updateCameraState)
  .delete(protect, deleteModel);

module.exports = router;
