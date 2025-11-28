const axios = require('axios');

const API_URL = 'http://localhost:5001/api/workouts';

async function runTest() {
  console.log('Testing Workout Creation...');

  const payload = {
    name: 'Debug Workout ' + Date.now(),
    duration: 60,
    exercises: [
      {
        name: 'Bench Press',
        sets: 3,
        reps: 10,
        weight: 100
      },
      {
        name: 'Squat',
        sets: 3,
        reps: 8,
        weight: 135
      }
    ]
  };

  try {
    const response = await axios.post(API_URL, payload);
    console.log('✅ Workout created successfully:', response.data._id);
    // console.log('Exercises:', JSON.stringify(response.data.exercises, null, 2));
  } catch (error) {
    console.error('❌ Workout creation failed:', error.message);
    if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
    }
  }
}

runTest();
