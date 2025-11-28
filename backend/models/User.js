const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profile: {
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  },
  goals: {
    targetWeight: { type: Number },
    weeklyWorkouts: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
