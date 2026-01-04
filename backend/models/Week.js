const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema({
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  isDeload: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Week', weekSchema);
