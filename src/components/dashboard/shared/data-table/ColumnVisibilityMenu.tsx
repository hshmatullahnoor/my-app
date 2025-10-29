import React, { useState, useCallback, useMemo } from 'react';

type ColumnVisibilityMenuProps = {
    columns: Array<{
        id: string;
        label: string;
        visible: boolean;
    }>;
    onToggle: (columnId: string) => void;
    onToggleAll: (visible: boolean) => void;
};

export const ColumnVisibilityMenu: React.FC<ColumnVisibilityMenuProps> = ({ columns, onToggle, onToggleAll }) => {
    const [isOpen, setIsOpen] = useState(false);

    const areAllVisible = useMemo(() => columns.every((column) => column.visible), [columns]);
    const areNoneVisible = useMemo(() => columns.every((column) => !column.visible), [columns]);

    const handleToggle = useCallback(
        (columnId: string) => {
            onToggle(columnId);
        },
        [onToggle]
    );

    const closeMenu = useCallback(() => setIsOpen(false), []);

    if (columns.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex flex-row-reverse items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                ستون‌ها
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={closeMenu} />
                    <div className="absolute left-0 z-20 w-56 mt-2 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl dark:border-gray-700 dark:bg-gray-900 max-h-[900%]">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">انتخاب ستون‌ها</h3>
                        </div>
                        <div className="p-3 space-y-1">
                            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                                <span className="text-sm text-gray-600 dark:text-gray-300">همه</span>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onToggleAll(true)}
                                        className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${areAllVisible ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'}`}
                                    >
                                        همه
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onToggleAll(false)}
                                        className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${areNoneVisible ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'}`}
                                    >
                                        هیچ
                                    </button>
                                </div>
                            </div>
                            {columns.map((column) => (
                                <label key={column.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60">
                                    <input
                                        type="checkbox"
                                        checked={column.visible}
                                        onChange={() => handleToggle(column.id)}
                                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 dark:bg-gray-900 dark:border-gray-600"
                                    />
                                    <span className="flex-1 text-right">{column.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
