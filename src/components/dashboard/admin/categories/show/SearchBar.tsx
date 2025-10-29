import React, { useState, useEffect } from 'react';

type SearchBarProps = {
    onSearch: (query: string) => void;
    placeholder?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "جستجو..." }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            onSearch(searchQuery);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, onSearch]);

    const handleClear = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <div className="relative mb-4">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                className="w-full px-4 py-2 pr-10 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};
