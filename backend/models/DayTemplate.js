const mongoose = require('mongoose');

const dayTemplateSchema = new mongoose.Schema({
  week: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Week',
    required: true
  },
  dayNumber: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['structured', 'routine'],
    default: 'structured'
  },
  structuredExercises: [{
    movement: String,
    sets: String,
    reps: String
  }],
  routineTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoutineTemplate',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DayTemplate', dayTemplateSchema);
