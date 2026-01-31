'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatEnumValue } from '@/lib/utils';
import type { Agremiado } from '@/types/agremiado';

/**
 * ModalDetalles - Modal for displaying agremiado details
 * Styled with institutional colors: Burgundy (#6a0032) & Gold (#d4af37)
 */

interface ModalDetallesProps {
    agremiado: Agremiado | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (agremiado: Agremiado) => void;
    onDelete?: (agremiado: Agremiado) => void;
}

function EditIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    );
}

function TrashIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

export function ModalDetalles({
    agremiado,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}: ModalDetallesProps) {
    if (!agremiado) return null;

    const handleEdit = () => {
        onEdit?.(agremiado);
        onClose();
    };

    const handleDelete = () => {
        onDelete?.(agremiado);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles de Estudios">
            <div className="space-y-6">
                {/* Avatar and basic info */}
                <div className="text-center">
                    <Avatar cop={agremiado.cop} size="lg" />
                    <h3 className="text-2xl font-bold text-[#6a0032] mt-4 mb-1">
                        {agremiado.nombres} {agremiado.apellidos}
                    </h3>
                    <p className="text-gray-600 font-medium">COP: {agremiado.cop}</p>
                </div>

                {/* Detailed information */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                    <h4 className="text-base font-semibold text-[#6a0032] mb-4 uppercase tracking-wide">
                        Información del Agremiado
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Colegio Regional</span>
                            <p className="text-gray-900 font-medium">
                                {formatEnumValue(agremiado.colegio)}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Estado</span>
                            <div>
                                <StatusBadge status={agremiado.estado} type="estado" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Habilitado</span>
                            <div>
                                <StatusBadge status={agremiado.habilitado} type="habilitado" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Fecha de Registro</span>
                            <p className="text-gray-900 font-medium">
                                {formatDate(agremiado.fechaRegistro)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-center pt-2">
                    {onEdit && (
                        <Button variant="accent" onClick={handleEdit}>
                            <EditIcon className="w-4 h-4" />
                            Editar
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="danger" onClick={handleDelete}>
                            <TrashIcon className="w-4 h-4" />
                            Eliminar
                        </Button>
                    )}
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
