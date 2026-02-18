const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');

dotenv.config();

const subjects = [
    // 1st Year - Semester 1
    { name: 'C Programming Lab', year: '1st', semester: 1 },
    { name: 'Engineering Physics Lab', year: '1st', semester: 1 },
    { name: 'Basic Electrical Engineering Lab', year: '1st', semester: 1 },
    { name: 'Engineering Graphics & Design', year: '1st', semester: 1 },

    // 1st Year - Semester 2
    { name: 'Advanced C Programming Lab', year: '1st', semester: 2 },
    { name: 'Engineering Chemistry Lab', year: '1st', semester: 2 },
    { name: 'Basic Mechanical Engineering Lab', year: '1st', semester: 2 },
    { name: 'Digital Fabrication / Workshop', year: '1st', semester: 2 },

    // 2nd Year - Semester 3
    { name: 'C++ Programming Lab', year: '2nd', semester: 3 },
    { name: 'Data Structures Lab (using C++)', year: '2nd', semester: 3 },
    { name: 'Digital Electronics Lab', year: '2nd', semester: 3 },
    { name: 'Computer Organization', year: '2nd', semester: 3 },

    // 2nd Year - Semester 4
    { name: 'Python Programming Lab', year: '2nd', semester: 4 },
    { name: 'Database Management Systems (DBMS) Lab', year: '2nd', semester: 4 },
    { name: 'Operating Systems Lab', year: '2nd', semester: 4 },
    { name: 'Analysis & Design of Algorithms', year: '2nd', semester: 4 },

    // 3rd Year - Semester 5
    { name: 'Java Programming Lab', year: '3rd', semester: 5 },
    { name: 'Web Technology Lab (MERN)', year: '3rd', semester: 5 },
    { name: 'Software Engineering Lab', year: '3rd', semester: 5 },
    { name: 'Microprocessor Lab', year: '3rd', semester: 5 },

    // 3rd Year - Semester 6
    { name: 'Machine Learning Lab', year: '3rd', semester: 6 },
    { name: 'Computer Networks Lab', year: '3rd', semester: 6 },
    { name: 'Compiler Design Lab', year: '3rd', semester: 6 },
    { name: 'Minor Project', year: '3rd', semester: 6 },

    // 4th Year - Semester 7
    { name: 'Cloud Computing Lab', year: '4th', semester: 7 },
    { name: 'Data Analytics Lab', year: '4th', semester: 7 },
    { name: 'Information Security Lab', year: '4th', semester: 7 },
    { name: 'Major Project Phase-1', year: '4th', semester: 7 },

    // 4th Year - Semester 8
    { name: 'Major Project Phase-2', year: '4th', semester: 8 },
    { name: 'Internet of Things (IoT) Lab', year: '4th', semester: 8 },
    { name: 'Industrial Training Viva', year: '4th', semester: 8 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log('Connected to MongoDB');

        // Clear existing subjects to avoid duplicates (Optional: remove if you want to keep existing)
        await Subject.deleteMany({});
        console.log('Existing subjects cleared');

        await Subject.insertMany(subjects);
        console.log('Database seeded successfully with B.Tech subjects');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
