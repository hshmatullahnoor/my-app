import React from 'react';

type PageSizeSelectorProps = {
    value: number;
    onChange: (value: number) => void;
    options?: number[];
};

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
    value,
    onChange,
    options = [5, 10, 20, 50, 100],
}) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">نمایش:</span>
            <select
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
                {options.map((option) => (
                    <option key={option} value={option} className="text-gray-700 dark:text-gray-200 dark:bg-gray-900">
                        {option}
                    </option>
                ))}
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-300">رکورد در هر صفحه</span>
        </div>
    );
};
