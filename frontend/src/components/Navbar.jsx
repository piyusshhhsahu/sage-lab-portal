import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gradient hover:opacity-80 transition-opacity">
                    SAGE Lab Manual Submission Portal
                </Link>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <div className="flex items-center space-x-6">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Welcome, {user.name}</span>
                            <button
                                onClick={logout}
                                className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white px-4 py-2 rounded-xl transition-all duration-300 border border-gray-300 dark:border-white/10 shadow-sm hover:shadow-md font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-6">
                            <Link to="/login" className="text-gray-700 dark:text-gray-300 font-medium hover:text-brand-600 dark:hover:text-white transition-colors">Login</Link>
                            <Link to="/register" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl hover:bg-brand-500 transition-all shadow-lg shadow-brand-900/40">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
