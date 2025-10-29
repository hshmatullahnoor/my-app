import React, { useEffect, useState } from "react";
import { CategoriesApi, type Category } from "../../../api/categories_api";

type CategorySectionProps = {
    onSelectCategory: (categoryId: number) => void;
    onSelectSubcategory: (subcategoryId: number) => void;
    errors?: Array<{ key: string; value: string }>;
};

const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory, onSelectSubcategory, errors }) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);

    const fetchCategories = async () => {
        try {
            const response = await CategoriesApi.getCategories();
            if (response.success) {
                setCategories(response.data);
                const parents = response.data.filter(cat => cat.parent_id === null);
                setParentCategories(parents);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    return (
        <div className="p-6 space-y-6 transition-colors border border-gray-200 shadow-sm rounded-xl bg-white/90 dark:bg-gray-900 dark:border-gray-700">
            {/* بخش اطلاعات */}
            <div className="mb-4 text-gray-900 dark:text-gray-100">
                <h3 className="mb-2 text-xl font-bold">دسته‌بندی آگهی</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">لطفاً دسته‌بندی مناسب برای آگهی خود را انتخاب کنید.</p>
            </div>

            {/* بخش انتخاب دسته‌ها */}
            <div className="space-y-4">
                {/* دسته‌بندی اصلی */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">دسته‌بندی اصلی</label>
                    <div className="relative">
                        <select
                            className="w-full p-2 pr-8 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                            value={selectedCategoryId || ""}
                            onChange={(e) => {
                                const categoryId = parseInt(e.target.value);
                                setSelectedCategoryId(categoryId);
                                setSelectedSubcategoryId(null);
                                onSelectCategory(categoryId);

                                const subs = categories.filter((cat) => cat.parent_id === categoryId);
                                setSubcategories(subs);
                            }}
                        >
                            <option value="" disabled>
                                دسته‌بندی را انتخاب کنید
                            </option>
                            {parentCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* فلش سفارشی */}
                        <span className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-2 dark:text-gray-500">
                            ▼
                        </span>
                        {errors && errors.some(err => err.key === 'category_id') && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.find(err => err.key === 'category_id')?.value}
                            </p>
                        )}
                    </div>
                </div>

                {/* زیر دسته */}
                {subcategories.length > 0 && (
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">زیر دسته‌بندی</label>
                        <div className="relative">
                            <select
                                className="w-full p-2 pr-8 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                                value={selectedSubcategoryId || ""}
                                onChange={(e) => {
                                    const subcategoryId = parseInt(e.target.value);
                                    setSelectedSubcategoryId(subcategoryId);
                                    onSelectSubcategory(subcategoryId);
                                }}
                            >
                                <option value="" disabled>
                                    زیر دسته‌بندی را انتخاب کنید
                                </option>
                                {subcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </option>
                                ))}
                            </select>

                            {/* فلش سفارشی */}
                            <span className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-2 dark:text-gray-500">
                                ▼
                            </span>
                            {errors && errors.some(err => err.key === 'sub_category_id') && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.find(err => err.key === 'sub_category_id')?.value}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySection;