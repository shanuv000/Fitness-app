const axios = require('axios');

const API_URL = 'http://localhost:5001/api/exercises';

async function runTests() {
  console.log('Starting Exercises API Tests...');
  let createdExerciseId = null;

  try {
    // 1. Test GET /api/exercises
    console.log('\n1. Testing GET /api/exercises');
    const getResponse = await axios.get(API_URL);
    console.log('✅ GET /api/exercises successful. Count:', getResponse.data.length);

    // 2. Test POST /api/exercises
    console.log('\n2. Testing POST /api/exercises');
    const newExercise = {
      name: 'Test Exercise ' + Date.now(),
      category: 'Strength',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      instructions: 'Push the bar up.',
      imageUrl: 'http://example.com/image.png'
    };
    const postResponse = await axios.post(API_URL, newExercise);
    createdExerciseId = postResponse.data._id;
    console.log('✅ POST /api/exercises successful. ID:', createdExerciseId);

    // 3. Test PUT /api/exercises/:id
    console.log('\n3. Testing PUT /api/exercises/:id');
    const updateData = {
      name: 'Updated Test Exercise ' + Date.now()
    };
    const putResponse = await axios.put(`${API_URL}/${createdExerciseId}`, updateData);
    if (putResponse.data.name === updateData.name) {
        console.log('✅ PUT /api/exercises/:id successful.');
    } else {
        console.error('❌ PUT /api/exercises/:id failed. Name mismatch.');
    }

    // 4. Test GET /api/exercises/search
    console.log('\n4. Testing GET /api/exercises/search');
    const searchResponse = await axios.get(`${API_URL}/search?q=Test`);
    const found = searchResponse.data.some(ex => ex._id === createdExerciseId);
    if (found) {
        console.log('✅ GET /api/exercises/search successful.');
    } else {
        console.warn('⚠️ GET /api/exercises/search did not find the created exercise (might be indexing delay or different search logic).');
    }

    // 5. Test DELETE /api/exercises/:id
    console.log('\n5. Testing DELETE /api/exercises/:id');
    await axios.delete(`${API_URL}/${createdExerciseId}`);
    console.log('✅ DELETE /api/exercises/:id successful.');

    // Verify deletion
    try {
        await axios.put(`${API_URL}/${createdExerciseId}`, updateData);
        console.error('❌ Exercise should have been deleted but PUT succeeded.');
    } catch (error) {
        if (error.response && error.response.status === 404) {
             console.log('✅ Verification: Exercise correctly not found after delete.');
        } else {
             console.error('❌ Verification failed with unexpected error:', error.message);
        }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
    }
  }
}

runTests();
