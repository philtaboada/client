import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Button component with institutional color variants
 * Primary: Burgundy (#6a0032) | Accent: Gold (#d4af37)
 */

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'accent' | 'success' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
            inline-flex items-center justify-center gap-2 
            font-semibold rounded-full
            transition-all duration-200 ease-out
            disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        `;

        const variants = {
            primary: `
                bg-[#6a0032] text-white
                hover:bg-[#4a0022] hover:shadow-lg
                active:bg-[#3a0018]
                focus-visible:ring-[#6a0032]
            `,
            accent: `
                bg-[#d4af37] text-[#1a1a1a]
                hover:bg-[#b8962e] hover:shadow-lg
                active:bg-[#a08528]
                focus-visible:ring-[#d4af37]
            `,
            success: `
                bg-emerald-600 text-white
                hover:bg-emerald-700 hover:shadow-lg
                active:bg-emerald-800
                focus-visible:ring-emerald-600
            `,
            danger: `
                bg-red-600 text-white
                hover:bg-red-700 hover:shadow-lg
                active:bg-red-800
                focus-visible:ring-red-600
            `,
            outline: `
                bg-transparent text-[#6a0032]
                border-2 border-[#6a0032]
                hover:bg-[#6a0032] hover:text-white
                active:bg-[#4a0022]
                focus-visible:ring-[#6a0032]
            `,
            ghost: `
                bg-transparent text-gray-600
                hover:bg-gray-100 hover:text-gray-900
                active:bg-gray-200
                focus-visible:ring-gray-400
            `,
        };

        const sizes = {
            sm: 'px-4 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-6 py-3 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
