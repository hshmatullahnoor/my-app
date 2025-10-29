
import { useCallback, useEffect, useState } from "react";
import SidebarNav from "../sidebarNav";
import AuthAPI, { type User } from "../../../api/auth_api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MainDetail from "../../../components/dashboard/UserProfile/MainDetails";
import ActivityDetails from "../../../components/dashboard/UserProfile/ActivityDatails";
import UsersApi from "../../../api/admin/users";
import ChangePassword from "../../../components/dashboard/UserProfile/ChangePassword";



const UserProfilePage = () => {

    const [token, setToken] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();



    const fetchUserData = useCallback(async () => {
        setLoading(true)
        // Check if user is logged in and is admin
        const access_token = localStorage.getItem('access_token');

        if (!access_token) {
            toast.error('خطا در دریافت اطلاعات شما. لطفا مجدد وارد شوید')
            navigate('/login');
            return;
        }

        setToken(access_token)

        try {
            const response = await AuthAPI.getUser(access_token);

            if (response.success && response.user) {
                setUser(response.user);
            } else {
                toast.error('خطا در اتصال به سرور!')
            }
        } catch (error) {
            console.error('خطا در دریافت اطلاعات کاربر:', error);

            console.error(error);

        } finally {
            setLoading(false)
        }
    }, [navigate])

    useEffect(() => {


        fetchUserData();
    }, [fetchUserData]);

    if (loading) {
        return (
            <>
                <SidebarNav userRole="user" />
                <div className="flex items-center justify-center min-h-screen pr-16 bg-white dark:bg-gray-900" dir="rtl">
                    <div className="text-center text-gray-900 dark:text-white">
                        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-teal-400 rounded-full animate-spin"></div>
                        <p>در حال بارگذاری...</p>
                    </div>
                </div>
            </>
        );
    }



    if (!user) {
        return (
            <>
                <SidebarNav userRole="user" />
                <div className="flex items-center justify-center w-full min-h-screen text-gray-700 bg-white dark:bg-gray-800 dark:text-white">
                    <div className="w-[40%] h-[12vh] shadow-md rounded-md p-6 text-center gap-y-4">
                        <p>خطا در دریافت اطلاعات کاربر</p>
                        <p>هنگام دریافت اطلاعات از سرور به مشکل برخوریم.</p>
                        <p>لطفا بعدا دوباره تلاش کنید</p>
                    </div>
                </div>
            </>
        )
    }

    const updateUser = async (
        name?: string,
        email?: string,
        phone?: string | null,
        telegram?: string | null,
        city_id?: string | null,
        show_phone?: boolean | null,
        show_telegram?: boolean | null,
        password?: string,
        password_confirmation?: string,
        old_password?: string
    ) => {
        setLoading(true);
        const update = await AuthAPI.updateUser(
            token,
            user?.id,
            name ?? user.name,
            email ?? user.email,
            phone ?? user.phone,
            telegram ?? user.telegram,
            city_id ?? String(user.city_id),
            show_phone ?? user.show_phone,
            show_telegram ?? user.show_phone,
            password ?? undefined,
            password_confirmation ?? undefined,
            old_password ?? undefined
        );

        if (!update.success) {
            toast.error('خطا در ویرایش کاربر');
            console.log(update.error);
            console.log(update.message);
            setLoading(false);
            return;
        }

        toast.success('بروزرسانی موفقیت آمیز بود');
        setLoading(false);
        fetchUserData();

    }

    const onChangeHandler = async (record: string, value?: string, file?: File, passwordData?: { old: string, new: string, confirm: string }) => {


        if (record === 'name' && value && value !== '') {

            updateUser(
                value
            );
            return;
        }
        if (record === 'email' && value && value !== '') {

            updateUser(
                undefined,
                value
            );
            return;
        }
        if (record === 'phone' && value && value !== '') {

            updateUser(
                undefined,
                undefined,
                value
            );
            return;
        }
        if (record === 'telegram' && value && value !== '') {

            updateUser(
                undefined,
                undefined,
                undefined,
                value
            );
            return;
        }
        if (record === 'city_id' && value && value !== '') {

            updateUser(
                undefined,
                undefined,
                undefined,
                undefined,
                value
            );
            return;
        }
        if (record === 'show_phone' && value && value !== '') {

            updateUser(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                value === 'yes' ? true : false
            );
            return;
        }
        if (record === 'show_telegram' && value && value !== '') {

            updateUser(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                value === 'yes' ? true : false
            );
            return;
        }

        if (file !== undefined && record === 'avatar') {

            // console.log('uploading avatar');


            const res = await UsersApi.updateUserAvatar(token, user.id, file);

            if (!res.success) {
                toast.error('خطا در بارگذاری آواتار');
                console.log(res.message);
                console.log(res.errors);

            }

            toast.success('آواتار با موفقیت بروز شد')
            fetchUserData();
        }

        if (passwordData !== undefined && record === 'password') {
            updateUser(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                passwordData.new,
                passwordData.confirm,
                passwordData.old
            );
            return;
        }

    }

    return (
        <>
            <SidebarNav user={user} userRole={user.role} key={user.email} />

            <div className="p-6 pr-16 mt-16 min-h-[93vh] md:mt-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                <div className="mx-auto max-w-7xl">
                    {/* image, name and email */}
                    <MainDetail
                        user={user}
                        onChange={(record, vlaue, file) => {
                            // console.log(record, vlaue);
                            onChangeHandler(record, vlaue, file);

                        }}
                    />

                    {/* Activity Details */}
                    <ActivityDetails />
                        
                    {/* change pass */}
                    <ChangePassword
                        OnChange={(old, newP, conf) => {

                            onChangeHandler('password', undefined, undefined, { old: old, new: newP, confirm: conf })

                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default UserProfilePage;