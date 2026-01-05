const WorkoutLog = require('../models/WorkoutLog');
const Plan = require('../models/Plan');
const Phase = require('../models/Phase');
const Week = require('../models/Week');
const DayTemplate = require('../models/DayTemplate');
const User = require('../models/User');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('activePlan');

    if (!user.activePlan) {
      return res.status(200).json({
        success: true,
        data: {
          hasActivePlan: false,
          message: 'No active plan'
        }
      });
    }

    const plan = user.activePlan;

    // Get current phase
    const currentPhase = await Phase.findOne({
      plan: plan._id,
      number: plan.currentPhase
    });

    // Calculate phase progress
    let phaseProgress = 0;
    if (currentPhase) {
      const weeks = await Week.find({ phase: currentPhase._id });
      const dayTemplateIds = [];

      for (const week of weeks) {
        const days = await DayTemplate.find({ week: week._id });
        dayTemplateIds.push(...days.map(d => d._id));
      }

      const totalDays = dayTemplateIds.length;
      const completedLogs = await WorkoutLog.countDocuments({
        user: user._id,
        dayTemplate: { $in: dayTemplateIds },
        status: { $in: ['completed', 'partial'] }
      });

      phaseProgress = totalDays > 0 ? Math.round((completedLogs / totalDays) * 100) : 0;
    }

    // Calculate current streak
    const allLogs = await WorkoutLog.find({ user: user._id }).sort({ date: -1 });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const log of allLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));

      if (dayDiff === streak && (log.status === 'completed' || log.status === 'partial')) {
        streak++;
        currentDate = new Date(logDate);
      } else if (log.status === 'skipped') {
        break;
      }
    }

    // Calculate weekly completion for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyLogs = await WorkoutLog.find({
      user: user._id,
      date: { $gte: sevenDaysAgo }
    });

    const completedThisWeek = weeklyLogs.filter(
      log => log.status === 'completed' || log.status === 'partial'
    ).length;

    const weeklyCompletion = weeklyLogs.length > 0
      ? Math.round((completedThisWeek / weeklyLogs.length) * 100)
      : 0;

    // Get recent logs (last 3)
    const recentLogs = await WorkoutLog.find({ user: user._id })
      .populate({
        path: 'dayTemplate',
        populate: {
          path: 'routineTemplate'
        }
      })
      .sort({ date: -1 })
      .limit(3);

    // Calculate average metrics (if more than 5 logs)
    const logsWithMetrics = await WorkoutLog.find({
      user: user._id,
      $or: [
        { weight: { $ne: null } },
        { energy: { $ne: null } },
        { sleep: { $ne: null } },
        { rpe: { $ne: null } }
      ]
    }).limit(30);

    let averages = null;
    if (logsWithMetrics.length >= 5) {
      const weights = logsWithMetrics.filter(l => l.weight).map(l => l.weight);
      const energies = logsWithMetrics.filter(l => l.energy).map(l => l.energy);
      const sleeps = logsWithMetrics.filter(l => l.sleep).map(l => l.sleep);
      const rpes = logsWithMetrics.filter(l => l.rpe).map(l => l.rpe);

      averages = {
        weight: weights.length ? (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1) : null,
        energy: energies.length ? (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(1) : null,
        sleep: sleeps.length ? (sleeps.reduce((a, b) => a + b, 0) / sleeps.length).toFixed(1) : null,
        rpe: rpes.length ? (rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1) : null
      };
    }

    res.status(200).json({
      success: true,
      data: {
        hasActivePlan: true,
        plan: {
          name: plan.name,
          currentPhase: currentPhase ? currentPhase.name : 'N/A'
        },
        phaseProgress,
        streak,
        weeklyCompletion,
        recentLogs,
        averages
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
