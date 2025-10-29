import React from 'react';

const EndOfResults: React.FC = () => {
    return (
        <div className="py-8 mt-12 text-center">
            <div className="inline-flex items-center px-4 py-2 transition-colors border rounded-lg bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">همه آگهی‌ها نمایش داده شد</span>
            </div>
        </div>
    );
};

export default EndOfResults;