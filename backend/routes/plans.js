const express = require('express');
const router = express.Router();
const {
  getPlans,
  getPlan,
  activatePlan
} = require('../controllers/planController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPlans);
router.get('/:id', protect, getPlan);
router.put('/:id/activate', protect, activatePlan);

module.exports = router;
