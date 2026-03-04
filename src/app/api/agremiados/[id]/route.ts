import { NextRequest } from 'next/server';
import { UpdateAgremiadoSchema } from '@/lib/validations';
import {
    handleApiError,
    successResponse,
    ApiError,
} from '@/lib/api-utils';
import { verifyAdminSession } from '@/lib/auth-utils';
import {
    fetchAgremiadoById,
    updateAgremiadoInSupabase,
    deleteAgremiadoFromSupabase,
} from '@/lib/supabase-service';

/**
 * GET /api/agremiados/[id]
 * Obtener un agremiado por ID (UUID)
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const agremiado = await fetchAgremiadoById(id);

        if (!agremiado) {
            throw new ApiError(404, 'Agremiado no encontrado');
        }

        return successResponse(agremiado);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * PUT /api/agremiados/[id]
 * Actualizar agremiado (solo admin)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await verifyAdminSession();
        if (!isAdmin) {
            throw new ApiError(403, 'No autorizado');
        }

        const { id } = await params;
        const body = await request.json();
        const validatedData = UpdateAgremiadoSchema.parse(body);

        const updateData: Record<string, string> = {};
        if (validatedData.cop !== undefined) updateData.cop = validatedData.cop;
        if (validatedData.nombres !== undefined) updateData.nombres = validatedData.nombres;
        if (validatedData.apellidos !== undefined) updateData.apellidos = validatedData.apellidos;
        if (validatedData.colegio !== undefined) updateData.colegio = String(validatedData.colegio);
        if (validatedData.estado !== undefined) updateData.estado = validatedData.estado;
        if (validatedData.habilitado !== undefined) updateData.habilitado = validatedData.habilitado;

        if (Object.keys(updateData).length === 0) {
            throw new ApiError(400, 'No hay campos para actualizar');
        }

        const agremiado = await updateAgremiadoInSupabase(id, updateData);
        return successResponse(agremiado);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/agremiados/[id]
 * Eliminar agremiado (solo admin)
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await verifyAdminSession();
        if (!isAdmin) {
            throw new ApiError(403, 'No autorizado');
        }

        const { id } = await params;

        await deleteAgremiadoFromSupabase(id);
        return new Response(null, { status: 204 });
    } catch (error) {
        return handleApiError(error);
    }
}
