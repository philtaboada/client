import { NextRequest } from 'next/server';
// import { query } from '@/lib/db';
import { CreateAgremiadoSchema, SearchAgremiadoSchema } from '@/lib/validations';
import {
    handleApiError,
    successResponse,
    paginatedResponse,
} from '@/lib/api-utils';
import { Agremiado } from '@/types/agremiado';
// Import test data for demo
import testData from '../../../../test-data.json';

/**
 * GET /api/agremiados
 * List all agremiados with optional pagination
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { page, limit, q } = SearchAgremiadoSchema.parse({
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

        /* --- ORIGINAL DATABASE LOGIC (Keep for later) ---
        const offset = (page - 1) * limit;

        const [agremiadosResult, countResult] = await Promise.all([
            query<Agremiado>(
                'SELECT * FROM agremiados ORDER BY "fechaRegistro" DESC LIMIT $1 OFFSET $2',
                [limit, offset]
            ),
            query('SELECT COUNT(*) FROM agremiados'),
        ]);

        const total = parseInt(countResult.rows[0].count, 10);

        return paginatedResponse(agremiadosResult.rows, total, page, limit);
        */
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * POST /api/agremiados
 * Create a new agremiado
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = CreateAgremiadoSchema.parse(body);

        // --- MOCKED FOR DEMO ---
        // Just return the validated data with a fake ID
        const newAgremiado: Agremiado = {
            id: Math.floor(Math.random() * 1000) + 100,
            ...validatedData,
            fechaRegistro: new Date(),
            fechaActualizacion: new Date(),
        } as Agremiado;

        return successResponse(newAgremiado, 201);

        /* --- ORIGINAL DATABASE LOGIC (Keep for later) ---
        const columns = Object.keys(validatedData).map(key => `"${key}"`).join(', ');
        const values = Object.values(validatedData);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const sql = `
            INSERT INTO agremiados (${columns})
            VALUES (${placeholders})
            RETURNING *
        `;

        const result = await query<Agremiado>(sql, values);

        return successResponse(result.rows[0], 201);
        */
    } catch (error) {
        return handleApiError(error);
    }
}
