import React from "react";

type DetailsSectionProps = {
    errors?: Array<{ key: string; value: string }>;
    onInputChange?: (field: string, value: string) => void;
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ errors, onInputChange }) => {
    return (
        <div className="p-6 space-y-6 transition-colors border rounded-xl bg-white/90 border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            {/* بخش اطلاعات */}
            <div className="mb-4 text-gray-900 dark:text-gray-100">
                <h3 className="mb-2 text-xl font-bold">جزئیات آگهی</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">لطفاً جزئیات دقیق‌تری از آگهی خود ارائه دهید تا خریداران بتوانند بهتر تصمیم بگیرند.</p>
            </div>
            {/* بخش ورودی جزئیات */}
            <div className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="title">
                        عنوان آگهی
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full p-2 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                        placeholder="عنوان آگهی را وارد کنید"
                        onChange={(e) => {
                            if (onInputChange) {
                                onInputChange('title', e.target.value);
                            }
                        }}
                    />
                    {errors && errors.some(err => err.key === 'title') && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.find(err => err.key === 'title')?.value}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="description">
                        توضیحات آگهی
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="w-full p-3 text-sm font-medium leading-6 text-gray-900 transition-colors bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                        placeholder="توضیحات آگهی را وارد کنید"
                        rows={4}
                        onChange={(e) => {
                            if (onInputChange) {
                                onInputChange('description', e.target.value);
                            }
                        }}
                    ></textarea>
                    {errors && errors.some(err => err.key === 'description') && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.find(err => err.key === 'description')?.value}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailsSection;