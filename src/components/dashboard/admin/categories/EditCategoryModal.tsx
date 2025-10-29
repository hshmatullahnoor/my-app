import React, { useEffect, useState } from 'react';
import { CategoriesApi, type Category, type CategoryRequestBody } from '../../../../api/categories_api';

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    categories: Category[];
    onSuccess?: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
    isOpen,
    onClose,
    category,
    categories,
    onSuccess,
}) => {
    const [formData, setFormData] = useState<CategoryRequestBody>({
        name: '',
        slug: null,
        description: null,
        parent_id: null,
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description,
                parent_id: category.parent_id,
            });
            setErrorMessage(null);
            setSuccessMessage(null);
        }
    }, [category]);

    useEffect(() => {
        if (!isOpen) {
            setErrorMessage(null);
            setSuccessMessage(null);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen || !category) {
        return null;
    }

    const token = localStorage.getItem('access_token') || '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            if (name === 'parent_id') {
                return {
                    ...prev,
                    parent_id: value === '' ? null : Number(value),
                };
            }
            if (name === 'slug' || name === 'description') {
                return {
                    ...prev,
                    [name]: value === '' ? null : value,
                } as CategoryRequestBody;
            }
            return {
                ...prev,
                [name]: value,
            } as CategoryRequestBody;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) return;

        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const payload: CategoryRequestBody = {
                name: formData.name.trim(),
                slug: formData.slug ? formData.slug.trim() : null,
                description: formData.description ? formData.description.trim() : null,
                parent_id: formData.parent_id ? Number(formData.parent_id) : null,
            };

            const response = await CategoriesApi.updateCategory(token, category.id, payload);

            if (response.success) {
                setSuccessMessage('دسته‌بندی با موفقیت بروزرسانی شد!');
                if (onSuccess) {
                    onSuccess();
                }
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                setErrorMessage('خطا در بروزرسانی دسته‌بندی');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setErrorMessage('خطایی در هنگام بروزرسانی دسته‌بندی رخ داد');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">ویرایش دسته‌بندی</h3>
                    <button
                        type="button"
                        className="text-2xl font-bold text-gray-400 transition-colors hover:text-white"
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
                        <div className="mb-4">
                            <label htmlFor="edit-name" className="block mb-2 text-sm font-medium text-white">نام *</label>
                            <input
                                id="edit-name"
                                name="name"
                                type="text"
                                className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="نام دسته‌بندی"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="edit-slug" className="block mb-2 text-sm font-medium text-white">نامک</label>
                            <input
                                id="edit-slug"
                                name="slug"
                                type="text"
                                className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.slug || ''}
                                onChange={handleChange}
                                placeholder="نامک دسته‌بندی (اختیاری)"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="edit-description" className="block mb-2 text-sm font-medium text-white">توضیحات</label>
                            <textarea
                                id="edit-description"
                                name="description"
                                rows={3}
                                className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.description || ''}
                                onChange={handleChange}
                                placeholder="توضیحات دسته‌بندی (اختیاری)"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="edit-parent_id" className="block mb-2 text-sm font-medium text-white">دسته‌بندی والد</label>
                            <select
                                id="edit-parent_id"
                                name="parent_id"
                                value={formData.parent_id ?? ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" className="text-white bg-gray-700">بدون والد</option>
                                {categories
                                    .filter((item) => item.id !== category.id && item.parent_id === null)
                                    .map((item) => (
                                        <option key={item.id} value={item.id} className="text-white bg-gray-700">
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </form>
                </div>

                <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 bg-gray-700 border-t border-gray-600">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-200 transition-colors bg-red-600 rounded-md hover:bg-red-500 disabled:opacity-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'در حال بروزرسانی...' : 'ذخیره تغییرات'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;
