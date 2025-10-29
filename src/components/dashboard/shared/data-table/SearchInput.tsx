import React, { useState, useEffect } from 'react';

type SearchInputProps = {
    onSearch: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    realTime?: boolean;
};

export const SearchInput: React.FC<SearchInputProps> = ({
    onSearch,
    placeholder = 'جستجو...',
    debounceMs = 250,
    realTime = false
}) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (!realTime) return;

        const handler = setTimeout(() => {
            onSearch(value.trim());
        }, debounceMs);

        return () => clearTimeout(handler);
    }, [value, onSearch, debounceMs, realTime]);

    const handleClear = () => {
        setValue('');
        onSearch('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearch(value.trim());
        }
    };

    const handleBlur = () => {
        onSearch(value.trim());
    };

    const handleSearchClick = () => {
        onSearch(value.trim());
    };

    return (
        <div className="relative flex items-center w-full gap-2 sm:w-72">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                />

                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* آیکون جستجوی جدید قابل کلیک */}
            <button
                type="button"
                onClick={handleSearchClick}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition-colors hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-teal-300 dark:focus:ring-offset-gray-900"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    );
};