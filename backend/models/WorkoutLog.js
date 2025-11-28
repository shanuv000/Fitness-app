const mongoose = require('mongoose');

const SetLogSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  rpe: { type: Number }, // Rate of Perceived Exertion (1-10)
});

const ExerciseLogSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: [SetLogSchema],
});

const WorkoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine' }, // Optional, if following a routine
  name: { type: String, required: true }, // e.g., "Monday Morning Lift"
  date: { type: Date, default: Date.now },
  duration: { type: Number }, // in minutes
  exercises: [ExerciseLogSchema],
  notes: { type: String },
});

module.exports = mongoose.model('WorkoutLog', WorkoutLogSchema);
