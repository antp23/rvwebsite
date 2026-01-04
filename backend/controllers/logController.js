const WorkoutLog = require('../models/WorkoutLog');
const DayTemplate = require('../models/DayTemplate');

// @desc    Create workout log
// @route   POST /api/logs
// @access  Private
exports.createLog = async (req, res) => {
  try {
    const { date, dayTemplateId, status, weight, energy, sleep, rpe, notes } = req.body;

    // Validate required fields
    if (!date || !dayTemplateId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, dayTemplateId, and status'
      });
    }

    // Check if day template exists
    const dayTemplate = await DayTemplate.findById(dayTemplateId);
    if (!dayTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Day template not found'
      });
    }

    // Check if log already exists for this date and day
    const existingLog = await WorkoutLog.findOne({
      user: req.user._id,
      date: new Date(date),
      dayTemplate: dayTemplateId
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: 'Log already exists for this date and workout'
      });
    }

    // Create log
    const log = await WorkoutLog.create({
      user: req.user._id,
      date: new Date(date),
      dayTemplate: dayTemplateId,
      status,
      weight,
      energy,
      sleep,
      rpe,
      notes
    });

    const populatedLog = await WorkoutLog.findById(log._id)
      .populate({
        path: 'dayTemplate',
        populate: {
          path: 'routineTemplate'
        }
      });

    res.status(201).json({
      success: true,
      data: populatedLog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get workout logs with filters
// @route   GET /api/logs
// @access  Private
exports.getLogs = async (req, res) => {
  try {
    const { startDate, endDate, status, page = 1, limit = 20 } = req.query;

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
        populate: [
          {
            path: 'week',
            populate: {
              path: 'phase',
              populate: 'plan'
            }
          },
          {
            path: 'routineTemplate',
            populate: 'attachment'
          }
        ]
      })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await WorkoutLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update workout log
// @route   PUT /api/logs/:id
// @access  Private
exports.updateLog = async (req, res) => {
  try {
    let log = await WorkoutLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    // Check ownership
    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this log'
      });
    }

    // Check if within 24 hours
    const hoursSinceLog = (Date.now() - log.timestamp) / (1000 * 60 * 60);
    if (hoursSinceLog > 24) {
      return res.status(403).json({
        success: false,
        message: 'Cannot edit log after 24 hours'
      });
    }

    log = await WorkoutLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'dayTemplate',
      populate: {
        path: 'routineTemplate'
      }
    });

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get today's workout
// @route   GET /api/logs/today
// @access  Private
exports.getTodayWorkout = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await WorkoutLog.findOne({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate({
      path: 'dayTemplate',
      populate: {
        path: 'routineTemplate'
      }
    });

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
