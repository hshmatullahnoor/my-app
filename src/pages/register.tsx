import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthAPI from '../api/auth_api';
import type { RegisterResponse } from '../api/auth_api';
import toast from 'react-hot-toast';
import { Navigation } from '../components';
import CitySelector from '../components/CitySelector';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        city_id: '' as number | ''
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

    const handleCityChange = (cityId: number | '') => {
        setFormData(prev => ({ ...prev, city_id: cityId }));
        if (errors.city_id) {
            setErrors(prev => ({ ...prev, city_id: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'نام اجباری است';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'ایمیل اجباری است';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'ایمیل معتبر نیست';
        }

        if (formData.city_id === '') {
            newErrors.city_id = 'انتخاب شهر اجباری است';
        }

        if (!formData.password) {
            newErrors.password = 'رمز عبور اجباری است';
        } else if (formData.password.length < 8) {
            newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = 'تکرار رمز عبور اجباری است';
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'رمز عبور و تکرار آن یکسان نیست';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const cityIdToSend = typeof formData.city_id === 'number' ? formData.city_id : undefined;

            if (cityIdToSend === undefined) {
                throw new Error('City ID is required and must be a number');
            }

            const response: RegisterResponse = await AuthAPI.register(
                formData.name,
                formData.email,
                formData.password,
                formData.password_confirmation,
                cityIdToSend
            );

            if (response.success) {
                if (response.access_token) {
                    localStorage.setItem('access_token', response.access_token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                toast.success('ثبت نام با موفقیت انجام شد!');
                navigate('/dashboard');
            } else {
                if (response.errors) {
                    const backendErrors: Record<string, string> = {};
                    Object.keys(response.errors).forEach(field => {
                        backendErrors[field] = response.errors![field][0];
                    });
                    setErrors(backendErrors);
                } else {
                    toast.error('خطایی در سرور رخ داده است. لطفاً دوباره تلاش کنید.');
                    setErrors({ general: response.message || 'خطایی در ثبت نام رخ داد' });
                }
            }
        } catch (error) {
            console.error('خطا در ثبت نام:', error);
            toast.error('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
            setErrors({ general: 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen transition-colors bg-gradient-to-br from-orange-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-black" dir="rtl">
            <Navigation showDashboard={false} />

            <div className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center max-w-5xl gap-10 mx-auto lg:flex-row lg:justify-between">
                    <div className="max-w-xl text-center lg:text-right">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 transition-colors md:text-5xl dark:text-white">
                            به بازار افغان خوش آمدید
                        </h1>
                        <p className="mt-4 text-base leading-7 text-gray-600 transition-colors dark:text-gray-300">
                            تنها چند قدم با ایجاد حساب کاربری فاصله دارید. اطلاعات خود را وارد کنید تا بتوانید آگهی‌های دلخواه را ثبت و مدیریت کنید.
                        </p>
                    </div>

                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <h2 className="mt-2 text-3xl font-extrabold text-center text-gray-900 transition-colors dark:text-white">
                                ایجاد حساب کاربری
                            </h2>
                            <p className="mt-2 text-sm text-center text-gray-600 transition-colors dark:text-gray-300">
                                یا{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
                                >
                                    وارد حساب موجود خود شوید
                                </Link>
                            </p>
                        </div>

                        {errors.general && (
                            <div className="px-4 py-3 text-red-700 bg-red-50 border border-red-200 rounded-lg dark:text-red-100 dark:bg-red-950/70 dark:border-red-700">
                                <p className="text-sm">{errors.general}</p>
                            </div>
                        )}

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="p-8 space-y-6 transition-colors border rounded-2xl shadow-2xl backdrop-blur bg-white/90 border-gray-200 dark:bg-gray-900/90 dark:border-gray-700">

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 transition-colors dark:text-gray-200">
                                        نام کامل
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`${baseInputClasses} ${errors.name ? errorInputClasses : ''}`}
                                        placeholder="علی احمدی"
                                        dir="rtl"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                                    )}
                                </div>

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
                                    <CitySelector
                                        value={formData.city_id}
                                        onChange={handleCityChange}
                                    />
                                    {errors.city_id && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.city_id}</p>
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

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 transition-colors dark:text-gray-200">
                                        تکرار رمز عبور
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className={`${baseInputClasses} ${errors.password_confirmation ? errorInputClasses : ''}`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex justify-center w-full px-4 py-2 text-sm font-semibold text-white transition-colors border border-transparent rounded-lg shadow-md bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:bg-orange-600 dark:hover:bg-orange-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            در حال ایجاد حساب...
                                        </div>
                                    ) : (
                                        'ایجاد حساب کاربری'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;