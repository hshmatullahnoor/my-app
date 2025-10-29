import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FilterIcon, FolderSymlinkIcon, MapPin } from 'lucide-react';
import Logo from './Logo';
import ToggleThemeButton from './ToggleThemeButton';
import CategoryFilter from './CategoryFilter';
import CitySelector from './CitySelector';
import AdvancedFilters from './AdvancedFilters';
import CreateAdvertisingButton from './advertising/createAdvertisingButton';

type FilterState = {
    cityId: number | null;
    fromPrice: number | null;
    toPrice: number | null;
    onlyWithImage: boolean;
};

type FilterPanel = 'city' | 'category' | 'advanced';

interface NavigationProps {
    className?: string;
    showSearch?: boolean;
    showDashboard?: boolean;
    isMobile?: boolean;
    token?: string | null;
    filters?: FilterState;
    onFiltersChange?: (filters: FilterState) => void;
    onCategoryChange?: (categoryId: number | null) => void;
    selectedCategoryId?: number | null;
    itemsPerPage?: number;
    onItemsPerPageChange?: (count: number) => void;
    totalItems?: number;
}

const Navigation: React.FC<NavigationProps> = ({
    className = '',
    showSearch = true,
    showDashboard = true,
    isMobile = false,
    token = null,
    filters,
    onFiltersChange,
    onCategoryChange,
    selectedCategoryId = null,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems
}) => {
    const navigate = useNavigate();
    const [urlSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(urlSearchParams.get('search') || '');
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [activeFilterPanel, setActiveFilterPanel] = useState<FilterPanel | null>(null);

    const filterContainerRef = useRef<HTMLDivElement>(null);

    const isLoggedIn = useMemo(() => {
        if (token) return true;
        if (typeof window === 'undefined') return false;
        return Boolean(localStorage.getItem('access_token'));
    }, [token]);

    const hasFiltersHandler = Boolean(filters && onFiltersChange);
    const hasCategoryHandler = typeof onCategoryChange === 'function';
    const canShowAdvancedFilters =
        hasFiltersHandler && typeof itemsPerPage === 'number' && typeof onItemsPerPageChange === 'function';

    const resolvedItemsPerPage = typeof itemsPerPage === 'number' ? itemsPerPage : 0;
    const resolvedTotalItems = typeof totalItems === 'number' ? totalItems : 0;

    const hasCityFilter = Boolean(filters?.cityId);
    const hasAdvancedActive = Boolean(filters && (filters.fromPrice || filters.toPrice || filters.onlyWithImage));
    const hasCategoryActive = selectedCategoryId !== null && selectedCategoryId !== undefined;

    useEffect(() => {
        setSearchQuery(urlSearchParams.get('search') || '');
    }, [urlSearchParams]);

    const tablet = window.innerWidth < 768

    useEffect(() => {
        if (!activeFilterPanel) {
            return;
        }

        // Close popovers on outside click or Escape.
        const handleClickOutside = (event: MouseEvent) => {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
                setActiveFilterPanel(null);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveFilterPanel(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [activeFilterPanel]);

    useEffect(() => {
        if (isMobile) {
            setActiveFilterPanel(null);
        }
    }, [isMobile]);

    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(urlSearchParams);

        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        } else {
            params.delete('search');
        }

        params.set('page', '1');
        navigate(`/?${params.toString()}`);
        setMobileSearchOpen(false);
    }, [navigate, searchQuery, urlSearchParams]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const toggleFilterPanel = useCallback((panel: FilterPanel) => {
        setActiveFilterPanel((current) => (current === panel ? null : panel));
    }, []);

    const baseFilterButtonClasses =
        'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-60';
    const activeFilterButtonClasses =
        'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-500/60 dark:bg-teal-900/40 dark:text-teal-200';
    const inactiveFilterButtonClasses =
        'border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800';

    return (
        <nav className={`bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 ${className}`} dir="rtl">
            <div className="px-2 mx-auto max-w-7xl sm:px-4 lg:px-8">
                <div className="flex items-center justify-between min-w-0 h-14 sm:h-16 flex-nowrap">
                    <div className="flex-shrink-0 ml-6">
                        <Logo size="sm" className="sm:hidden" />
                        <Logo size="md" className="hidden sm:flex" />
                    </div>

                    {showSearch && (
                        <div className="justify-center hidden max-w-md px-4 mx-auto md:flex">
                            <form onSubmit={handleSearchSubmit} className="w-full max-w-sm">
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="جستجو در Afghan Market..."
                                        className="block w-full py-2 pl-3 text-sm leading-5 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-md pr-9 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:text-white dark:placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:bg-gray-600"
                                        dir="rtl"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="flex items-center justify-end flex-1 gap-x-4 md:gap-x-5">

                        {!isMobile && !tablet && (
                            
                            <CreateAdvertisingButton token={token} />
                        )}
                        
                        {!isMobile && (hasFiltersHandler || hasCategoryHandler) && (
                            <div ref={filterContainerRef} className="relative items-center hidden gap-2 md:flex lg:gap-3">
                                {hasFiltersHandler && (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => toggleFilterPanel('city')}
                                            className={`${baseFilterButtonClasses} ${(activeFilterPanel === 'city' || hasCityFilter) ? activeFilterButtonClasses : inactiveFilterButtonClasses}`}
                                        >
                                            <MapPin className="w-4 h-4" />
                                            <span>شهر</span>
                                            {hasCityFilter && (
                                                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-700 dark:bg-teal-900/50 dark:text-teal-200">
                                                    فعال
                                                </span>
                                            )}
                                        </button>

                                        {activeFilterPanel === 'city' && filters && (
                                            <div className="absolute right-0 z-40 p-4 mt-3 bg-white border border-gray-200 shadow-xl top-full w-72 rounded-xl dark:border-gray-700 dark:bg-gray-900">
                                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                    انتخاب شهر
                                                </div>
                                                <div className="pt-3">
                                                    <CitySelector
                                                        value={filters.cityId ?? ''}
                                                        onChange={(value) => {
                                                            if (!onFiltersChange || !filters) return;
                                                            onFiltersChange({
                                                                ...filters,
                                                                cityId: value === '' ? null : Number(value)
                                                            });
                                                            setActiveFilterPanel(null);
                                                        }}
                                                        showLable={false}
                                                    />
                                                </div>
                                                <div className="flex justify-between gap-2 pt-3">
                                                    {hasCityFilter && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (!onFiltersChange || !filters) return;
                                                                onFiltersChange({ ...filters, cityId: null });
                                                                setActiveFilterPanel(null);
                                                            }}
                                                            className="px-3 py-1.5 text-xs font-medium text-red-600 transition-colors duration-200 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
                                                        >
                                                            پاک کردن
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveFilterPanel(null)}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                                    >
                                                        بستن
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {hasCategoryHandler && (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => toggleFilterPanel('category')}
                                            className={`${baseFilterButtonClasses} ${(activeFilterPanel === 'category' || hasCategoryActive) ? activeFilterButtonClasses : inactiveFilterButtonClasses}`}
                                        >
                                            <FolderSymlinkIcon className="w-4 h-4" />
                                            <span>دسته‌بندی</span>
                                            {hasCategoryActive && (
                                                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-700 dark:bg-teal-900/50 dark:text-teal-200">
                                                    فعال
                                                </span>
                                            )}
                                        </button>

                                        {activeFilterPanel === 'category' && (
                                            <div className="absolute top-full right-0 z-40 mt-3 w-[380px] max-h-[440px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                                                <CategoryFilter
                                                    onCategoryChange={(categoryId) => {
                                                        onCategoryChange?.(categoryId);
                                                    }}
                                                    selectedCategoryId={selectedCategoryId}
                                                    onClose={() => setActiveFilterPanel(null)}
                                                />
                                                <div className="flex justify-end px-4 pb-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveFilterPanel(null)}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                                    >
                                                        بستن
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {canShowAdvancedFilters && filters && (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => toggleFilterPanel('advanced')}
                                            className={`${baseFilterButtonClasses} ${(activeFilterPanel === 'advanced' || hasAdvancedActive) ? activeFilterButtonClasses : inactiveFilterButtonClasses}`}
                                        >
                                            <FilterIcon className="w-4 h-4" />
                                            <span>فیلترها</span>
                                            {hasAdvancedActive && (
                                                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-700 dark:bg-teal-900/50 dark:text-teal-200">
                                                    فعال
                                                </span>
                                            )}
                                        </button>

                                        {activeFilterPanel === 'advanced' && (
                                            <div className="absolute top-full right-0 z-40 mt-3 w-[420px] max-h-[520px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                                                <AdvancedFilters
                                                    filters={filters}
                                                    onFiltersChange={(updatedFilters) => {
                                                        onFiltersChange?.(updatedFilters);
                                                    }}
                                                    is_Expanded
                                                    showToggleButton={false}
                                                    itemsPerPage={resolvedItemsPerPage}
                                                    onItemsPerPageChange={onItemsPerPageChange!}
                                                    totalItems={resolvedTotalItems}
                                                />
                                                <div className="flex justify-end gap-2 px-2 pb-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveFilterPanel(null)}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                                    >
                                                        بستن
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {showSearch && (
                            <button
                                type="button"
                                onClick={() => setMobileSearchOpen((open) => !open)}
                                className="md:hidden p-1.5 rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        )}

                        {!isMobile && showDashboard && isLoggedIn && !tablet && (
                            <Link
                                to="/dashboard"
                                className="hidden sm:flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-teal-600 transition-colors hover:bg-teal-700"
                            >
                                <svg className="w-3 h-3 ml-1 sm:w-4 sm:h-4 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <span className="hidden sm:inline">داشبورد</span>
                            </Link>
                        )}

                        {!isMobile && !isLoggedIn && !tablet && (
                            <div className="flex items-center space-x-1 space-x-reverse sm:space-x-2">
                                <Link
                                    to="/login"
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    ورود
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium text-white bg-orange-600 transition-colors hover:bg-orange-700"
                                >
                                    ثبت نام
                                </Link>
                            </div>
                        )}

                        {!isMobile && isLoggedIn && (
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <Link
                                    to="/dashboard"
                                    className="sm:hidden p-1.5 rounded-md text-white bg-teal-600 transition-colors hover:bg-teal-700"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </Link>
                            </div>
                        )}

                        <div className="">
                            <ToggleThemeButton />
                        </div>
                    </div>
                </div>
            </div>

            {showSearch && mobileSearchOpen && (
                <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700 md:hidden">
                    <form onSubmit={handleSearchSubmit} className="pt-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="جستجو در Afghan Market..."
                                className="block w-full py-2 pl-3 text-sm leading-5 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-md pr-9 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:text-white dark:placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:bg-gray-600"
                                dir="rtl"
                                autoFocus
                            />
                        </div>
                    </form>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
