import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-colors duration-200 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-800 dark:text-yellow-400"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
        </button>
    );
};

export default ThemeToggle;
