// sidebarNav.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navItems from "../../types/navItems";
import AuthAPI, { type User } from '../../api/auth_api';
import ToggleThemeButton from '../../components/ToggleThemeButton';
import { LogOutIcon } from 'lucide-react';
// import toast from 'react-hot-toast';

interface SidebarNavProps {
    userRole?: 'admin' | 'user';
    user?: User;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ userRole = 'user', user }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    const filteredNavItems = navItems.filter(item =>
        item.role.includes(userRole)
    );

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const isActivePath = (path: string) => {
        return location.pathname === path;
    };

    // ذخیره وضعیت سایدبار در localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebarExpanded');
        if (saved !== null) {
            setIsExpanded(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
        updateIsMobile();

        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    // بستن سایدبار در موبایل هنگام تغییر مسیر
    // useEffect(() => {
    //     if (isMobile && isExpanded) {
    //         setIsExpanded(false);
    //     }
    // }, [location.pathname, isMobile, isExpanded]);

    return (
        <>
            {/* Backdrop for mobile */}
            {isExpanded && isMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Fixed Header */}
            <header
                className={`
                    fixed top-0 left-0 z-30 transition-all duration-300
                    border-b backdrop-blur-md shadow-lg
                    bg-white/80 text-gray-900 border-gray-200
                    dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 dark:text-white dark:border-gray-700/60
                    ${isExpanded ? 'right-64' : 'right-12 md:right-16'}
                `}
            >
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-around space-x-3 space-x-reverse">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {filteredNavItems.find(item => isActivePath(item.path))?.label || 'داشبورد'}
                            </h1>
                        </div>
                        <div className="flex items-center justify-end flex-1 gap-8">
                            <div className="flex items-center space-x-4 space-x-reverse">
                                {user && (
                                    <>
                                        <div className="items-center hidden space-x-2 space-x-reverse text-gray-500 md:flex dark:text-gray-300">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm">خوش آمدید، {user.name}</span>
                                        </div>

                                    </>
                                )}

                            </div>
                            <div className="">
                                <ToggleThemeButton />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Fixed Sidebar */}
            <div
                className={`
                    fixed top-0 right-0 h-full transition-all duration-300 z-50
                    flex flex-col shadow-2xl backdrop-blur-lg
                    bg-white/85 border-l border-gray-200
                    dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-950 dark:border-gray-800/60
                    ${isExpanded ? 'w-64' : 'w-12 md:w-16'}
                `}
            >
                {/* Toggle Button */}
                <div className="flex items-center justify-between p-3 mt-16 border-b border-gray-200/80 dark:border-gray-800/50">
                    {isExpanded && (
                        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">منوی اصلی</h2>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 transition-colors p-1.5 rounded-lg hover:bg-teal-50 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400/60 focus:ring-offset-2 focus:ring-offset-white dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-white dark:focus:ring-offset-gray-900"
                        aria-label={isExpanded ? 'بستن منو' : 'باز کردن منو'}
                    >
                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-2 overflow-y-auto">
                    <ul className="px-2 space-y-1">
                        {filteredNavItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`
                                        group flex items-center w-full rounded-xl transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400/60 focus:ring-offset-white
                                        dark:focus:ring-offset-gray-900
                                        ${isExpanded
                                            ? 'px-3 py-2.5'
                                            : 'px-3 py-2.5 justify-center w-12 mx-auto'
                                        }
                                        ${isActivePath(item.path)
                                            ? 'bg-teal-500/10 text-teal-700 border-r-2 border-teal-500 shadow-sm dark:bg-gradient-to-r dark:from-blue-600/20 dark:to-teal-600/20 dark:text-teal-300 dark:border-teal-400'
                                            : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                                        }
                                        relative
                                    `}
                                    aria-label={item.label}
                                >
                                    <div
                                        className={`
                                            flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors
                                            ${isActivePath(item.path) ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}
                                            ${isExpanded ? 'ml-3' : ''}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: item.icon }}
                                    />

                                    {isExpanded && (
                                        <span className="text-sm font-medium whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    )}

                                    {!isExpanded && (
                                        <div className="
                                            absolute left-full top-1/2 transform -translate-y-1/2 ml-3
                                            bg-white text-gray-700 text-xs px-2.5 py-1.5 rounded-lg shadow-lg border border-gray-200
                                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                            transition-all duration-200 whitespace-nowrap z-50
                                            before:content-[''] before:absolute before:right-full before:top-1/2 
                                            before:-translate-y-1/2 before:border-4 before:border-transparent 
                                            before:border-r-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:before:border-r-gray-800
                                        ">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Logout */}
                <div className="px-3 pb-4 ">
                    <div className={`
                        border-t border-gray-200/80 pt-3 dark:border-gray-800/40
                        
                   `}>
                        <Link
                            to={'/'}
                            onClick={async () => {
                                const res = await AuthAPI.logout(localStorage.getItem('access_token') ?? '');
                                
                                if(!res.success) {
                                    // toast.error('خطا در خروج');
                                    console.log(res.message);
                                    
                                }

                                localStorage.removeItem('access_token');
                            }}
                        >
                            {isExpanded ? (
                                <div className="flex items-center gap-3 p-3 text-xs text-red-600 dark:text-gray-400 ms-2">
                                    <LogOutIcon />
                                    خروج
                                </div>
                            ) : (
                                <div className="flex items-center justify-center text-red-600">
                                    <LogOutIcon />
                                </div>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SidebarNav;