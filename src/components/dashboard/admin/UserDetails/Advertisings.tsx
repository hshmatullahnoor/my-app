import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { type Advertising } from "../../../../api/advertisings_api";
import type { User } from "../../../../api/auth_api";
import SidebarNav from "../../../../pages/dashboard/sidebarNav";
import AuthAPI from "../../../../api/auth_api";
import AdvertisingsAPI from "../../../../api/advertisings_api";


const UserAdverising: React.FC<{ token: string | null; currentUser:User | null }> = ({ token, currentUser }) => {

    const navigate = useNavigate();

    if (!token) {

        toast.error('لطفا مجددا وارد بشید')

        navigate("/login")

    }


    const [advertisings, setAdvertisings] = useState<Advertising[] | undefined | null>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUserAdvertisings = async () => {
        setLoading(true);
        if (!token) {
            toast.error('لطفا مجددا وارد بشید')

            navigate("/login")
            setLoading(false);
            return
        }
        const res = await AuthAPI.getUser(token, 'yes')

        if (!res.success && !res.user) {
            toast.error('خطا در دیافت آگهی های شما');
            setAdvertisings(undefined);
            console.log(res.errors);
            setLoading(false);

            return
        }

        // console.log(res.user);
        

        setAdvertisings(res.user?.ads);
        setLoading(false);

    }

    useEffect(() => {
        fetchUserAdvertisings();
        
    }, [])

    

    if(!currentUser) {
        toast.error('لطفا مجددا وارد بشید')

        navigate("/login")
        return
    }
    if (advertisings === undefined || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen pr-16 bg-white dark:bg-gray-900" dir="rtl">
                <div className="text-center text-gray-900 dark:text-white">
                    <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-teal-400 rounded-full animate-spin"></div>
                    <p>در حال بارگذاری...</p>
                </div>
            </div>
        );
    }
    

    const getStatusBadge = (status: string) => {
        const statusMap = {
            'active': { text: 'فعال', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            'inactive': { text: 'غیرفعال', class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
            'sold': { text: 'فروخته شده', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' }
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { text: status, class: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    const getTypeBadge = (type: string) => {
        const typeMap = {
            'accepted': { text: 'تایید شده', class: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
            'rejected': { text: 'رد شده', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
            'pending': { text: 'در انتظار تایید', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
        };
        const typeInfo = typeMap[type as keyof typeof typeMap] || { text: type, class: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 text-xs rounded-full ${typeInfo.class}`}>{typeInfo.text}</span>;
    };

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

    const handleDelete = async (id: number) => {
        if (!token) {
            toast.error('لطفا مجددا وارد بشید');
            navigate('/login');
            return;
        }

        if (!confirm('آیا از حذف این آگهی اطمینان دارید؟')) {
            return;
        }

        try {
            const result = await AdvertisingsAPI.deleteAdvertising(token, id);
            if (result.success) {
                toast.success('آگهی با موفقیت حذف شد');
                fetchUserAdvertisings();
            } else {
                toast.error(result.message || 'خطا در حذف آگهی');
            }
        } catch (error) {
            console.error(error);
            toast.error('خطا در حذف آگهی');
        }
    };

    return (
        <>
            <SidebarNav userRole={(currentUser.role as 'admin' | 'user') || 'user'} user={currentUser} />

            <div className="min-h-screen p-6 pr-16 mt-24 md:mt-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">آگهی های من</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            مدیریت و مشاهده آگهی های خود
                        </p>
                    </div>

                    {advertisings && advertisings.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {advertisings.map((ad) => (
                                <div
                                    key={ad.id}
                                    className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row">
                                        <div className="flex-shrink-0">
                                            {ad.images && ad.images.length > 0 ? (
                                                <img
                                                    src={ad.images[0].image_path}
                                                    alt={ad.title}
                                                    className="object-cover w-full h-48 rounded-lg md:w-48 md:h-32"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-48 bg-gray-200 rounded-lg md:w-48 md:h-32 dark:bg-gray-700">
                                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                                        {ad.title}
                                                    </h2>
                                                    <p className="mb-3 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                                                        {ad.description}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handleDelete(ad.id)}
                                                    className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                    title="حذف آگهی"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-3 md:grid-cols-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">قیمت</p>
                                                    <p className="font-semibold text-teal-600 dark:text-teal-400">
                                                        {ad.price ? `${formatPrice(ad.price - (ad.discount || 0))} افغانی` : 'توافقی'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">موقعیت</p>
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {ad.city?.name || 'نامشخص'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">بازدید</p>
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {ad.views || 0}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">تاریخ ثبت</p>
                                                    <p className="text-sm text-gray-900 dark:text-white">
                                                        {formatDate(ad.created_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {getStatusBadge(ad.status)}
                                                {getTypeBadge(ad.type)}
                                                {ad.category && (
                                                    <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                                        {ad.category.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                            <svg className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">هنوز آگهی ثبت نکرده‌اید</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">اولین آگهی خود را ثبت کنید</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default UserAdverising;