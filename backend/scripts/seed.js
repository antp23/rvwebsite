const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Phase = require('../models/Phase');
const Week = require('../models/Week');
const DayTemplate = require('../models/DayTemplate');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Plan.deleteMany();
    await Phase.deleteMany();
    await Week.deleteMany();
    await DayTemplate.deleteMany();

    console.log('Cleared existing data...');

    // Create users
    const anthony = await User.create({
      username: 'anthony',
      password: 'password123'
    });

    const sakshee = await User.create({
      username: 'sakshee',
      password: 'password123'
    });

    console.log('Created users...');

    // Create Anthony's strength-focused plan
    const anthonyPlan = await Plan.create({
      name: 'Strength Training Program',
      user: anthony._id,
      startDate: new Date(),
      currentPhase: 1
    });

    // Phase 1: Foundation (4 weeks)
    const anthonyPhase1 = await Phase.create({
      plan: anthonyPlan._id,
      number: 1,
      name: 'Foundation Phase',
      weeksCount: 4
    });

    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const week = await Week.create({
        phase: anthonyPhase1._id,
        number: weekNum,
        isDeload: false
      });

      // Create 5 training days per week
      const exercises = [
        [
          { movement: 'Squat', sets: '3', reps: '8-10' },
          { movement: 'Bench Press', sets: '3', reps: '8-10' },
          { movement: 'Rows', sets: '3', reps: '10-12' }
        ],
        [
          { movement: 'Deadlift', sets: '3', reps: '5-8' },
          { movement: 'Overhead Press', sets: '3', reps: '8-10' },
          { movement: 'Pull-ups', sets: '3', reps: 'AMRAP' }
        ],
        [
          { movement: 'Squat', sets: '4', reps: '6-8' },
          { movement: 'Incline Press', sets: '3', reps: '8-10' },
          { movement: 'Face Pulls', sets: '3', reps: '12-15' }
        ],
        [
          { movement: 'Romanian Deadlift', sets: '3', reps: '8-10' },
          { movement: 'Dips', sets: '3', reps: '8-12' },
          { movement: 'Lat Pulldowns', sets: '3', reps: '10-12' }
        ],
        [
          { movement: 'Front Squat', sets: '3', reps: '8-10' },
          { movement: 'Push Press', sets: '3', reps: '6-8' },
          { movement: 'Farmers Walk', sets: '3', reps: '30s' }
        ]
      ];

      for (let day = 1; day <= 5; day++) {
        await DayTemplate.create({
          week: week._id,
          dayNumber: day,
          type: 'structured',
          structuredExercises: exercises[day - 1]
        });
      }
    }

    // Phase 2: Strength Building (4 weeks)
    const anthonyPhase2 = await Phase.create({
      plan: anthonyPlan._id,
      number: 2,
      name: 'Strength Building Phase',
      weeksCount: 4
    });

    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const week = await Week.create({
        phase: anthonyPhase2._id,
        number: weekNum,
        isDeload: weekNum === 4 // Week 4 is deload
      });

      const exercises = weekNum === 4
        ? [
            [
              { movement: 'Squat', sets: '2', reps: '8' },
              { movement: 'Bench Press', sets: '2', reps: '8' }
            ],
            [
              { movement: 'Deadlift', sets: '2', reps: '5' },
              { movement: 'Overhead Press', sets: '2', reps: '8' }
            ],
            [
              { movement: 'Mobility Work', sets: '3', reps: '10 min' }
            ]
          ]
        : [
            [
              { movement: 'Squat', sets: '4', reps: '5' },
              { movement: 'Bench Press', sets: '4', reps: '5' },
              { movement: 'Rows', sets: '4', reps: '8' }
            ],
            [
              { movement: 'Deadlift', sets: '4', reps: '3-5' },
              { movement: 'Overhead Press', sets: '4', reps: '5' },
              { movement: 'Pull-ups', sets: '4', reps: 'AMRAP' }
            ],
            [
              { movement: 'Squat', sets: '5', reps: '3' },
              { movement: 'Incline Press', sets: '4', reps: '6' },
              { movement: 'Chin-ups', sets: '4', reps: 'AMRAP' }
            ]
          ];

      for (let day = 1; day <= exercises.length; day++) {
        await DayTemplate.create({
          week: week._id,
          dayNumber: day,
          type: 'structured',
          structuredExercises: exercises[day - 1]
        });
      }
    }

    // Update Anthony's active plan
    anthony.activePlan = anthonyPlan._id;
    await anthony.save();

    console.log('Created Anthony\'s plan...');

    // Create Sakshee's balanced plan
    const saksheePlan = await Plan.create({
      name: 'Balanced Fitness Program',
      user: sakshee._id,
      startDate: new Date(),
      currentPhase: 1
    });

    // Phase 1: Base Building (4 weeks)
    const saksheePhase1 = await Phase.create({
      plan: saksheePlan._id,
      number: 1,
      name: 'Base Building Phase',
      weeksCount: 4
    });

    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const week = await Week.create({
        phase: saksheePhase1._id,
        number: weekNum,
        isDeload: false
      });

      const exercises = [
        [
          { movement: 'Bodyweight Squats', sets: '3', reps: '12-15' },
          { movement: 'Push-ups', sets: '3', reps: '8-12' },
          { movement: 'Walking Lunges', sets: '3', reps: '10/leg' }
        ],
        [
          { movement: 'Cardio - Running/Cycling', sets: '1', reps: '20-30 min' },
          { movement: 'Core Work', sets: '3', reps: '12-15' }
        ],
        [
          { movement: 'Goblet Squats', sets: '3', reps: '10-12' },
          { movement: 'Dumbbell Press', sets: '3', reps: '10-12' },
          { movement: 'Rows', sets: '3', reps: '10-12' }
        ],
        [
          { movement: 'Yoga/Mobility', sets: '1', reps: '30-40 min' }
        ],
        [
          { movement: 'Full Body Circuit', sets: '3', reps: '12-15' },
          { movement: 'Plank Variations', sets: '3', reps: '30-45s' }
        ]
      ];

      for (let day = 1; day <= 5; day++) {
        await DayTemplate.create({
          week: week._id,
          dayNumber: day,
          type: 'structured',
          structuredExercises: exercises[day - 1]
        });
      }
    }

    // Update Sakshee's active plan
    sakshee.activePlan = saksheePlan._id;
    await sakshee.save();

    console.log('Created Sakshee\'s plan...');

    console.log('✅ Database seeded successfully!');
    console.log('Login credentials:');
    console.log('  Anthony - username: anthony, password: password123');
    console.log('  Sakshee - username: sakshee, password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
