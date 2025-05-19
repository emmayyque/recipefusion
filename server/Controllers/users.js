const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt'); 
const isLogin = require('../middleware/verifyuser')

// POST /api/users
router.post('/add-user', async (req, res) => {
  try {
    const { username, email, phone, gender, password, role } = req.body;

    if (!username || !email || !phone || !gender || !password) {
      return res.status(400).json({});
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phone,
      gender,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all
//GET /api/users
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: error.message });
  }
});
//GET /api/users/username/:username 
router.get('/getuser/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }, '-password'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: error.message });
  }
});

//DELETE /api/users/username/:username 
router.delete('/delete-user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/update
router.put('/update-user', async (req, res) => {
  try {
    const { email, username, phone, gender, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required to update user' });
    }

    const updateFields = {};

    if (username) updateFields.username = username;
    if (phone) updateFields.phone = phone;
    if (gender) updateFields.gender = gender;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true, projection: { password: 0 } } // Return updated user, exclude password
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
