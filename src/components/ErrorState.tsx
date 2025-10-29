import React from 'react';

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
    return (
        <div className="px-6 py-4 mb-8 text-red-700 bg-red-50 border border-red-200 rounded-lg transition-colors dark:text-red-100 dark:bg-red-950/70 dark:border-red-800">
            <p className="text-center">{error}</p>
            <button
                onClick={onRetry}
                className="block px-4 py-2 mt-3 font-medium text-white transition-colors bg-red-600 rounded-md mx-auto hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-500 dark:focus:ring-offset-gray-900"
            >
                تلاش مجدد
            </button>
        </div>
    );
};

export default ErrorState;