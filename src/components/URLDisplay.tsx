import React from 'react';
import { useSearchParams } from 'react-router-dom';

const URLDisplay: React.FC = () => {
    const [searchParams] = useSearchParams();

    // Build the full URL like the API would use
    const buildAPIUrl = () => {
        const baseUrl = 'http://127.0.0.1:8000/api/advertisings';
        const params = new URLSearchParams();

        // Always include page and per-page
        params.set('page', searchParams.get('page') || '1');
        params.set('per-page', searchParams.get('per-page') || '12');

        // Add other parameters if they exist
        if (searchParams.get('category_id')) {
            params.set('category_id', searchParams.get('category_id')!);
        }
        if (searchParams.get('city_id')) {
            params.set('city_id', searchParams.get('city_id')!);
        }
        if (searchParams.get('from_price')) {
            params.set('from_price', searchParams.get('from_price')!);
        }
        if (searchParams.get('to_price')) {
            params.set('to_price', searchParams.get('to_price')!);
        }
        if (searchParams.get('only_with_image')) {
            params.set('only_with_image', searchParams.get('only_with_image')!);
        }

        return `${baseUrl}?${params.toString()}`;
    };

    const currentURL = buildAPIUrl();

    return (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm font-medium">Current API URL:</span>
                <button
                    onClick={() => navigator.clipboard.writeText(currentURL)}
                    className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                >
                    کپی کردن
                </button>
            </div>
            <div className="mt-2 p-2 bg-gray-900 rounded text-xs font-mono text-green-400 break-all">
                {currentURL}
            </div>
        </div>
    );
};

export default URLDisplay;