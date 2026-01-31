import { cn } from '@/lib/utils';
import { Estado, Habilitado } from '@/types/agremiado';

/**
 * StatusBadge component - styled like Colegio de Obstetras
 * ACTIVO: Green pill | INACTIVO: Gold/Yellow pill
 */

interface StatusBadgeProps {
    status: Estado | Habilitado;
    type?: 'estado' | 'habilitado';
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const baseStyles = `
        inline-flex items-center justify-center 
        px-4 py-1.5 rounded-full 
        text-xs font-bold uppercase tracking-wide
        min-w-[80px]
    `;

    const variants: Record<string, string> = {
        ACTIVO: 'bg-emerald-600 text-white',
        INACTIVO: 'bg-[#d4af37] text-[#1a1a1a]',
        SUSPENDIDO: 'bg-amber-500 text-white',
        RETIRADO: 'bg-gray-400 text-white',
    };

    return (
        <span className={cn(baseStyles, variants[status] || variants.INACTIVO)}>
            {status}
        </span>
    );
}
