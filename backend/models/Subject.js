const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
        enum: ['1st', '2nd', '3rd', '4th'],
        required: true
    },
    semester: {
        type: Number,
        min: 1,
        max: 8,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
