import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  FileText,
  MapPin,
  DollarSign,
  ListChecks,
} from "lucide-react";

type ReViewSectionProps = {
  formData: FormData;
};

const getTextValue = (data: FormData, key: string) => {
  const value = data.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const ReViewSection: React.FC<ReViewSectionProps> = ({ formData }) => {
  const title = getTextValue(formData, "title");
  const description = getTextValue(formData, "description");
  const price = getTextValue(formData, "price");
  const discount = getTextValue(formData, "discount");
  const city = getTextValue(formData, "city_id");
  const province = getTextValue(formData, "province");

  const featuresRaw = formData.get("features");
  let features: { feature_id: number; value: string }[][] = [];
  if (featuresRaw && typeof featuresRaw === "string") {
    try {
      features = JSON.parse(featuresRaw);
    } catch (e) {
      console.warn("Invalid features JSON", e);
    }
  }

  // استخراج فایل‌های تصویر
  const imageFiles = useMemo(
    () =>
      formData
        .getAll("images")
        .filter((entry): entry is File => entry instanceof File && entry.size > 0),
    [formData]
  );

  // مدیریت پیش‌نمایش تصاویر با state
  const [imagePreviews, setImagePreviews] = useState<{ file: File; url: string }[]>([]);

  // هر بار که imageFiles تغییر کند، URLهای جدید ایجاد و قدیمی‌ها revoke شوند
  useEffect(() => {
    const newPreviews = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews((previous) => {
      previous.forEach(({ url }) => URL.revokeObjectURL(url));
      return newPreviews;
    });

    return () => {
      newPreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? imagePreviews.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === imagePreviews.length - 1 ? 0 : prev + 1));

  // محاسبه قیمت نهایی و درصد تخفیف
  const numericPrice = price ? parseFloat(price) : 0;
  const numericDiscount = discount ? parseFloat(discount) : 0;
  const discountPercent =
    numericPrice && numericDiscount
      ? ((numericDiscount / numericPrice) * 100).toFixed(1)
      : null;
  const finalPrice = numericPrice - numericDiscount;

  return (
    <div className="p-6 space-y-8 transition-colors border rounded-2xl bg-white border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6 text-center text-gray-900 dark:text-white">
        <h3 className="mb-2 text-2xl font-bold">🔍 بازبینی نهایی آگهی</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          تمام اطلاعات آگهی خود را بررسی کنید پیش از ثبت نهایی.
        </p>
      </div>

      {/* تصاویر آگهی */}
      <div className="relative">
        <h4 className="flex items-center gap-2 mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
          <FileText className="text-green-500 dark:text-green-400" size={20} /> تصاویر آگهی
        </h4>

        {imagePreviews.length > 0 ? (
          <div className="relative flex items-center justify-center">
            <img
              src={imagePreviews[currentIndex].url}
              alt={`Preview ${currentIndex + 1}`}
              className="object-cover w-full h-80 border border-gray-200 shadow-lg rounded-2xl dark:border-gray-700"
            />
            {imagePreviews.length > 1 && (
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
          <p className="text-sm text-gray-500 dark:text-gray-400">هیچ تصویری بارگذاری نشده است.</p>
        )}
      </div>

      {/* اطلاعات آگهی */}
      <div className="grid grid-cols-1 gap-6 text-gray-900 dark:text-gray-100 md:grid-cols-2">
        {/* عنوان */}
        <div className="p-4 transition-colors border rounded-xl bg-gray-50 shadow-sm border-gray-200 dark:bg-gray-900/70 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="text-blue-500 dark:text-blue-400" size={20} />
            <h4 className="font-bold">عنوان آگهی</h4>
          </div>
          <p>{title ?? <span className="text-sm text-gray-500 dark:text-gray-400">عنوان وارد نشده است.</span>}</p>
        </div>

        {/* توضیحات */}
        <div className="p-4 transition-colors border rounded-xl bg-gray-50 shadow-sm border-gray-200 dark:bg-gray-900/70 dark:border-gray-700">
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
        <div className="p-4 transition-colors border rounded-xl bg-gray-50 shadow-sm border-gray-200 dark:bg-gray-900/70 dark:border-gray-700">
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
        <div className="p-4 transition-colors border rounded-xl bg-gray-50 shadow-sm border-gray-200 dark:bg-gray-900/70 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-red-500 dark:text-red-400" size={20} />
            <h4 className="font-bold">موقعیت مکانی</h4>
          </div>
          <div className="flex flex-col md:flex-row md:gap-6">
            <p>{city ?? <span className="text-sm text-gray-500 dark:text-gray-400">شهر وارد نشده است.</span>}</p>
            <p>{province ?? <span className="text-sm text-gray-500 dark:text-gray-400">ولسوالی وارد نشده است.</span>}</p>
          </div>
        </div>

        {/* ویژگی‌ها */}
        {features.length > 0 && (
          <div className="p-4 transition-colors border rounded-xl bg-gray-50 shadow-sm md:col-span-2 border-gray-200 dark:bg-gray-900/70 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="text-cyan-500 dark:text-cyan-400" size={20} />
              <h4 className="font-bold">ویژگی‌های آگهی</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {features.flat().map((f, i) => (
                <div
                  key={i}
                  className="p-2 text-center text-gray-700 transition-colors border rounded-lg bg-white/70 border-gray-200 hover:bg-teal-50/60 dark:text-gray-200 dark:bg-gray-800/60 dark:border-gray-700 dark:hover:bg-gray-700/60"
                >
                  {f.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReViewSection;