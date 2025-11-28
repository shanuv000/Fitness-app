const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Strength', 'Cardio', 'Flexibility', 'Balance'], 
    required: true 
  },
  muscleGroup: { 
    type: String, 
    enum: ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Abs', 'Full Body'],
    required: true
  },
  equipment: { type: String }, // e.g., "Barbell", "Dumbbell", "Machine", "Bodyweight"
  instructions: { type: String },
  imageUrl: { type: String },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
