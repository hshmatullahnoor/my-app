import type { IconNode } from 'lucide-react';
import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export type DataTableColumn<T> = {
    id: string;
    label: string;
    render?: (row: T, context: DataTableCellContext) => ReactNode;
    sortValue?: (row: T) => string | number | boolean | Date | null | undefined;
    searchValue?: (row: T) => string | number | Array<string | number | null | undefined> | null | undefined;
    initialVisible?: boolean;
    toggleable?: boolean;
    sortable?: boolean;
    searchable?: boolean;
    headerClassName?: string;
    cellClassName?: string;
    align?: 'left' | 'right' | 'center';
    default_hidden?: boolean;
    columnIcon? : IconNode;
};

export type DataTableCellContext = {
    globalIndex: number;
    pageIndex: number;
    page: number;
    pageSize: number;
};

export type DataTableEmptyState = {
    title?: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
};
