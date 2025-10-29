import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AuthAPI, { type User } from '../../../api/auth_api';
import SidebarNav from '../sidebarNav';
import AddNewCategory from '../../../components/dashboard/admin/categories/AddNewCategory';
import EditCategoryModal from '../../../components/dashboard/admin/categories/EditCategoryModal';
import DeleteCategoryModal from '../../../components/dashboard/admin/categories/DeleteCategoryModal';
import { CategoriesApi, type Category } from '../../../api/categories_api';
import { Table } from '../../../components/dashboard/admin/categories/show/Table';


const CategoriesManagement: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);


    const navigate = useNavigate();


    const fetchCategories = useCallback(async (showSuccessToast = false, successMessage?: string) => {
        try {
            const response = await CategoriesApi.getCategories();
            if (response.success) {
                setCategories(response.data);
                if (showSuccessToast && successMessage) {
                    toast.success(successMessage);
                }
            } else {
                toast.error('خطا در دریافت دسته‌بندی‌ها');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error(' خطایی در هنگام دریافت دسته‌بندی‌ها رخ داد');
        }
    }, []);

    const onCategoryAdded = async () => {
        await fetchCategories(true, 'دسته‌بندی با موفقیت اضافه شد');
        setIsAddCategoryModalOpen(false);
    };

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsEditCategoryModalOpen(true);
    };

    const handleDeleteCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteCategoryModalOpen(true);
    };

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
    }, [navigate]);

    // Fetch categories for parent dropdown
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    if (!currentUser) {
        return (
            <>
                <SidebarNav userRole="admin" />
                <div className="flex items-center justify-center min-h-screen pr-16 my-auto mt-24 mp-6 md:mt-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                    <div className="text-center text-gray-800 dark:text-white">
                        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-teal-400 rounded-full animate-spin"></div>
                        <p>در حال بارگذاری...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Sidebar Navigation */}
            <SidebarNav userRole="admin" user={currentUser} />

            <div className="min-h-screen p-6 pr-16 mt-24 md:mt-16 bg-gray-50 dark:bg-gray-900" dir="rtl">
                <AddNewCategory
                    isOpen={isAddCategoryModalOpen}
                    onClose={() => setIsAddCategoryModalOpen(false)}
                    categories={categories}
                    onSuccess={onCategoryAdded}
                />
                <EditCategoryModal
                    isOpen={isEditCategoryModalOpen}
                    onClose={() => {
                        setIsEditCategoryModalOpen(false);
                        setSelectedCategory(null);
                    }}
                    category={selectedCategory}
                    categories={categories}
                    onSuccess={async () => {
                        await fetchCategories(true, 'دسته‌بندی با موفقیت بروزرسانی شد');
                    }}
                />
                <DeleteCategoryModal
                    isOpen={isDeleteCategoryModalOpen}
                    onClose={() => {
                        setIsDeleteCategoryModalOpen(false);
                        setSelectedCategory(null);
                    }}
                    category={selectedCategory}
                    onSuccess={async () => {
                        await fetchCategories(true, 'دسته‌بندی با موفقیت حذف شد');
                        setIsDeleteCategoryModalOpen(false);
                        setSelectedCategory(null);
                    }}
                />
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center justify-end mb-8 md:justify-between">
                        <div className="hidden md:block">
                            <h1 className="mb-2 text-xl font-bold text-gray-700 dark:text-white md:text-3xl">مدیریت دسته‌بندی‌ها</h1>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                                onClick={() => setIsAddCategoryModalOpen(true)}
                                type="button"
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
                                دسته‌بندی جدید
                            </button>

                            <button
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-50"
                                type="button"
                                onClick={() => { void fetchCategories(); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H9m11 11v-5h-.581m-15.357-2a8.003 8.003 0 0015.356 2H15" />
                                </svg>
                                بروزرسانی
                            </button>
                        </div>
                    </div>

                    <Table
                        categories={categories}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                    />

                </div>
            </div>
        </>
    );
};

export default CategoriesManagement;