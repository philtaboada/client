/**
 * Type definitions for Agremiado entity
 */

export type Colegio = 'I_LIMA' | 'II_AREQUIPA' | 'III_LIMA_CALLAO' | 'IV_TRUJILLO' | 'V_PIURA' | 'VI_CUSCO';
export type Estado = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'RETIRADO';
export type Habilitado = 'ACTIVO' | 'INACTIVO';

export interface Agremiado {
    id: number | string;
    cop: string;
    nombres: string;
    apellidos: string;
    colegio: Colegio | string; // string for CSV data (e.g. "I-PIURA", "III-LIMA CALLAO")
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
 * Colegio options for select inputs (regionales del COP según data.csv)
 */
export const COLEGIO_OPTIONS = [
    'I-PIURA', 'II-LA LIBERTAD', 'III-LIMA CALLAO', 'IV-AREQUIPA', 'V-ICA',
    'VI-JUNIN', 'VII-AYACUCHO', 'VIII-PUNO', 'X-CUSCO', 'XI-LAMBAYEQUE',
    'XII-TACNA', 'XIII-SAN MARTIN', 'XIV-CAJAMARCA', 'XV-ANCASH CHIMBOTE',
    'XVII-HUANUCO', 'XIX-UCAYALI', 'XX-MOQUEGUA', 'XXI-AMAZONAS',
    'XXIV-MADRE DE DIOS', 'XXV-PASCO',
].map((v) => ({ value: v, label: v }));

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
