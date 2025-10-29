import React, { useState, useCallback } from 'react';

type Column = {
    id: string;
    label: string;
    visible: boolean;
};

type ColumnSelectorProps = {
    columns: Column[];
    onChange: (updatedColumns: Column[]) => void;
};

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({ columns, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleColumn = useCallback((id: string) => {
        const updatedColumns = columns.map(column =>
            column.id === id ? { ...column, visible: !column.visible } : column
        );
        onChange(updatedColumns);
    }, [columns, onChange]);

    const toggleAll = useCallback((visible: boolean) => {
        const updatedColumns = columns.map(column => ({ ...column, visible }));
        onChange(updatedColumns);
    }, [columns, onChange]);

    const areAllSelected = columns.every(column => column.visible);
    const areNoneSelected = columns.every(column => !column.visible);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row-reverse items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                ستون‌ها
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 left-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                        <div className="p-3 border-b border-gray-700">
                            <h3 className="text-sm font-medium text-white">انتخاب ستون‌ها</h3>
                        </div>

                        <div className="p-2">
                            <div className="flex items-center justify-between p-2">
                                <span className="text-sm text-gray-300">همه</span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => toggleAll(true)}
                                        className={`px-2 py-1 text-xs rounded ${areAllSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        همه
                                    </button>
                                    <button
                                        onClick={() => toggleAll(false)}
                                        className={`px-2 py-1 text-xs rounded ${areNoneSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        هیچ
                                    </button>
                                </div>
                            </div>

                            {columns.map((column) => (
                                <div key={column.id} className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        id={`column-${column.id}`}
                                        checked={column.visible}
                                        onChange={() => toggleColumn(column.id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label
                                        htmlFor={`column-${column.id}`}
                                        className="mr-2 text-sm text-gray-300"
                                    >
                                        {column.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
