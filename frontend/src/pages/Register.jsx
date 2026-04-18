import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        enrollmentNumber: '',
        year: '1st',
        semester: '1'
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration Error:', err);
            const status = err.response?.status;
            const msg = err.response?.data?.message || err.message || 'Registration failed';
            setError(`Error ${status || ''}: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen pt-20 px-4 pb-10">
            <div className="glass-card w-full max-w-lg p-8 md:p-10 transform transition-all hover:scale-[1.01] duration-500">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                    <p className="text-gray-600 dark:text-gray-400">Join the SAGE Lab Manual Submission Portal community</p>
                </div>

                {error && (
                    <div className="bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-200 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Full Name</label>
                            <input type="text" name="name" className="glass-input w-full" placeholder="John Doe" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Email</label>
                            <input type="email" name="email" className="glass-input w-full" placeholder="john@example.com" onChange={handleChange} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Password</label>
                        <input type="password" name="password" className="glass-input w-full" placeholder="••••••••" onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Role</label>
                        <div className="relative">
                            <select name="role" className="glass-input w-full appearance-none bg-gray-50 dark:bg-surface-dark/50" onChange={handleChange} value={formData.role}>
                                <option value="student" className="text-gray-900 dark:text-black">Student</option>
                                <option value="admin" className="text-gray-900 dark:text-black">Faculty (Admin)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                    {formData.role === 'student' && (
                        <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Enrollment Number</label>
                                <input type="text" name="enrollmentNumber" className="glass-input w-full" placeholder="e.g. 0187CS211001" onChange={handleChange} required />
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Year</label>
                                    <div className="relative">
                                        <select
                                            name="year"
                                            className="glass-input w-full appearance-none bg-gray-50 dark:bg-surface-dark/50"
                                            onChange={(e) => {
                                                const newYear = e.target.value;
                                                // Auto-select the first semester of the new year
                                                const firstSem = {
                                                    '1st': '1',
                                                    '2nd': '3',
                                                    '3rd': '5',
                                                    '4th': '7'
                                                }[newYear];
                                                setFormData({ ...formData, year: newYear, semester: firstSem });
                                            }}
                                            value={formData.year}
                                        >
                                            <option value="1st" className="text-gray-900 dark:text-black">1st</option>
                                            <option value="2nd" className="text-gray-900 dark:text-black">2nd</option>
                                            <option value="3rd" className="text-gray-900 dark:text-black">3rd</option>
                                            <option value="4th" className="text-gray-900 dark:text-black">4th</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 ml-1">Semester</label>
                                    <div className="relative">
                                        <select
                                            name="semester"
                                            className="glass-input w-full appearance-none bg-gray-50 dark:bg-surface-dark/50"
                                            onChange={handleChange}
                                            value={formData.semester}
                                            required
                                        >
                                            {(() => {
                                                const semMap = {
                                                    '1st': ['1', '2'],
                                                    '2nd': ['3', '4'],
                                                    '3rd': ['5', '6'],
                                                    '4th': ['7', '8']
                                                };
                                                return semMap[formData.year].map(sem => (
                                                    <option key={sem} value={sem} className="text-gray-900 dark:text-black">{sem}</option>
                                                ));
                                            })()}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full flex justify-center items-center mt-4"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Create Account'}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-600 hover:text-brand-500 dark:text-brand-400 font-bold dark:hover:text-brand-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
