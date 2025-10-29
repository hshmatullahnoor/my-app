import React, { useEffect } from "react";
import { getCities, type City } from "../types/functions"; // مسیر صحیح را وارد کنید
import { useState } from "react";

export type CitySelectorProps = {
    // تغییر از string به number | "" برای مدیریت حالت انتخاب نشده
    value: number | "";
    onChange: (value: number | "") => void; // تغییر تابع onChange
    showLable?: boolean;
};

const CitySelector: React.FC<CitySelectorProps> = (
    { value, onChange, showLable = true } // value اکنون یک عدد یا رشته خالی است
) => {
    const fetchCities = async () => {
        setLoadingCities(true);
        setErrors([]); // پاک کردن خطاها قبل از درخواست جدید

        try {
            const citiesData = await getCities();

            if (!citiesData || !citiesData.success || !Array.isArray(citiesData.cities)) {
                setErrors(citiesData?.errors || ["خطا در دریافت شهرها"]);
                setCities([]); // اطمینان از اینکه لیست شهرها خالی است در صورت خطا
            } else {
                setCities(citiesData.cities);
            }
        } catch (error) {
            console.error('Error in fetchCities:', error);
            setErrors(["خطا در بارگذاری فهرست شهرها"]);
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    };

    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        fetchCities();
    }, []);

    // تابعی که هنگام تغییر انتخاب فراخوانی می‌شود
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        // تبدیل مقدار به عدد یا رشته خالی
        const numericValue = selectedValue === "" ? "" : Number(selectedValue);
        onChange(numericValue); // ارسال id یا "" به والد
    };

    return (
        <div className="">
            {showLable && (
                <label htmlFor="city_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    شهر
                </label>
            )}

            {loadingCities ? (
                <div className="block w-full px-3 py-2 mt-1 text-sm text-gray-500 transition-colors bg-gray-100 border border-gray-200 rounded-md shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300">
                    در حال بارگذاری شهرها...
                </div>
            ) : (
                <select
                    id="city_id"
                    name="city_id"
                    // value باید id عددی باشد یا ""
                    value={value}
                    onChange={handleSelectChange} // استفاده از تابع جدید
                    className={`block w-full px-3 py-2 mt-1 text-sm transition-colors bg-white border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100 ${errors.length > 0 ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                    dir="rtl"
                >
                    {/* گزینه پیش‌فرض با مقدار "" */}
                    <option value="">شهر خود را انتخاب کنید</option>
                    {Array.isArray(cities) && cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>
            )}
            {errors.length > 0 && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.map((error, index) => (
                        <span key={index}>{error}</span>
                    ))}
                </p>
            )}
        </div>
    );
};

export default CitySelector;