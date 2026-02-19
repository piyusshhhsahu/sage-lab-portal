import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import SubmissionForm from '../components/SubmissionForm';
import SubmissionList from '../components/SubmissionList';
import axios from 'axios';
import { FaPlus, FaTimes, FaBook, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [refresh, setRefresh] = useState(false);
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    // Data states for Student Dashboard
    const [subjects, setSubjects] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);

    const triggerRefresh = () => setRefresh(prev => !prev);

    // Fetch data for student dashboard
    useEffect(() => {
        const fetchData = async () => {
            if (!user || user.role !== 'student') return;
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const [subjectsRes, submissionsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/subjects?year=${user.year}&semester=${user.semester}`),
                    axios.get(`${import.meta.env.VITE_API_URL}/submissions`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setSubjects(subjectsRes.data);
                setSubmissions(submissionsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, refresh]);

    // Calculate stats
    const totalSubjects = subjects.length;
    // Count unique subjects that have at least one submission
    const submittedSubjectIds = new Set(submissions.map(s => s.subject?._id));
    const submittedCount = submittedSubjectIds.size;
    const progress = totalSubjects > 0 ? (submittedCount / totalSubjects) * 100 : 0;

    const handleUploadClick = (subjectId) => {
        setSelectedSubjectId(subjectId);
        setShowUploadModal(true);
    };

    const handleSubmissionSuccess = () => {
        triggerRefresh();
        setShowUploadModal(false);
    };

    // Simple Add Subject Component inside Dashboard for Admin
    const AddSubject = () => {
        const [subData, setSubData] = useState({ name: '', year: '1st', semester: '1' });
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const token = localStorage.getItem('token');
                await axios.post(`${import.meta.env.VITE_API_URL}/subjects`, subData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Subject Added');
                setSubData({ name: '', year: '1st', semester: '1' });
                triggerRefresh();
            } catch (error) {
                alert('Error adding subject');
            }
        };

        return (
            <div className="glass-panel p-6 mb-8 animate-fadeIn border-l-4 border-brand-500 bg-white dark:bg-surface-dark/50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Subject</h3>
                    <button onClick={() => setShowAddSubject(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-gray-600 dark:text-gray-400 text-xs font-medium mb-1 ml-1">Subject Name</label>
                        <input type="text" placeholder="e.g. Advanced web Design" value={subData.name} onChange={e => setSubData({ ...subData, name: e.target.value })} className="glass-input w-full" required />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-gray-600 dark:text-gray-400 text-xs font-medium mb-1 ml-1">Year</label>
                        <div className="relative">
                            <select
                                value={subData.year}
                                onChange={e => {
                                    const newYear = e.target.value;
                                    const firstSem = {
                                        '1st': '1',
                                        '2nd': '3',
                                        '3rd': '5',
                                        '4th': '7'
                                    }[newYear];
                                    setSubData({ ...subData, year: newYear, semester: firstSem });
                                }}
                                className="glass-input w-full appearance-none bg-gray-50 dark:bg-surface-dark/50"
                            >
                                <option value="1st" className="text-gray-900 dark:text-black">1st Year</option>
                                <option value="2nd" className="text-gray-900 dark:text-black">2nd Year</option>
                                <option value="3rd" className="text-gray-900 dark:text-black">3rd Year</option>
                                <option value="4th" className="text-gray-900 dark:text-black">4th Year</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-gray-600 dark:text-gray-400 text-xs font-medium mb-1 ml-1">Semester</label>
                        <div className="relative">
                            <select
                                value={subData.semester}
                                onChange={e => setSubData({ ...subData, semester: e.target.value })}
                                className="glass-input w-full appearance-none bg-gray-50 dark:bg-surface-dark/50"
                                required
                            >
                                {(() => {
                                    const semMap = {
                                        '1st': ['1', '2'],
                                        '2nd': ['3', '4'],
                                        '3rd': ['5', '6'],
                                        '4th': ['7', '8']
                                    };
                                    return semMap[subData.year].map(sem => (
                                        <option key={sem} value={sem} className="text-gray-900 dark:text-black">{sem}</option>
                                    ));
                                })()}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary whitespace-nowrap h-[50px] flex items-center justify-center px-6">
                        Add Subject
                    </button>
                </form>
            </div>
        );
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {user?.role === 'admin' ? 'Manage lab submissions and academic progress' : `Welcome back, ${user?.name}`}
                        </p>
                    </div>
                    {user && user.role === 'admin' && !showAddSubject && (
                        <button onClick={() => setShowAddSubject(true)} className="btn-secondary flex items-center gap-2">
                            <FaPlus /> Add New Subject
                        </button>
                    )}
                    {user && user.role === 'student' && (
                        <button onClick={() => { setSelectedSubjectId(null); setShowUploadModal(true); }} className="btn-primary flex items-center gap-2">
                            <FaPlus /> New Submission
                        </button>
                    )}
                </div>

                {user && (
                    <div className="animate-slideUp space-y-10">
                        {user.role === 'admin' && showAddSubject && <AddSubject />}

                        {/* Student Progress Section */}
                        {user.role === 'student' && (
                            <>
                                <div className="glass-panel p-6 bg-white dark:bg-surface-dark/50">
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Progress</h3>
                                        <span className="text-brand-600 dark:text-brand-300 font-medium">{Math.round(progress)}% Completed</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-brand-500 to-accent-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/5">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalSubjects}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Subjects</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/5">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{submittedCount}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Active Subjects</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/5">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{submissions.length}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Total Submissions</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subject Cards Grid */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Subjects</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {subjects.map(subject => {
                                        const subjectSubmissions = submissions.filter(s => s.subject?._id === subject._id);
                                        const lastSubmission = subjectSubmissions.length > 0 ? subjectSubmissions[0] : null; // Assuming API returns sorted or just taking one
                                        const isSubmitted = subjectSubmissions.length > 0;

                                        return (
                                            <div key={subject._id} className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="p-3 rounded-xl bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300">
                                                            <FaBook />
                                                        </div>
                                                        {isSubmitted ? (
                                                            <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs rounded-full border border-green-200 dark:border-green-500/30 flex items-center gap-1">
                                                                <FaCheckCircle size={10} /> Active
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-xs rounded-full border border-yellow-200 dark:border-yellow-500/30 flex items-center gap-1">
                                                                <FaExclamationCircle size={10} /> Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{subject.name}</h4>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{user.year} Year • {user.semester} Semester</p>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
                                                    <div className="flex justify-between items-center text-sm mb-4">
                                                        <span className="text-gray-500 dark:text-gray-400">Submissions</span>
                                                        <span className="text-gray-900 dark:text-white font-medium">{subjectSubmissions.length}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUploadClick(subject._id)}
                                                        className="w-full btn-secondary text-sm py-2"
                                                    >
                                                        Upload Manual
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        <div>
                            <SubmissionList refreshTrigger={refresh} />
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-2xl transform transition-all scale-100">
                        <SubmissionForm
                            subjects={subjects}
                            initialSubjectId={selectedSubjectId}
                            onSubmissionSuccess={handleSubmissionSuccess}
                            onClose={() => setShowUploadModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
