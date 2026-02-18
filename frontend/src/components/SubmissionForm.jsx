import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCloudUploadAlt, FaFilePdf, FaTimes } from 'react-icons/fa';

const SubmissionForm = ({ onSubmissionSuccess, subjects: propSubjects, initialSubjectId, onClose }) => {
    const { user } = useContext(AuthContext);
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        subject: initialSubjectId || '',
        experimentNumber: '',
        title: '',
        file: null
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialSubjectId) {
            setFormData(prev => ({ ...prev, subject: initialSubjectId }));
        }
    }, [initialSubjectId]);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (propSubjects) {
                setSubjects(propSubjects);
                return;
            }
            try {
                const { data } = await axios.get(`http://127.0.0.1:8080/api/subjects?year=${user.year}&semester=${user.semester}`);
                setSubjects(data);
            } catch (error) {
                console.error('Error fetching subjects', error);
            }
        };
        if (user && user.role === 'student') fetchSubjects();
    }, [user, propSubjects]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFormData({ ...formData, file });
        } else {
            setMessage('Please select a PDF file.');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setFormData({ ...formData, file });
            } else {
                setMessage('Only PDF files are allowed.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) {
            setMessage('Please upload a file.');
            return;
        }
        setIsSubmitting(true);
        const data = new FormData();
        data.append('subject', formData.subject);
        data.append('experimentNumber', formData.experimentNumber);
        data.append('title', formData.title);
        data.append('file', formData.file);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/submissions', data, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            setMessage('Submission Successful!');
            setFormData({ subject: '', experimentNumber: '', title: '', file: null });
            if (onSubmissionSuccess) onSubmissionSuccess();
            if (fileInputRef.current) fileInputRef.current.value = "";
            // Optional: Auto close after success
            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);
        } catch (error) {
            setMessage('Submission Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    return (
        <div className="glass-panel p-8 relative overflow-hidden bg-white dark:bg-surface-dark">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            {/* Close Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-20"
                    title="Close"
                >
                    <FaTimes />
                </button>
            )}

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaCloudUploadAlt className="text-brand-600 dark:text-brand-400" />
                        Upload Lab Manual
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Submit your experiment reports in PDF format</p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-xl text-sm font-medium animate-fadeIn ${message.includes('Failed') || message.includes('Please') ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-green-500/20 text-green-200 border border-green-500/30'
                        }`}>
                        {message}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Subject</label>
                        <div className="relative">
                            <select name="subject" value={formData.subject} onChange={handleChange} className="glass-input w-full appearance-none bg-gray-50 dark:bg-surface-dark/50" required>
                                <option value="" className="text-gray-500">Select Subject</option>
                                {subjects.map(sub => (
                                    <option key={sub._id} value={sub._id} className="text-gray-900 dark:text-black">{sub.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Experiment No.</label>
                        <input type="text" name="experimentNumber" value={formData.experimentNumber} onChange={handleChange} className="glass-input w-full" placeholder="e.g. Exp 1" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Title/Topic</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="glass-input w-full" placeholder="Enter experiment title" required />
                    </div>

                    {/* Drag and Drop Area */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Upload File</label>
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${dragActive ? 'border-brand-500 bg-brand-500/10 scale-[1.02]' : 'border-gray-300 dark:border-white/20 hover:border-brand-400/50 hover:bg-gray-50 dark:hover:bg-white/5'
                                } ${formData.file ? 'border-green-500/50 bg-green-500/5' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {formData.file ? (
                                <div className="flex flex-col items-center animate-fadeIn">
                                    <FaFilePdf className="text-4xl text-red-500 dark:text-red-400 mb-3" />
                                    <p className="text-gray-900 dark:text-white font-medium text-lg">{formData.file.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData({ ...formData, file: null });
                                            fileInputRef.current.value = "";
                                        }}
                                        className="mt-4 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 underline"
                                    >
                                        Remove File
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <FaCloudUploadAlt className={`text-5xl mb-4 transition-colors ${dragActive ? 'text-brand-500 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                        Drag & drop your PDF here or <span className="text-brand-600 dark:text-brand-400">browse</span>
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Maximum file size: 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-end mt-6">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl border border-gray-300 dark:border-white/10 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : 'Submit Manual'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmissionForm;
