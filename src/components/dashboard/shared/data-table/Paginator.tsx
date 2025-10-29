import React, { useMemo } from 'react';

type PaginatorProps = {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
};

export const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onChange }) => {
    const pages = useMemo(() => {
        const maxVisible = 5;
        const result: Array<number | string> = [];

        if (totalPages <= maxVisible + 2) {
            for (let page = 1; page <= totalPages; page += 1) {
                result.push(page);
            }
            return result;
        }

        result.push(1);

        if (currentPage > 3) {
            result.push('…');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let page = start; page <= end; page += 1) {
            result.push(page);
        }

        if (currentPage < totalPages - 2) {
            result.push('…');
        }

        if (totalPages > 1) {
            result.push(totalPages);
        }

        return result;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) {
        return null;
    }

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onChange(page);
    };

    const baseButtonClasses = 'rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900';

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white/90 dark:border-gray-800 dark:bg-gray-900/80">
            <span className="text-sm text-gray-600 dark:text-gray-300">
                صفحه {currentPage} از {totalPages}
            </span>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={baseButtonClasses}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {pages.map((page, index) =>
                    page === '…' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400 dark:text-gray-500">
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => goToPage(page as number)}
                            className={`${baseButtonClasses} ${currentPage === page ? 'text-white shadow-sm hover:bg-teal-500 bg-teal-600 dark:hover:bg-teal-500' : 'bg-white'}`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={baseButtonClasses}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
