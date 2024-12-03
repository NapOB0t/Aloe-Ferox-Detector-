// Database table for messages from home page
const mongoose = require('mongoose');

const userMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    dateSubmitted: { type: Date, default: Date.now },
});

const UserMessage = mongoose.model('UserMessage', userMessageSchema);
module.exports = UserMessage;