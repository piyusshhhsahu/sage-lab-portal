const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
        });
        console.log('MongoDB Connected');

        // Check if test user exists
        const testEmail = 'demo_student@sage.ac.in';
        const userExists = await User.findOne({ email: testEmail });

        if (userExists) {
            console.log('Test user already exists. Removing...');
            await User.deleteOne({ email: testEmail });
        }

        const user = await User.create({
            name: 'Demo Student',
            email: testEmail,
            password: 'password123',
            role: 'student',
            enrollmentNumber: 'SAGE12345',
            year: '3rd',
            semester: '5'
        });

        console.log('Test User Created:');
        console.log('Email:', user.email);
        console.log('Password: password123');
        console.log('Role:', user.role);

        const adminEmail = 'demo_faculty@sage.ac.in';
        const adminExists = await User.findOne({ email: adminEmail });
        if (adminExists) {
            await User.deleteOne({ email: adminEmail });
        }

        const admin = await User.create({
            name: 'Demo Faculty',
            email: adminEmail,
            password: 'admin123',
            role: 'admin'
        });

        console.log('Test Faculty Created:');
        console.log('Email:', admin.email);
        console.log('Password: admin123');
        console.log('Role:', admin.role);

        process.exit();
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
