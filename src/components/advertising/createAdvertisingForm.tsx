import React, { useState, useRef } from "react";
import MultiStepProgress from "./createAdvertisingSections/MultiStepProgress";
import TokenNotAllowed from "./createAdvertisingSections/tokenNotAllowed";
import CategorySection from "./createAdvertisingSections/CategorySection";
import { handleNextButtonClick } from "./createAdvertisingSections/NextButtonHandler";
import toast from "react-hot-toast";
import FeaturesSection from "./createAdvertisingSections/FeaturesSection";
import type { SaveAdvertisingFeaturePayload } from "../../api/save_advertisings_api";
import DetailsSection from "./createAdvertisingSections/DetailsSection";
import LocationSection from "./createAdvertisingSections/LocationSection";
import PriceSection from "./createAdvertisingSections/PriceSection";
import ImagesSection from "./createAdvertisingSections/ImagesSection";
import ReViewSection from "./createAdvertisingSections/ReViewSection";

type CreateAdvertisingFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
    token: string | null;
};

const CreateAdvertisingForm: React.FC<CreateAdvertisingFormProps> = ({ isOpen, onClose, onSubmit, token }) => {
    const progressSteps = ["دسته‌بندی", "ویژگی‌ها", "جزئیات", "موقعیت", "قیمت", "تصاویر", "بازبینی"];

    // Stateهای فرم
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [errors, setErrors] = useState<Array<{ key: string; value: string }>>([]);
    const [selectedCategoryFeatures, setSelectedCategoryFeatures] = useState<SaveAdvertisingFeaturePayload[][]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    // FormData در ref ذخیره می‌شود تا بین ری‌ رندرها حفظ شود
    const formDataRef = useRef<FormData>(new FormData());
    const formData = formDataRef.current;

    if (!isOpen) return null;
    if (!token) return <TokenNotAllowed onClose={onClose} loginURL="/login" />;

    // تابع ریست فرم
    const resetForm = () => {
        formDataRef.current = new FormData();
        setCurrentStep(1);
        setErrors([]);
        setSelectedCategoryFeatures([]);
        setImageFiles([]);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[2000] bg-black/50">
            <div className="z-50 w-full p-6 transition-colors bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-[98%] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl dark:bg-gray-900 dark:border-gray-700">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">ایجاد آگهی جدید</h2>

                <MultiStepProgress
                    totalSteps={progressSteps.length}
                    currentStep={currentStep}
                    titles={progressSteps}
                />

                <form
                    className="mt-16 overflow-y-auto z-[300]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="mt-6 overflow-y-auto max-h-[60vh] text-gray-900 rounded-md dark:text-gray-100">
                        {Math.floor(currentStep) === 1 && (
                            <CategorySection
                                onSelectCategory={(categoryId) => {
                                    setCurrentStep(1.4);
                                    formData.set("category_id", categoryId.toString());
                                }}
                                onSelectSubcategory={(subcategoryId) => {
                                    setCurrentStep(1.8);
                                    formData.set("sub_category_id", subcategoryId.toString());
                                }}
                                errors={errors}
                            />
                        )}

                        {Math.floor(currentStep) === 2 && (
                            <FeaturesSection
                                categoryId={Number(formData.get("sub_category_id"))}
                                errors={errors}
                                onSelectedFeatures={(features) => {
                                    setSelectedCategoryFeatures((prev) => [...prev, features]);
                                }}
                            />
                        )}

                        {Math.floor(currentStep) === 3 && (
                            <DetailsSection
                                errors={errors}
                                onInputChange={(field, value) => {
                                    formData.set(field, value);
                                }}
                            />
                        )}

                        {Math.floor(currentStep) === 4 && (
                            <LocationSection
                                errors={errors}
                                onInputChange={(field, value) => {
                                    formData.set(field, value);
                                }}
                            />
                        )}

                        {Math.floor(currentStep) === 5 && (
                            <PriceSection
                                errors={errors}
                                onInputChange={(field, value) => {
                                    formData.set(field, value);
                                }}
                            />
                        )}

                        {Math.floor(currentStep) === 6 && (
                            <ImagesSection
                                errors={errors}
                                onInputChange={(field, files) => {
                                    if (files) {
                                        const newFiles = Array.from(files);
                                        setImageFiles((prev) => [...prev, ...newFiles]);
                                        newFiles.forEach((file) => formData.append(field, file));
                                    }
                                }}
                                images={imageFiles}
                                onRemoveImage={(index) => {
                                    setImageFiles((prev) => prev.filter((_, i) => i !== index));
                                }}
                            />
                        )}

                        {Math.floor(currentStep) === 7 && (
                            <ReViewSection formData={formData} />
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-14">
                        {/* دکمه قبلی / بستن */}
                        <button
                            type="button"
                            className="px-4 py-2 mr-2 font-medium text-white transition-colors bg-orange-500 border border-orange-500 rounded-md hover:bg-transparent hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:bg-orange-600 dark:border-orange-600 dark:hover:text-orange-400 dark:focus:ring-offset-gray-900"
                            onClick={() => {
                                if (currentStep === 1) {
                                    resetForm();
                                    onClose();
                                } else {
                                    setCurrentStep((prev) => Math.max(prev - 1, 1));
                                }
                            }}
                        >
                            {currentStep < 2 ? "انصراف و بستن" : "مرحله قبلی"}
                        </button>

                        {/* دکمه بعدی */}
                        <button
                            type="button"
                            className="px-4 py-2 font-medium text-white transition-colors duration-300 bg-teal-500 border border-teal-500 rounded-md hover:bg-transparent hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 dark:bg-teal-600 dark:border-teal-600 dark:hover:text-teal-400 dark:focus:ring-offset-gray-900"
                            onClick={() => {
                                handleNextButtonClick(
                                    currentStep,
                                    progressSteps.length,
                                    formData,
                                    (errs) => {
                                        setErrors(errs);
                                        errs.forEach((err) => toast.error(err.value));
                                    },
                                    setCurrentStep,
                                    selectedCategoryFeatures,
                                    onSubmit
                                );
                            }}
                        >
                            {currentStep === progressSteps.length ? "اتمام و ثبت" : "مرحله بعدی"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAdvertisingForm;
