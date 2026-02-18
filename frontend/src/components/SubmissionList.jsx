import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaFilter, FaDownload } from 'react-icons/fa';

const SubmissionList = ({ refreshTrigger }) => {
    const { user } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterSubject, setFilterSubject] = useState('All');

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:8080/api/submissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions', error);
        }
    };

    useEffect(() => {
        if (user) fetchSubmissions();
    }, [user, refreshTrigger]);

    const handleStatusUpdate = async (id, status, remarks) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/submissions/${id}`, { status, remarks }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSubmissions();
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'Rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        }
    };

    // Extract unique subjects for filter
    const uniqueSubjects = [...new Set(submissions.map(sub => sub.subject?.name).filter(Boolean))];

    // Filter Logic
    const filteredSubmissions = submissions.filter(sub => {
        const matchesStatus = filterStatus === 'All' || sub.status === filterStatus;
        const matchesSubject = filterSubject === 'All' || sub.subject?.name === filterSubject;
        return matchesStatus && matchesSubject;
    });

    return (
        <div className="glass-panel overflow-hidden bg-white dark:bg-surface-dark/50">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.role === 'admin' ? 'Student Submissions' : 'Your Submissions'}</h3>
                    {user.role !== 'admin' && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total: {submissions.length}</span>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="glass-input pl-8 py-2 text-sm w-32 md:w-36 appearance-none bg-gray-50 dark:bg-surface-dark/50"
                        >
                            <option value="All" className="text-gray-900 dark:text-black">All Status</option>
                            <option value="Pending" className="text-gray-900 dark:text-black">Pending</option>
                            <option value="Approved" className="text-gray-900 dark:text-black">Approved</option>
                            <option value="Rejected" className="text-gray-900 dark:text-black">Rejected</option>
                        </select>
                    </div>

                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="glass-input pl-8 py-2 text-sm w-40 md:w-48 appearance-none bg-gray-50 dark:bg-surface-dark/50"
                        >
                            <option value="All" className="text-gray-900 dark:text-black">All Subjects</option>
                            {uniqueSubjects.map(sub => (
                                <option key={sub} value={sub} className="text-gray-900 dark:text-black">{sub}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Experiment</th>
                            <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">File</th>
                            <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            {user.role === 'admin' && (
                                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {filteredSubmissions.length === 0 ? (
                            <tr>
                                <td colSpan={user.role === 'admin' ? 6 : 5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">
                                    No submissions found matching filters.
                                </td>
                            </tr>
                        ) : filteredSubmissions.map(sub => (
                            <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-no-wrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{sub.experimentNumber}</div>
                                    <div className="text-xs text-brand-600 dark:text-brand-300">{sub.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap text-sm text-gray-600 dark:text-gray-300">
                                    {sub.subject?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap text-sm text-gray-600 dark:text-gray-300">
                                    {sub.student?.name}
                                    <span className="block text-xs text-gray-400 dark:text-gray-500">{sub.student?.enrollmentNumber}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap text-sm">
                                    <a
                                        href={`http://localhost:8080/${sub.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-50  dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 hover:bg-brand-100 dark:hover:bg-brand-500/30 transition-colors"
                                    >
                                        <FaDownload className="mr-1.5" size={10} />
                                        View PDF
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(sub.status)} shadow-sm`}>
                                        {sub.status}
                                    </span>
                                </td>
                                {user.role === 'admin' && (
                                    <td className="px-6 py-4 whitespace-no-wrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStatusUpdate(sub._id, 'Approved')}
                                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-100 dark:bg-green-500/10 p-1.5 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/20 transition-colors border border-green-200 dark:border-green-500/20"
                                                title="Approve"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(sub._id, 'Rejected')}
                                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-100 dark:bg-red-500/10 p-1.5 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors border border-red-200 dark:border-red-500/20"
                                                title="Reject"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubmissionList;
