const mongoose = require('mongoose');

const model3DSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  cameraState: {
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 5 },
    },
    target: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    }
  }
}, {
  timestamps: true,
});

const Model3D = mongoose.model('Model3D', model3DSchema);
module.exports = Model3D;
