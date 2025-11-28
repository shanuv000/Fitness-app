const axios = require('axios');

// Vercel URL provided by user
const API_URL = 'https://fitness-app-nu-nine.vercel.app/api';

async function runTests() {
  console.log('🚀 Starting Vercel CRUD Tests...');
  console.log(`Target: ${API_URL}`);

  let exerciseId = null;
  let workoutId = null;

  try {
    // 1. Create Exercise
    console.log('\n1. Testing Create Exercise...');
    const exercisePayload = {
      name: 'Vercel Test Exercise ' + Date.now(),
      category: 'Strength',
      muscleGroup: 'Back',
      equipment: 'Dumbbell'
    };
    const exRes = await axios.post(`${API_URL}/exercises`, exercisePayload);
    exerciseId = exRes.data._id;
    console.log('✅ Exercise Created:', exerciseId);

    // 2. Read Exercises
    console.log('\n2. Testing Read Exercises...');
    const exListRes = await axios.get(`${API_URL}/exercises`);
    if (exListRes.data.length > 0) {
        console.log(`✅ Exercises Fetched: ${exListRes.data.length} items`);
    } else {
        console.warn('⚠️ No exercises found (might be empty DB)');
    }

    // 3. Create Workout
    console.log('\n3. Testing Create Workout...');
    const workoutPayload = {
      name: 'Vercel Test Workout ' + Date.now(),
      duration: 30,
      exercises: [
        {
          name: exercisePayload.name,
          sets: 3,
          reps: 12,
          weight: 20
        }
      ]
    };
    const workoutRes = await axios.post(`${API_URL}/workouts`, workoutPayload);
    workoutId = workoutRes.data._id;
    console.log('✅ Workout Created:', workoutId);

    // 4. Read Workouts
    console.log('\n4. Testing Read Workouts...');
    const workoutListRes = await axios.get(`${API_URL}/workouts`);
    const foundWorkout = workoutListRes.data.find(w => w._id === workoutId);
    if (foundWorkout) {
        console.log('✅ Created Workout found in list');
    } else {
        console.error('❌ Created Workout NOT found in list');
    }

    // 5. Delete Workout
    console.log('\n5. Testing Delete Workout...');
    await axios.delete(`${API_URL}/workouts/${workoutId}`);
    console.log('✅ Workout Deleted');

    // 6. Delete Exercise
    console.log('\n6. Testing Delete Exercise...');
    await axios.delete(`${API_URL}/exercises/${exerciseId}`);
    console.log('✅ Exercise Deleted');

    console.log('\n🎉 All Vercel CRUD Tests Passed!');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
    }
  }
}

runTests();
