/**
 * Script para importar data.csv a Supabase
 * Ejecutar: npx ts-node --esm scripts/import-csv-to-supabase.ts
 * O: npm run import:csv
 *
 * Requiere: .env con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env') });

const BATCH_SIZE = 100;

function parseCsvLine(line: string): string[] {
    return line.split(',').map((cell) => cell.trim());
}

function mapRowToAgremiado(row: string[]): {
    cop: string;
    nombres: string;
    apellidos: string;
    colegio: string;
    estado: string;
    habilitado: string;
} {
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

    return {
        cop,
        nombres,
        apellidos,
        colegio: colegioRegional,
        estado: 'ACTIVO',
        habilitado: 'ACTIVO',
    };
}

async function main(): Promise<void> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        console.error('Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
        process.exit(1);
    }

    const csvPath = join(process.cwd(), 'data.csv');
    const content = readFileSync(csvPath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const headerIndex = lines.findIndex(
        (line) => line.includes('APELLIDO PATERNO') && line.includes('COP')
    );
    const dataLines = lines.slice(headerIndex >= 0 ? headerIndex + 1 : 0);

    const records: Array<{
        cop: string;
        nombres: string;
        apellidos: string;
        colegio: string;
        estado: string;
        habilitado: string;
    }> = [];

    for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        const cols = parseCsvLine(line);
        if (cols.length < 7) continue;
        const cop = cols[5]?.trim();
        if (!cop || !/^\d+$/.test(cop)) continue;
        records.push(mapRowToAgremiado(cols));
    }

    console.log(`Importando ${records.length} registros a Supabase...`);

    const supabase = createClient(url, serviceKey);
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        const { data, error } = await supabase.from('agremiados').upsert(batch, {
            onConflict: 'cop',
            ignoreDuplicates: false,
        });

        if (error) {
            console.error(`Error en lote ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
            errors += batch.length;
        } else {
            imported += batch.length;
            console.log(`  Procesados: ${Math.min(i + BATCH_SIZE, records.length)}/${records.length}`);
        }
    }

    console.log(`\nImportación completada: ${imported} registros. Errores: ${errors}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
