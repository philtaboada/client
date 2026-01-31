import { getInitialsFromCOP } from '@/lib/utils';

/**
 * Avatar component displaying COP initials
 */

interface AvatarProps {
    cop: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ cop, size = 'md' }: AvatarProps) {
    const sizes = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
    };

    return (
        <div
            className={`
        ${sizes[size]}
        rounded-full
        bg-[#6a0032]
        flex items-center justify-center
        text-white
        shadow-md
        mx-auto
      `}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-10 h-10' : 'w-16 h-16'}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.5h6v1.5H9z" />
            </svg>
        </div>
    );
}
