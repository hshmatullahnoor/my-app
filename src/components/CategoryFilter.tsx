import React, { useState, useEffect } from 'react';
import { CategoriesApi, type Category } from '../api/categories_api';

interface CategoryFilterProps {
    onCategoryChange: (categoryId: number | null) => void;
    selectedCategoryId: number | null;
    onClose?: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    onCategoryChange,
    selectedCategoryId,
    onClose
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [childCategories, setChildCategories] = useState<Category[]>([]);
    const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Update child categories when parent is selected
    useEffect(() => {
        if (selectedParentId) {
            const children = categories.filter(cat => cat.parent_id === selectedParentId);
            setChildCategories(children);
        } else {
            setChildCategories([]);
        }
    }, [selectedParentId, categories]);

    // Initialize selected values if a category is already selected
    useEffect(() => {
        if (selectedCategoryId && categories.length > 0) {
            const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
            if (selectedCategory?.parent_id) {
                setSelectedParentId(selectedCategory.parent_id);
            } else if (!selectedCategory?.parent_id) {
                setSelectedParentId(selectedCategory?.id || null);
            }
        }
    }, [selectedCategoryId, categories]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoriesApi.getCategories();

            if (response.success) {
                setCategories(response.data);
                // Filter parent categories (those without parent_id)
                const parents = response.data.filter(cat => cat.parent_id === null);
                setParentCategories(parents);
            } else {
                setError('خطا در دریافت دسته‌بندی‌ها');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            setError('خطا در برقراری ارتباط با سرور');
        } finally {
            setLoading(false);
        }
    };

    const handleParentChange = (parentId: string) => {
        const newParentId = parentId ? Number(parentId) : null;
        setSelectedParentId(newParentId);
        onCategoryChange(newParentId); // ✅ تغییر از null به newParentId
    };

    const handleChildChange = (childId: string) => {
        const newChildId = childId ? Number(childId) : null;
        onCategoryChange(newChildId);
    };

    const resetFilters = () => {
        setSelectedParentId(null);
        setChildCategories([]);
        onCategoryChange(null);
    };

    if (loading) {
        return (
            <div className="flex items-center mb-6 space-x-4 space-x-reverse">
                <div className="w-40 h-10 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                <div className="w-40 h-10 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-3 mb-6 text-sm text-red-700 border border-red-300 rounded-lg bg-red-50 dark:border-red-700 dark:bg-red-900/40 dark:text-red-200">
                {error}
            </div>
        );
    }

    return (
        <div className="p-4 mb-4 transition-colors duration-300 bg-white border border-gray-200 rounded-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300">
                        دسته‌بندی اصلی:
                    </label>
                    <select
                        value={selectedParentId || ''}
                        onChange={(e) => handleParentChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-gray-900 transition-all duration-300 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/30"
                    >
                        <option value="">همه دسته‌بندی‌ها</option>
                        {parentCategories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedParentId && childCategories.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 transition-colors duration-300 dark:text-gray-300">
                            زیر دسته‌بندی:
                        </label>
                        <select
                            value={selectedCategoryId || ''}
                            onChange={(e) => handleChildChange(e.target.value)}
                            className="w-full px-3 py-2 text-sm text-gray-900 transition-all duration-300 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400/30"
                        >
                            <option value="">همه زیر دسته‌ها</option>
                            {childCategories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex flex-col justify-end space-y-2">
                    {(selectedParentId || selectedCategoryId) && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center justify-center px-3 py-2 text-sm text-gray-700 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            پاک کردن
                        </button>
                    )}
                    {selectedCategoryId && (
                        <p className="text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400">
                            فیلتر: {categories.find(cat => cat.id === selectedCategoryId)?.name}
                        </p>
                    )}

                    <button
                        onClick={onClose}
                        className="items-center justify-center px-3 py-2 text-sm text-gray-700 transition-colors duration-300 bg-white border border-gray-300 rounded-lg md:hiddeninline-flex hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;