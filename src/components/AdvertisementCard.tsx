import React from 'react';
import { type Advertising } from '../api/advertisings_api';


interface AdvertisementCardProps {
    advertisement: Advertising;
}

const AdvertisementCard: React.FC<AdvertisementCardProps> = ({ advertisement }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };


    const AdvertisementImage = (props: { advertisement: Advertising }) => {

        if (props.advertisement.images.length > 0) {
            return (
                <img
                    src={props.advertisement.images[0].image_path}
                    alt={props.advertisement.title}
                    className="object-cover w-full h-full"
                />
            );
        }



        return (
            <svg className="w-12 h-12 text-gray-400 transition-colors dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        );



    };

    // محاسبه قیمت نهایی و درصد تخفیف
    const numericPrice = advertisement.price ? parseFloat(String(advertisement.price)) : 0;
    const numericDiscount = advertisement.discount ? parseFloat(String(advertisement.discount)) : 0;
    const discountPercent =
        numericPrice && numericDiscount
            ? ((numericDiscount / numericPrice) * 100).toFixed(1)
            : null;
    const finalPrice = numericPrice - numericDiscount;

    return (
        <div className="overflow-hidden transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600">
            {/* Image Placeholder */}
            {/* if image is available */}

            <div className="flex items-center justify-center h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                <AdvertisementImage advertisement={advertisement} />
            </div>

            <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2 dark:text-white">
                    {advertisement.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                    {advertisement.description}
                </p>

                {/* advertisement features */}
                {advertisement.features && advertisement.features.length > 0 && (
                    <div className="flex items-center justify-start gap-2 mb-3">

                        {advertisement.features.map((feature, index) => {
                            return (
                                <span key={index} className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded dark:bg-teal-600 dark:text-white">
                                    {/* SVG icon from raw string */}
                                    {feature.icon && feature.icon != null && feature.icon != "" && (
                                        <span
                                            dangerouslySetInnerHTML={{ __html: feature.icon }}
                                            className="text-teal-600 size-4 dark:text-white"
                                        />)}
                                    {feature.value}
                                </span>
                            );
                        })}

                    </div>
                )}

                <div className="flex items-center justify-between mb-3">
                    <div className="transition-colors text-nowrap">

                        {numericPrice ? (
                            <div>
                                <p className="text-teal-600 dark:text-teal-400">
                                    {formatPrice(finalPrice)} افغانی
                                </p>
                                {numericDiscount > 0 && (
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="text-red-500 line-through">
                                            {formatPrice(numericPrice)} افغانی
                                        </span>
                                        <span className="text-teal-500 dark:text-teal-400">{discountPercent}% تخفیف</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">قیمت وارد نشده است.</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {advertisement.city?.name || 'نامشخص'} - {advertisement.province}
                    </span>
                    <span>{formatDate(advertisement.created_at)}</span>
                </div>

                {advertisement.category && (
                    <div className="mt-2">
                        <span className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">
                            {advertisement.category.name}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvertisementCard;