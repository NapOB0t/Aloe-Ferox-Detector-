// routes/messageRoutes.js
const express = require('express');
const UserMessage = require('../models/userMessage');
const router = express.Router();

// POST route to submit a message
router.post('/submit-message', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Create a new user message
        const newMessage = new UserMessage({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message submitted successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Error saving message', error });
    }
});

module.exports = router;