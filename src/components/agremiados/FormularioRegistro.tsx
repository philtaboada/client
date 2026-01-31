'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAgremiadoSchema, type CreateAgremiadoInput, type CreateAgremiadoFormInput } from '@/lib/validations';
import { useCreateAgremiado, useUpdateAgremiado } from '@/hooks/useAgremiados';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
    COLEGIO_OPTIONS,
    ESTADO_OPTIONS,
    HABILITADO_OPTIONS,
    type Agremiado,
} from '@/types/agremiado';

/**
 * FormularioRegistro - Form for creating/editing agremiados
 * Uses React Hook Form with Zod validation
 * Styled with institutional colors
 */

interface FormularioRegistroProps {
    agremiado?: Agremiado;
    onSuccess?: () => void;
}

function SaveIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
        </svg>
    );
}

function ClearIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
}

export function FormularioRegistro({
    agremiado,
    onSuccess,
}: FormularioRegistroProps) {
    const { showToast } = useToast();
    const createMutation = useCreateAgremiado();
    const updateMutation = useUpdateAgremiado();

    const isEditing = !!agremiado;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateAgremiadoFormInput>({
        resolver: zodResolver(CreateAgremiadoSchema),
        defaultValues: agremiado
            ? {
                cop: agremiado.cop,
                nombres: agremiado.nombres,
                apellidos: agremiado.apellidos,
                colegio: agremiado.colegio,
                estado: agremiado.estado,
                habilitado: agremiado.habilitado,
            }
            : {
                estado: 'ACTIVO',
                habilitado: 'ACTIVO',
            },
    });

    const onSubmit = async (data: CreateAgremiadoFormInput) => {
        // After Zod validation, defaults are applied, so we can safely cast
        const validatedData = data as CreateAgremiadoInput;
        try {
            if (isEditing) {
                await updateMutation.mutateAsync({
                    id: agremiado.id,
                    data: validatedData,
                });
                showToast('Agremiado actualizado exitosamente', 'success');
            } else {
                await createMutation.mutateAsync(validatedData);
                showToast('Agremiado registrado exitosamente', 'success');
                reset();
            }
            onSuccess?.();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al guardar';
            showToast(message, 'error');
        }
    };

    const handleClear = () => {
        reset({
            cop: '',
            nombres: '',
            apellidos: '',
            colegio: undefined,
            estado: 'ACTIVO',
            habilitado: 'ACTIVO',
        });
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#6a0032]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input
                        label="Número COP"
                        placeholder="Ej: 001234"
                        error={errors.cop?.message}
                        {...register('cop')}
                        required
                        disabled={isEditing}
                    />

                    <Input
                        label="Nombres"
                        placeholder="Ej: JUAN CARLOS"
                        error={errors.nombres?.message}
                        {...register('nombres')}
                        required
                    />

                    <Input
                        label="Apellidos"
                        placeholder="Ej: PÉREZ GONZÁLEZ"
                        error={errors.apellidos?.message}
                        {...register('apellidos')}
                        required
                    />

                    <Select
                        label="Colegio Regional"
                        options={[
                            { value: '', label: 'Seleccionar colegio...' },
                            ...COLEGIO_OPTIONS,
                        ]}
                        error={errors.colegio?.message}
                        {...register('colegio')}
                        required
                    />

                    <Select
                        label="Estado"
                        options={ESTADO_OPTIONS}
                        error={errors.estado?.message}
                        {...register('estado')}
                        required
                    />

                    <Select
                        label="Habilitado"
                        options={HABILITADO_OPTIONS}
                        error={errors.habilitado?.message}
                        {...register('habilitado')}
                        required
                    />
                </div>

                <div className="flex gap-3 flex-wrap pt-2">
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        <SaveIcon className="w-4 h-4" />
                        {isEditing ? 'Actualizar Agremiado' : 'Guardar Agremiado'}
                    </Button>

                    {!isEditing && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClear}
                            disabled={isLoading}
                        >
                            <ClearIcon className="w-4 h-4" />
                            Limpiar Formulario
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
