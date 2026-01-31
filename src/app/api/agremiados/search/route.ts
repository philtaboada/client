import { NextRequest } from 'next/server';
// import { query } from '@/lib/db';
import { SearchAgremiadoSchema } from '@/lib/validations';
import { handleApiError, paginatedResponse } from '@/lib/api-utils';
import { Agremiado } from '@/types/agremiado';
// Import test data for demo
import testData from '../../../../../test-data.json';

/**
 * GET /api/agremiados/search
 * Search agremiados by term (COP, nombres, apellidos, colegio)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { q, page, limit } = SearchAgremiadoSchema.parse({
            q: searchParams.get('q') || undefined,
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
        });

        // --- MOCKED FOR DEMO ---
        let filteredData = (testData as any[]).map(a => ({
            ...a,
            fechaRegistro: new Date(a.fechaRegistro),
            fechaActualizacion: new Date(a.fechaActualizacion)
        })) as Agremiado[];

        if (q) {
            const query = q.toLowerCase();
            filteredData = filteredData.filter(a =>
                a.cop.includes(query) ||
                a.nombres.toLowerCase().includes(query) ||
                a.apellidos.toLowerCase().includes(query)
            );
        }

        const total = filteredData.length;
        const offset = (page - 1) * limit;
        const paginatedData = filteredData.slice(offset, offset + limit);

        return paginatedResponse(paginatedData, total, page, limit);

        /* --- ORIGINAL DATABASE LOGIC ---
        const offset = (page - 1) * limit;

        let sql = 'SELECT * FROM agremiados';
        ...
        return paginatedResponse(results.rows, total, page, limit);
        */
    } catch (error) {
        return handleApiError(error);
    }
}
