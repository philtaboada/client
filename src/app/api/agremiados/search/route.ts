import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { SearchAgremiadoSchema } from '@/lib/validations';
import { handleApiError, paginatedResponse } from '@/lib/api-utils';
import { Prisma } from '@prisma/client';

/**
 * GET /api/agremiados/search
 * Search agremiados by term (COP, nombres, apellidos, colegio)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const { q, page, limit } = SearchAgremiadoSchema.parse({
            q: searchParams.get('q'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        });

        const skip = (page - 1) * limit;

        // Build search conditions
        const searchConditions: Prisma.AgremiadoWhereInput = q
            ? {
                OR: [
                    { cop: { contains: q, mode: 'insensitive' } },
                    { nombres: { contains: q, mode: 'insensitive' } },
                    { apellidos: { contains: q, mode: 'insensitive' } },
                    { colegio: { equals: q.toUpperCase().replace(/ /g, '_') as any } },
                ],
            }
            : {};

        const [agremiados, total] = await Promise.all([
            prisma.agremiado.findMany({
                where: searchConditions,
                skip,
                take: limit,
                orderBy: {
                    fechaRegistro: 'desc',
                },
            }),
            prisma.agremiado.count({
                where: searchConditions,
            }),
        ]);

        return paginatedResponse(agremiados, total, page, limit);
    } catch (error) {
        return handleApiError(error);
    }
}
