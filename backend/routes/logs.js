const express = require('express');
const router = express.Router();
const {
  createLog,
  getLogs,
  updateLog,
  getTodayWorkout
} = require('../controllers/logController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createLog);
router.get('/', protect, getLogs);
router.get('/today', protect, getTodayWorkout);
router.put('/:id', protect, updateLog);

module.exports = router;
