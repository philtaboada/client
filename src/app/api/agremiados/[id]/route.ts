import { NextRequest } from 'next/server';
// import { query } from '@/lib/db';
import { UpdateAgremiadoSchema } from '@/lib/validations';
import {
    handleApiError,
    successResponse,
    ApiError,
} from '@/lib/api-utils';
import { Agremiado } from '@/types/agremiado';
// Import test data for demo
import testData from '../../../../../test-data.json';

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

        // --- MOCKED FOR DEMO ---
        const agremiado = (testData as any[]).find(a => a.id === agremiadoId);

        if (!agremiado) {
            throw new ApiError(404, 'Agremiado no encontrado');
        }

        // Convert dates
        const formattedAgremiado: Agremiado = {
            ...agremiado,
            fechaRegistro: new Date(agremiado.fechaRegistro),
            fechaActualizacion: new Date(agremiado.fechaActualizacion)
        } as Agremiado;

        return successResponse(formattedAgremiado);

        /* --- ORIGINAL DATABASE LOGIC ---
        const result = await query<Agremiado>(
            'SELECT * FROM agremiados WHERE id = $1',
            [agremiadoId]
        );

        if (result.rowCount === 0) {
            throw new ApiError(404, 'Agremiado no encontrado');
        }

        return successResponse(result.rows[0]);
        */
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

        // --- MOCKED FOR DEMO ---
        const agremiado = (testData as any[]).find(a => a.id === agremiadoId);
        if (!agremiado) {
            throw new ApiError(404, 'Agremiado no encontrado');
        }

        return successResponse({
            ...agremiado,
            ...validatedData,
            fechaActualizacion: new Date()
        });

        /* --- ORIGINAL DATABASE LOGIC ---
        const updates = Object.keys(validatedData);
        if (updates.length === 0) {
            throw new ApiError(400, 'No hay campos para actualizar');
        }

        const setClause = updates.map((key, i) => `"${key}" = $${i + 1}`).join(', ');
        const values = [...Object.values(validatedData), agremiadoId];

        const sql = `
            UPDATE agremiados 
            SET ${setClause}, "fechaActualizacion" = NOW()
            WHERE id = $${values.length}
            RETURNING *
        `;

        const result = await query<Agremiado>(sql, values);

        if (result.rowCount === 0) {
            throw new ApiError(404, 'Agremiado no encontrado');
        }

        return successResponse(result.rows[0]);
        */
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

        // --- MOCKED FOR DEMO ---
        const exists = (testData as any[]).some(a => a.id === agremiadoId);
        if (!exists) {
            throw new ApiError(404, 'Agremiado no encontrado');
        }

        return new Response(null, { status: 204 });

        /* --- ORIGINAL DATABASE LOGIC ---
        const result = await query('DELETE FROM agremiados WHERE id = $1', [agremiadoId]);

        if (result.rowCount === 0) {
            throw new ApiError(404, 'Agremiado no encontrado');
        }

        return new Response(null, { status: 204 });
        */
    } catch (error) {
        return handleApiError(error);
    }
}
