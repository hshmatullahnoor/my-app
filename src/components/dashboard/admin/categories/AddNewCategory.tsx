import React, { useState } from 'react';
import { CategoriesApi, type CategoryRequestBody, type Category } from "../../../../api/categories_api";

interface AddNewCategoryProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onSuccess?: () => void;
}

const AddNewCategory: React.FC<AddNewCategoryProps> = ({ isOpen, onClose, categories, onSuccess }) => {

    const [formData, setFormData] = useState<CategoryRequestBody>({
        name: '',
        slug: '',
        description: '',
        parent_id: null,
    });


    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const token = localStorage.getItem('access_token') || '';


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === '' ? (name === 'parent_id' ? null : '') : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const payload: CategoryRequestBody = {
                name: formData.name.trim(),
                slug: formData.slug?.trim() || null,
                description: formData.description?.trim() || null,
                parent_id: formData.parent_id ? Number(formData.parent_id) : null,
            };

            const response = await CategoriesApi.addCategory(token, payload);

            if (response.success) {
                setSuccessMessage("دسته‌بندی با موفقیت ایجاد شد!");
                // Reset form
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    parent_id: null,
                });
                // Call success callback and close modal
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    onClose();
                }, 1500);
            } else {
                setErrorMessage("خطا در ایجاد دسته‌بندی");
            }
        } catch (error) {
            console.error('Error creating category:', error);
            setErrorMessage("خطایی در هنگام ایجاد دسته‌بندی رخ داد");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={onClose}
        >
            <div
                className="dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700 bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-700 dark:bg-gray-800">
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-white">افزودن دسته‌بندی جدید</h3>
                    <button
                        type="button"
                        className="text-2xl font-bold text-gray-500 transition-colors dark:text-gray-400 dark:hover:text-white hover:text-gray-700"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="p-6">
                    {errorMessage && (
                        <div className="px-4 py-3 mb-4 text-red-200 bg-red-900 border border-red-600 rounded">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="px-4 py-3 mb-4 text-green-200 bg-green-900 border border-green-600 rounded">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* نام دسته‌بندی */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">نام *</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 text-gray-500 placeholder-gray-400 bg-white border border-gray-700 rounded-md dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="نام دسته‌بندی"
                            />
                        </div>

                        {/* نامک */}
                        <div className="mb-4">
                            <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">نامک</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 text-gray-500 placeholder-gray-400 bg-white border border-gray-700 rounded-md dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                id="slug"
                                name="slug"
                                value={formData.slug || ''}
                                onChange={handleChange}
                                placeholder="نامک دسته‌بندی (اختیاری)"
                            />
                        </div>

                        {/* توضیحات */}
                        <div className="mb-4">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">توضیحات</label>
                            <textarea
                                className="w-full px-3 py-2 text-gray-500 placeholder-gray-400 bg-white border border-gray-700 rounded-md dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="توضیحات دسته‌بندی (اختیاری)"
                            />
                        </div>

                        {/* والد (parent_id) */}
                        <div className="mb-4">
                            <label htmlFor="parent_id" className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">دسته‌بندی والد</label>
                            <select
                                className="w-full px-3 py-2 text-gray-500 placeholder-gray-400 bg-white border border-gray-700 rounded-md dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                id="parent_id"
                                name="parent_id"
                                value={formData.parent_id || ''}
                                onChange={handleChange}
                            >
                                <option value="" className="text-gray-700 bg-white dark:bg-gray-700 dark:text-white">بدون والد</option>
                                {categories
                                    .filter(category => category.parent_id === null)
                                    .map((category) => (
                                        <option key={category.id} value={category.id} className="text-gray-700 bg-white dark:bg-gray-700 dark:text-white">
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                    </form>
                </div>
                <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 bg-white border-t border-gray-600 dark:bg-gray-700">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-200 transition-colors bg-red-600 rounded-md hover:bg-red-500 disabled:opacity-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        انصراف
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white transition-colors bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? 'در حال ارسال...' : 'افزودن دسته‌بندی'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewCategory;