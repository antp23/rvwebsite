const Plan = require('../models/Plan');
const Phase = require('../models/Phase');
const Week = require('../models/Week');
const DayTemplate = require('../models/DayTemplate');
const User = require('../models/User');

// @desc    Get all plans for user
// @route   GET /api/plans
// @access  Private
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single plan with all details
// @route   GET /api/plans/:id
// @access  Private
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check ownership
    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this plan'
      });
    }

    // Get phases with weeks and day templates
    const phases = await Phase.find({ plan: plan._id }).sort('number');

    const phasesWithDetails = await Promise.all(
      phases.map(async (phase) => {
        const weeks = await Week.find({ phase: phase._id }).sort('number');

        const weeksWithDays = await Promise.all(
          weeks.map(async (week) => {
            const days = await DayTemplate.find({ week: week._id })
              .sort('dayNumber')
              .populate('routineTemplate');

            return {
              ...week.toObject(),
              days
            };
          })
        );

        return {
          ...phase.toObject(),
          weeks: weeksWithDays
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        ...plan.toObject(),
        phases: phasesWithDetails
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

// @desc    Set active plan for user
// @route   PUT /api/plans/:id/activate
// @access  Private
exports.activatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check ownership
    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this plan'
      });
    }

    // Update user's active plan
    await User.findByIdAndUpdate(req.user._id, { activePlan: plan._id });

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
