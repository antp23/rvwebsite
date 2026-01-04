const express = require('express');
const router = express.Router();
const { exportLogs, getCalendar } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

router.get('/', protect, exportLogs);
router.get('/calendar', protect, getCalendar);

module.exports = router;
