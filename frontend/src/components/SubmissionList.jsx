import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';
import LoadingSkeleton from './LoadingSkeleton';
import { FaFilter, FaDownload, FaSearch, FaFileExport, FaCheck, FaTimes, FaEye, FaCalendarAlt } from 'react-icons/fa';

const SubmissionList = ({ refreshTrigger }) => {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterSubject, setFilterSubject] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedSubmissions, setSelectedSubmissions] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'warning'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/submissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions', error);
            addToast('Failed to load submissions. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchSubmissions();
    }, [user, refreshTrigger]);

    const handleStatusUpdate = async (id, status, remarks = '') => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/submissions/${id}`, { status, remarks }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast(`Submission ${status.toLowerCase()} successfully.`, 'success');
            fetchSubmissions();
        } catch (error) {
            console.error('Error updating status', error);
            addToast('Failed to update submission status.', 'error');
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        if (selectedSubmissions.length === 0) return;

        try {
            const token = localStorage.getItem('token');
            const promises = selectedSubmissions.map(id =>
                axios.put(`${import.meta.env.VITE_API_URL}/submissions/${id}`, { status }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            );
            await Promise.all(promises);
            addToast(`${selectedSubmissions.length} submissions ${status.toLowerCase()} successfully.`, 'success');
            setSelectedSubmissions([]);
            setShowBulkActions(false);
            fetchSubmissions();
        } catch (error) {
            console.error('Error bulk updating status', error);
            addToast('Failed to update some submissions.', 'error');
        }
    };

    const exportToCSV = () => {
        const headers = ['Experiment', 'Title', 'Subject', 'Student', 'Enrollment', 'Status', 'Date'];
        const csvData = filteredSubmissions.map(sub => [
            sub.experimentNumber,
            sub.title,
            sub.subject?.name || '',
            sub.student?.name || '',
            sub.student?.enrollmentNumber || '',
            sub.status,
            new Date(sub.createdAt).toLocaleDateString()
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        addToast('CSV exported successfully.', 'success');
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
        const matchesSearch = !searchTerm ||
            sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.experimentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.student?.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !dateFilter || new Date(sub.createdAt).toDateString() === new Date(dateFilter).toDateString();

        return matchesStatus && matchesSubject && matchesSearch && matchesDate;
    });

    const handleSelectSubmission = (id) => {
        setSelectedSubmissions(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    // Pagination
    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSelectedSubmissions([]); // Clear selections on page change
    };

    return (
        <div className="glass-panel overflow-hidden bg-white dark:bg-surface-dark/50">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.role === 'admin' ? 'Student Submissions' : 'Your Submissions'}</h3>
                        {user.role !== 'admin' && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total: {submissions.length}</span>
                        )}
                        {user.role === 'admin' && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Showing {filteredSubmissions.length} of {submissions.length} submissions
                            </div>
                        )}
                    </div>

                    {user.role === 'admin' && (
                        <div className="flex gap-2">
                            <button
                                onClick={exportToCSV}
                                className="btn-secondary flex items-center gap-2 text-sm"
                            >
                                <FaFileExport size={14} />
                                Export CSV
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-0">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search by title, experiment, student..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass-input pl-10 py-2 text-sm w-full"
                        />
                    </div>

                    {/* Status Filter */}
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

                    {/* Subject Filter */}
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

                    {/* Date Filter */}
                    <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="glass-input pl-8 py-2 text-sm w-40 appearance-none bg-gray-50 dark:bg-surface-dark/50"
                        />
                    </div>
                </div>

                {/* Bulk Actions */}
                {user.role === 'admin' && selectedSubmissions.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700 dark:text-blue-300">
                                {selectedSubmissions.length} submission{selectedSubmissions.length > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmDialog({
                                        isOpen: true,
                                        title: 'Approve Submissions',
                                        message: `Are you sure you want to approve ${selectedSubmissions.length} submission${selectedSubmissions.length > 1 ? 's' : ''}?`,
                                        onConfirm: () => {
                                            handleBulkStatusUpdate('Approved');
                                            setConfirmDialog({ isOpen: false });
                                        },
                                        type: 'success'
                                    })}
                                    className="btn-primary text-xs px-3 py-1 flex items-center gap-1"
                                >
                                    <FaCheck size={12} />
                                    Approve All
                                </button>
                                <button
                                    onClick={() => setConfirmDialog({
                                        isOpen: true,
                                        title: 'Reject Submissions',
                                        message: `Are you sure you want to reject ${selectedSubmissions.length} submission${selectedSubmissions.length > 1 ? 's' : ''}? This action cannot be undone.`,
                                        onConfirm: () => {
                                            handleBulkStatusUpdate('Rejected');
                                            setConfirmDialog({ isOpen: false });
                                        },
                                        type: 'danger'
                                    })}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-lg flex items-center gap-1"
                                >
                                    <FaTimes size={12} />
                                    Reject All
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <LoadingSkeleton rows={8} cols={user.role === 'admin' ? 8 : 7} />
                ) : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                {user.role === 'admin' && (
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={selectedSubmissions.length === paginatedSubmissions.length && paginatedSubmissions.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                        />
                                    </th>
                                )}
                                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Experiment</th>
                                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">File</th>
                                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                {user.role === 'admin' && (
                                    <th className="px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={user.role === 'admin' ? 8 : 7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">
                                        {searchTerm || filterStatus !== 'All' || filterSubject !== 'All' || dateFilter ?
                                            'No submissions found matching your filters.' :
                                            'No submissions found.'}
                                    </td>
                                </tr>
                            ) : paginatedSubmissions.map(sub => (
                                <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    {user.role === 'admin' && (
                                        <td className="px-6 py-4 whitespace-no-wrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubmissions.includes(sub._id)}
                                                onChange={() => handleSelectSubmission(sub._id)}
                                                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                            />
                                        </td>
                                    )}
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
                                            href={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${sub.fileUrl}`}
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
                                    <td className="px-6 py-4 whitespace-no-wrap text-sm text-gray-600 dark:text-gray-300">
                                        {new Date(sub.createdAt).toLocaleDateString()}
                                    </td>
                                    {user.role === 'admin' && (
                                        <td className="px-6 py-4 whitespace-no-wrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(sub._id, 'Approved')}
                                                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-100 dark:bg-green-500/10 p-1.5 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/20 transition-colors border border-green-200 dark:border-green-500/20"
                                                    title="Approve"
                                                >
                                                    <FaCheck className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(sub._id, 'Rejected')}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-100 dark:bg-red-500/10 p-1.5 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors border border-red-200 dark:border-red-500/20"
                                                    title="Reject"
                                                >
                                                    <FaTimes className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length} submissions
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-white/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                            if (page > totalPages) return null;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                                        currentPage === page
                                            ? 'bg-brand-500 text-white border-brand-500'
                                            : 'border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-white/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ isOpen: false })}
                type={confirmDialog.type}
            />
        </div>
    );
};

export default SubmissionList;
