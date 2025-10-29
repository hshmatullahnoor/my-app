import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdvertisingsAPI, { type Advertising } from '../api/advertisings_api';
import {
    Navigation,
    AdvertisementSkeleton,
    EmptyAdvertisements,
    LoadingSpinner,
    EndOfResults,
    ErrorState,
    SearchDisplay
} from '../components';
import toast from 'react-hot-toast';
import InstaCard from '../components/advertising/Cards/Insta';
import type { User } from '../api/auth_api';
import MobileBottomNav from '../components/mobile/BottomNav';

// Interface for potential paginated response
interface PaginatedResponse {
    data?: Advertising[];
    advertisements?: Advertising[];
    [key: string]: unknown;
}

// Constants
const DEFAULT_ITEMS_PER_PAGE = 12;

const Home: React.FC<{ token: string | null; current_user: User | null; isMobile: boolean }> = ({ token, current_user, isMobile }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [advertisements, setAdvertisements] = useState<Advertising[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Use useRef to store the filters to prevent unnecessary re-renders
    const advancedFiltersRef = useRef({
        cityId: null as number | null,
        fromPrice: null as number | null,
        toPrice: null as number | null,
        onlyWithImage: false
    });

    const [advancedFilters, setAdvancedFiltersState] = useState(advancedFiltersRef.current);

    // Update ref when state changes
    useEffect(() => {
        advancedFiltersRef.current = advancedFilters;
    }, [advancedFilters]);

    const currentPageRef = useRef(1);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Initialize state from URL parameters
    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('per-page') || DEFAULT_ITEMS_PER_PAGE.toString());
        const categoryId = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : null;
        const cityId = searchParams.get('city_id') ? parseInt(searchParams.get('city_id')!) : null;
        const fromPrice = searchParams.get('from_price') ? parseInt(searchParams.get('from_price')!) : null;
        const toPrice = searchParams.get('to_price') ? parseInt(searchParams.get('to_price')!) : null;
        const onlyWithImage = searchParams.get('only_with_image') === 'true';
        const search = searchParams.get('search') || '';

        setCurrentPage(page);
        setItemsPerPage(perPage);
        setSelectedCategoryId(categoryId);
        setSearchQuery(search);
        setAdvancedFiltersState({
            cityId,
            fromPrice,
            toPrice,
            onlyWithImage
        });
        currentPageRef.current = page;
    }, [searchParams]);

    // Update URL parameters when filters change
    const updateURLParams = useCallback((params: {
        page?: number;
        perPage?: number;
        categoryId?: number | null;
        cityId?: number | null;
        fromPrice?: number | null;
        toPrice?: number | null;
        onlyWithImage?: boolean;
    }) => {
        const newParams = new URLSearchParams();

        newParams.set('page', (params.page || currentPage).toString());
        newParams.set('per-page', (params.perPage || itemsPerPage).toString());

        if (params.categoryId !== undefined ? params.categoryId : selectedCategoryId) {
            newParams.set('category_id', (params.categoryId !== undefined ? params.categoryId : selectedCategoryId)!.toString());
        }

        if (params.cityId !== undefined ? params.cityId : advancedFiltersRef.current.cityId) {
            newParams.set('city_id', (params.cityId !== undefined ? params.cityId : advancedFiltersRef.current.cityId)!.toString());
        }

        if (params.fromPrice !== undefined ? params.fromPrice : advancedFiltersRef.current.fromPrice) {
            newParams.set('from_price', (params.fromPrice !== undefined ? params.fromPrice : advancedFiltersRef.current.fromPrice)!.toString());
        }

        if (params.toPrice !== undefined ? params.toPrice : advancedFiltersRef.current.toPrice) {
            newParams.set('to_price', (params.toPrice !== undefined ? params.toPrice : advancedFiltersRef.current.toPrice)!.toString());
        }

        if (params.onlyWithImage !== undefined ? params.onlyWithImage : advancedFiltersRef.current.onlyWithImage) {
            newParams.set('only_with_image', (params.onlyWithImage !== undefined ? params.onlyWithImage : advancedFiltersRef.current.onlyWithImage).toString());
        }

        setSearchParams(newParams);
    }, [currentPage, itemsPerPage, selectedCategoryId, setSearchParams]);

    // Load advertisements - useCallback removed to avoid dependency on advancedFilters object
    const loadAdvertisements = async (page: number) => {
        try {
            if (page === 1) {
                setLoading(true);
                setError(null);
            } else {
                setIsLoadingMore(true);
            }

            const response = await AdvertisingsAPI.getAdvertisings(
                page,
                itemsPerPage,
                selectedCategoryId,
                advancedFiltersRef.current.cityId, // Use ref to get current value
                advancedFiltersRef.current.fromPrice,
                advancedFiltersRef.current.toPrice,
                advancedFiltersRef.current.onlyWithImage,
                searchQuery,
                'yes',
                current_user?.id ?? null

            );

            console.log('home', current_user);


            if (response.success) {
                // Handle both array and paginated object responses
                let advertisingData: Advertising[];

                if (Array.isArray(response.data)) {
                    // Direct array response
                    advertisingData = response.data;
                } else if (response.data && typeof response.data === 'object') {
                    // Handle paginated response format
                    const dataObj = response.data as PaginatedResponse;
                    if (Array.isArray(dataObj.data)) {
                        // Paginated response with data.data array
                        advertisingData = dataObj.data;
                    } else if (Array.isArray(dataObj.advertisements)) {
                        // Response with advertisements array
                        advertisingData = dataObj.advertisements;
                    } else {
                        console.error('Unexpected response format:', response);
                        //'Response data type:', typeof response.data);
                        //'Response data:', response.data);
                        setError('خطا در دریافت آگهی‌ها - فرمت نامناسب پاسخ');
                        return;
                    }
                } else {
                    console.error('Unexpected response format:', response);
                    //'Response data type:', typeof response.data);
                    //'Response data:', response.data);
                    setError('خطا در دریافت آگهی‌ها - فرمت نامناسب پاسخ');
                    return;
                }

                if (page === 1) {
                    setAdvertisements(advertisingData);
                } else {
                    setAdvertisements(prev => [...prev, ...advertisingData]);
                }

                // Update hasMore based on returned data length
                setHasMore(advertisingData.length === itemsPerPage);

                // Update refs
                currentPageRef.current = page;
            } else {
                console.error('API returned success: false', response);
                setError('خطا در دریافت آگهی‌ها');
            }
        } catch (error) {
            console.error('Error loading advertisements:', error);
            setError('خطا در برقراری ارتباط با سرور');
            toast.error('خطا در بارگذاری آگهی‌ها');
        } finally {
            if (page === 1) setLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Effect to load advertisements when filters change - only depends on primitive values and searchQuery
    useEffect(() => {
        //"useEffect for filters executed, currentPage:", currentPage, "advertisements length:", advertisements.length);
        setCurrentPage(1);
        currentPageRef.current = 1;
        setAdvertisements([]);
        setHasMore(true);
        // We call loadAdvertisements directly here, ensuring it uses the latest ref values
        loadAdvertisements(1);
    }, [itemsPerPage, selectedCategoryId,
        advancedFiltersRef.current.cityId,
        advancedFiltersRef.current.fromPrice,
        advancedFiltersRef.current.toPrice,
        advancedFiltersRef.current.onlyWithImage,
        searchQuery]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !isLoadingMore && hasMore && !loading) {
                    const nextPage = currentPageRef.current + 1;
                    setCurrentPage(nextPage);
                    updateURLParams({ page: nextPage });
                    loadAdvertisements(nextPage); // This will use the latest ref values
                }
            },
            {
                rootMargin: '100px',
            }
        );

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [isLoadingMore, hasMore, loading, updateURLParams]); // Removed loadAdvertisements from dependencies

    const handleRetry = () => {
        setError(null);
        setCurrentPage(1);
        currentPageRef.current = 1;
        setAdvertisements([]);
        updateURLParams({ page: 1 });
        loadAdvertisements(1);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
        currentPageRef.current = 1;
        setAdvertisements([]);
        setHasMore(true);
        updateURLParams({ page: 1, perPage: newItemsPerPage });
    };

    const handleCategoryChange = (categoryId: number | null) => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(1);
        currentPageRef.current = 1;
        setAdvertisements([]);
        setHasMore(true);
        updateURLParams({ page: 1, categoryId });
    };

    const handleAdvancedFiltersChange = (filters: {
        cityId: number | null;
        fromPrice: number | null;
        toPrice: number | null;
        onlyWithImage: boolean;
    }) => {
        setAdvancedFiltersState(filters); // This will trigger the useEffect
        setCurrentPage(1);
        currentPageRef.current = 1;
        setAdvertisements([]);
        setHasMore(true);
        updateURLParams({
            page: 1,
            cityId: filters.cityId,
            fromPrice: filters.fromPrice,
            toPrice: filters.toPrice,
            onlyWithImage: filters.onlyWithImage
        });
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900" dir="rtl">
            <MobileBottomNav
                user={current_user}
                token={token}
                onCategoryChange={handleCategoryChange}
                selectedCategoryId={selectedCategoryId}
                onFiltersChange={handleAdvancedFiltersChange}
                filters={advancedFilters}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={advertisements.length}
            />
            <Navigation
                isMobile={isMobile}
                token={token}
                filters={advancedFilters}
                onFiltersChange={handleAdvancedFiltersChange}
                onCategoryChange={handleCategoryChange}
                selectedCategoryId={selectedCategoryId}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                totalItems={advertisements.length}
                // showSearch={window.innerWidth > 1200}
            />

            {/* Hero Section */}
            <div className="py-16 transition-colors duration-300 bg-gradient-to-br from-orange-50 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-black">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mb-6 text-4xl font-bold text-gray-900 transition-colors duration-300 md:text-6xl dark:text-white">
                            بازار افغان
                        </h1>
                        <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-600 transition-colors duration-300 dark:text-gray-300">
                            بزرگ‌ترین مرکز خرید و فروش آنلاین افغانستان
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                to="/register"
                                className="px-8 py-3 font-bold text-white transition-colors bg-teal-600 rounded-lg hover:bg-white hover:text-teal-600 hover:border-teal-600 hover:border-2"
                            >
                                شروع کنید
                            </Link>
                            <button className="px-8 py-3 font-bold text-gray-900 transition-colors border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-gray-900">
                                درباره ما
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-12 mx-auto transition-colors duration-300 max-w-7xl sm:px-6 lg:px-8">

                {/* Search Display */}
                <SearchDisplay
                    searchQuery={searchQuery}
                    onClearSearch={() => {
                        setSearchQuery('');
                        const params = new URLSearchParams(window.location.search);
                        params.delete('search');
                        params.set('page', '1');
                        setSearchParams(params);
                    }}
                />



                {/* Error State */}
                {error && (
                    <ErrorState error={error} onRetry={handleRetry} />
                )}

                {/* Loading State for Initial Load */}
                {loading && currentPage === 1 && (
                    <AdvertisementSkeleton count={8} />
                )}

                {/* Advertisements Grid - Always render when available */}
                {advertisements.length > 0 && (
                    // <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    //     {advertisements.map((ad) => (
                    //         <AdvertisementCard key={ad.id} advertisement={ad} />
                    //     ))}
                    // </div>

                    advertisements.map((ad) => (
                        <InstaCard advertisement={ad} key={ad.title + ad.created_at} user={current_user} token={token} />
                    ))

                )}

                {/* Infinite Scroll Loading */}
                {isLoadingMore && (
                    <LoadingSpinner />
                )}

                {/* Sentinel element for intersection observer */}
                {hasMore && advertisements.length > 0 && (
                    <div ref={sentinelRef} className="h-10" />
                )}

                {/* End of Results Indicator */}
                {!hasMore && advertisements.length > 0 && (
                    <EndOfResults />
                )}

                {/* No Results */}
                {advertisements.length === 0 && !loading && !error && (
                    <EmptyAdvertisements />
                )}
            </div>

        </div>
    );
};

export default Home;