const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Ensure uploads directory exists for multer
const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const router = express.Router();
router.use('/auth', require('./routes/authRoutes'));
router.use('/subjects', require('./routes/subjectRoutes'));
router.use('/submissions', require('./routes/submissionRoutes'));

// Health Check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        dbState: mongoose.connection.readyState,
        env: {
            mongo: !!process.env.MONGO_URI
        }
    });
});

// Mount router at both /api and root to handle Vercel rewrites robustly
app.use('/api', router);
app.use('/', router);

// Make uploads folder static
const uploadsPath = process.env.VERCEL ? '/tmp/uploads' : 'uploads';
app.use('/uploads', express.static(uploadsPath));

// Basic Route
app.get('/', (req, res) => {
    res.send('SAGE Lab Manual Submission Portal API is running...');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        dbState: mongoose.connection.readyState,
        env: {
            mongo: !!process.env.MONGO_URI
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    const statusCode = err.status || (err.name === 'MulterError' ? 400 : 500);
    res.status(statusCode).json({
        message: err.message || 'Unexpected server error',
    });
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
