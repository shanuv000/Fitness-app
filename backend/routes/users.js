const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Helper to get default user
async function getDefaultUser() {
  let user = await User.findOne({ username: 'default_user' });
  if (!user) {
    user = new User({
      username: 'default_user',
      email: 'default@example.com',
      passwordHash: 'dummyhash',
      profile: { age: 25, weight: 70, height: 175, gender: 'Other' }
    });
    await user.save();
  }
  return user;
}

// GET user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await getDefaultUser();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update user profile
router.put('/profile', async (req, res) => {
  try {
    const user = await getDefaultUser();
    
    if (req.body.profile) {
      user.profile = { ...user.profile, ...req.body.profile };
    }
    if (req.body.goals) {
      user.goals = { ...user.goals, ...req.body.goals };
    }
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
