const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userInfo'); // Ensure this path is correct
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/User_Images'); // Set destination to your images folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add a timestamp to the filename
    }
});

const upload = multer({ storage });

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check for missing fields
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Email, username, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            username,
            hashedPassword,
            dateCreated: new Date(),
            profileImage: 'User_Images/default.png',
            darkMode: false, // Default dark mode setting
        });

        await newUser.save();

        // Store user ID in session for later use
        req.session.userId = newUser._id;

        // Return user data and redirect URL
        return res.status(200).json({
            redirectUrl: '/Main.html',
            userData: {
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage,
                darkMode: newUser.darkMode,
            },
        });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error creating user', error: error.message || error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Store user ID in session
        req.session.userId = user._id; // Should work if session middleware is set up
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Settings Route
router.get('/user', async (req, res) => {
    try {
        // Ensure the user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            dateJoined: user.dateCreated.toLocaleDateString(), // Format the date as needed
            profileImage: user.profileImage,
            darkMode: user.darkMode,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});

// Route to update the user's profile image
router.patch('/update-profile-image', async (req, res) => {
    const { profileImage } = req.body;
    const userId = req.session.userId; // Assuming you are storing the user's session

    try {
        // Find the user by ID and update their profile image
        const updatedUser = await User.findByIdAndUpdate(userId, { profileImage }, { new: true });
        if (updatedUser) {
            return res.status(200).json({ message: 'Profile image updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating profile image:', error);
        return res.status(500).json({ message: 'Error updating profile image', error });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out', err });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});

// PATCH request to update user email
router.patch('/update-email', async (req, res) => {
    const { email } = req.body;
    const userId = req.session.userId; // Assuming user ID is stored in session

    try {
        await User.findByIdAndUpdate(userId, { email });
        res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating email', error });
    }
});

// PATCH request to update dark mode preference
router.patch('/update-dark-mode', async (req, res) => {
    const { darkMode } = req.body;
    const userId = req.session.userId; // Use user ID stored in session

    try {
        // Update the user's dark mode preference in the database
        await User.findByIdAndUpdate(userId, { darkMode });
        res.status(200).json({ message: 'Dark mode preference updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating dark mode preference', error });
    }
});

// DELETE request to delete user account
router.delete('/delete-account', async (req, res) => {
    const userId = req.session.userId;

    try {
        await User.findByIdAndDelete(userId);
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Error logging out', err });
            }
            res.status(200).json({ message: 'Account deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
});

// Export the router
module.exports = router;