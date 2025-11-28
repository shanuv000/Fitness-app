const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');
const routineRoutes = require('./routes/routines');
const userRoutes = require('./routes/users');

app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Fitness App API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
