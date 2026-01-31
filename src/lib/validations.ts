import { z } from 'zod';

/**
 * Validation schemas for Agremiado entity
 * Shared between client and server for consistent validation
 */

// Enum schemas matching Prisma enums
export const ColegioEnum = z.enum([
    'I_LIMA',
    'II_AREQUIPA',
    'III_LIMA_CALLAO',
    'IV_TRUJILLO',
    'V_PIURA',
    'VI_CUSCO',
]);

export const EstadoEnum = z.enum(['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'RETIRADO']);

export const HabilitadoEnum = z.enum(['ACTIVO', 'INACTIVO']);

/**
 * Schema for creating a new Agremiado
 * Includes transformations for data normalization
 */
export const CreateAgremiadoSchema = z.object({
    cop: z
        .string()
        .min(1, 'El número COP es requerido')
        .regex(/^\d+$/, 'El COP debe contener solo números')
        .trim(),
    nombres: z
        .string()
        .min(2, 'Los nombres deben tener al menos 2 caracteres')
        .max(100, 'Los nombres no pueden exceder 100 caracteres')
        .trim()
        .transform((val) => val.toUpperCase()),
    apellidos: z
        .string()
        .min(1, 'Los apellidos son requeridos')
        .max(100, 'Los apellidos no pueden exceder 100 caracteres')
        .trim()
        .transform((val) => val.toUpperCase()),
    colegio: ColegioEnum,
    estado: EstadoEnum.default('ACTIVO'),
    habilitado: HabilitadoEnum.default('ACTIVO'),
});

/**
 * Schema for updating an existing Agremiado
 * All fields are optional for partial updates
 */
export const UpdateAgremiadoSchema = CreateAgremiadoSchema.partial();

/**
 * Schema for search query parameters
 */
export const SearchAgremiadoSchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(1000).default(50),
});

// Type exports for TypeScript
// z.infer returns the output type (after transforms and defaults are applied)
// z.input returns the input type (before transforms, with optional defaults)
export type CreateAgremiadoInput = z.infer<typeof CreateAgremiadoSchema>;
export type CreateAgremiadoFormInput = z.input<typeof CreateAgremiadoSchema>;
export type UpdateAgremiadoInput = z.infer<typeof UpdateAgremiadoSchema>;
export type SearchAgremiadoInput = z.infer<typeof SearchAgremiadoSchema>;
export type ColegioType = z.infer<typeof ColegioEnum>;
export type EstadoType = z.infer<typeof EstadoEnum>;
export type HabilitadoType = z.infer<typeof HabilitadoEnum>;
