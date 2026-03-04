# Migraciones Supabase

## Variables de entorno requeridas

Añade a tu `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

La `SUPABASE_SERVICE_ROLE_KEY` se obtiene en el Dashboard de Supabase → Settings → API.

## Cómo ejecutar las migraciones

1. Entra al [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y ejecuta el contenido de `migrations/001_create_agremiados.sql`

## Estructura de la tabla agremiados

| Columna            | Tipo        | Descripción                          |
|--------------------|-------------|--------------------------------------|
| id                 | UUID        | PK, generado automáticamente         |
| cop                | TEXT        | Número COP (único)                   |
| nombres            | TEXT        | Nombres concatenados                 |
| apellidos          | TEXT        | Apellidos concatenados               |
| colegio            | TEXT        | Colegio regional (ej: III-LIMA CALLAO) |
| estado             | TEXT        | ACTIVO, INACTIVO, SUSPENDIDO, RETIRADO |
| habilitado         | TEXT        | ACTIVO, INACTIVO                     |
| fecha_registro     | TIMESTAMPTZ | Fecha de creación                    |
| fecha_actualizacion| TIMESTAMPTZ | Fecha de última actualización        |

## Importar datos desde CSV

Después de crear la tabla, ejecuta el script de importación:

```bash
npm run import:csv
```

Esto leerá `data.csv` y subirá los registros a Supabase.
