import React from 'react';

interface AdvertisementFilterProps {
    itemsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
    totalItems: number;
}

const AdvertisementFilter: React.FC<AdvertisementFilterProps> = ({
    itemsPerPage,
    onItemsPerPageChange,
}) => {
    const options = [5, 10, 20, 50, 100];

    return (

            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center justify-between space-x-3 space-x-reverse">
                        
                        <label
                            htmlFor="items-per-page"
                            className="text-sm font-medium text-gray-700 transition-colors duration-300 whitespace-nowrap dark:text-gray-300"
                        >
                            نمایش در صفحه:
                        </label>
                        <div className="relative -z-0">
                            <select
                                id="items-per-page"
                                value={itemsPerPage}
                                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                className="z-0 min-w-[80px] w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pr-8 text-sm text-gray-900 transition-colors duration-300 hover:bg-gray-100 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:border-teal-400 dark:focus:ring-teal-400/30"
                            >
                                {options.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center px-2 text-gray-400 pointer-events-none dark:text-gray-300">
                                <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    );
};

export default AdvertisementFilter;