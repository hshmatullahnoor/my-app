import React from 'react';

type PerPageSelectorProps = {
    perPage: number;
    onChange: (perPage: number) => void;
    options?: number[];
};

export const PerPageSelector: React.FC<PerPageSelectorProps> = ({
    perPage,
    onChange,
    options = [5, 10, 20, 50, 100]
}) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">نمایش:</span>
            <select
                value={perPage}
                onChange={(e) => onChange(Number(e.target.value))}
                className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {options.map((option) => (
                    <option key={option} value={option} className="bg-gray-700 text-white">
                        {option}
                    </option>
                ))}
            </select>
            <span className="text-sm text-gray-300">رکورد در هر صفحه</span>
        </div>
    );
};
