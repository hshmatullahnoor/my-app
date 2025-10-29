import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthAPI from '../api/auth_api';
import type { LoginResponse } from '../api/auth_api';
import toast from 'react-hot-toast';
import { Navigation } from '../components';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const baseInputClasses = 'mt-1 block w-full px-3 py-2 text-sm transition-colors border rounded-lg shadow-sm bg-white/80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 border-gray-200 dark:bg-gray-900/60 dark:text-gray-100 dark:placeholder-gray-500 dark:border-gray-700';
    const errorInputClasses = 'border-red-300 focus:ring-red-400 focus:border-red-400 dark:border-red-500 dark:focus:ring-red-500';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'ایمیل اجباری است';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'ایمیل معتبر نیست';
        }

        if (!formData.password) {
            newErrors.password = 'رمز عبور اجباری است';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response: LoginResponse = await AuthAPI.login(formData.email, formData.password);

            if (response.success) {
                if (response.access_token) {
                    localStorage.setItem('access_token', response.access_token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                toast.success('ورود با موفقیت انجام شد!');
                navigate('/dashboard');
            } else {
                if (response.errors) {
                    const backendErrors: Record<string, string> = {};
                    Object.keys(response.errors).forEach(field => {
                        backendErrors[field] = response.errors![field][0];
                    });
                    setErrors(backendErrors);
                } else {
                    const message = response.message || 'خطایی در ورود رخ داد';
                    toast.error(message);
                    setErrors({ general: message });
                }
            }
        } catch (error) {
            console.error('خطا در ورود:', error);
            toast.error('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
            setErrors({ general: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen transition-colors bg-gradient-to-br from-slate-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-black" dir="rtl">
            <Navigation showDashboard={false} />

            <div className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center max-w-5xl gap-10 mx-auto lg:flex-row lg:justify-between">
                    <div className="max-w-xl text-center lg:text-right">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide text-teal-700 uppercase rounded-full bg-teal-100/80 dark:bg-teal-500/15 dark:text-teal-300">
                            خوش آمدید
                        </span>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 transition-colors md:text-5xl dark:text-white">
                            ورود به حساب بازار افغان
                        </h1>
                        <p className="mt-4 text-base leading-7 text-gray-600 transition-colors dark:text-gray-300">
                            برای مدیریت آگهی‌ها، مشاهده پیام‌ها و دنبال کردن عملکرد فروش خود وارد شوید. محیط کاربری ما در هر دو حالت تیره و روشن هماهنگی کامل دارد.
                        </p>
                        <ul className="mt-6 space-y-3 text-sm text-gray-600 transition-colors dark:text-gray-300">
                            <li className="flex flex-row-reverse items-center gap-3 lg:flex-row">
                                <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-teal-500/90 dark:bg-teal-500/70">
                                    ۱
                                </span>
                                <span className="flex-1">
                                    ثبت و مدیریت آگهی‌ها در داشبورد متمرکز
                                </span>
                            </li>
                            <li className="flex flex-row-reverse items-center gap-3 lg:flex-row">
                                <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-orange-500/90 dark:bg-orange-500/70">
                                    ۲
                                </span>
                                <span className="flex-1">
                                    دسترسی سریع به مخاطبین و پیام‌های جدید
                                </span>
                            </li>
                            <li className="flex flex-row-reverse items-center gap-3 lg:flex-row">
                                <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-indigo-500/90 dark:bg-indigo-500/70">
                                    ۳
                                </span>
                                <span className="flex-1">
                                    تجربه کاربری بهینه در حالت موبایل و دسکتاپ
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <h2 className="mt-2 text-3xl font-extrabold text-center text-gray-900 transition-colors dark:text-white">
                                ورود به حساب کاربری
                            </h2>
                            <p className="mt-2 text-sm text-center text-gray-600 transition-colors dark:text-gray-300">
                                هنوز حسابی ندارید؟{' '}
                                <Link
                                    to="/register"
                                    className="font-semibold text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
                                >
                                    همین حالا ثبت‌نام کنید
                                </Link>
                            </p>
                        </div>

                        {errors.general && (
                            <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50 dark:text-red-100 dark:bg-red-950/70 dark:border-red-700">
                                <p className="text-sm">{errors.general}</p>
                            </div>
                        )}

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="p-8 space-y-6 transition-colors border border-gray-200 shadow-2xl rounded-2xl backdrop-blur bg-white/90 dark:bg-gray-900/90 dark:border-gray-700">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 transition-colors dark:text-gray-200">
                                        آدرس ایمیل
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`${baseInputClasses} ${errors.email ? errorInputClasses : ''}`}
                                        placeholder="ali.ahmadi@example.com"
                                        dir="ltr"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 transition-colors dark:text-gray-200">
                                        رمز عبور
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`${baseInputClasses} ${errors.password ? errorInputClasses : ''}`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex justify-center w-full px-4 py-2 text-sm font-semibold text-white transition-colors bg-teal-600 border border-transparent rounded-lg shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 dark:bg-teal-500 dark:hover:bg-teal-400 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            در حال ورود...
                                        </div>
                                    ) : (
                                        'ورود'
                                    )}
                                </button>

                                <div className="text-sm text-center text-gray-500 transition-colors dark:text-gray-400">
                                    <Link
                                        to="/"
                                        className="font-medium text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
                                    >
                                        ← بازگشت به صفحه اصلی
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;