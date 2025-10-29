import React from 'react';

interface AdvertisementSkeletonProps {
    count?: number;
}

const AdvertisementSkeleton: React.FC<AdvertisementSkeletonProps> = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(count)].map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden transition-colors border rounded-lg shadow-sm animate-pulse bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:shadow-none"
                >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4 space-y-2">
                        <div className="h-4 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="w-3/4 h-3 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="w-1/2 h-4 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdvertisementSkeleton;