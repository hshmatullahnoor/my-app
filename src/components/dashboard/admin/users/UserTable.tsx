import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../../../../api/auth_api";
import {
    DataTable,
    type DataTableColumn,
    type DataTableEmptyState,
} from "../../shared/data-table";
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorState from "../../../ErrorState";
import { getCities, type City } from "../../../../types/functions";
import { IMAGES_URL } from "../../../../api/main";

type UserTableProps = {
    users: User[];
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    toolbarActions?: ReactNode;
    perPageOptions?: number[];
    defaultPerPage?: number;
    totalPages?: number;
    curentPage?: number;
    onPageChange?: (page: number) => void;
    onSearch?: (query: string) => void;
    onPerPageChange?: (perPage: number) => void;
};

const formatDateTime = (value: Date | string | null) => {
    if (!value) return "-";
    const date = value && value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }
    return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const formatBooleanBadge = (value: boolean | null, trueLabel: string, falseLabel: string) => {
    const isTrue = Boolean(value);
    return (
        <span
            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${isTrue ? "dark:bg-emerald-600/20 dark:text-emerald-300 bg-teal-400 text-white" : "dark:bg-gray-700 dark:text-gray-400 bg-gray-200 text-gray-500"
                }`}
        >
            {isTrue ? trueLabel : falseLabel}
        </span>
    );
};

const roleBadge = (role: User["role"]) => {
    if (!role) {
        return <span className="text-gray-400">نامشخص</span>;
    }

    const styles =
        role === "admin"
            ? "dark:bg-indigo-600/20 dark:text-indigo-300 bg-teal-400 text-white"
            : "dark:bg-sky-600/20 dark:text-sky-300 bg-gray-200 text-gray-500";

    const label = role === "admin" ? "مدیر" : "کاربر";

    return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${styles}`}>
            {label}
        </span>
    );
};


const UserTable = ({
    users,
    loading = false,
    error,
    onRetry,
    onEdit,
    onDelete,
    toolbarActions,
    perPageOptions = [5, 10, 20, 50, 100],
    defaultPerPage = 20,
    totalPages,
    curentPage,
    onPageChange,
    onSearch,
    onPerPageChange
}: UserTableProps) => {

    const [cityNames, setCityNames] = useState<Record<number, string>>({});

    useEffect(() => {
        let isMounted = true;

        const loadCities = async () => {
            try {
                const response = await getCities();
                if (!isMounted) return;

                if (response.success && Array.isArray(response.cities)) {
                    const mapped = response.cities.reduce<Record<number, string>>((acc, city: City) => {
                        acc[city.id] = city.name;
                        return acc;
                    }, {});
                    setCityNames(mapped);
                }
            } catch (cityError) {
                console.error("خطا در بارگذاری لیست شهرها", cityError);
            }
        };

        void loadCities();

        return () => {
            isMounted = false;
        };
    }, []);

    const getCityName = useCallback((cityId: number | null): string => {
        if (!cityId) return "-";
        return cityNames[cityId] ?? "-";
    }, [cityNames]);

    const columns = useMemo<DataTableColumn<User>[]>(() => [
        {
            id: "id",
            label: "#",
            toggleable: true,
            searchable: false,
            sortable: false,
            headerClassName: "w-16",
            render: (_user, context) => context.globalIndex + 1,
        },
        {
            id: "name",
            label: "نام",
            sortable: true,
            searchValue: (user) => [user.name, user.email ?? "", user.phone ?? ""],
            render: (user) => {
                const avatarUrl = user.avatar ? (IMAGES_URL + user.avatar) : '';
                return (
                    <div className="flex items-center gap-3">
                        {/* Avatar wrapper */}
                        <div className="flex-shrink-0 w-10 h-10">
                            {user.avatar ? (
                                <img
                                    src={avatarUrl}
                                    alt={user.name}
                                    className="object-cover w-full h-full rounded-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-lg font-semibold text-white bg-gray-600 rounded-full">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Name & Email */}
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-gray-800 truncate dark:text-white">{user.name}</span>
                            <span className="text-xs text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                        </div>
                    </div>
                );
            }
        },

        {
            id: "city_id",
            label: "شهر",
            sortable: true,
            searchValue: (user) => getCityName(user.city_id),
            sortValue: (user) => getCityName(user.city_id),
            render: (user) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">{getCityName(user.city_id)}</span>
            ),
        },
        {
            id: "phone",
            label: "شماره تماس",
            sortable: true,
            searchValue: (user) => user.phone ?? "",
            render: (user) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">{user.phone ?? "-"}</span>
            ),
        },
        {
            id: "role",
            label: "نقش",
            sortable: true,
            searchValue: (user) => user.role ?? "",
            sortValue: (user) => user.role ?? "",
            render: (user) => roleBadge(user.role),
        },
        {
            id: "telegram",
            label: "تلگرام",
            sortable: true,
            searchValue: (user) => user.telegram ?? "",
            render: (user) => (
                <span className="text-sm text-gray-500 dark:text-gray-300">{user.telegram ?? "-"}</span>
            ),
        },
        {
            id: "show_phone",
            label: "نمایش تلفن",
            sortable: true,
            searchValue: (user) => (user.show_phone ? "بله" : "خیر"),
            sortValue: (user) => (user.show_phone ? 1 : 0),
            render: (user) => formatBooleanBadge(user.show_phone, "بله", "خیر"),
        },
        {
            id: "show_telegram",
            label: "نمایش تلگرام",
            sortable: true,
            searchValue: (user) => (user.show_telegram ? "بله" : "خیر"),
            sortValue: (user) => (user.show_telegram ? 1 : 0),
            render: (user) => formatBooleanBadge(user.show_telegram, "بله", "خیر"),
        },
        {
            id: "email_verified_at",
            label: "تایید ایمیل",
            sortable: true,
            searchValue: (user) => formatDateTime(user.email_verified_at),
            sortValue: (user) => {
                const value = user.email_verified_at;
                if (!value) return 0;
                const date = value && value instanceof Date ? value : new Date(value);
                return Number.isNaN(date.getTime()) ? 0 : date.getTime();
            },
            render: (user) => (
                <span className="text-sm text-gray-500 dark:text-gray-300">{formatDateTime(user.email_verified_at)}</span>
            ),
        },
        {
            id: "created_at",
            label: "تاریخ ایجاد",
            sortable: true,
            searchValue: (user) => formatDateTime(user.created_at),
            sortValue: (user) => {
                const value = user.email_verified_at;
                if (!value) return 0;
                const date = value && value instanceof Date ? value : new Date(value);
                return Number.isNaN(date.getTime()) ? 0 : date.getTime();
            },
            render: (user) => (
                <span className="text-sm text-gray-500 dark:text-gray-300">{formatDateTime(user.created_at)}</span>
            ),
        },
        {
            id: "actions",
            label: "عملیات",
            align: "center",
            sortable: false,
            searchable: false,
            toggleable: false,
            headerClassName: "w-36",
            render: (user) => (
                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        onClick={onEdit ? () => onEdit(user) : undefined}
                        className="p-2 text-teal-400 transition-colors rounded-md hover:bg-gray-300 hover:text-teal-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="ویرایش"
                        disabled={!onEdit}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={onDelete ? () => onDelete(user) : undefined}
                        className="p-2 text-red-400 transition-colors rounded-md hover:text-red-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                        title="حذف"
                        disabled={!onDelete}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ),
        },
    ], [getCityName, onDelete, onEdit]);

    const emptyState = useMemo<DataTableEmptyState>(() => ({
        title: "هیچ کاربری یافت نشد",
        description: "برای شروع، از دکمه کاربر جدید استفاده کنید",
    }), []);

    if (loading && users.length === 0 && !error) {
        return <LoadingSpinner />;
    }

    if (error) {
        if (onRetry) {
            return <ErrorState error={error} onRetry={onRetry} />;
        }

        return (
            <div className="px-6 py-4 mb-8 text-red-200 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-center">{error}</p>
            </div>
        );
    }

    return (
        <DataTable
            data={users}
            columns={columns}
            rowKey={(user) => user.id}
            searchPlaceholder="جستجو در کاربران..."
            emptyState={emptyState}
            toolbarActions={toolbarActions}
            perPageOptions={perPageOptions}
            initialSort={{ columnId: "created_at", direction: "desc" }}
            daynamicPagenaition={true}
            daynamicCurrentPage={curentPage}
            daynamicPagenaitionPagesCount={totalPages}
            daynamicPagenaitionPerPage={defaultPerPage}
            serverSideSearch={true}
            onDaynamicPageChange={onPageChange}
            onServerSearch={onSearch}
            onDaynamicPerPageChange={onPerPageChange}
        />
    );
};

export default UserTable;