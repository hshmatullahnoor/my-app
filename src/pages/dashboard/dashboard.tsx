// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthAPI, { type User } from '../../api/auth_api';
import SidebarNav from './sidebarNav';

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await AuthAPI.getUser(token);
                if (response.success && response.user) {
                    setUser(response.user);
                } else {
                    const userData = localStorage.getItem('user');
                    if (userData) {
                        setUser(JSON.parse(userData));
                    } else {
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('خطا در دریافت اطلاعات کاربر:', error);
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        setUser(JSON.parse(userData));
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

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center" dir="rtl">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
                    <p>در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex" dir="rtl">
            {/* Sidebar */}
            <SidebarNav
                userRole={(user.role as 'admin' | 'user') || 'user'}
                user={user}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 mt-36">


                {/* Scrollable Main Content */}
                <main className="flex-1 pt-20 pr-4 overflow-y-auto">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {/* Welcome Section */}
                        <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    به داشبورد خود خوش آمدید
                                </h2>
                                <p className="text-gray-300 text-lg">
                                    شما با موفقیت وارد سیستم شده‌اید
                                </p>
                            </div>
                        </div>

                        {/* User Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-teal-600 text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                    <div className="mr-4">
                                        <h3 className="text-lg font-medium text-white">پروفایل</h3>
                                        <p className="text-gray-400">{user.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-orange-600 text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <div className="mr-4">
                                        <h3 className="text-lg font-medium text-white">ایمیل</h3>
                                        <p className="text-gray-400 text-sm" dir="ltr">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-600 text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div className="mr-4">
                                        <h3 className="text-lg font-medium text-white">وضعیت حساب</h3>
                                        <p className="text-gray-400">فعال</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-6">دسترسی سریع</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <button className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-lg transition-colors text-center">
                                    <div className="w-8 h-8 mx-auto mb-2">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                                        </svg>
                                    </div>
                                    تنظیمات
                                </button>

                                <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-colors text-center">
                                    <div className="w-8 h-8 mx-auto mb-2">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                    گزارشات
                                </button>

                                <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors text-center">
                                    <div className="w-8 h-8 mx-auto mb-2">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    </div>
                                    کاربران
                                </button>

                                <Link
                                    to="/"
                                    className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg transition-colors text-center block"
                                >
                                    <div className="w-8 h-8 mx-auto mb-2">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                        </svg>
                                    </div>
                                    صفحه اصلی
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;