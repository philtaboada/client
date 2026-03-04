import { NextRequest } from 'next/server';
import { SearchAgremiadoSchema } from '@/lib/validations';
import { handleApiError, paginatedResponse } from '@/lib/api-utils';
import { fetchAgremiadosFromSupabase } from '@/lib/supabase-service';

/**
 * GET /api/agremiados/search
 * Buscar agremiados por término
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { q, page, limit } = SearchAgremiadoSchema.parse({
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
