const Model3D = require('../models/Model3D');
const fs = require('fs');
const path = require('path');

const uploadModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { name } = req.body;
    
    // Convert relative path for client
    const filePath = `/uploads/${req.file.filename}`;

    const newModel = await Model3D.create({
      user: req.user._id,
      name: name || req.file.originalname,
      filePath,
      cameraState: {
        position: { x: 0, y: 0, z: 5 },
        target: { x: 0, y: 0, z: 0 }
      }
    });

    res.status(201).json(newModel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyModels = async (req, res) => {
  try {
    const models = await Model3D.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getModelById = async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);

    if (model) {
      if (model.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to view this model' });
      }
      res.json(model);
    } else {
      res.status(404).json({ message: 'Model not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCameraState = async (req, res) => {
  try {
    const { cameraState } = req.body;
    const model = await Model3D.findById(req.params.id);

    if (model) {
      if (model.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this model' });
      }
      
      model.cameraState = cameraState;
      const updatedModel = await model.save();
      res.json(updatedModel);
    } else {
      res.status(404).json({ message: 'Model not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteModel = async (req, res) => {
  try {
    const model = await Model3D.findById(req.params.id);

    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    if (model.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this model' });
    }

    // Safely delete physical file from server
    try {
      const fullPath = path.join(__dirname, '../', model.filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error('Error deleting physical model file:', err);
    }

    await model.deleteOne();
    res.json({ message: 'Model removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadModel, getMyModels, getModelById, updateCameraState, deleteModel };
