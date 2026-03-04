import { NextRequest } from 'next/server';
import { CreateAgremiadoSchema, SearchAgremiadoSchema } from '@/lib/validations';
import {
    handleApiError,
    successResponse,
    paginatedResponse,
    ApiError,
} from '@/lib/api-utils';
import { verifyAdminSession } from '@/lib/auth-utils';
import {
    fetchAgremiadosFromSupabase,
    createAgremiadoInSupabase,
} from '@/lib/supabase-service';

/**
 * GET /api/agremiados
 * Lista agremiados con paginación (lectura pública)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { page, limit, q } = SearchAgremiadoSchema.parse({
            q: searchParams.get('q') || undefined,
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
        });

        const { data, total } = await fetchAgremiadosFromSupabase({
            page,
            limit,
            q,
        });

        return paginatedResponse(data, total, page, limit);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * POST /api/agremiados
 * Crear agremiado (solo admin)
 */
export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdminSession();
        if (!isAdmin) {
            throw new ApiError(403, 'No autorizado');
        }

        const body = await request.json();
        const validatedData = CreateAgremiadoSchema.parse(body);

        const newAgremiado = await createAgremiadoInSupabase({
            cop: validatedData.cop,
            nombres: validatedData.nombres,
            apellidos: validatedData.apellidos,
            colegio: String(validatedData.colegio),
            estado: validatedData.estado,
            habilitado: validatedData.habilitado,
        });

        return successResponse(newAgremiado, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
