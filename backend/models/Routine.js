const mongoose = require('mongoose');

const RoutineExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  targetSets: { type: Number, required: true },
  targetReps: { type: String, required: true }, // String to allow ranges like "8-12"
  restTime: { type: Number }, // in seconds
});

const RoutineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // e.g., "Push Day"
  description: { type: String },
  exercises: [RoutineExerciseSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Routine', RoutineSchema);
