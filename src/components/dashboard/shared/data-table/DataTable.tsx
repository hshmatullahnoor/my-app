import React, { useMemo, useState, useCallback, useEffect } from 'react';
import type { DataTableColumn, DataTableEmptyState, SortDirection } from './types';
import { SearchInput } from './SearchInput.tsx';
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu.tsx';
import { PageSizeSelector } from './PageSizeSelector.tsx';
import { Paginator } from './Paginator.tsx';

type DataTableProps<T> = {
    realTimeSearch?: boolean,
    data: T[];
    columns: DataTableColumn<T>[];
    rowKey: (row: T, context: { index: number }) => string | number;
    searchPlaceholder?: string;
    enableSearch?: boolean;
    perPageOptions?: number[];
    defaultPerPage?: number;
    emptyState?: DataTableEmptyState;
    toolbarActions?: React.ReactNode;
    filterRows?: (rows: T[], query: string) => T[];
    initialSort?: { columnId: string; direction: SortDirection };
    onRowClick?: (row: T) => void;
    daynamicPagenaition?: boolean;
    daynamicPagenaitionPagesCount?: number;
    daynamicPagenaitionPerPage?: number;
    daynamicCurrentPage?: number;
    onDaynamicPageChange?: (page: number) => void;
    onDaynamicPerPageChange?: (perPage: number) => void;
    serverSideSearch?: boolean;
    onServerSearch?: (query: string) => void;
    onSortChange?: (sort: { columnId: string | null; direction: SortDirection | null }) => void;
};

type PreparedColumn<T> = DataTableColumn<T> & {
    toggleable: boolean;
    initialVisible: boolean;
    sortable: boolean;
    searchable: boolean;
    align: 'left' | 'right' | 'center';
    headerClassName?: string;
    default_hidden?: boolean;
};

const normalizeString = (value: unknown) => {
    if (value == null) return '';
    if (Array.isArray(value)) {
        return value
            .filter((item) => item != null)
            .map((item) => String(item).toLowerCase())
            .join(' ');
    }
    return String(value).toLowerCase();
};

const buildColumns = <T,>(columns: DataTableColumn<T>[]): PreparedColumn<T>[] =>
    columns.map((column) => {
        const toggleable = column.toggleable ?? true;
        const initialVisible = column.default_hidden ? false : (column.initialVisible ?? true);
        const sortable = column.sortable ?? false;
        const searchable = column.searchable ?? true;
        const align = column.align ?? 'right';

        return {
            ...column,
            toggleable,
            initialVisible,
            sortable,
            searchable,
            align,
        };
    });

const getSortValue = <T,>(row: T, column: PreparedColumn<T>) => {
    if (column.sortValue) {
        return column.sortValue(row);
    }

    if (column.searchValue) {
        const searchVal = column.searchValue(row);
        if (Array.isArray(searchVal)) {
            return searchVal.join(' ');
        }
        return searchVal ?? null;
    }

    const candidate = (row as Record<string, unknown>)[column.id];
    return candidate as string | number | boolean | Date | null | undefined;
};

const getSearchValue = <T,>(row: T, column: PreparedColumn<T>) => {
    if (!column.searchable) return '';

    if (column.searchValue) {
        return normalizeString(column.searchValue(row));
    }

    const candidate = (row as Record<string, unknown>)[column.id];
    return normalizeString(candidate);
};

export const DataTable = <T,>({
    realTimeSearch = false,
    data,
    columns,
    rowKey,
    searchPlaceholder,
    enableSearch = true,
    perPageOptions = [10, 20, 50, 100],
    defaultPerPage = 10,
    emptyState,
    toolbarActions,
    filterRows,
    initialSort,
    onRowClick,
    daynamicPagenaition,
    daynamicPagenaitionPagesCount,
    daynamicPagenaitionPerPage,
    daynamicCurrentPage,
    onDaynamicPageChange,
    onDaynamicPerPageChange,
    serverSideSearch,
    onServerSearch,
    onSortChange,
}: DataTableProps<T>) => {
    const isDynamicPagination = Boolean(daynamicPagenaition);
    const preparedColumns = useMemo(() => buildColumns(columns), [columns]);

    const [visibleColumnIds, setVisibleColumnIds] = useState<Set<string>>(() => {
        const ids = new Set<string>();
        preparedColumns.forEach((column) => {
            if (!column.toggleable) {
                ids.add(column.id);
                return;
            }
            if (column.initialVisible) {
                ids.add(column.id);
            }
        });
        return ids;
    });

    useEffect(() => {
        setVisibleColumnIds((prev) => {
            const next = new Set<string>();
            preparedColumns.forEach((column) => {
                if (!column.toggleable) {
                    next.add(column.id);
                    return;
                }
                if (prev.has(column.id)) {
                    next.add(column.id);
                } else if (column.initialVisible) {
                    next.add(column.id);
                }
            });
            return next;
        });
    }, [preparedColumns]);

    const [searchQuery, setSearchQuery] = useState('');
    const [perPage, setPerPage] = useState(() =>
        isDynamicPagination ? daynamicPagenaitionPerPage ?? defaultPerPage : defaultPerPage
    );
    const [currentPage, setCurrentPage] = useState(() =>
        isDynamicPagination ? daynamicCurrentPage ?? 1 : 1
    );

    const [sortColumnId, setSortColumnId] = useState<string | null>(initialSort?.columnId ?? null);
    const [sortDirection, setSortDirection] = useState<SortDirection | null>(initialSort?.direction ?? null);

    const columnsForRendering = useMemo(
        () =>
            preparedColumns.filter((column) => {
                if (!column.toggleable) return true;
                return visibleColumnIds.has(column.id);
            }),
        [preparedColumns, visibleColumnIds]
    );

    const pageSizeOptions = useMemo(() => {
        if (!isDynamicPagination || !daynamicPagenaitionPerPage) {
            return perPageOptions;
        }
        if (perPageOptions.includes(daynamicPagenaitionPerPage)) {
            return perPageOptions;
        }
        return [...perPageOptions, daynamicPagenaitionPerPage].sort((a, b) => a - b);
    }, [isDynamicPagination, daynamicPagenaitionPerPage, perPageOptions]);

    const toggleColumnVisibility = useCallback((columnId: string) => {
        setVisibleColumnIds((prev) => {
            const next = new Set(prev);
            if (next.has(columnId)) {
                next.delete(columnId);
            } else {
                next.add(columnId);
            }
            return next;
        });
    }, []);

    const setAllColumnsVisibility = useCallback((value: boolean) => {
        setVisibleColumnIds((prev) => {
            const next = new Set(prev);
            preparedColumns.forEach((column) => {
                if (!column.toggleable) return;
                if (value) {
                    next.add(column.id);
                } else {
                    next.delete(column.id);
                }
            });
            return next;
        });
    }, [preparedColumns]);

    const handleSort = useCallback(
        (column: PreparedColumn<T>) => {
            if (!column.sortable) return;

            setSortColumnId((prev) => {
                if (prev !== column.id) {
                    setSortDirection(() => {
                        onSortChange?.({ columnId: column.id, direction: 'asc' });
                        return 'asc';
                    });
                    return column.id;
                }

                setSortDirection((prevDirection) => {
                    if (prevDirection === 'asc') {
                        onSortChange?.({ columnId: column.id, direction: 'desc' });
                        return 'desc';
                    }
                    if (prevDirection === 'desc') {
                        onSortChange?.({ columnId: null, direction: null });
                        setSortColumnId(null);
                        return null;
                    }
                    onSortChange?.({ columnId: column.id, direction: 'asc' });
                    return 'asc';
                });

                return prev;
            });
        },
        [onSortChange]
    );

    const filteredData = useMemo(() => {
        if (serverSideSearch) {
            if (filterRows) return filterRows(data, searchQuery);
            return data;
        }
        if (filterRows) return filterRows(data, searchQuery);

        const normalizedQuery = searchQuery.trim().toLowerCase();
        if (!normalizedQuery) return data;

        return data.filter((row) =>
            preparedColumns.some((column) => {
                if (!column.searchable) return false;
                const value = getSearchValue(row, column);
                return value.includes(normalizedQuery);
            })
        );
    }, [data, preparedColumns, searchQuery, filterRows, serverSideSearch]);

    const sortedData = useMemo(() => {
        if (!sortColumnId || !sortDirection) return filteredData;

        const column = preparedColumns.find((col) => col.id === sortColumnId);
        if (!column) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = getSortValue(a, column);
            const bValue = getSortValue(b, column);

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
            if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

            const aComparable = aValue instanceof Date ? aValue.getTime() : aValue;
            const bComparable = bValue instanceof Date ? bValue.getTime() : bValue;

            if (aComparable < bComparable) return sortDirection === 'asc' ? -1 : 1;
            if (aComparable > bComparable) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, preparedColumns, sortColumnId, sortDirection]);

    const totalPages = useMemo(() => {
        if (isDynamicPagination) {
            if (typeof daynamicPagenaitionPagesCount === 'number' && daynamicPagenaitionPagesCount > 0) {
                return Math.max(1, daynamicPagenaitionPagesCount);
            }
            return Math.max(1, Math.ceil(Math.max(sortedData.length, data.length) / perPage));
        }
        if (sortedData.length === 0) return 1;
        return Math.max(1, Math.ceil(sortedData.length / perPage));
    }, [isDynamicPagination, daynamicPagenaitionPagesCount, sortedData.length, data.length, perPage]);

    const displayData = useMemo<T[]>(() => {
        if (isDynamicPagination) return sortedData;
        const startIndex = (currentPage - 1) * perPage;
        return sortedData.slice(startIndex, startIndex + perPage);
    }, [sortedData, isDynamicPagination, currentPage, perPage]);

    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            if (isDynamicPagination) onDaynamicPageChange?.(page);
        },
        [isDynamicPagination, onDaynamicPageChange]
    );

    const handlePerPageChange = useCallback(
        (value: number) => {
            setPerPage(value);
            setCurrentPage(1);
            if (isDynamicPagination) onDaynamicPerPageChange?.(value);
        },
        [isDynamicPagination, onDaynamicPerPageChange]
    );

    const handleSearchChange = useCallback(
        (query: string) => {
            setSearchQuery(query);
            setCurrentPage(1);
            if (serverSideSearch) onServerSearch?.(query);
        },
        [serverSideSearch, onServerSearch]
    );

    const renderSortIcon = (column: PreparedColumn<T>) => {
        if (sortColumnId !== column.id) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block w-4 h-4 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        if (sortDirection === 'asc') {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block w-4 h-4 text-blue-500 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            );
        }
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block w-4 h-4 text-blue-500 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const columnsForSelector = useMemo(
        () =>
            preparedColumns
                .filter((column) => column.toggleable)
                .map((column) => ({
                    id: column.id,
                    label: column.label,
                    visible: visibleColumnIds.has(column.id),
                })),
        [preparedColumns, visibleColumnIds]
    );

    const emptyStateIcon = emptyState?.icon ?? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
    );

    return (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col items-start justify-between gap-4 p-4 border-b border-gray-200 sm:flex-row sm:items-center dark:border-gray-700">
                {enableSearch ? (
                    <SearchInput onSearch={handleSearchChange} placeholder={searchPlaceholder} realTime={realTimeSearch} />
                ) : <div />}
                <div className="flex flex-wrap items-center gap-2">
                    {toolbarActions}
                    {columnsForSelector.length > 0 && (
                        <ColumnVisibilityMenu
                            columns={columnsForSelector}
                            onToggle={toggleColumnVisibility}
                            onToggleAll={setAllColumnsVisibility}
                        />
                    )}
                    <PageSizeSelector value={perPage} options={pageSizeOptions} onChange={handlePerPageChange} />
                </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
                <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            {columnsForRendering.map((column) => (
                                <th
                                    key={column.id}
                                    className={`px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors dark:text-gray-300 ${column.headerClassName ?? ''} ${column.align === 'center'
                                        ? 'text-center'
                                        : column.align === 'left'
                                            ? 'text-left'
                                            : 'text-right'
                                        } ${column.sortable ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600' : ''}`}
                                    onClick={() => handleSort(column)}


                                >
                                    <div className={`flex items-center gap-1 ${column.align === 'center' ? 'justify-center' : column.align === 'left' ? 'justify-end' : 'justify-start'}`}>
                                        {column.sortable && renderSortIcon(column)}
                                        <span>{column.label}</span>
                                        {column.columnIcon && column.columnIcon}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {displayData.length === 0 ? (
                            <tr>
                                <td colSpan={columnsForRendering.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        {emptyStateIcon}
                                        <p className="text-lg font-medium">{emptyState?.title ?? 'داده‌ای یافت نشد'}</p>
                                        {emptyState?.description && <p className="mt-2 text-sm">{emptyState.description}</p>}
                                        {emptyState?.action && <div className="mt-4">{emptyState.action}</div>}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayData.map((row, pageIndex) => {
                                const globalIndex = (currentPage - 1) * perPage + pageIndex;
                                const context = { globalIndex, pageIndex, page: currentPage, pageSize: perPage } as const;
                                const key = rowKey(row, { index: globalIndex });
                                return (
                                    <tr key={key} className={`transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick?.(row)}>
                                        {columnsForRendering.map((column) => (
                                            <td
                                                key={column.id}
                                                className={`px-6 py-4 text-sm text-gray-700 dark:text-gray-300 ${column.cellClassName ?? ''} ${column.align === 'center'
                                                    ? 'text-center'
                                                    : column.align === 'left'
                                                        ? 'text-left'
                                                        : 'text-right'
                                                    }`}
                                            >
                                                {column.render
                                                    ? column.render(row, context)
                                                    : (() => {
                                                        const value = (row as Record<string, unknown>)[column.id];
                                                        if (value == null || value === '') {
                                                            return <span className="text-gray-400 dark:text-gray-500">-</span>;
                                                        }
                                                        return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
                                                            ? String(value)
                                                            : (value as React.ReactNode);
                                                    })()}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <Paginator currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
        </div>
    );
};
