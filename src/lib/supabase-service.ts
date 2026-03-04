import { getSupabaseAdmin } from '@/lib/supabase';
import type { Agremiado } from '@/types/agremiado';

/**
 * Mapea fila de Supabase (snake_case) a Agremiado (camelCase)
 */
function mapRowToAgremiado(row: {
    id: string;
    cop: string;
    nombres: string;
    apellidos: string;
    colegio: string;
    estado: string;
    habilitado: string;
    fecha_registro: string;
    fecha_actualizacion: string;
}): Agremiado {
    return {
        id: row.id,
        cop: row.cop,
        nombres: row.nombres,
        apellidos: row.apellidos,
        colegio: row.colegio,
        estado: row.estado as Agremiado['estado'],
        habilitado: row.habilitado as Agremiado['habilitado'],
        fechaRegistro: new Date(row.fecha_registro),
        fechaActualizacion: new Date(row.fecha_actualizacion),
    };
}

export async function fetchAgremiadosFromSupabase(params: {
    page: number;
    limit: number;
    q?: string;
}): Promise<{ data: Agremiado[]; total: number }> {
    const supabase = getSupabaseAdmin();
    const { page, limit, q } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('agremiados')
        .select('*', { count: 'exact' });

    if (q && q.trim()) {
        const term = q.trim();
        query = query.or(
            `cop.ilike.%${term}%,nombres.ilike.%${term}%,apellidos.ilike.%${term}%,colegio.ilike.%${term}%`
        );
    }

    const { data: rows, error, count } = await query
        .order('apellidos', { ascending: true })
        .range(from, to);

    if (error) throw error;

    const agremiados = (rows || []).map(mapRowToAgremiado);
    return { data: agremiados, total: count ?? 0 };
}

export async function fetchAgremiadoById(id: string): Promise<Agremiado | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from('agremiados')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return mapRowToAgremiado(data);
}

export async function createAgremiadoInSupabase(input: {
    cop: string;
    nombres: string;
    apellidos: string;
    colegio: string;
    estado: string;
    habilitado: string;
}): Promise<Agremiado> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from('agremiados')
        .insert({
            cop: input.cop,
            nombres: input.nombres,
            apellidos: input.apellidos,
            colegio: input.colegio,
            estado: input.estado,
            habilitado: input.habilitado,
        })
        .select()
        .single();

    if (error) throw error;
    return mapRowToAgremiado(data);
}

export async function updateAgremiadoInSupabase(
    id: string,
    input: Partial<{
        cop: string;
        nombres: string;
        apellidos: string;
        colegio: string;
        estado: string;
        habilitado: string;
    }>
): Promise<Agremiado> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from('agremiados')
        .update(input)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return mapRowToAgremiado(data);
}

export async function deleteAgremiadoFromSupabase(id: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('agremiados').delete().eq('id', id);
    if (error) throw error;
}
