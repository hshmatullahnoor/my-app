import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  FileText,
  MapPin,
  DollarSign,
  ListChecks,
} from "lucide-react";
import type { Advertising } from "../../../../api/advertisings_api";
import { IMAGES_URL } from "../../../../api/main";

type ViewAdvertisingModelProps = {
  advertising: Advertising;
  isOpen: boolean;
  onClose: () => void;
};

const ViewAdvertisingModel: React.FC<ViewAdvertisingModelProps> = ({ advertising, isOpen, onClose }) => {
  const title = advertising.title;
  const description = advertising.description;
  const price = advertising.price;
  const discount = advertising.discount;
  const city = advertising.city_id;
  const province = advertising.province;

  const featuresRaw = advertising.features;
  let features: { feature_id: number; value: string }[][] = [];
  if (featuresRaw && typeof featuresRaw === "string") {
    try {
      features = JSON.parse(featuresRaw);
    } catch (e) {
      console.warn("Invalid features JSON", e);
    }
  }

  if (!isOpen) return null;

  const Images = advertising.images;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? Images.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === Images.length - 1 ? 0 : prev + 1));

  // محاسبه قیمت نهایی و درصد تخفیف
  const numericPrice = price;
  const numericDiscount = discount;
  const discountPercent =
    numericPrice && numericDiscount
      ? ((numericDiscount / numericPrice) * 100).toFixed(1)
      : null;
  const finalPrice = numericPrice - numericDiscount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="p-6 space-y-8 transition-colors bg-white border border-gray-200 shadow-xl rounded-2xl dark:bg-gray-900 dark:border-gray-700 md:w-[90%] overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="sticky top-0 flex items-center justify-start px-6 py-4">
          <button
            type="button"
            className="text-3xl font-bold text-red-400 transition-colors hover:text-red-600"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="mb-6 text-center text-gray-900 dark:text-white">
          <h3 className="mb-2 text-2xl font-bold">🔍 بازبینی آگهی</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            شما وظیفه دارید تا قبل از تایید آگهی, آن را به خوبی چک کنید.
          </p>
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
                className="object-cover w-full border border-gray-200 shadow-lg bg-black/60 h-80 rounded-2xl dark:border-gray-700 md:h-96 md:object-contain backdrop-blur-sm"
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

        {/* اطلاعات آگهی */}
        <div className="grid grid-cols-1 gap-6 text-gray-900 dark:text-gray-100 md:grid-cols-2">
          {/* عنوان */}
          <div className="p-4 transition-colors border border-gray-200 shadow-sm rounded-xl bg-gray-50 dark:bg-gray-900/70 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="text-blue-500 dark:text-blue-400" size={20} />
              <h4 className="font-bold">عنوان آگهی</h4>
            </div>
            <p>{title ?? <span className="text-sm text-gray-500 dark:text-gray-400">عنوان وارد نشده است.</span>}</p>
          </div>

          {/* توضیحات */}
          <div className="p-4 transition-colors border border-gray-200 shadow-sm rounded-xl bg-gray-50 dark:bg-gray-900/70 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-yellow-500 dark:text-yellow-400" size={20} />
              <h4 className="font-bold">توضیحات آگهی</h4>
            </div>
            <p className="leading-relaxed text-gray-700 dark:text-gray-200">
              {description ?? (
                <span className="text-sm text-gray-500 dark:text-gray-400">توضیحات وارد نشده است.</span>
              )}
            </p>
          </div>

          {/* قیمت و تخفیف */}
          <div className="p-4 transition-colors border border-gray-200 shadow-sm rounded-xl bg-gray-50 dark:bg-gray-900/70 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-500 dark:text-green-400" size={20} />
              <h4 className="font-bold">قیمت نهایی</h4>
            </div>

            {numericPrice ? (
              <div>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {finalPrice.toLocaleString()} افغانی
                </p>
                {numericDiscount > 0 && (
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500 line-through dark:text-gray-400">
                      {numericPrice.toLocaleString()} افغانی
                    </span>
                    <span className="text-pink-500 dark:text-pink-400">{discountPercent}% تخفیف</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">قیمت وارد نشده است.</span>
            )}
          </div>

          {/* موقعیت */}
          <div className="p-4 transition-colors border border-gray-200 shadow-sm rounded-xl bg-gray-50 dark:bg-gray-900/70 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-red-500 dark:text-red-400" size={20} />
              <h4 className="font-bold">موقعیت مکانی</h4>
            </div>
            <div className="flex flex-col md:flex-row md:gap-6">
              <p>{city ? advertising.city.name : <span className="text-sm text-gray-500 dark:text-gray-400">شهر وارد نشده است.</span>}</p>
              <p>{province ?? <span className="text-sm text-gray-500 dark:text-gray-400">ولسوالی وارد نشده است.</span>}</p>
            </div>
          </div>

          {/* ویژگی‌ها */}
          {features.length > 0 && (
            <div className="p-4 transition-colors border border-gray-200 shadow-sm rounded-xl bg-gray-50 md:col-span-2 dark:bg-gray-900/70 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="text-cyan-500 dark:text-cyan-400" size={20} />
                <h4 className="font-bold">ویژگی‌های آگهی</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {features.flat().map((f, i) => (
                  <div
                    key={i}
                    className="p-2 text-center text-gray-700 transition-colors border border-gray-200 rounded-lg bg-white/70 hover:bg-teal-50/60 dark:text-gray-200 dark:bg-gray-800/60 dark:border-gray-700 dark:hover:bg-gray-700/60"
                  >
                    {f.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAdvertisingModel;