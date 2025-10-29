import React from 'react';

const EmptyAdvertisements: React.FC = () => {
    return (
        <div className="py-16 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-500 transition-colors dark:text-gray-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mb-2 text-xl font-medium text-gray-700 dark:text-gray-300">
                هیچ آگهی یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
                در حال حاضر آگهی جدیدی برای نمایش وجود ندارد
            </p>
        </div>
    );
};

export default EmptyAdvertisements;