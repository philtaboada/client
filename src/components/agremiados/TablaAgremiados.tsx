'use client';

import * as React from 'react';
import { useDeleteAgremiado } from '@/hooks/useAgremiados';
import { useToast } from '@/components/ui/Toast';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';
import { formatEnumValue } from '@/lib/utils';
import type { Agremiado } from '@/types/agremiado';

/**
 * TablaAgremiados - Table styled like Colegio de Obstetras
 * Header: Burgundy (#6a0032) | Accents: Gold (#d4af37)
 */

interface TablaAgremiadosProps {
    agremiados: Agremiado[];
    onEdit?: (agremiado: Agremiado) => void;
    onView?: (agremiado: Agremiado) => void;
}

function EmptyIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

export function TablaAgremiados({
    agremiados,
    onEdit,
    onView,
}: TablaAgremiadosProps) {
    const { showToast } = useToast();
    const deleteMutation = useDeleteAgremiado();

    const handleDelete = async (agremiado: Agremiado) => {
        const confirmed = window.confirm(
            `¿Está seguro de eliminar a ${agremiado.nombres} ${agremiado.apellidos}? Esta acción no se puede deshacer.`
        );

        if (!confirmed) return;

        try {
            await deleteMutation.mutateAsync(agremiado.id);
            showToast('Agremiado eliminado exitosamente', 'success');
        } catch (error: any) {
            showToast(error.message || 'Error al eliminar', 'error');
        }
    };

    if (agremiados.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <EmptyIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron resultados
                </h3>
                <p className="text-sm text-gray-500">
                    Ingresa un término y presiona &quot;Buscar&quot;
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="bg-[#6a0032]">
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Foto
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            COP
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Nombre Completo
                        </th>
                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Colegio Regional
                        </th>
                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase tracking-wider">
                            Estado
                        </th>
                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase tracking-wider">
                            Habilitado
                        </th>
                        <th className="px-4 py-3.5 text-center text-xs font-semibold text-white uppercase tracking-wider">
                            Más
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {agremiados.map((agremiado, index) => (
                        <tr
                            key={agremiado.id}
                            className={`
                                transition-colors duration-150
                                hover:bg-[#6a0032]/5
                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                            `}
                        >
                            <td className="px-4 py-3">
                                <Avatar cop={agremiado.cop} size="sm" />
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-semibold text-gray-900">
                                    {agremiado.cop}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                                {agremiado.nombres} {agremiado.apellidos}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {formatEnumValue(agremiado.colegio)}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <StatusBadge status={agremiado.estado} type="estado" />
                            </td>
                            <td className="px-4 py-3 text-center">
                                <StatusBadge status={agremiado.habilitado} type="habilitado" />
                            </td>
                            <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    {onView && (
                                        <button
                                            onClick={() => onView(agremiado)}
                                            className="px-4 py-2 bg-[#d4af37] text-[#1a1a1a] rounded-full text-sm font-semibold
                                                     hover:bg-[#b8962e] hover:shadow-md
                                                     transition-all duration-200"
                                            title="Ver detalles"
                                        >
                                            Ver más
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(agremiado)}
                                            className="p-2 rounded-full text-amber-600 hover:bg-amber-50 
                                                     transition-colors duration-150"
                                            title="Editar"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(agremiado)}
                                        disabled={deleteMutation.isPending}
                                        className="p-2 rounded-full text-red-600 hover:bg-red-50 
                                                 transition-colors duration-150
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Eliminar"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
