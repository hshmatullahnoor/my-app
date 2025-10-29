import { useMemo, type ReactNode } from "react";
import type { Category } from "../../../../../api/categories_api";
import {
    DataTable,
    type DataTableColumn,
    type DataTableEmptyState,
} from "../../../shared/data-table";

type TableProps = {
    categories: Category[];
    onEdit?: (category: Category) => void;
    onDelete?: (category: Category) => void;
    toolbarActions?: ReactNode;
};

export const Table = ({ categories, onEdit, onDelete, toolbarActions }: TableProps) => {
    const categoryMap = useMemo(() => {
        const map = new Map<number, string>();
        categories.forEach((category) => {
            map.set(category.id, category.name);
        });
        return map;
    }, [categories]);

    const columns = useMemo<DataTableColumn<Category>[]>(() => [
        {
            id: "index",
            label: "#",
            render: (_category, context) => context.globalIndex + 1,
            sortable: false,
            searchable: false,
            toggleable: true,
            headerClassName: "w-16",
        },
        {
            id: "name",
            label: "نام دسته‌بندی",
            sortable: true,
            searchValue: (category) => category.name,
            render: (category) => (
                <div className="text-sm font-medium text-gray-700 dark:text-white">{category.name}</div>
            ),
        },
        {
            id: "slug",
            label: "نامک",
            sortable: true,
            searchValue: (category) => category.slug ?? "",
            render: (category) => (
                <div className="text-sm text-gray-500 dark:text-gray-400">{category.slug ?? "-"}</div>
            ),
        },
        {
            id: "description",
            label: "توضیحات",
            sortable: true,
            searchValue: (category) => category.description ?? "",
            render: (category) => (
                <div
                    className="max-w-xs text-sm text-gray-500 truncate dark:text-gray-400"
                    title={category.description ?? "-"}
                >
                    {category.description ?? "-"}
                </div>
            ),
        },
        {
            id: "parent_id",
            label: "دسته‌بندی والد",
            sortable: true,
            searchValue: (category) =>
                category.parent_id ? categoryMap.get(category.parent_id) ?? "-" : "-",
            sortValue: (category) =>
                category.parent_id ? categoryMap.get(category.parent_id) ?? "-" : "-",
            render: (category) => (
                <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-gray-500 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    {category.parent_id
                        ? categoryMap.get(category.parent_id) ?? "-"
                        : "-"}
                </span>
            ),
        },
        {
            id: "actions",
            label: "عملیات",
            sortable: false,
            searchable: false,
            toggleable: false,
            align: "center",
            headerClassName: "w-36",
            render: (category) => (
                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit?.(category)}
                        className="p-2 text-teal-400 transition-colors rounded-md hover:text-teal-300 hover:bg-gray-700"
                        title="ویرایش"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete?.(category)}
                        className="p-2 text-red-400 transition-colors rounded-md hover:text-red-300 hover:bg-gray-700"
                        title="حذف"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            ),
        },
    ], [categoryMap, onDelete, onEdit]);

    const emptyState = useMemo<DataTableEmptyState>(() => ({
        title: "هیچ دسته‌بندی یافت نشد",
        description: "برای شروع، یک دسته‌بندی جدید اضافه کنید",
    }), []);

    return (
        <DataTable
            realTimeSearch={true}
            data={categories}
            columns={columns}
            rowKey={(category) => category.id}
            searchPlaceholder="جستجو در دسته‌بندی‌ها..."
            emptyState={emptyState}
            defaultPerPage={5}
            perPageOptions={[5, 10, 20, 50]}
            initialSort={{ columnId: "name", direction: "asc" }}
            toolbarActions={toolbarActions}
        />
    );
};