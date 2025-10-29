import React, { useMemo, type ReactNode } from "react";
import { type Advertising } from "../../../../api/advertisings_api";
import { DataTable, type DataTableColumn, type DataTableEmptyState } from "../../shared/data-table";
import { IMAGES_URL } from "../../../../api/main";
import { Eye } from "lucide-react";
import MoreModal from "./MoreModal";

type AdvertisingTableProps = {
    advertisings: Advertising[],
    totalPages: number,
    currentPage: number,
    defaultPerPage: number,
    onPerPageChange?: (perPage: number) => void;
    onPageChange?: (page: number) => void;
    onSearch?: (searchQuery: string) => void;
    toolbarActions?: ReactNode;
    perPageOptions?: number[];
    onMore: (advertising: Advertising) => void;
    onDelete: (advertising: Advertising) => void;
    onView: (Advertising: Advertising) => void;
    token: string;
}

const AdvertisingTable: React.FC<AdvertisingTableProps> = ({
    advertisings,
    totalPages,
    currentPage,
    defaultPerPage,
    onPageChange,
    onPerPageChange,
    onSearch,
    toolbarActions,
    perPageOptions = [5, 10, 20, 50],
    onDelete,
    onMore,
    onView,
    token
}) => {

    const formatDateTime = (value: Date | string | null) => {
        if (!value) return "-";
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }
        return new Intl.DateTimeFormat("fa-IR", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    const toTimestamp = (value: unknown): number => {
        if (!value) return 0;
        if (value instanceof Date) {
            return value.getTime();
        }
        if (typeof value === "string" || typeof value === "number") {
            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? 0 : date.getTime();
        }
        return 0;
    };




    const columns = useMemo<DataTableColumn<Advertising>[]>(() => [
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
            id: "owner",
            label: "مالک",
            toggleable: true,
            searchable: true,
            headerClassName: 'w-48',
            searchValue: (ad) => [ad.user.name, ad.user.email, ad.user.phone ?? ""],
            sortable: true,
            render: (ad) => {
                const user = ad.user;
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
            id: 'title',
            label: "عنوان",
            toggleable: true,
            searchable: true,
            headerClassName: '',
            searchValue: (ad) => [ad.title],
            sortable: true,
            render: (ad) => {
                const t = ad.title.substring(0, 20);
                const dots = t.length >= 20 ? '...' : '';
                return (
                    <span className="text-gray-500 dark:text-gray-300 text-nowrap">
                        {t + dots}
                    </span>
                )
            }

        },
        {
            id: "type",
            label: "حالت",
            toggleable: true,
            sortable: true,
            render: (ad) => {
                const type = ad.type;

                return (
                    <span
                        className={`rounded-full p-2 ${type === 'accepted'
                            ? 'bg-teal-200 text-teal-700'
                            : type === 'pending'
                                ? 'bg-yellow-300 text-yellow-600'
                                : type === 'rejected'
                                    ? 'bg-red-300 text-red-600'
                                    : ''
                            }`}
                    >
                        {type === 'accepted' ? 'تایید شده' : type === 'pending' ? 'در انتظار تایید' : type === 'rejected' ? 'رد شده' : ''}
                    </span>
                )
            }
        },
        {
            id: "status",
            label: "وضعیت",
            toggleable: true,
            sortable: true,
            render: (ad) => {
                const status = ad.status;

                return (
                    <span
                        className={`rounded-full p-2 ${status === 'active'
                            ? 'bg-teal-200 text-teal-700'
                            : status === 'inactive'
                                ? 'bg-gray-300 text-gray-600'
                                : status === 'sold'
                                    ? 'bg-green-300 text-green-600'
                                    : ''
                            }`}
                    >
                        {status === 'active' ? 'فعال' : status === 'inactive' ? 'غیر فعال' : status === 'sold' ? 'فروخته' : ''}
                    </span>
                )
            }
        },
        {
            id: "description",
            label: "توضیحات",
            toggleable: true,
            searchable: true,
            sortable: true,
            searchValue: (ad) => [ad.description],
            default_hidden: true,
            render: (ad) => {
                const desc = ad.description;
                const formated_desc = desc.length > 0 ? desc : '-';
                const limited_desc = formated_desc.length <= 50 ? formated_desc : formated_desc.substring(0, 50) + '...';
                return (
                    <span className="text-gray-500 dark:text-gray-300 text-nowrap">
                        {limited_desc}
                    </span>
                )

            }
        },
        {
            id: "price",
            label: "قیمت",
            toggleable: true,
            searchable: false,
            default_hidden: true,
            render: (ad) => {
                // محاسبه قیمت نهایی و درصد تخفیف
                const numericPrice = ad.price ? parseFloat(String(ad.price)) : 0;
                const numericDiscount = ad.discount ? parseFloat(String(ad.discount)) : 0;
                const discountPercent =
                    numericPrice && numericDiscount
                        ? ((numericDiscount / numericPrice) * 100).toFixed(1)
                        : null;
                const finalPrice = numericPrice - numericDiscount;

                return (
                    <div className="transition-colors text-nowrap">

                        {numericPrice ? (
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {finalPrice.toLocaleString()} افغانی
                                </p>
                                {numericDiscount > 0 && (
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="text-red-500 line-through">
                                            {numericPrice.toLocaleString()} افغانی
                                        </span>
                                        <span className="text-teal-500 dark:text-teal-400">{discountPercent}% تخفیف</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">قیمت وارد نشده است.</span>
                        )}
                    </div>
                )

            }
        },
        {
            id: "location",
            label: "مکان",
            toggleable: true,
            sortable: true,
            default_hidden: true,
            render: (ad) => {
                const city = ad.city_id ? ad.city.name : 'وارد نشده';
                const province = ad.province ? ad.province : 'وارد نشده';

                return (
                    <span className="p-2 text-xs text-gray-500 bg-gray-200 rounded-lg dark:bg-gray-900 text-nowrap">
                        {city + '-' + province}
                    </span>
                )
            }
        },
        {
            id: "category",
            label: "دسته بندی",
            toggleable: true,
            sortable: true,
            default_hidden: true,
            render: (ad) => {
                const name = ad.category_id ? ad.category.name : '-';
                return (
                    <span className="p-2 text-xs text-gray-500 bg-gray-200 rounded-lg dark:bg-gray-900 text-nowrap">
                        {name}
                    </span>
                )
            }
        },
        {
            id: "features",
            label: "تعداد ویژگی",
            toggleable: true,
            default_hidden: true,
            render: (ad) => {
                return <span className="p-2 text-xs text-gray-500 bg-gray-200 rounded-lg text-nowrap dark:bg-gray-900">{ad.features.length}</span>
            }
        },
        {
            id: "images",
            label: "تعداد عکسها",
            toggleable: true,
            default_hidden: true,
            render: (ad) => {
                return <span className="p-2 text-xs text-gray-500 bg-gray-200 rounded-lg text-nowrap dark:bg-gray-900">{ad.images.length}</span>
            }
        },
        {
            id: "created_at",
            label: "تاریخ ایجاد",
            toggleable: true,
            sortable: true,
            default_hidden: true,
            sortValue: (ad) => toTimestamp(ad.created_at),
            render: (ad) => (
                <span className="text-sm text-gray-500 text-nowrap dark:text-gray-300">{formatDateTime(ad.created_at)}</span>
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
            render: (ad) => (
                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        onClick={onDelete ? () => onDelete(ad) : undefined}
                        className="p-2 text-red-400 transition-colors rounded-md hover:text-red-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                        title="حذف"
                        disabled={!onDelete}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={onView ? () => onView(ad) : undefined}
                        className="p-2 text-teal-400 transition-colors rounded-md hover:text-teal-500 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                        title="دیدن"
                        disabled={!onView}
                    >
                        <Eye />
                    </button>
                    <MoreModal
                        advertising={ad}
                        token={token}
                        onEdit={onMore}
                    />
                </div>
            ),
        },
    ], [onDelete, onMore, onView, token])

    const emptyState = useMemo<DataTableEmptyState>(() => ({
        title: "هیچ آگهی یافت نشد",
        description: "هیچ آگهی هنوز ثبت نشده"
    }), []);

    // //defaultPerPage + ' ' + currentPage + ' ' + totalPages + ' ' + perPage)

    return (
        <DataTable
            data={advertisings}
            columns={columns}
            rowKey={(user) => user.id}
            searchPlaceholder="جستجو در آگهی ها..."
            emptyState={emptyState}
            toolbarActions={toolbarActions}
            perPageOptions={perPageOptions}
            initialSort={{ columnId: "created_at", direction: "desc" }}
            daynamicPagenaition={true}
            daynamicCurrentPage={currentPage}
            daynamicPagenaitionPagesCount={totalPages}
            daynamicPagenaitionPerPage={defaultPerPage}
            serverSideSearch={true}
            onDaynamicPageChange={onPageChange}
            onServerSearch={onSearch}
            onDaynamicPerPageChange={onPerPageChange}
        />
    )
}

export default AdvertisingTable;