/**
 * Parser para importar Excel/CSV a formato agremiados
 * Columnas esperadas: APELLIDO PATERNO, APELLIDO MATERNO, 1ER NOMBRE, 2DO NOMBRE, 3ER NOMBRE, COP, COLEGIO REGIONAL
 */

import type { AgremiadoImportRow } from './supabase-service';

function parseCsvLine(line: string): string[] {
    return line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));
}

function mapRowToAgremiado(row: string[]): AgremiadoImportRow | null {
    const apellidoPaterno = (row[0] || '').trim();
    const apellidoMaterno = (row[1] || '').trim();
    const primerNombre = (row[2] || '').trim();
    const segundoNombre = (row[3] || '').trim();
    const tercerNombre = (row[4] || '').trim();
    const cop = String(row[5] || '').trim();
    const colegioRegional = (row[6] || '').trim();
    if (!cop || !/^\d+$/.test(cop)) return null;
    const nombres = [primerNombre, segundoNombre, tercerNombre]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();
    const apellidos = [apellidoPaterno, apellidoMaterno]
        .filter(Boolean)
        .join(' ')
        .toUpperCase();
    return {
        cop,
        nombres: nombres || 'SIN NOMBRE',
        apellidos: apellidos || 'SIN APELLIDO',
        colegio: colegioRegional || 'SIN COLEGIO',
        estado: 'ACTIVO',
        habilitado: 'ACTIVO',
    };
}

function findHeaderRowIndex(lines: string[]): number {
    const idx = lines.findIndex(
        (line) =>
            line.includes('APELLIDO PATERNO') && line.includes('COP')
    );
    return idx >= 0 ? idx + 1 : 0;
}

export function parseCsvToAgremiados(csvContent: string): AgremiadoImportRow[] {
    const lines = csvContent.split(/\r?\n/);
    const startIndex = findHeaderRowIndex(lines);
    const records: AgremiadoImportRow[] = [];
    for (let i = startIndex; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length < 7) continue;
        const row = mapRowToAgremiado(cols);
        if (row) records.push(row);
    }
    return records;
}

function getColumnIndex(
    headers: string[],
    ...names: string[]
): number {
    const lower = headers.map((h) => String(h ?? '').toLowerCase());
    for (const name of names) {
        const idx = lower.findIndex((h) => h.includes(name.toLowerCase()));
        if (idx >= 0) return idx;
    }
    return -1;
}

export function parseExcelToAgremiados(
    buffer: Buffer
): AgremiadoImportRow[] {
    const XLSX = require('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
    }) as string[][];
    const headerRowIdx = data.findIndex(
        (row) =>
            Array.isArray(row) &&
            row.some((c) => String(c).includes('APELLIDO PATERNO')) &&
            row.some((c) => String(c).includes('COP'))
    );
    if (headerRowIdx < 0) return [];
    const headers = data[headerRowIdx].map((c) => String(c ?? ''));
    const idxApellidoPaterno = getColumnIndex(headers, 'apellido paterno');
    const idxApellidoMaterno = getColumnIndex(headers, 'apellido materno');
    const idxPrimerNombre = getColumnIndex(headers, '1er nombre', '1er');
    const idxSegundoNombre = getColumnIndex(headers, '2do nombre', '2do');
    const idxTercerNombre = getColumnIndex(headers, '3er nombre', '3er');
    const idxCop = getColumnIndex(headers, 'cop');
    const idxColegio = getColumnIndex(headers, 'colegio regional', 'colegio');
    if (
        idxApellidoPaterno < 0 ||
        idxApellidoMaterno < 0 ||
        idxCop < 0 ||
        idxColegio < 0
    ) {
        return [];
    }
    const records: AgremiadoImportRow[] = [];
    for (let i = headerRowIdx + 1; i < data.length; i++) {
        const row = data[i];
        if (!Array.isArray(row)) continue;
        const arr = [
            String(row[idxApellidoPaterno] ?? ''),
            String(row[idxApellidoMaterno] ?? ''),
            String(row[idxPrimerNombre] ?? ''),
            String(row[idxSegundoNombre] ?? ''),
            String(row[idxTercerNombre] ?? ''),
            String(row[idxCop] ?? ''),
            String(row[idxColegio] ?? ''),
        ];
        const mapped = mapRowToAgremiado(arr);
        if (mapped) records.push(mapped);
    }
    return records;
}
