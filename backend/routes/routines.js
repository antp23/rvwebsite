const express = require('express');
const router = express.Router();
const {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  upload
} = require('../controllers/routineController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRoutines);
router.post('/', protect, upload.single('attachment'), createRoutine);
router.put('/:id', protect, updateRoutine);
router.delete('/:id', protect, deleteRoutine);

module.exports = router;
