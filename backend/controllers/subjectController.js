const Subject = require('../models/Subject');

// @desc    Get all subjects or filter by year/semester
// @route   GET /api/subjects
// @access  Public (or Protected)
const getSubjects = async (req, res) => {
    const { year, semester } = req.query;
    console.log('--- Get Subjects Request ---');
    console.log('Query Params:', req.query);

    let query = {};

    if (year) query.year = year;
    if (semester) query.semester = parseInt(semester); // Explicitly cast to number

    console.log('Mongo Query:', query);

    try {
        const subjects = await Subject.find(query);
        console.log(`Found ${subjects.length} subjects`);
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Admin
const createSubject = async (req, res) => {
    const { name, year, semester } = req.body;

    try {
        const subject = new Subject({
            name,
            year,
            semester
        });

        const createdSubject = await subject.save();
        res.status(201).json(createdSubject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSubjects, createSubject };
