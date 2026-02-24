import { readFileSync } from 'fs';
import { join } from 'path';
import type { Agremiado } from '@/types/agremiado';

const CSV_PATH = join(process.cwd(), 'data.csv');

/**
 * Parse a CSV line (simple split - no quoted commas in this dataset)
 */
function parseCsvLine(line: string): string[] {
    return line.split(',').map((cell) => cell.trim());
}

/**
 * Transform CSV row to Agremiado format
 */
function mapRowToAgremiado(row: string[], index: number): Agremiado {
    const apellidoPaterno = (row[0] || '').trim();
    const apellidoMaterno = (row[1] || '').trim();
    const primerNombre = (row[2] || '').trim();
    const segundoNombre = (row[3] || '').trim();
    const tercerNombre = (row[4] || '').trim();
    const cop = String(row[5] || '').trim();
    const colegioRegional = (row[6] || '').trim();

    const nombres = [primerNombre, segundoNombre, tercerNombre]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();
    const apellidos = [apellidoPaterno, apellidoMaterno]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();

    const baseDate = new Date('2024-01-01T08:00:00Z');

    return {
        id: index + 1,
        cop,
        nombres,
        apellidos,
        colegio: colegioRegional,
        estado: 'ACTIVO',
        habilitado: 'ACTIVO',
        fechaRegistro: baseDate,
        fechaActualizacion: baseDate,
    };
}

/**
 * Load and parse agremiados from data.csv
 */
export function loadAgremiadosFromCsv(): Agremiado[] {
    const content = readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split(/\r?\n/);
    const headerIndex = lines.findIndex((line) =>
        line.includes('APELLIDO PATERNO') && line.includes('COP')
    );
    const dataLines = lines.slice(headerIndex >= 0 ? headerIndex + 1 : 0);
    const agremiados: Agremiado[] = [];

    for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        const cols = parseCsvLine(line);

        if (cols.length < 7) continue;

        const cop = cols[5]?.trim();
        if (!cop || !/^\d+$/.test(cop)) continue;

        agremiados.push(mapRowToAgremiado(cols, i));
    }

    return agremiados;
}

let cachedAgremiados: Agremiado[] | null = null;

/**
 * Get agremiados data (cached)
 */
export function getAgremiadosData(): Agremiado[] {
    if (!cachedAgremiados) {
        cachedAgremiados = loadAgremiadosFromCsv();
    }
    return cachedAgremiados;
}
