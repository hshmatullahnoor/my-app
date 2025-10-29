import React, { useEffect, useState } from 'react';
import { CategoriesApi, type Category } from '../../../../api/categories_api';

interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onSuccess?: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({ isOpen, onClose, category, onSuccess }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setErrorMessage(null);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen || !category) {
        return null;
    }

    const token = localStorage.getItem('access_token') || '';

    const handleDelete = async () => {
        if (!category) return;

        setLoading(true);
        setErrorMessage(null);

        try {
            const response = await CategoriesApi.deleteCategory(token, category.id);
            if (response.success) {
                if (onSuccess) {
                    onSuccess();
                }
                onClose();
            } else {
                setErrorMessage(response.message || 'حذف دسته‌بندی با خطا مواجه شد');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setErrorMessage('خطایی در هنگام حذف دسته‌بندی رخ داد');
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
                className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-white">حذف دسته‌بندی</h3>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-300">
                        آیا از حذف دسته‌بندی <span className="font-semibold text-white">{category.name}</span> اطمینان دارید؟ این عملیات قابل بازگشت نیست.
                    </p>
                    {errorMessage && (
                        <div className="px-4 py-3 text-red-200 bg-red-900 border border-red-600 rounded">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-700 border-t border-gray-600">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-200 transition-colors bg-gray-600 rounded-md hover:bg-gray-500 disabled:opacity-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        انصراف
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-500 disabled:opacity-50"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'در حال حذف...' : 'حذف دسته‌بندی'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;
