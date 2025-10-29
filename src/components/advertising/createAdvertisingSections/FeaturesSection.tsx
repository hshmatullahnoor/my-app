import React, { useEffect, useState } from "react";
import CategoryFeaturesAPI, { type CategoryFeatures } from "../../../api/admin/categoryFeatures_api";
import type { SaveAdvertisingFeaturePayload } from "../../../api/save_advertisings_api";

type FeaturesSectionProps = {
    errors?: Array<{ key: string; value: string }>;
    categoryId: number;
    onSelectedFeatures?: (features: SaveAdvertisingFeaturePayload[]) => void;
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ errors, categoryId, onSelectedFeatures }) => {

    const [features, setFeatures] = useState<CategoryFeatures[]>([]);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await CategoryFeaturesAPI.GrtAllCategoryFeatures();
                if (response.success) {
                    const categoryFeatures = response.data.filter(feature => feature.category_id === categoryId);
                    setFeatures(categoryFeatures);
                }
            } catch (error) {
                console.error("Error fetching features:", error);
            }
        };

        if (categoryId) {
            fetchFeatures();
        }
    }, [categoryId]);



    return (
        <div className="p-6 space-y-6 transition-colors border rounded-xl bg-white/90 border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            {/* بخش اطلاعات */}
            <div className="mb-4 text-gray-900 dark:text-gray-100">
                <h3 className="mb-2 text-xl font-bold">ویژگی‌های آگهی</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">لطفاً ویژگی‌های مرتبط با آگهی خود را انتخاب کنید. این اطلاعات به خریداران کمک می‌کند تا تصمیم بهتری بگیرند.</p>
            </div>

            {/* بخش انتخاب ویژگی ها */}
            <div className={`space-y-4 ${features.length >= 5 ? 'md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0' : ''}`}>
                {features.map((feature) => (
                    <div key={feature.id}>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">{feature.feature_name}
                        </label>

                        {feature.feature_type === "string" && (
                            <input
                                type="text"
                                name={`feature_${feature.id}`}
                                className="w-full p-2 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                                placeholder={`لطفا ${feature.feature_name} را وارد کنید`}
                                onBlur={(e) => {
                                    const value = e.target.value.trim();
                                    if (value) {
                                        // Update the feature value in the parent component
                                        if (onSelectedFeatures) {
                                            onSelectedFeatures([{ feature_id: feature.category_id, value }]);
                                        }
                                    }
                                }
                                }
                            />
                        )}
                        {feature.feature_type === "json" && (
                            <select
                                name={`feature_${feature.id}`}
                                className="w-full p-2 pr-8 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                                defaultValue=""
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value && value !== "0") {
                                        // Update the feature value in the parent component
                                        if (onSelectedFeatures) {
                                            onSelectedFeatures([{ feature_id: feature.category_id, value }]);
                                        }
                                    }
                                }}
                            >
                                <option value="" disabled>
                                    {`لطفا ${feature.feature_name} را انتخاب کنید`}
                                </option>
                                <option value="0">بدون انتخاب</option>
                                {feature.options && JSON.parse(feature.options).map((option: string, index: number) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors && errors.some(err => err.key === `feature_${feature.id}`) && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.find(err => err.key === `feature_${feature.id}`)?.value}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesSection;