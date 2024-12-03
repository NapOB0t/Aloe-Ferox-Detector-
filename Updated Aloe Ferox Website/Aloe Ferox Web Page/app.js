const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session'); // Import express-session
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL;

// Connect to MongoDB
const connectdb = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};
connectdb();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from the public directory
app.use(cors());

// Session middleware
app.use(session({
    secret: '53342', // Secure random key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Import Routes
const authRoutes = require('./routes/authRoutes.js');
const messageRoutes = require('./routes/messageRoutes'); // Import message routes

// Use Routes
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});