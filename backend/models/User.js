const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    enrollmentNumber: {
        type: String,
        required: function () { return this.role === 'student'; }
    },
    year: {
        type: String,
        enum: ['1st', '2nd', '3rd', '4th'],
        required: function () { return this.role === 'student'; }
    },
    semester: {
        type: Number,
        min: 1,
        max: 8,
        required: function () { return this.role === 'student'; }
    }
}, { timestamps: true });

// Hash password before saving
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
