import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateAgremiadoSchema, SearchAgremiadoSchema } from '@/lib/validations';
import {
    handleApiError,
    successResponse,
    paginatedResponse,
} from '@/lib/api-utils';

/**
 * GET /api/agremiados
 * List all agremiados with optional pagination
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { page, limit } = SearchAgremiadoSchema.parse({
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        const skip = (page - 1) * limit;

        const [agremiados, total] = await Promise.all([
            prisma.agremiado.findMany({
                skip,
                take: limit,
                orderBy: {
                    fechaRegistro: 'desc',
                },
            }),
            prisma.agremiado.count(),
        ]);

        return paginatedResponse(agremiados, total, page, limit);
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

        const agremiado = await prisma.agremiado.create({
            data: validatedData,
        });

        return successResponse(agremiado, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
