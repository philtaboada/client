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
    isAdmin?: boolean;
    onEdit?: (agremiado: Agremiado) => void;
    onDelete?: (agremiado: Agremiado) => void;
}

export function ModalDetalles({
    agremiado,
    isOpen,
    onClose,
    isAdmin,
    onEdit,
    onDelete,
}: ModalDetallesProps) {
    if (!agremiado) return null;

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
                <div className="flex justify-center gap-2 pt-2 flex-wrap">
                    {isAdmin && onEdit && (
                        <Button variant="accent" onClick={() => { onEdit(agremiado); onClose(); }}>
                            Editar
                        </Button>
                    )}
                    {isAdmin && onDelete && (
                        <Button variant="danger" onClick={() => { onDelete(agremiado); onClose(); }}>
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
