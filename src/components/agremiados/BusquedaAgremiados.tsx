'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { TablaAgremiados } from './TablaAgremiados';
import { useSearchAgremiados } from '@/hooks/useAgremiados';
import { debounce } from '@/lib/utils';
import type { Agremiado } from '@/types/agremiado';

/**
 * BusquedaAgremiados - Search component with institutional styling
 * Colors: Burgundy (#6a0032) & Gold (#d4af37)
 */

interface BusquedaAgremiadosProps {
    onEdit?: (agremiado: Agremiado) => void;
    onView?: (agremiado: Agremiado) => void;
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function InfoIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
    );
}

export function BusquedaAgremiados({
    onEdit,
    onView,
}: BusquedaAgremiadosProps) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [debouncedTerm, setDebouncedTerm] = React.useState('');

    const { data, isLoading, error } = useSearchAgremiados(debouncedTerm);

    const debouncedSearch = React.useMemo(
        () =>
            debounce((value: string) => {
                setDebouncedTerm(value);
            }, 500),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setSearchTerm('');
        setDebouncedTerm('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDebouncedTerm(searchTerm);
    };

    const resultCount = data?.total || 0;
    const agremiados = data?.data || [];

    return (
        <div className="space-y-6">
            {/* Search Input */}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Ingrese COP o nombre..."
                        className="flex-1 px-5 py-4 rounded-lg text-base border-none bg-white text-gray-900
                                 placeholder:text-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-[#d4af37]
                                 shadow-sm"
                    />
                    <div className="flex gap-2">
                        <Button type="submit" variant="accent" size="lg">
                            <SearchIcon className="w-5 h-5" />
                            Buscar
                        </Button>
                        <Button type="button" variant="outline" size="lg" onClick={handleClear} className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#6a0032]">
                            Limpiar
                        </Button>
                    </div>
                </div>
            </form>

            {/* Results Count */}
            <div className="flex items-center justify-between flex-wrap gap-3 text-white/90">
                <div className="flex items-center gap-2">
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span className="text-sm">Buscando...</span>
                        </>
                    ) : (
                        <span className="text-sm font-medium">
                            <span className="text-[#d4af37] font-bold">{resultCount}</span>
                            {' '}resultado{resultCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <InfoIcon className="w-4 h-4" />
                    Los resultados se limitan a 50 registros para un mejor rendimiento.
                </div>
            </div>

            {/* Results Table - Outside the burgundy card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden -mx-6 md:-mx-8 mt-8">
                <div className="px-6 md:px-8 py-4">
                    {error ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Error al buscar</h3>
                            <p className="text-sm text-gray-500">{error.message}</p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-10 h-10 border-4 border-[#6a0032]/20 border-t-[#6a0032] rounded-full animate-spin" />
                            <p className="mt-4 text-gray-500">Cargando resultados...</p>
                        </div>
                    ) : (
                        <TablaAgremiados
                            agremiados={agremiados}
                            onEdit={onEdit}
                            onView={onView}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
