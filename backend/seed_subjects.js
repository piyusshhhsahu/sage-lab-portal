const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');

dotenv.config();

const subjects = [
    // 1st Year - Semester 1
    { name: 'Mathematics-I', year: '1st', semester: 1 },
    { name: 'Engineering Physics', year: '1st', semester: 1 },
    { name: 'Engineering Chemistry', year: '1st', semester: 1 },
    { name: 'Programming for Problem Solving', year: '1st', semester: 1 },
    { name: 'English', year: '1st', semester: 1 },
    { name: 'Engineering Graphics', year: '1st', semester: 1 },
    { name: 'Physics Lab', year: '1st', semester: 1 },
    { name: 'Chemistry Lab', year: '1st', semester: 1 },
    { name: 'Programming Lab', year: '1st', semester: 1 },
    { name: 'English Lab', year: '1st', semester: 1 },

    // 1st Year - Semester 2
    { name: 'Mathematics-II', year: '1st', semester: 2 },
    { name: 'Discrete Mathematics', year: '1st', semester: 2 },
    { name: 'Data Structures and Algorithms', year: '1st', semester: 2 },
    { name: 'Computer Organization and Architecture', year: '1st', semester: 2 },
    { name: 'Environmental Science', year: '1st', semester: 2 },
    { name: 'Business Economics & Accountancy', year: '1st', semester: 2 },
    { name: 'Data Structures Lab', year: '1st', semester: 2 },
    { name: 'COA Lab', year: '1st', semester: 2 },

    // 2nd Year - Semester 3
    { name: 'Mathematics-III', year: '2nd', semester: 3 },
    { name: 'Design and Analysis of Algorithms', year: '2nd', semester: 3 },
    { name: 'Database Management Systems', year: '2nd', semester: 3 },
    { name: 'Operating Systems', year: '2nd', semester: 3 },
    { name: 'Theory of Computation', year: '2nd', semester: 3 },
    { name: 'Software Engineering', year: '2nd', semester: 3 },
    { name: 'DBMS Lab', year: '2nd', semester: 3 },
    { name: 'OS Lab', year: '2nd', semester: 3 },

    // 2nd Year - Semester 4
    { name: 'Compiler Design', year: '2nd', semester: 4 },
    { name: 'Computer Networks', year: '2nd', semester: 4 },
    { name: 'Web Technologies', year: '2nd', semester: 4 },
    { name: 'Artificial Intelligence', year: '2nd', semester: 4 },
    { name: 'Machine Learning', year: '2nd', semester: 4 },
    { name: 'Compiler Design Lab', year: '2nd', semester: 4 },
    { name: 'Networks Lab', year: '2nd', semester: 4 },

    // 3rd Year - Semester 5
    { name: 'Cloud Computing', year: '3rd', semester: 5 },
    { name: 'Cyber Security', year: '3rd', semester: 5 },
    { name: 'Data Analytics', year: '3rd', semester: 5 },
    { name: 'Internet of Things', year: '3rd', semester: 5 },
    { name: 'Mobile Application Development', year: '3rd', semester: 5 },
    { name: 'Cloud Computing Lab', year: '3rd', semester: 5 },
    { name: 'Cyber Security Lab', year: '3rd', semester: 5 },

    // 3rd Year - Semester 6
    { name: 'Big Data Analytics', year: '3rd', semester: 6 },
    { name: 'Blockchain Technology', year: '3rd', semester: 6 },
    { name: 'Natural Language Processing', year: '3rd', semester: 6 },
    { name: 'Computer Vision', year: '3rd', semester: 6 },
    { name: 'Minor Project', year: '3rd', semester: 6 },
    { name: 'Big Data Lab', year: '3rd', semester: 6 },

    // 4th Year - Semester 7
    { name: 'Advanced Machine Learning', year: '4th', semester: 7 },
    { name: 'Quantum Computing', year: '4th', semester: 7 },
    { name: 'Ethical Hacking', year: '4th', semester: 7 },
    { name: 'Major Project Phase-1', year: '4th', semester: 7 },
    { name: 'Internship', year: '4th', semester: 7 },

    // 4th Year - Semester 8
    { name: 'Major Project Phase-2', year: '4th', semester: 8 },
    { name: 'Seminar', year: '4th', semester: 8 },
    { name: 'Comprehensive Viva', year: '4th', semester: 8 }
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
