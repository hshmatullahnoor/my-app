import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SidebarNav from "../sidebarNav";
import AuthAPI, { type User } from "../../../api/auth_api";
import CategoryFeaturesAPI, {
    type CategoryFeaturePayload,
    type CategoryFeatures,
} from "../../../api/admin/categoryFeatures_api";
import { CategoriesApi, type Category } from "../../../api/categories_api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorState from "../../../components/ErrorState";
import {
    DataTable,
    type DataTableColumn,
    type DataTableEmptyState,
} from "../../../components/dashboard/shared/data-table";
import { DeleteModal } from "../../../components/dashboard/shared/data-table/deleteModal";
import { type FormValue } from "../../../components/dashboard/shared/data-table/form";
import CategoryFeatureFormModal from "./createCategoryFeature";

const formatDateTime = (value: string | null) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const typeBadge = (type: CategoryFeatures["feature_type"]) => {
    const isJson = type === "json";
    const label = isJson ? "چند گزینه‌ای" : "متنی";
    const styles = isJson
        ? "bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-300"
        : "bg-sky-100 text-sky-700 dark:bg-sky-600/20 dark:text-sky-300";

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${styles}`}>
            {label}
        </span>
    );
};

const normalizeOptions = (value: FormValue, featureType: CategoryFeatures["feature_type"]): string[] | null => {
    if (featureType !== "json") return null;

    if (typeof value !== "string") return [];

    return value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
};

const optionBlob = (value: string, more: number = 0) => {
    return (
        <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-200">
                {value}
            </span>
            {more > 0 && (
                <span className="inline-flex items-center px-2 py-1 ml-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-200">
                    +{more}
                </span>
            )}
        </div>
    );
};

const formatFeatureOptions = (options: string | null) => {
    if (!options || options.length === 0) return optionBlob("-");
    const parsedOptions: Array<string> = JSON.parse(options);

    if (parsedOptions.length < 1) {
        return optionBlob("-");
    }

    return optionBlob(parsedOptions[0], parsedOptions.length - 1);
};

const CategoryFeaturesPage = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>("");
    const [features, setFeatures] = useState<CategoryFeatures[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMetadataLoading, setIsMetadataLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFeature, setSelectedFeature] = useState<CategoryFeatures | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const categoriesById = useMemo(() => {
        return categories.reduce<Record<number, string>>((acc, category) => {
            acc[category.id] = category.name;
            return acc;
        }, {});
    }, [categories]);

    const getCategoryName = useCallback(
        (categoryId: number) => {
            if (!categoryId) return "نامشخص";
            return categoriesById[categoryId] ?? "نامشخص";
        },
        [categoriesById],
    );

    const fetchFeatures = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await CategoryFeaturesAPI.GrtAllCategoryFeatures();

            if (res.success && Array.isArray(res.data)) {
                setFeatures(res.data);
            } else {
                setFeatures([]);
                setError(res.message ?? "خطا در دریافت ویژگی‌ها");
            }
        } catch (fetchError) {
            console.error("خطا در دریافت ویژگی‌ها:", fetchError);
            setFeatures([]);
            setError("خطا در ارتباط با سرور");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshCategories = useCallback(async () => {
        try {
            setIsMetadataLoading(true);
            const response = await CategoriesApi.getCategories();
            if (response.success && Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                setCategories([]);
                toast.error("خطا در دریافت دسته‌بندی‌ها");
            }
        } catch (categoryError) {
            console.error("خطا در دریافت دسته‌بندی‌ها:", categoryError);
            setCategories([]);
            toast.error("ارتباط با سرور برای دریافت دسته‌بندی‌ها برقرار نشد");
        } finally {
            setIsMetadataLoading(false);
        }
    }, []);

    const initialize = useCallback(async () => {
        const storedToken = localStorage.getItem("access_token");

        if (!storedToken) {
            toast.error("برای مشاهده این صفحه لازم است دوباره وارد شوید.");
            navigate("/login");
            return;
        }

        setToken(storedToken);

        try {
            setIsMetadataLoading(true);
            const response = await AuthAPI.getUser(storedToken);

            if (response.success && response.user) {
                if (response.user.role !== "admin") {
                    toast.error("دسترسی لازم برای مشاهده این صفحه را ندارید.");
                    navigate("/dashboard");
                    return;
                }
                setCurrentUser(response.user);
            } else {
                toast.error("خطا در دریافت اطلاعات کاربر");
                navigate("/login");
                return;
            }
        } catch (authError) {
            console.error("خطا در اعتبارسنجی کاربر:", authError);
            toast.error("خطا در برقراری ارتباط با سرور");
            navigate("/login");
            return;
        } finally {
            setIsMetadataLoading(false);
        }

        await refreshCategories();
        await fetchFeatures();
    }, [fetchFeatures, navigate, refreshCategories]);

    useEffect(() => {
        void initialize();
    }, [initialize]);

    const featureColumns = useMemo<DataTableColumn<CategoryFeatures>[]>(() => [
        {
            id: "index",
            label: "#",
            toggleable: true,
            sortable: false,
            searchable: false,
            headerClassName: "w-12",
            render: (_feature, context) => context.globalIndex + 1,
        },
        {
            id: "feature_name",
            label: "نام ویژگی",
            sortable: true,
            searchValue: (feature) => feature.feature_name,
            render: (feature) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{feature.feature_name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">شناسه #{feature.id}</span>
                </div>
            ),
        },
        {
            id: "category_id",
            label: "دسته‌بندی",
            sortable: true,
            searchValue: (feature) => getCategoryName(feature.category_id),
            sortValue: (feature) => getCategoryName(feature.category_id),
            render: (feature) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">{getCategoryName(feature.category_id)}</span>
            ),
        },
        {
            id: "feature_type",
            label: "نوع",
            sortable: true,
            default_hidden: true,
            searchValue: (feature) => feature.feature_type,
            sortValue: (feature) => feature.feature_type,
            render: (feature) => typeBadge(feature.feature_type),
        },
        {
            id: "options",
            label: "گزینه‌ها",
            sortable: false,
            default_hidden: true,
            searchValue: () => "",
            render: (feature) => formatFeatureOptions(feature.options ?? null),
        },
        {
            id: "icon",
            label: "آیکون",
            sortable: false,
            searchable: false,
            default_hidden: true,
            render: (feature) => (
                feature.icon ? (
                    <div className="flex justify-center" title="نمایش آیکون">
                        <span
                            className="block w-6 h-6 text-gray-600 dark:text-gray-200"
                            dangerouslySetInnerHTML={{ __html: feature.icon ?? "" }}
                        />
                    </div>
                ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                )
            ),
        },
        {
            id: "created_at",
            label: "تاریخ ایجاد",
            sortable: true,
            default_hidden: true,
            searchValue: (feature) => formatDateTime(feature.created_at),
            sortValue: (feature) => {
                const date = new Date(feature.created_at);
                return Number.isNaN(date.getTime()) ? 0 : date.getTime();
            },
            render: (feature) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">{formatDateTime(feature.created_at)}</span>
            ),
        },
        {
            id: "updated_at",
            label: "آخرین بروزرسانی",
            sortable: true,
            default_hidden: true,
            searchValue: (feature) => formatDateTime(feature.updated_at),
            sortValue: (feature) => {
                if (!feature.updated_at) return 0;
                const date = new Date(feature.updated_at);
                return Number.isNaN(date.getTime()) ? 0 : date.getTime();
            },
            render: (feature) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">{formatDateTime(feature.updated_at)}</span>
            ),
        },
        {
            id: "actions",
            label: "عملیات",
            align: "center",
            toggleable: false,
            sortable: false,
            searchable: false,
            headerClassName: "w-32",
            render: (feature) => (
                <div className="flex justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedFeature(feature);
                            setIsEditModalOpen(true);
                        }}
                        className="p-2 text-teal-600 transition-colors rounded-md hover:bg-teal-50 hover:text-teal-500 dark:text-teal-400 dark:hover:bg-gray-700 dark:hover:text-teal-300"
                        title="ویرایش"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedFeature(feature);
                            setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 transition-colors rounded-md hover:bg-red-50 hover:text-red-500 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-red-300"
                        title="حذف"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ),
        },
    ], [getCategoryName]);

    const emptyState = useMemo<DataTableEmptyState>(() => ({
        title: "ویژگی‌ای یافت نشد",
        description: "برای افزودن ویژگی جدید از دکمه بالای صفحه استفاده کنید.",
    }), []);

    const buildPayload = useCallback(
        (formData: Record<string, FormValue>): CategoryFeaturePayload | null => {
            const featureName = String(formData.feature_name ?? "").trim();
            const featureType = (formData.feature_type as CategoryFeatures["feature_type"]) ?? "string";
            const categoryIdRaw = formData.category_id;
            const iconRaw = typeof formData.icon === "string" ? formData.icon.trim() : "";

            if (!featureName) {
                toast.error("نام ویژگی الزامی است.");
                return null;
            }

            const categoryId = typeof categoryIdRaw === "number"
                ? categoryIdRaw
                : Number(categoryIdRaw);

            if (!Number.isInteger(categoryId) || categoryId <= 0) {
                toast.error("انتخاب دسته‌بندی معتبر الزامی است.");
                return null;
            }

            const options = normalizeOptions(formData.options, featureType);

            return {
                feature_name: featureName,
                feature_type: featureType,
                category_id: categoryId,
                icon: iconRaw ? iconRaw : null,
                options,
            };
        },
        [],
    );

    const handleCreateSubmit = useCallback(async (formData: Record<string, FormValue>) => {
        if (!token) {
            toast.error("برای ایجاد ویژگی باید وارد شوید.");
            navigate("/login");
            return;
        }

        const payload = buildPayload(formData);
        if (!payload) return;

        try {
            const response = await CategoryFeaturesAPI.createCategoryFeature(token, payload);
            if (response.success) {
                toast.success("ویژگی جدید با موفقیت ایجاد شد");
                setIsCreateModalOpen(false);
                await fetchFeatures();
            } else {
                toast.error(response.message ?? "خطا در ایجاد ویژگی");
            }
        } catch (createError) {
            console.error("خطا در ایجاد ویژگی:", createError);
            toast.error("ارتباط با سرور برقرار نشد");
        }
    }, [buildPayload, fetchFeatures, navigate, token]);

    const handleEditSubmit = useCallback(async (formData: Record<string, FormValue>) => {
        if (!token) {
            toast.error("برای ویرایش ویژگی باید وارد شوید.");
            navigate("/login");
            return;
        }

        if (!selectedFeature) {
            toast.error("ویژگی معتبری برای ویرایش انتخاب نشده است.");
            return;
        }

        const payload = buildPayload(formData);
        if (!payload) return;

        try {
            const response = await CategoryFeaturesAPI.updateCategoryFeature(token, selectedFeature.id, payload);
            if (response.success) {
                toast.success("ویژگی با موفقیت بروزرسانی شد");
                setIsEditModalOpen(false);
                await fetchFeatures();
            } else {
                toast.error(response.message ?? "خطا در بروزرسانی ویژگی");
            }
        } catch (updateError) {
            console.error("خطا در بروزرسانی ویژگی:", updateError);
            toast.error("ارتباط با سرور برقرار نشد");
        }
    }, [buildPayload, fetchFeatures, navigate, selectedFeature, token]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!token) {
            toast.error("برای حذف ویژگی باید وارد شوید.");
            navigate("/login");
            return;
        }

        if (!selectedFeature) {
            toast.error("هیچ ویژگی برای حذف انتخاب نشده است.");
            return;
        }

        try {
            const response = await CategoryFeaturesAPI.deleteCategoryFeature(token, selectedFeature.id);
            if (response.success) {
                toast.success(`ویژگی ${selectedFeature.feature_name} حذف شد`);
                setIsDeleteModalOpen(false);
                setSelectedFeature(null);
                await fetchFeatures();
            } else {
                toast.error(response.message ?? "خطا در حذف ویژگی");
            }
        } catch (deleteError) {
            console.error("خطا در حذف ویژگی:", deleteError);
            toast.error("ارتباط با سرور برقرار نشد");
        }
    }, [fetchFeatures, navigate, selectedFeature, token]);

    if (isMetadataLoading && !currentUser) {
        return (
            <>
                <SidebarNav userRole="admin" />
                <div className="flex items-center justify-center min-h-screen pr-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                    <LoadingSpinner />
                </div>
            </>
        );
    }

    if (!currentUser) {
        return null;
    }

    return (
        <>
            <SidebarNav userRole="admin" user={currentUser} />

            <div className="min-h-screen p-6 pr-16 mt-24 md:mt-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                <div className="mx-auto max-w-7xl">
                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        title="حذف ویژگی"
                        itemName={selectedFeature?.feature_name ?? ""}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={() => {
                            setIsDeleteModalOpen(false);
                            void handleDeleteConfirm();
                        }}
                    />

                    <CategoryFeatureFormModal
                        isOpen={isCreateModalOpen}
                        type="create"
                        categories={categories}
                        initialFeature={null}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSubmit={handleCreateSubmit}
                    />

                    <CategoryFeatureFormModal
                        isOpen={isEditModalOpen}
                        type="edit"
                        categories={categories}
                        initialFeature={selectedFeature}
                        onClose={() => setIsEditModalOpen(false)}
                        onSubmit={handleEditSubmit}
                    />

                    <div className="flex items-center justify-center mb-8 md:justify-between">
                        <div className="hidden md:block">
                            <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white md:text-3xl">مدیریت ویژگی‌های دسته‌بندی</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">افزودن، ویرایش و حذف ویژگی‌های مرتبط با دسته‌بندی‌ها</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white transition bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                                type="button"
                                onClick={() => setIsCreateModalOpen(true)}
                                disabled={categories.length === 0}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 5v14m-7-7h14"
                                    />
                                </svg>
                                ویژگی جدید
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                type="button"
                                onClick={() => { void fetchFeatures(); toast.success("ویژگی‌ها بروزرسانی شد"); }}
                                disabled={isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H9m11 11v-5h-.581m-15.357-2a8.003 8.003 0 0015.356 2H15" />
                                </svg>
                                بروزرسانی
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <ErrorState
                            error={error}
                            onRetry={() => {
                                setError(null);
                                void fetchFeatures();
                            }}
                        />
                    ) : isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <DataTable
                            data={features}
                            columns={featureColumns}
                            rowKey={(feature) => feature.id}
                            searchPlaceholder="جستجو در ویژگی‌ها..."
                            emptyState={emptyState}
                            perPageOptions={[5, 10, 20, 50]}
                            defaultPerPage={5}
                            initialSort={{ columnId: "created_at", direction: "desc" }}
                            realTimeSearch={true}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default CategoryFeaturesPage;
