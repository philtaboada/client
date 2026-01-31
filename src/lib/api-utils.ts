import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * Standardized error handling for API routes
 * Provides consistent error responses across the application
 */

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Handle errors and return appropriate NextResponse
 */
export function handleApiError(error: unknown): NextResponse {
    console.error('API Error:', error);

    // Zod validation errors
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: 'Validation error',
                message: 'Los datos proporcionados no son válidos',
                details: error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            },
            { status: 400 }
        );
    }

    // Custom API errors
    if (error instanceof ApiError) {
        return NextResponse.json(
            {
                error: error.message,
                details: error.details,
            },
            { status: error.statusCode }
        );
    }

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
            return NextResponse.json(
                {
                    error: 'Duplicate entry',
                    message: 'Este número COP ya está registrado',
                    details: error.meta,
                },
                { status: 409 }
            );
        }

        // Record not found
        if (error.code === 'P2025') {
            return NextResponse.json(
                {
                    error: 'Not found',
                    message: 'El agremiado no fue encontrado',
                },
                { status: 404 }
            );
        }
    }

    // Generic server error
    return NextResponse.json(
        {
            error: 'Internal server error',
            message: 'Ocurrió un error en el servidor',
        },
        { status: 500 }
    );
}

/**
 * Success response helper
 */
export function successResponse<T>(
    data: T,
    status: number = 200
): NextResponse {
    return NextResponse.json({ data }, { status });
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): NextResponse {
    return NextResponse.json({
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    });
}
