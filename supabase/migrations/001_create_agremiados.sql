-- Migration: Create agremiados table
-- Mapea la estructura del CSV: APELLIDO PATERNO, APELLIDO MATERNO, 1ER NOMBRE, 2DO NOMBRE, 3ER NOMBRE, COP, COLEGIO REGIONAL
-- La tabla normaliza en: nombres, apellidos, cop, colegio, estado, habilitado

-- Crear tabla agremiados
CREATE TABLE IF NOT EXISTS public.agremiados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cop TEXT NOT NULL UNIQUE,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    colegio TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'RETIRADO')),
    habilitado TEXT NOT NULL DEFAULT 'ACTIVO' CHECK (habilitado IN ('ACTIVO', 'INACTIVO')),
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_agremiados_cop ON public.agremiados(cop);
CREATE INDEX IF NOT EXISTS idx_agremiados_nombres ON public.agremiados USING gin(to_tsvector('spanish', nombres));
CREATE INDEX IF NOT EXISTS idx_agremiados_apellidos ON public.agremiados USING gin(to_tsvector('spanish', apellidos));
CREATE INDEX IF NOT EXISTS idx_agremiados_colegio ON public.agremiados(colegio);

-- Trigger para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_agremiados_updated ON public.agremiados;
CREATE TRIGGER trigger_agremiados_updated
    BEFORE UPDATE ON public.agremiados
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion();

-- RLS: Permitir lectura pública, escritura solo con service role (API server-side)
ALTER TABLE public.agremiados ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública para todos
CREATE POLICY "Allow public read access" ON public.agremiados
    FOR SELECT
    USING (true);

-- Nota: La API usa SUPABASE_SERVICE_ROLE_KEY en el servidor.
-- El service role de Supabase bypassa RLS automáticamente.
