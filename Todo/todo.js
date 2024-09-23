// todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);