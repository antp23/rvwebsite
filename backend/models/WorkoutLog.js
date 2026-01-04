const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  dayTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DayTemplate',
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'skipped', 'partial', 'rescheduled'],
    required: true
  },
  weight: {
    type: Number,
    default: null
  },
  energy: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },
  sleep: {
    type: Number,
    default: null
  },
  rpe: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
