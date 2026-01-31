/**
 * Type definitions for Agremiado entity
 */

export type Colegio = 'I_LIMA' | 'II_AREQUIPA' | 'III_LIMA_CALLAO' | 'IV_TRUJILLO' | 'V_PIURA' | 'VI_CUSCO';
export type Estado = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'RETIRADO';
export type Habilitado = 'ACTIVO' | 'INACTIVO';

export interface Agremiado {
    id: number;
    cop: string;
    nombres: string;
    apellidos: string;
    colegio: Colegio;
    estado: Estado;
    habilitado: Habilitado;
    fechaRegistro: Date;
    fechaActualizacion: Date;
}

/**
 * Agremiado without auto-generated fields (for creation)
 */
export type AgremiadoCreateInput = Omit<
    Agremiado,
    'id' | 'fechaRegistro' | 'fechaActualizacion'
>;

/**
 * Agremiado with all fields optional (for updates)
 */
export type AgremiadoUpdateInput = Partial<AgremiadoCreateInput>;

/**
 * Agremiado for display purposes
 */
export type AgremiadoDisplay = Agremiado & {
    nombreCompleto?: string;
};

/**
 * API Response types for consistent error handling
 */
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Search parameters
 */
export interface SearchParams {
    q?: string;
    page?: number;
    limit?: number;
}

/**
 * Colegio display mapping
 */
export const COLEGIO_DISPLAY: Record<Colegio, string> = {
    I_LIMA: 'I LIMA',
    II_AREQUIPA: 'II AREQUIPA',
    III_LIMA_CALLAO: 'III LIMA-CALLAO',
    IV_TRUJILLO: 'IV TRUJILLO',
    V_PIURA: 'V PIURA',
    VI_CUSCO: 'VI CUSCO',
};

/**
 * Colegio options for select inputs
 */
export const COLEGIO_OPTIONS = Object.entries(COLEGIO_DISPLAY).map(
    ([value, label]) => ({
        value: value as Colegio,
        label,
    })
);

/**
 * Estado options
 */
export const ESTADO_OPTIONS: { value: Estado; label: string }[] = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
    { value: 'SUSPENDIDO', label: 'Suspendido' },
    { value: 'RETIRADO', label: 'Retirado' },
];

/**
 * Habilitado options
 */
export const HABILITADO_OPTIONS: { value: Habilitado; label: string }[] = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
];
