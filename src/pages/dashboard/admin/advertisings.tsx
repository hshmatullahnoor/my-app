import React, { useCallback, useEffect, useState } from "react";
import SidebarNav from "../sidebarNav";
import AuthAPI, { type User } from "../../../api/auth_api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdvertisingsAPI, { type Advertising } from "../../../api/advertisings_api";
import AdvertisingTable from "../../../components/dashboard/admin/advertisings/AdvertisingsTable";
import { DeleteModal } from "../../../components/dashboard/shared/data-table/deleteModal";
import ViewAdvertisingModel from "../../../components/dashboard/admin/advertisings/ViewAdvertising";


const AdvertisingManagment: React.FC = () => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isMetadataLoading, setIsMetadataLoading] = useState<boolean>(false)
    const [advertisings, setAdvertisings] = useState<Advertising[] | null>(null)
    const [perPage, setPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedAd, setSelectedAd] = useState<Advertising>({} as Advertising)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isViewModelOpen, setIsViewModelOpen] = useState<boolean>(false);
    const [isMoreModalOpen, setIsMoreModalOpen] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');

    const navigate = useNavigate();

    const onDelete = (ad: Advertising) => {

        setSelectedAd(ad);
        setIsDeleteModalOpen(true);

    }

    const fetchAdvertisings = useCallback(async ({
        page,
        perPageValue = perPage,
        categoryId = null,
        city_id = null,
        search = searchQuery,
        onlyAccepted = 'no'
    }: {
        page?: number;
        perPageValue?: number;
        categoryId?: number | null;
        city_id?: number | null;
        search?: string;
        onlyAccepted?: string;
    } = {}) => {

        setIsMetadataLoading(true)

        const access_token = localStorage.getItem('access_token');

        if (!access_token) {
            toast.error("خطا در دریافت اطلاعات!");
            navigate("/login");
        }

        try {

            const response = await AdvertisingsAPI.getAdvertisings(
                page ?? 1,
                perPageValue,
                categoryId,
                city_id,
                null,
                null,
                null,
                search,
                onlyAccepted
            );

            if (!response.success) {
                toast.error("خطا در دریافت آگهی ها");
            }

            setAdvertisings(response.data.data)
            setTotalPages(response.data.last_page ?? 1)

            // //response.data.last_page);



        } catch (e) {
            toast.error("خطا در اتصال به سرور")
            console.error("error fetching advertisings:", e);

        } finally {
            setIsMetadataLoading(false)
        }

    }, [navigate, perPage, searchQuery])


    // handlers
    const handlePerPageChange = useCallback((pageSize: number) => {
        setPerPage(pageSize);
        setCurrentPage(1);
        void fetchAdvertisings({ page: 1, perPageValue: pageSize, search: searchQuery });
    }, [fetchAdvertisings, searchQuery]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        void fetchAdvertisings({ page, search: searchQuery });
    }, [fetchAdvertisings, searchQuery]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        void fetchAdvertisings({ page: 1, search: query });
    }, [fetchAdvertisings]);

    const onConfirmDeleting = async () => {
        //selectedAd.title + "deleted"); 
        setIsDeleteModalOpen(false)

        const res = await AdvertisingsAPI.deleteAdvertising(token, selectedAd.id);

        if (!res.success) {
            toast.error('خطا در حذف آگهی');
            toast.error(res.message);
        }

        toast.success('آگهی با موفقیت حذف شد');
        fetchAdvertisings();

    }


    useEffect(() => {
        const fetchUserData = async () => {
            // Check if user is logged in and is admin
            const token = localStorage.getItem('access_token');

            if (!token) {
                navigate('/login');
                return;
            }

            setToken(token)

            try {
                const response = await AuthAPI.getUser(token);

                if (response.success && response.user) {
                    if (response.user.role !== 'admin') {
                        toast.error('دسترسی غیرمجاز');
                        navigate('/dashboard');
                        return;
                    }
                    setCurrentUser(response.user);
                    await fetchAdvertisings();
                } else {
                    // If API call fails, try to get user from localStorage as fallback
                    const userData = localStorage.getItem('user');
                    if (userData) {
                        try {
                            const user = JSON.parse(userData);
                            if (user.role !== 'admin') {
                                toast.error('دسترسی غیرمجاز');
                                navigate('/dashboard');
                                return;
                            }
                            setCurrentUser(user);
                            await fetchAdvertisings();
                        } catch (parseError) {
                            console.error('خطا در پردازش اطلاعات کاربر:', parseError);
                            navigate('/login');
                        }
                    } else {
                        // If no user data available, redirect to login
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('خطا در دریافت اطلاعات کاربر:', error);

                // Fallback to localStorage if API fails
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        if (user.role !== 'admin') {
                            toast.error('دسترسی غیرمجاز');
                            navigate('/dashboard');
                            return;
                        }
                        setCurrentUser(user);
                        await fetchAdvertisings();
                    } catch (parseError) {
                        console.error('خطا در پردازش اطلاعات کاربر:', parseError);
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            }
        };

        fetchUserData();
    }, [fetchAdvertisings, navigate]);


    const onView = (ad: Advertising) => {
        setSelectedAd(ad)
        setIsViewModelOpen(true)
    }

    if (!currentUser || isMetadataLoading) {
        return (
            <>
                <SidebarNav userRole="admin" />
                <div className="flex items-center justify-center min-h-screen pr-16 bg-white dark:bg-gray-900" dir="rtl">
                    <div className="text-center text-gray-900 dark:text-white">
                        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-teal-400 rounded-full animate-spin"></div>
                        <p>در حال بارگذاری...</p>
                    </div>
                </div>
            </>
        );
    }


    return (
        <div className="">

            <SidebarNav userRole="admin" user={currentUser} />

            <div className="p-6 pr-16 mt-16 min-h-[93vh] md:mt-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                <div className="mx-auto max-w-7xl">

                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                        }}
                        itemName={selectedAd.title}
                        title="حذف آگهی"
                        key={selectedAd.id + selectedAd.title}
                        onConfirm={onConfirmDeleting}
                    />

                    <ViewAdvertisingModel
                        advertising={selectedAd}
                        key={selectedAd.id}
                        isOpen={isViewModelOpen}
                        onClose={() => { setIsViewModelOpen(false) }}
                    />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="">
                            <h1 className="mb-2 text-xl font-bold text-gray-800 dark:text-white md:text-3xl">مدیریت آگهی ها</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">مدیریت آگهی های کاربران</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-50"
                                type="button"
                                onClick={() => { void fetchAdvertisings(); }}
                            // disabled={isLoadingUsers}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H9m11 11v-5h-.581m-15.357-2a8.003 8.003 0 0015.356 2H15" />
                                </svg>
                                بروزرسانی
                            </button>
                        </div>
                    </div>

                    <AdvertisingTable
                        advertisings={advertisings ?? []}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onSearch={handleSearch}
                        defaultPerPage={perPage}
                        onDelete={onDelete}
                        onMore={() => {
                            setIsMoreModalOpen(!isMoreModalOpen);
                            fetchAdvertisings();
                        }}
                        onView={onView}
                        token={token}
                    />

                </div>
            </div>
        </div>
    )

}

export default AdvertisingManagment;