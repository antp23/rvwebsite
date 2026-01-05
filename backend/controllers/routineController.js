const RoutineTemplate = require('../models/RoutineTemplate');
const Attachment = require('../models/Attachment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF) and PDFs are allowed'));
  }
};

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

// @desc    Get all routine templates for user
// @route   GET /api/routines
// @access  Private
exports.getRoutines = async (req, res) => {
  try {
    const routines = await RoutineTemplate.find({ user: req.user._id })
      .populate('attachment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: routines
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create routine template
// @route   POST /api/routines
// @access  Private
exports.createRoutine = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a name for the routine'
      });
    }

    let attachmentId = null;

    // Handle file upload if present
    if (req.file) {
      const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'pdf';

      const attachment = await Attachment.create({
        fileName: req.file.originalname,
        fileType,
        storagePath: req.file.path
      });

      attachmentId = attachment._id;
    }

    const routine = await RoutineTemplate.create({
      user: req.user._id,
      name,
      description,
      attachment: attachmentId
    });

    const populatedRoutine = await RoutineTemplate.findById(routine._id).populate('attachment');

    res.status(201).json({
      success: true,
      data: populatedRoutine
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update routine template
// @route   PUT /api/routines/:id
// @access  Private
exports.updateRoutine = async (req, res) => {
  try {
    let routine = await RoutineTemplate.findById(req.params.id);

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    // Check ownership
    if (routine.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this routine'
      });
    }

    routine = await RoutineTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('attachment');

    res.status(200).json({
      success: true,
      data: routine
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete routine template
// @route   DELETE /api/routines/:id
// @access  Private
exports.deleteRoutine = async (req, res) => {
  try {
    const routine = await RoutineTemplate.findById(req.params.id).populate('attachment');

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    // Check ownership
    if (routine.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this routine'
      });
    }

    // Delete associated attachment file if exists
    if (routine.attachment) {
      if (fs.existsSync(routine.attachment.storagePath)) {
        fs.unlinkSync(routine.attachment.storagePath);
      }
      await Attachment.findByIdAndDelete(routine.attachment._id);
    }

    await RoutineTemplate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
