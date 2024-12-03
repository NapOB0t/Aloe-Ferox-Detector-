const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 50,
    },
    hashedPassword: {
        type: String,
        required: true,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
    },
    profileImage: {
        type: String,
        default: 'User_Images/default.png', // Default user profile image
    },
    darkMode: {
        type: Boolean,
        default: false, // Default value for dark mode
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the UserInfo model
module.exports = mongoose.model('UserInfo', userInfoSchema);