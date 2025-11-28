const axios = require('axios');
require('dotenv').config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const BASE_URL = 'https://exercisedb-api1.p.rapidapi.com/api/v1';

const exerciseDb = {
  search: async (query) => {
    if (!RAPIDAPI_KEY) {
      console.warn('RAPIDAPI_KEY is not set');
      return [];
    }

    try {
      const response = await axios.get(`${BASE_URL}/exercises`, {
        params: { name: query, limit: 10 },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb-api1.p.rapidapi.com'
        }
      });
      
      return response.data.data || [];
    } catch (error) {
      console.error('ExerciseDB Search Error:', error.message);
      return [];
    }
  }
};

module.exports = exerciseDb;
