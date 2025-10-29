import React from "react";

type PriceSectionProps = {
    errors?: Array<{ key: string; value: string }>;
    onInputChange?: (field: string, value: string) => void;
};

const PriceSection: React.FC<PriceSectionProps> = ({ errors, onInputChange }) => {
    return (
        <div className="p-6 space-y-6 transition-colors border rounded-xl bg-white/90 border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            {/* بخش قیمت */}
            <div className="mb-4 text-gray-900 dark:text-gray-100">
                <h3 className="mb-2 text-xl font-bold">قیمت آگهی</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">لطفاً قیمت آگهی خود را وارد کنید تا خریداران بتوانند بهتر تصمیم بگیرند.</p>
            </div>
            {/* بخش ورودی قیمت */}
            <div className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="price">
                        قیمت (به افغانی)
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="w-full p-2 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                        placeholder="قیمت آگهی را وارد کنید"
                        onChange={(e) => {
                            if (onInputChange) {
                                onInputChange('price', e.target.value);
                            }
                        }}
                    />
                    {errors && errors.some(err => err.key === 'price') && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.find(err => err.key === 'price')?.value}
                        </p>
                    )}
                </div>
                {/* discount input*/}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="discount">
                        تخفیف (اختیاری)
                    </label>
                    <input
                        type="number"
                        id="discount"
                        name="discount"
                        className="w-full p-2 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                        placeholder="مقدار تخفیف را وارد کنید"
                        onChange={(e) => {
                            if (onInputChange) {
                                onInputChange('discount', e.target.value);
                            }
                        }}
                    />
                    {errors && errors.some(err => err.key === 'discount') && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.find(err => err.key === 'discount')?.value}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default PriceSection;