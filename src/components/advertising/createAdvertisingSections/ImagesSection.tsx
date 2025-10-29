import React, { useState, useEffect } from "react";

type ImagesSectionProps = {
    errors?: Array<{ key: string; value: string }>;
    onInputChange?: (field: string, value: FileList | null) => void;
    images?: File[];
    onRemoveImage?: (index: number) => void;
};

const ImagesSection: React.FC<ImagesSectionProps> = ({
    errors,
    onInputChange,
    images = [],
    onRemoveImage,
}) => {
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const urls = images.map((file) => URL.createObjectURL(file));
        setPreviews(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [images]);

    return (
        <div className="p-6 space-y-6 transition-colors border rounded-xl bg-white/90 border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            {/* بخش عنوان */}
            <div className="mb-4 text-gray-900 dark:text-gray-100">
                <h3 className="mb-2 text-xl font-bold">تصاویر آگهی</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">لطفاً تصاویر با کیفیت و واضح از آگهی خود بارگذاری کنید.</p>
            </div>

            {/* آپلودر جدید */}
            <div className="relative flex items-center justify-center h-48 transition-colors border-2 border-dashed rounded-lg border-teal-500/70 bg-teal-50/40 dark:border-teal-400/60 dark:bg-teal-900/20">
                <div className="absolute text-center text-teal-600 pointer-events-none dark:text-teal-300">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-12 h-12 mx-auto mb-3"
                        viewBox="0 0 16 16">
                        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z" />
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-300">فایل‌های خود را انتخاب کنید</p>
                </div>
                <input
                    type="file"
                    id="images"
                    name="images"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        if (onInputChange) {
                            onInputChange("images", e.target.files);
                        }
                    }}
                />
            </div>

            {/* پیش‌نمایش تصاویر */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3 lg:grid-cols-4">
                    {previews.map((src, index) => (
                        <div key={index} className="relative transition-colors border rounded-lg group border-gray-200 dark:border-gray-700">
                            <img
                                src={src}
                                alt={`preview-${index}`}
                                className="object-cover w-full h-32 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveImage && onRemoveImage(index)}
                                className="absolute flex items-center justify-center w-6 h-6 text-xs text-white transition bg-red-600 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* خطاها */}
            {errors && errors.some((err) => err.key === "images") && (
                <p className="mt-1 text-sm text-red-500">
                    {errors.find((err) => err.key === "images")?.value}
                </p>
            )}
        </div>
    );
};

export default ImagesSection;
