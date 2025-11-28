const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');
const User = require('../models/User');

// Helper to get default user (same as in workouts.js)
async function getDefaultUser() {
  let user = await User.findOne({ username: 'default_user' });
  if (!user) {
    // Should exist by now, but just in case
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

// GET all routines for the user
router.get('/', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const routines = await Routine.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(routines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific routine
router.get('/:id', async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id).populate('exercises.exercise');
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    res.json(routine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new routine
router.post('/', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const routine = new Routine({
      user: user._id,
      name: req.body.name,
      description: req.body.description,
      exercises: req.body.exercises // Expecting array of { exercise: ObjectId, targetSets, targetReps, restTime }
    });

    const newRoutine = await routine.save();
    res.status(201).json(newRoutine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a routine
router.put('/:id', async (req, res) => {
  try {
    const routine = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    res.json(routine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a routine
router.delete('/:id', async (req, res) => {
  try {
    const routine = await Routine.findByIdAndDelete(req.params.id);
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    res.json({ message: 'Routine deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
