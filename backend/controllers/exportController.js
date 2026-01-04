const WorkoutLog = require('../models/WorkoutLog');

// @desc    Export workout logs as CSV
// @route   GET /api/export
// @access  Private
exports.exportLogs = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    const query = { user: req.user._id };

    // Apply filters
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (status) {
      query.status = status;
    }

    const logs = await WorkoutLog.find(query)
      .populate({
        path: 'dayTemplate',
        populate: {
          path: 'week',
          populate: {
            path: 'phase',
            select: 'name number'
          }
        }
      })
      .sort({ date: -1 });

    // Generate CSV
    const csvHeaders = 'Date,Phase,Week,Day,Status,Weight,Energy,Sleep,RPE,Notes\n';

    const csvRows = logs.map(log => {
      const phase = log.dayTemplate?.week?.phase?.name || 'N/A';
      const week = log.dayTemplate?.week?.number || 'N/A';
      const day = log.dayTemplate?.dayNumber || 'N/A';

      return [
        new Date(log.date).toISOString().split('T')[0],
        phase,
        week,
        day,
        log.status,
        log.weight || '',
        log.energy || '',
        log.sleep || '',
        log.rpe || '',
        `"${(log.notes || '').replace(/"/g, '""')}"` // Escape quotes in notes
      ].join(',');
    }).join('\n');

    const csv = csvHeaders + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=workout-logs.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get calendar data (heatmap)
// @route   GET /api/calendar
// @access  Private
exports.getCalendar = async (req, res) => {
  try {
    const { year, month } = req.query;

    let startDate, endDate;

    if (year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const logs = await WorkoutLog.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
      .populate({
        path: 'dayTemplate',
        populate: {
          path: 'routineTemplate'
        }
      })
      .sort({ date: 1 });

    // Group logs by date
    const calendarData = logs.reduce((acc, log) => {
      const dateKey = new Date(log.date).toISOString().split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push({
        id: log._id,
        status: log.status,
        dayTemplate: log.dayTemplate,
        notes: log.notes
      });

      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: calendarData,
      startDate,
      endDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
