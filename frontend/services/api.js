import { Platform } from 'react-native';

// Production API URL (Vercel)
const API_URL = 'https://fitness-app-nu-nine.vercel.app/api';

// Production API URL (Render) - Backup
// const API_URL = 'https://fitness-app-a4vr.onrender.com/api';

// Development API URL (Uncomment to use)
// const API_URL = 'http://192.168.1.5:5001/api';

export const getWorkouts = async () => {
  try {
    const response = await fetch(`${API_URL}/workouts`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};

export const createWorkout = async (workoutData) => {
  try {
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create workout');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating workout:', error);
    return { error: error.message };
  }
};

// Exercises
export const getExercises = async () => {
  try {
    const response = await fetch(`${API_URL}/exercises`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
};

export const createExercise = async (exerciseData) => {
  try {
    const response = await fetch(`${API_URL}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exerciseData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create exercise');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating exercise:', error);
    return { error: error.message };
  }
};



export const searchExercises = async (query) => {
  try {
    const response = await fetch(`${API_URL}/exercises/search?q=${query}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching exercises:', error);
    return [];
  }
};

export const importExercise = async (exerciseData) => {
  try {
    const response = await fetch(`${API_URL}/exercises/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exerciseData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import exercise');
    }
    return await response.json();
  } catch (error) {
    console.error('Error importing exercise:', error);
    return { error: error.message };
  }
};

// Routines
export const getRoutines = async () => {
  try {
    const response = await fetch(`${API_URL}/routines`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching routines:', error);
    return [];
  }
};

export const createRoutine = async (routineData) => {
  try {
    const response = await fetch(`${API_URL}/routines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routineData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating routine:', error);
    return null;
  }
};

// User Profile
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/users/profile`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};
