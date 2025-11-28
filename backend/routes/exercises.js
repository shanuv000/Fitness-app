const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// GET all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new exercise
router.post('/', async (req, res) => {
  const exercise = new Exercise({
    name: req.body.name,
    category: req.body.category,
    muscleGroup: req.body.muscleGroup,
    equipment: req.body.equipment,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl
  });

  try {
    const newExercise = await exercise.save();
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update an exercise
router.put('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an exercise
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
    res.json({ message: 'Exercise deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const exerciseDb = require('../services/exerciseDb');

// GET search exercises (Local + External)
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  try {
    // 1. Search Local
    const localExercises = await Exercise.find({ 
      name: { $regex: query, $options: 'i' } 
    }).limit(5);

    // 2. Search External
    const externalExercises = await exerciseDb.search(query);

    // 3. Combine (mark source)
    const results = [
      ...localExercises.map(ex => ({ ...ex.toObject(), source: 'local' })),
      ...externalExercises.map(ex => ({
        id: ex.exerciseId,
        name: ex.name,
        category: ex.bodyParts ? ex.bodyParts[0] : 'Other',
        muscleGroup: ex.targetMuscles && ex.targetMuscles.length > 0 ? ex.targetMuscles[0] : 'Full Body',
        equipment: ex.equipments ? ex.equipments[0] : 'None',
        imageUrl: ex.imageUrl, // Changed from gifUrl
        instructions: ex.instructions ? ex.instructions.join(' ') : '',
        source: 'external'
      }))
    ];

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper to map external values to valid enums
const mapCategory = (externalCategory) => {
  const validCategories = ['Strength', 'Cardio', 'Flexibility', 'Balance'];
  const upperCat = externalCategory ? externalCategory.toUpperCase() : '';
  
  if (upperCat.includes('CARDIO')) return 'Cardio';
  if (upperCat.includes('STRENGTH') || upperCat.includes('POWER') || upperCat.includes('OLYMPIC')) return 'Strength';
  if (upperCat.includes('PLYOMETRICS')) return 'Cardio';
  if (upperCat.includes('STRETCHING')) return 'Flexibility';
  return 'Strength'; // Default
};

const mapMuscleGroup = (externalMuscle) => {
  const validGroups = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Abs', 'Full Body'];
  const upperMuscle = externalMuscle ? externalMuscle.toUpperCase() : '';

  if (upperMuscle.includes('CHEST') || upperMuscle.includes('PECTORALIS')) return 'Chest';
  if (upperMuscle.includes('BACK') || upperMuscle.includes('LATS') || upperMuscle.includes('TRAPEZIUS')) return 'Back';
  if (upperMuscle.includes('LEG') || upperMuscle.includes('QUAD') || upperMuscle.includes('CALF') || upperMuscle.includes('GLUTE') || upperMuscle.includes('HAMSTRING')) return 'Legs';
  if (upperMuscle.includes('ARM') || upperMuscle.includes('BICEP') || upperMuscle.includes('TRICEP') || upperMuscle.includes('FOREARM')) return 'Arms';
  if (upperMuscle.includes('SHOULDER') || upperMuscle.includes('DELTOID')) return 'Shoulders';
  if (upperMuscle.includes('ABS') || upperMuscle.includes('ABDOMINAL')) return 'Abs';
  return 'Full Body'; // Default
};

// POST import exercise
router.post('/import', async (req, res) => {
  try {
    // Check if already exists
    let exercise = await Exercise.findOne({ name: req.body.name });
    if (exercise) return res.json(exercise);

    // Create new with mapped values
    exercise = new Exercise({
      name: req.body.name,
      category: mapCategory(req.body.category),
      muscleGroup: mapMuscleGroup(req.body.muscleGroup),
      equipment: req.body.equipment || 'None',
      instructions: req.body.instructions,
      imageUrl: req.body.imageUrl
    });

    const newExercise = await exercise.save();
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
