'use client';

import { cn } from '@/lib/utils';

/**
 * Pagination component - Institutional styling (Burgundy & Gold)
 */

interface PaginationProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    className?: string;
}

function ChevronLeftIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
    );
}

function ChevronRightIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    );
}

export function Pagination({
    page,
    totalPages,
    total,
    limit,
    onPageChange,
    className,
}: PaginationProps) {
    const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | 'ellipsis')[] = [];
        if (page <= 4) {
            pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
        } else if (page >= totalPages - 3) {
            pages.push(1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages);
        }
        return pages;
    };

    if (totalPages <= 1) {
        return (
            <div className={cn('flex items-center justify-between py-4', className)}>
                <p className="text-sm text-gray-500">
                    Mostrando {startItem}-{endItem} de {total}
                </p>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 py-4', className)}>
            <p className="text-sm text-gray-500">
                Mostrando <span className="font-medium text-gray-700">{startItem}</span>-
                <span className="font-medium text-gray-700">{endItem}</span> de{' '}
                <span className="font-medium text-gray-700">{total}</span>
            </p>
            <nav className="flex items-center gap-1" aria-label="Paginación">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#6a0032]/5 hover:border-[#6a0032]/30 hover:text-[#6a0032] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    aria-label="Página anterior"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((p, i) =>
                        p === 'ellipsis' ? (
                            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                                …
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={cn(
                                    'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors',
                                    p === page
                                        ? 'bg-[#6a0032] text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-[#6a0032]/5 hover:border-[#6a0032]/30 hover:text-[#6a0032]'
                                )}
                            >
                                {p}
                            </button>
                        )
                    )}
                </div>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-[#6a0032]/5 hover:border-[#6a0032]/30 hover:text-[#6a0032] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    aria-label="Página siguiente"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </nav>
        </div>
    );
}
