const mongoose = require('mongoose');

const routineTemplateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  attachment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attachment',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RoutineTemplate', routineTemplateSchema);
