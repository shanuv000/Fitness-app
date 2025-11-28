const express = require('express');
const router = express.Router();
const WorkoutLog = require('../models/WorkoutLog');
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// Helper to get or create a default user
async function getDefaultUser() {
  let user = await User.findOne({ username: 'default_user' });
  if (!user) {
    user = new User({
      username: 'default_user',
      email: 'default@example.com',
      passwordHash: 'dummyhash',
      profile: { age: 25, weight: 70, height: 175, gender: 'Other' }
    });
    await user.save();
  }
  return user;
}

// Helper to get or create exercise by name
async function getExerciseId(name) {
  let exercise = await Exercise.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (!exercise) {
    exercise = new Exercise({
      name: name,
      category: 'Strength', // Default
      muscleGroup: 'Full Body' // Default
    });
    await exercise.save();
  }
  return exercise._id;
}

// GET all workouts
router.get('/', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const workouts = await WorkoutLog.find({ user: user._id })
      .populate('exercises.exercise')
      .sort({ date: -1 });
    
    // Transform for frontend compatibility if needed, or frontend adapts to new structure
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific workout
router.get('/:id', async (req, res) => {
  try {
    const workout = await WorkoutLog.findById(req.params.id).populate('exercises.exercise');
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new workout
router.post('/', async (req, res) => {
  try {
    const user = await getDefaultUser();
    
    // Process exercises to get ObjectIds
    const processedExercises = await Promise.all(req.body.exercises.map(async (ex) => {
      const exerciseId = await getExerciseId(ex.name);
      return {
        exercise: exerciseId,
        sets: [{
          setNumber: 1, // Simplified for now, assuming 1 set summary or mapping multiple sets
          reps: ex.reps,
          weight: ex.weight
        }]
      };
    }));

    // If the frontend sends multiple sets as separate entries, we might need better logic.
    // For now, let's assume the frontend sends a summary or we map it simply.
    // Actually, the frontend sends: { name, sets, reps, weight }
    // The new schema expects: { exercise: ObjectId, sets: [{ setNumber, reps, weight }] }
    
    // Let's refine the mapping:
    const exercisesMap = new Map();
    
    for (const ex of req.body.exercises) {
      const exerciseId = await getExerciseId(ex.name);
      const exIdStr = exerciseId.toString();
      
      if (!exercisesMap.has(exIdStr)) {
        exercisesMap.set(exIdStr, {
          exercise: exerciseId,
          sets: []
        });
      }
      
      const entry = exercisesMap.get(exIdStr);
      // The frontend sends "sets" as a number (e.g. 3 sets of 10 reps).
      // We should create 3 set logs.
      const numSets = parseInt(ex.sets) || 1;
      for (let i = 0; i < numSets; i++) {
        entry.sets.push({
          setNumber: entry.sets.length + 1,
          reps: parseInt(ex.reps) || 0,
          weight: parseFloat(ex.weight) || 0
        });
      }
    }

    const workoutLog = new WorkoutLog({
      user: user._id,
      routine: req.body.routineId || null, // Link to routine if provided
      name: req.body.name,
      date: req.body.date,
      duration: req.body.duration,
      exercises: Array.from(exercisesMap.values()),
      notes: req.body.notes
    });

    const newWorkout = await workoutLog.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a workout
router.delete('/:id', async (req, res) => {
  try {
    const workout = await WorkoutLog.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
