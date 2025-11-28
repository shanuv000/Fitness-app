const axios = require('axios');

const API_URL = 'http://localhost:5001/api/routines';

async function runTests() {
  console.log('Starting Routines API Tests...');
  let createdRoutineId = null;

  try {
    // 1. Test GET /api/routines
    console.log('\n1. Testing GET /api/routines');
    const getResponse = await axios.get(API_URL);
    console.log('✅ GET /api/routines successful. Count:', getResponse.data.length);

    // 2. Test POST /api/routines
    console.log('\n2. Testing POST /api/routines');
    const newRoutine = {
      name: 'Test Routine ' + Date.now(),
      description: 'A test routine description',
      exercises: [] 
    };
    const postResponse = await axios.post(API_URL, newRoutine);
    createdRoutineId = postResponse.data._id;
    console.log('✅ POST /api/routines successful. ID:', createdRoutineId);

    // 3. Test GET /api/routines/:id
    console.log('\n3. Testing GET /api/routines/:id');
    const getOneResponse = await axios.get(`${API_URL}/${createdRoutineId}`);
    if (getOneResponse.data.name === newRoutine.name) {
        console.log('✅ GET /api/routines/:id successful.');
    } else {
        console.error('❌ GET /api/routines/:id failed. Name mismatch.');
    }

    // 4. Test PUT /api/routines/:id
    console.log('\n4. Testing PUT /api/routines/:id');
    const updateData = {
      name: 'Updated Test Routine ' + Date.now()
    };
    const putResponse = await axios.put(`${API_URL}/${createdRoutineId}`, updateData);
    if (putResponse.data.name === updateData.name) {
        console.log('✅ PUT /api/routines/:id successful.');
    } else {
        console.error('❌ PUT /api/routines/:id failed. Name mismatch.');
    }

    // 5. Test DELETE /api/routines/:id
    console.log('\n5. Testing DELETE /api/routines/:id');
    await axios.delete(`${API_URL}/${createdRoutineId}`);
    console.log('✅ DELETE /api/routines/:id successful.');

    // Verify deletion
    try {
        await axios.get(`${API_URL}/${createdRoutineId}`);
        console.error('❌ Routine should have been deleted but GET succeeded.');
    } catch (error) {
        if (error.response && error.response.status === 404) {
             console.log('✅ Verification: Routine correctly not found after delete.');
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
