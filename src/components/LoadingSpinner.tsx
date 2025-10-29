import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 transition-colors border rounded-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <svg className="w-5 h-5 mr-3 -ml-1 text-teal-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">در حال بارگذاری...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;