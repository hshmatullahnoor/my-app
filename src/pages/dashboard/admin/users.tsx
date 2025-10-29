import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AuthAPI, { type User } from '../../../api/auth_api';
import SidebarNav from '../sidebarNav';
import UserTable from '../../../components/dashboard/admin/users/UserTable';
import UsersApi, { type updateUserRequest } from '../../../api/admin/users';
import { DeleteModal } from '../../../components/dashboard/shared/data-table/deleteModal';
import { Form, type FormColumns } from '../../../components/dashboard/shared/data-table/form';
import CitySelector from '../../../components/CitySelector';
import Checkbox from '../../../components/dashboard/shared/data-table/checkbox';
import AvatarUploader from '../../../components/dashboard/shared/data-table/profileUploader';
import { IMAGES_URL } from '../../../api/main';
import { CreateUser } from '../../../components/dashboard/admin/users/createUser';

const UsersManagement: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User>([] as unknown as User);
    const [perPage, setPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();


    const token = localStorage.getItem('access_token') || '';

    if (!token) {
        toast.error('برای مشاهده این صفحه لازم است دوباره وارد شوید.');
        navigate('/login');
    }

    const onDeleteHandler = (user: User) => {
        setIsDeleteModalOpen(true)
        setSelectedUser(user);
    };

    const onEditHandler = (user: User) => {
        setIsEditModalOpen(true)
        setSelectedUser(user)
    }

    const onEditFormSubmited = async (data: updateUserRequest) => {
        //`edit form: ${JSON.stringify(data)}`);

        const {
            password,
            password_confirmation: passwordConfirmation,
            ...rest
        } = data;

        const trimmedPassword = password?.trim() ?? '';
        const trimmedConfirmation = passwordConfirmation?.trim() ?? '';

        const payload: updateUserRequest = {
            ...rest,
            password: trimmedPassword, // Ensure password is always included
            password_confirmation: trimmedConfirmation, // Ensure password_confirmation is always included
        };
        if (!trimmedPassword) {
            delete payload.password;
            delete payload.password_confirmation;
        }

        try {
            const response = await UsersApi.updateUser(
                token,
                selectedUser.id,
                payload.name,
                payload.email,
                payload.phone,
                payload.role,
                payload.telegram,
                payload.show_phone,
                payload.show_telegram,
                payload.city_id,
                payload.avatar,
                payload.email_verified,
                payload.password,
                payload.password_confirmation
            );
            if (response.success) {
                toast.success("اطلاعات کاربر با موفقیت بروزرسانی شد");
                fetchUsers();
            } else {
                toast.error("بروزرسانی اطلاعات کاربر با خطا مواجه شد");
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('ارتباط با سرور برقرار نشد');
        } finally {
            setIsEditModalOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        try {
            const response = await UsersApi.deleteUser(selectedUser.id, token);
            if (response.success) {
                toast.success("کاربر " + selectedUser.name + " با موفقیت حذف شد");
                fetchUsers();
                return
            }

            toast.error("حذف کاربر " + selectedUser.name + "با خطا مواجه شد");

        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('ارتباط با سرور برقرار نشد');
        } finally {
            setIsDeleteModalOpen(false);
        }
    }

    const fetchUsers = useCallback(async ({
        page,
        perPageValue = perPage,
        search = searchQuery,
    }: {
        page?: number;
        perPageValue?: number;
        search?: string;
    } = {}) => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            setUsersError('برای مشاهده کاربران لازم است دوباره وارد شوید.');
            setUsers([]);
            setIsLoadingUsers(false);
            return;
        }

        try {
            setIsLoadingUsers(true);
            setUsersError(null);

            const response = await UsersApi.getAllUsers(token, page ?? 1, perPageValue, search);



            if (!response.success && response.message) {
                switch (response.message) {
                    case 'Unauthorized':
                        setUsersError('برای مشاهده کاربران لازم است دوباره وارد شوید.');
                        toast.error('برای مشاهده کاربران لازم است دوباره وارد شوید.');
                        navigate('/login');
                        break;
                    case 'Forbidden':
                        setUsersError('شما دسترسی لازم برای مشاهده کاربران را ندارید.');
                        toast.error('شما دسترسی لازم برای مشاهده کاربران را ندارید.');
                        navigate('/dashboard');
                        break;
                    default:
                        setUsersError('خطا در دریافت کاربران: ' + response.message);
                        toast.error('خطا در دریافت کاربران: ' + response.message);
                }
            } else if (response.success && response.data) {
                setUsers(response.data.data ?? []);
                setTotalPages(response.data.last_page ?? 1);
                // Do NOT setCurrentPage here; only update in handlers
            } else {
                setUsersError('خطا در دریافت کاربران');
                toast.error('خطا در دریافت کاربران');
            }

        } catch (error) {
            console.error('Error fetching users:', error);
            setUsersError('ارتباط با سرور برقرار نشد');
            toast.error('ارتباط با سرور برقرار نشد');
        } finally {
            setIsLoadingUsers(false);
        }
    }, [navigate, perPage, searchQuery]);

    const handlePerPageChange = useCallback((pageSize: number) => {
        setPerPage(pageSize);
        setCurrentPage(1);
        void fetchUsers({ page: 1, perPageValue: pageSize, search: searchQuery });
    }, [fetchUsers, searchQuery]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        void fetchUsers({ page, search: searchQuery });
    }, [fetchUsers, searchQuery]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        void fetchUsers({ page: 1, search: query });
    }, [fetchUsers]);

    useEffect(() => {
        const fetchUserData = async () => {
            // Check if user is logged in and is admin
            const token = localStorage.getItem('access_token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await AuthAPI.getUser(token);

                if (response.success && response.user) {
                    if (response.user.role !== 'admin') {
                        toast.error('دسترسی غیرمجاز');
                        navigate('/dashboard');
                        return;
                    }
                    setCurrentUser(response.user);
                    await fetchUsers();
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
                            await fetchUsers();
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
                        await fetchUsers();
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
    }, [fetchUsers, navigate]);

    if (!currentUser) {
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




    const userFormColumns: FormColumns[] = [
        {
            name: 'avatar',
            label: '',
            inputType: 'input',
            required: false,
            value: selectedUser.avatar,
            position: 'center',
            render: ({ onChange }) => {

                const handleFileChange = (file: File | null) => {
                    onChange(file);
                };

                return (
                    <AvatarUploader
                        avatar={IMAGES_URL + selectedUser.avatar}
                        name={selectedUser.name}
                        preView={true}
                        onChange={handleFileChange}
                    />
                );


            }

        },

        {
            name: 'name',
            label: 'نام کامل',
            inputType: 'input',
            type: 'text',
            value: selectedUser.name,
            placeholder: 'نام و نام خانوادگی',
            required: true,
        },
        {
            name: 'email',
            label: 'ایمیل',
            inputType: 'input',
            type: 'email',
            placeholder: 'example@domain.com',
            required: true,
            value: selectedUser.email,
        },
        {
            name: 'phone',
            label: 'شماره تلفن',
            inputType: 'input',
            type: 'tel',
            placeholder: '09123456789',
            required: false,
            value: selectedUser.phone,
        },
        {
            name: 'role',
            label: 'نقش',
            inputType: 'select',
            required: true,
            value: selectedUser.role,
            options: [
                { value: 'user', label: 'کاربر عادی' },
                { value: 'admin', label: 'ادمین' },
            ],
        },
        {
            name: 'telegram',
            label: 'آیدی تلگرام',
            inputType: 'input',
            type: 'text',
            placeholder: '@username',
            required: false,
            value: selectedUser.telegram,
        },
        {
            name: 'show_phone',
            label: 'نمایش شماره تلفن به دیگران',
            inputType: 'checkbox',
            required: false,
            value: selectedUser.show_phone || false,
            render: ({ value, onChange }) => {
                const isChecked = !!value;

                return (
                    <Checkbox
                        checked={isChecked}
                        onChange={(checked) => onChange(checked)}
                        label="نمایش شماره تلفن به دیگران"
                        id="show_phone"
                    />
                )
            }
        },
        {
            name: 'show_telegram',
            label: 'نمایش آیدی تلگرام به دیگران',
            inputType: 'checkbox',
            required: false,
            value: selectedUser.show_phone,
            render: ({ value, onChange }) => {
                const isChecked = !!value;

                return (
                    <Checkbox
                        checked={isChecked}
                        onChange={(checked) => onChange(checked)}
                        label="نمایش آیدی تلگرام به دیگران"
                        id="show_telegram"
                    />
                )
            }
        },
        {
            name: 'city_id',
            label: '',
            inputType: 'select', // فقط برای سازگاری، ولی render جایگزین می‌شود
            required: false,
            value: selectedUser?.city_id ?? "", // مقدار اولیه: عدد یا null → به "" تبدیل می‌شود
            render: ({ value, onChange }) => {
                // تبدیل مقدار به فرمت مورد نیاز CitySelector
                const cityValue = value === null || value === undefined || value === '' ? "" : Number(value);

                return (
                    <CitySelector
                        value={cityValue}
                        onChange={(newValue) => {
                            // CitySelector "" یا number برمی‌گرداند
                            // در فرم، null یا عدد ذخیره می‌شود
                            const finalValue = newValue === "" ? null : newValue;
                            onChange(finalValue);
                        }}
                    />
                );
            }
        },
        {
            name: 'password',
            label: 'رمز عبور (برای تغییر رمز عبور وارد کنید)',
            inputType: 'input',
            type: 'password',
            placeholder: 'رمز عبور جدید',
            required: false,
            value: '',
        },
        {
            name: 'password_confirmation',
            label: 'تکرار رمز عبور',
            inputType: 'input',
            type: 'password',
            placeholder: 'تکرار رمز عبور جدید',
            required: false,
            value: '',
        },
        {
            name: 'email_verified',
            label: 'ایمیل تایید شده',
            inputType: 'checkbox',
            required: false,
            // مقدار اولیه: اگر تاریخ وجود داشت، true؛ در غیر این صورت false
            value: !!selectedUser.email_verified_at,
            render: ({ value, onChange }) => {
                const isChecked = !!value;

                return (
                    <Checkbox
                        checked={isChecked}
                        onChange={(checked) => onChange(checked)}
                        label="ایمیل تایید شده"
                        id="email_verified"
                    />
                );
            },
        }
    ];

    return (
        <>
            {/* Sidebar Navigation */}
            <SidebarNav userRole="admin" user={currentUser} />

            <div className="min-h-screen p-6 pr-16 mt-24 md:mt-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                <div className="mx-auto max-w-7xl">

                    <CreateUser
                        modelOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                    />

                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        title="حذف کاربر"
                        itemName={selectedUser.name}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={() => {
                            setIsDeleteModalOpen(false);
                            onDeleteConfirm();
                        }}
                    />

                    <Form
                        isOpen={isEditModalOpen}
                        title={"ویرایش " + selectedUser.name}
                        columns={userFormColumns}
                        onClose={() => { setIsEditModalOpen(false) }}
                        onSubmit={(data: Record<string, unknown>) => {
                            onEditFormSubmited(data as unknown as updateUserRequest);
                        }}
                        type='edit'
                        key={selectedUser.id}
                    />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="">
                            <h1 className="mb-2 text-xl font-bold text-gray-800 dark:text-white md:text-3xl">مدیریت کاربران</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">مدیریت کاربران سیستم</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                                type="button"
                                onClick={() => { setIsCreateModalOpen(true); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 5v14m-7-7h14"
                                    />
                                </svg>
                                کاربر جدید
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-50"
                                type="button"
                                onClick={() => { void fetchUsers(); }}
                                disabled={isLoadingUsers}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H9m11 11v-5h-.581m-15.357-2a8.003 8.003 0 0015.356 2H15" />
                                </svg>
                                بروزرسانی
                            </button>
                        </div>
                    </div>


                    <UserTable
                        users={users}
                        loading={isLoadingUsers}
                        error={usersError}
                        onRetry={() => { void fetchUsers(); }}
                        onEdit={(user) => onEditHandler(user)}
                        onDelete={(user) => onDeleteHandler(user)}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        defaultPerPage={perPage}
                        onPerPageChange={handlePerPageChange}
                        onSearch={handleSearch}
                        curentPage={currentPage}
                    />
                </div>
            </div>
        </>
    );
};

export default UsersManagement;