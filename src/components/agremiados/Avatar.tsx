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
        sm: 'w-10 h-10 text-base',
        md: 'w-16 h-16 text-xl',
        lg: 'w-24 h-24 text-3xl',
    };

    const initials = getInitialsFromCOP(cop);

    return (
        <div
            className={`
        ${sizes[size]}
        rounded-full
        bg-gradient-to-br from-purple-500 to-indigo-600
        flex items-center justify-center
        text-white font-bold
        shadow-md
        mx-auto
      `}
        >
            {initials}
        </div>
    );
}
