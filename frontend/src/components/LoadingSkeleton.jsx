const LoadingSkeleton = ({ rows = 5, cols = 6 }) => {
    return (
        <div className="animate-pulse">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4 py-4 border-b border-gray-200 dark:border-white/10">
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <div key={colIndex} className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                            {colIndex === 1 && <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2 mt-1"></div>}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;