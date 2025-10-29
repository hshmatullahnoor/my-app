import React from "react";


type DeleteModalProps = {
    isOpen: boolean;
    title: string;
    itemName: string;
    onClose: () => void;
    onConfirm: () => void;
};

export const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    title,
    itemName,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md space-y-4 rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900/95">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    آیا از حذف "{itemName}" مطمئن هستید؟ این عملیات قابل بازگشت نیست.
                </p>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
                    >
                        انصراف
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                    >
                        حذف
                    </button>
                </div>
            </div>
        </div>
    );
}