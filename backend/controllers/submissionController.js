const Submission = require('../models/Submission');

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Student
const createSubmission = async (req, res) => {
    const { subject, experimentNumber, title } = req.body;

    // File upload is handled by Multer middleware, file path in req.file.path
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    // Convert backslashes to forward slashes and make it a relative URL
    const fileUrl = `/uploads/${req.file.filename}`;

    try {
        const submission = new Submission({
            student: req.user._id,
            subject,
            experimentNumber,
            title,
            fileUrl
        });

        const createdSubmission = await submission.save();
        res.status(201).json(createdSubmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get submissions
// @route   GET /api/submissions
// @access  Private (Student: own, Admin: all)
const getSubmissions = async (req, res) => {
    const { year, semester, subject, studentId } = req.query;
    let query = {};

    // Filter by User properties requires looking up users first or using aggregation
    // For simplicity, we filter by fields directly on Submission or if admin provided filters

    // If student, only show own submissions
    if (req.user.role === 'student') {
        query.student = req.user._id;
    } else if (req.user.role === 'admin') {
        // Admin filters
        if (studentId) query.student = studentId;
        if (subject) query.subject = subject;

        // Note: Year/Semester are on User model, not Submission. 
        // To filter by year/sem, we'd need to populate or aggregate.
        // Doing basic population for now.
    }

    try {
        const submissions = await Submission.find(query)
            .populate('student', 'name email enrollmentNumber year semester')
            .populate('subject', 'name');

        // If admin wants to filter by year/sem, do it in memory for now (simple)
        let results = submissions;
        if (req.user.role === 'admin' && (year || semester)) {
            results = submissions.filter(sub => {
                let match = true;
                if (year && sub.student.year !== year) match = false;
                if (semester && sub.student.semester.toString() !== semester) match = false;
                return match;
            });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update submission status
// @route   PUT /api/submissions/:id
// @access  Admin
const updateSubmissionStatus = async (req, res) => {
    const { status, remarks } = req.body;

    try {
        const submission = await Submission.findById(req.params.id);

        if (submission) {
            submission.status = status || submission.status;
            submission.remarks = remarks || submission.remarks;

            const updatedSubmission = await submission.save();
            res.json(updatedSubmission);
        } else {
            res.status(404).json({ message: 'Submission not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSubmission, getSubmissions, updateSubmissionStatus };
