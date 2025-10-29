import React, { useState, useEffect } from 'react';
import AdvertisementFilter from './AdvertisementFilter';


interface AdvancedFiltersProps {
    onFiltersChange: (filters: {
        cityId: number | null;
        fromPrice: number | null;
        toPrice: number | null;
        onlyWithImage: boolean;
    }) => void;
    filters: {
        cityId: number | null;
        fromPrice: number | null;
        toPrice: number | null;
        onlyWithImage: boolean;
    };
    is_Expanded?: boolean;
    showToggleButton?: boolean;

    itemsPerPage: number;
    onItemsPerPageChange: (count: number) => void;
    totalItems: number;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    onFiltersChange,
    filters,
    is_Expanded = false,
    showToggleButton = true,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems
}) => {
    const [isExpanded, setIsExpanded] = useState(showToggleButton ? is_Expanded : true);

    useEffect(() => {
        setIsExpanded(showToggleButton ? is_Expanded : true);
    }, [is_Expanded, showToggleButton]);

    // Local state for price inputs to prevent onChange firing during typing
    const [localFromPrice, setLocalFromPrice] = useState<string>(filters.fromPrice?.toString() || '');
    const [localToPrice, setLocalToPrice] = useState<string>(filters.toPrice?.toString() || '');

    // Sync local price state when filters prop changes
    useEffect(() => {
        setLocalFromPrice(filters.fromPrice?.toString() || '');
        setLocalToPrice(filters.toPrice?.toString() || '');
    }, [filters.fromPrice, filters.toPrice]);

    const handlePriceChange = (field: 'fromPrice' | 'toPrice', value: string) => {
        // Only update local state during typing
        if (field === 'fromPrice') {
            setLocalFromPrice(value);
        } else {
            setLocalToPrice(value);
        }
    };

    const applyPriceFilter = (field: 'fromPrice' | 'toPrice', value: string) => {
        // Apply the filter when user finishes entering
        const numericValue = value.trim() ? Number(value) : null;
        onFiltersChange({
            ...filters,
            [field]: numericValue
        });
    };

    const handlePriceKeyPress = (field: 'fromPrice' | 'toPrice', value: string, event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            applyPriceFilter(field, value);
        }
    };

    const handlePriceBlur = (field: 'fromPrice' | 'toPrice', value: string) => {
        applyPriceFilter(field, value);
    };

    const handleImageFilterChange = (checked: boolean) => {
        onFiltersChange({
            ...filters,
            onlyWithImage: checked
        });
    };

    const resetAllFilters = () => {
        onFiltersChange({
            cityId: null,
            fromPrice: null,
            toPrice: null,
            onlyWithImage: false
        });
    };

    const hasActiveFilters = filters.cityId || filters.fromPrice || filters.toPrice || filters.onlyWithImage;

    return (
        <div className="mb-6">

            {/* Toggle Button */}
            {showToggleButton && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="items-center justify-between hidden w-full p-3 text-gray-900 transition-colors duration-300 bg-white border border-gray-200 rounded-lg md:flex hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                    <span className="flex items-center">
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                        </svg>
                        فیلترهای پیشرفته
                        {hasActiveFilters && (
                            <span className="px-2 py-1 mr-2 text-xs text-white bg-teal-600 rounded-full">
                                فعال
                            </span>
                        )}
                    </span>
                    <svg
                        className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}

            {/* Filters Panel */}
            {isExpanded && (
                <div className="p-4 mt-4 transition-colors duration-300 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                        <div className="flex flex-col">

                            <AdvertisementFilter
                                itemsPerPage={itemsPerPage}
                                onItemsPerPageChange={onItemsPerPageChange}
                                totalItems={totalItems}
                            />

                        </div>

                        {/* Price Range - From */}
                        <div className="flex flex-col md:mt-32">
                            <label htmlFor="price-from" className="mb-2 text-sm font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300">
                                قیمت از (افغانی):
                            </label>
                            <input
                                type="number"
                                id="price-from"
                                placeholder="حداقل قیمت"
                                value={localFromPrice}
                                onChange={(e) => handlePriceChange('fromPrice', e.target.value)}
                                onKeyPress={(e) => handlePriceKeyPress('fromPrice', localFromPrice, e)}
                                onBlur={() => handlePriceBlur('fromPrice', localFromPrice)}
                                className="px-3 py-2 text-sm text-gray-900 transition-colors duration-300 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/30"
                                min="0"
                            />
                        </div>

                        {/* Price Range - To */}
                        <div className="flex flex-col md:mt-32">
                            <label htmlFor="price-to" className="mb-2 text-sm font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300">
                                قیمت تا (افغانی):
                            </label>
                            <input
                                type="number"
                                id="price-to"
                                placeholder="حداکثر قیمت"
                                value={localToPrice}
                                onChange={(e) => handlePriceChange('toPrice', e.target.value)}
                                onKeyPress={(e) => handlePriceKeyPress('toPrice', localToPrice, e)}
                                onBlur={() => handlePriceBlur('toPrice', localToPrice)}
                                className="px-3 py-2 text-sm text-gray-900 transition-colors duration-300 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/30"
                                min="0"
                            />
                        </div>

                        {/* Image Filter */}
                        <div className="flex flex-col justify-end">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.onlyWithImage}
                                    onChange={(e) => handleImageFilterChange(e.target.checked)}
                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-teal-400"
                                />
                                <span className="mr-2 text-sm text-gray-700 transition-colors duration-300 dark:text-gray-300">
                                    فقط آگهی‌های دارای تصویر
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={resetAllFilters}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                پاک کردن همه فیلترها
                            </button>
                        </div>
                    )}

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="mt-3 text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400">
                            فیلترهای فعال:
                            {filters.fromPrice && ` قیمت از: ${filters.fromPrice.toLocaleString('fa-IR')}`}
                            {filters.toPrice && ` قیمت تا: ${filters.toPrice.toLocaleString('fa-IR')}`}
                            {filters.onlyWithImage && ' فقط با تصویر'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdvancedFilters;