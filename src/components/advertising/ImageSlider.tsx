import React, { useState } from "react";
import type { Advertising } from "../../api/advertisings_api";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { IMAGES_URL } from "../../api/main";

const ImageSlider: React.FC<{ Advertising: Advertising; onClose: () => void }> = ({ onClose, Advertising }) => {

    const Images = Advertising.images

      const [currentIndex, setCurrentIndex] = useState(0);
    
      const handlePrev = () =>
        setCurrentIndex((prev) => (prev === 0 ? Images.length - 1 : prev - 1));
      const handleNext = () =>
        setCurrentIndex((prev) => (prev === Images.length - 1 ? 0 : prev + 1));
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="p-6 space-y-8 transition-colors bg-white border border-gray-200 shadow-xl rounded-2xl dark:bg-gray-900 dark:border-gray-700 md:w-[90%] overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 flex items-center justify-start px-6 py-4">
                    <button
                        type="button"
                        className="text-3xl font-bold text-red-400 transition-colors hover:text-red-600"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                

                {/* تصاویر آگهی */}
                <div className="relative">
                    <h4 className="flex items-center gap-2 mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                        <FileText className="text-green-500 dark:text-green-400" size={20} /> تصاویر آگهی
                    </h4>

                    {Images.length > 0 ? (
                        <div className="relative flex items-center justify-center">
                            <img
                                src={IMAGES_URL + Images[currentIndex].image_path}
                                alt={`Preview ${currentIndex + 1}`}
                                className="object-contain w-full border border-gray-200 shadow-lg bg-black/60 h-80 rounded-2xl dark:border-gray-700 md:h-96 md:object-contain backdrop-blur-sm"
                            />
                            {Images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute p-2 transition-colors bg-white rounded-full shadow-md left-2 hover:bg-gray-100 dark:bg-gray-900/70 dark:hover:bg-gray-800"
                                    >
                                        <ChevronLeft className="text-gray-700 dark:text-gray-100" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute p-2 transition-colors bg-white rounded-full shadow-md right-2 hover:bg-gray-100 dark:bg-gray-900/70 dark:hover:bg-gray-800"
                                    >
                                        <ChevronRight className="text-gray-700 dark:text-gray-100" />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-[20vh] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-700">بدون عکس</div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ImageSlider;