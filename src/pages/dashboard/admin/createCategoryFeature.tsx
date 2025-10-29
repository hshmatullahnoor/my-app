import { useMemo } from "react";
import { Form, type FormColumns, type FormValue } from "../../../components/dashboard/shared/data-table/form";
import type { Category } from "../../../api/categories_api";
import type { CategoryFeatures } from "../../../api/admin/categoryFeatures_api";

type CategoryFeatureFormModalProps = {
    isOpen: boolean;
    type: "create" | "edit";
    categories: Category[];
    initialFeature?: CategoryFeatures | null;
    onClose: () => void;
    onSubmit: (data: Record<string, FormValue>) => void;
};

const featureOptions = (options: string) => {
    return JSON.parse(options);
}

const buildFormColumns = (
    categories: Category[],
    feature?: CategoryFeatures | null,
): FormColumns[] => [
        {
            name: "feature_name",
            label: "نام ویژگی",
            inputType: "input",
            type: "text",
            required: true,
            value: feature?.feature_name ?? "",
            placeholder: "مثلاً رنگ یا سایز",
        },
        {
            name: "category_id",
            label: "دسته‌بندی مرتبط",
            inputType: "select",
            required: true,
            value: feature?.category_id ?? "",
            options: categories.filter(cat => cat.parent_id).map(cat => ({ value: cat.id, label: cat.name })),
            placeholder: "یک دسته‌بندی انتخاب کنید",
        },
        {
            name: "feature_type",
            label: "نوع ویژگی",
            inputType: "select",
            required: true,
            value: feature?.feature_type ?? "text",
            options: [
                { value: "text", label: "متنی" },
                { value: "json", label: "چند گزینه‌ای" },
            ],
        },
        {
            name: "options",
            label: "گزینه‌ها (برای نوع چند گزینه‌ای)",
            inputType: "textarea",
            value: feature?.options ? featureOptions(feature.options).join("\n") : "",
            placeholder: "هر گزینه در یک خط",
        },
        {
            name: "icon",
            label: "آیکون (کد SVG)",
            inputType: "textarea",
            value: feature?.icon ?? "",
            placeholder: "کد SVG را اینجا قرار دهید (اختیاری)",
        },
    ];

export const CategoryFeatureFormModal = ({
    isOpen,
    type,
    categories,
    initialFeature,
    onClose,
    onSubmit,
}: CategoryFeatureFormModalProps) => {
    const columns = useMemo(
        () => buildFormColumns(categories, initialFeature),
        [categories, initialFeature],
    );

    const title = type === "create"
        ? "ایجاد ویژگی جدید"
        : `ویرایش ویژگی ${initialFeature?.feature_name ?? ""}`;

    return (
        <Form
            isOpen={isOpen}
            title={title}
            columns={columns}
            onClose={onClose}
            onSubmit={onSubmit}
            type={type}
            key={type === "create" ? "create-category-feature" : initialFeature?.id ?? "edit-category-feature"}
        />
    );
};

export default CategoryFeatureFormModal;
