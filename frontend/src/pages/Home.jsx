import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>

            <div className="z-10 text-center max-w-4xl px-4 animate-fadeIn">
                <span className="inline-block py-1 px-3 rounded-full bg-brand-100 dark:bg-white/10 border border-brand-200 dark:border-white/20 text-brand-700 dark:text-brand-200 text-sm font-medium mb-6 backdrop-blur-sm">
                    ✨ The Future of Lab Submissions
                </span>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-gray-900 dark:text-white">
                    Lab Manuals, <span className="text-gradient">Simpler.</span>
                    <br />
                    Submissions, <span className="text-gradient">Faster.</span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    Submit, track, and manage your university lab manuals with a modern, seamless experience designed for students and faculty.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/register" className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
                        Get Started
                    </Link>
                    <Link to="/login" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
                        Login
                    </Link>
                </div>
            </div>

            {/* Floating UI Elements Mockup (Decorative) */}
            <div className="absolute -bottom-20 left-0 right-0 h-64 bg-gradient-to-t from-gray-50 dark:from-surface-dark to-transparent pointer-events-none backdrop-blur-[2px]"></div>
        </div>
    );
};

export default Home;
