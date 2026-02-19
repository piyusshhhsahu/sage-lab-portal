const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Make uploads folder static
app.use('/uploads', express.static('uploads'));

// Basic Route
app.get('/', (req, res) => {
    res.send('SAGE Lab Manual Submission Portal API is running...');
});

// Database Connection and Server Start
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        console.log('Attempting to connect to MongoDB at:', process.env.MONGO_URI);
        // Force IPv4, disable buffering, and enable debug logs
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB Connected');
        console.log('Connection State:', mongoose.connection.readyState);
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
    }
};

// Connect to DB immediately
connectDB();

// Monitor connection events
mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Export the app for Vercel
module.exports = app;

// Only listen if running directly (dev mode)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
