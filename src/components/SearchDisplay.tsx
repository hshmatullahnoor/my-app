import React from 'react';

interface SearchDisplayProps {
    searchQuery: string;
    onClearSearch: () => void;
}

const SearchDisplay: React.FC<SearchDisplayProps> = ({ searchQuery, onClearSearch }) => {
    if (!searchQuery.trim()) return null;

    return (
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-blue-200 text-sm">
                        نتایج جستجو برای:
                        <span className="font-semibold text-white mr-1">"{searchQuery}"</span>
                    </span>
                </div>
                <button
                    onClick={onClearSearch}
                    className="text-blue-300 hover:text-white transition-colors"
                    title="پاک کردن جستجو"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SearchDisplay;