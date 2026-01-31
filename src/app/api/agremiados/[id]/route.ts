import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateAgremiadoSchema } from '@/lib/validations';
import {
    handleApiError,
    successResponse,
    ApiError,
} from '@/lib/api-utils';

/**
 * GET /api/agremiados/[id]
 * Get a single agremiado by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const agremiadoId = parseInt(id, 10);

        if (isNaN(agremiadoId)) {
            throw new ApiError(400, 'ID inválido');
        }

        const agremiado = await prisma.agremiado.findUnique({
            where: { id: agremiadoId },
        });

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
 * Update an existing agremiado
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const agremiadoId = parseInt(id, 10);

        if (isNaN(agremiadoId)) {
            throw new ApiError(400, 'ID inválido');
        }

        const body = await request.json();
        const validatedData = UpdateAgremiadoSchema.parse(body);

        const agremiado = await prisma.agremiado.update({
            where: { id: agremiadoId },
            data: validatedData,
        });

        return successResponse(agremiado);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/agremiados/[id]
 * Delete an agremiado
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const agremiadoId = parseInt(id, 10);

        if (isNaN(agremiadoId)) {
            throw new ApiError(400, 'ID inválido');
        }

        await prisma.agremiado.delete({
            where: { id: agremiadoId },
        });

        return new Response(null, { status: 204 });
    } catch (error) {
        return handleApiError(error);
    }
}
