import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
}

const Logo: React.FC<LogoProps> = ({
    className = '',
    size = 'md',
    showIcon = true
}) => {
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl'
    };

    const iconSizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <Link
            to="/"
            className={`flex items-center justify-center gap-2 hover:opacity-80 transition-opacity ${className}`}
        >
            <span className={`font-bold dark:text-white text-gray-900 ${sizeClasses[size]} whitespace-nowrap`}>
                Afghan Market
            </span>
            {showIcon && (
                <div className={`${iconSizeClasses[size]} text-orange-500 flex-shrink-0`}>
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </div>
            )}
        </Link>
    );
};

export default Logo;