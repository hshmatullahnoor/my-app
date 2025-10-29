import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { type Advertising } from "../../../../api/advertisings_api";
import type { User } from "../../../../api/auth_api";
import SidebarNav from "../../../../pages/dashboard/sidebarNav";
import AuthAPI from "../../../../api/auth_api";


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
    

    return (
        <>
            {/* Sidebar Navigation */}
            <SidebarNav userRole="admin" user={currentUser} />

            <div className="min-h-screen p-6 pr-16 mt-24 md:mt-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                <div className="mx-auto max-w-7xl">
                    {advertisings && advertisings.length > 0 && (
                        <p>hello</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default UserAdverising;