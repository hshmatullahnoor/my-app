import React from "react";
import CitySelector from "../../CitySelector";

type LocationSectionProps = {
    errors?: Array<{ key: string; value: string }>;
    onInputChange?: (field: string, value: string) => void;
};

const LocationSection: React.FC<LocationSectionProps> = ({ errors, onInputChange }) => {

    const [currentCity, setCurrentCity] = React.useState<number | "">("");

    return (
        <div className="p-6 space-y-6 transition-colors border rounded-xl bg-white/90 border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
            {/* بخش موقعیت مکانی */}
            <div className="mb-4 text-gray-900 dark:text-gray-100">
                <h3 className="mb-2 text-xl font-bold">موقعیت مکانی آگهی</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">لطفاً موقعیت مکانی دقیق آگهی خود را وارد کنید تا خریداران بتوانند آن را بهتر پیدا کنند.</p>
            </div>

            {/* بخش ورودی موقعیت مکانی */}
            <div className="space-y-4">
                <div>
                    <CitySelector
                        value={currentCity}
                        onChange={(value) => {
                            if (onInputChange) {
                                onInputChange('city_id', String(value));
                            }
                            setCurrentCity(value);
                        }}
                    />
                    {errors && errors.some(err => err.key === 'city_id') && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.find(err => err.key === 'city_id')?.value}
                        </p>
                    )}
                </div>

                {/* province input*/}
                <div className="">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="province">
                        ولسوالی
                    </label>
                    <input
                        type="text"
                        id="province"
                        name="province"
                        className="w-full p-2 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                        placeholder="ولسوالی را وارد کنید"
                        onChange={(e) => {
                            if (onInputChange) {
                                onInputChange('province', e.target.value);
                            }
                        }}
                    />
                    {errors && errors.some(err => err.key === 'province') && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.find(err => err.key === 'province')?.value}
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default LocationSection;