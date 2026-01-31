# Sistema de Gestión de Agremiados

Sistema web para registro y consulta de miembros del colegio profesional, desarrollado con Next.js, TypeScript, Prisma y PostgreSQL.

## 🚀 Características

- ✅ CRUD completo de agremiados
- 🔍 Búsqueda en tiempo real
- 📊 Exportación a CSV
- 📱 Diseño responsive
- 🎨 UI moderna con Tailwind CSS
- ⚡ React Query para gestión de estado
- 🔒 Validación con Zod (cliente y servidor)

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL (o MySQL)
- npm o pnpm

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd nextjs-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de base de datos:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

4. **Ejecutar migraciones de Prisma**
```bash
npx prisma migrate dev --name init
```

5. **Poblar base de datos con datos de ejemplo**
```bash
npx prisma db seed
```

6. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/agremiados/          # API Routes
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página principal con tabs
│   └── globals.css              # Estilos globales
├── components/
│   ├── ui/                      # Componentes UI base
│   ├── agremiados/              # Componentes de agremiados
│   └── Providers.tsx            # Context providers
├── hooks/
│   └── useAgremiados.ts         # React Query hooks
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── validations.ts           # Esquemas Zod
│   ├── utils.ts                 # Utilidades
│   └── api-utils.ts             # Helpers de API
└── types/
    └── agremiado.ts             # TypeScript types
```

## 🔌 API Endpoints

### Agremiados

- `GET /api/agremiados` - Listar todos (con paginación)
- `POST /api/agremiados` - Crear nuevo
- `GET /api/agremiados/[id]` - Obtener por ID
- `PUT /api/agremiados/[id]` - Actualizar
- `DELETE /api/agremiados/[id]` - Eliminar
- `GET /api/agremiados/search?q=term` - Buscar

## 🗄️ Esquema de Base de Datos

```prisma
model Agremiado {
  id                 Int        @id @default(autoincrement())
  cop                String     @unique
  nombres            String
  apellidos          String
  colegio            Colegio
  estado             Estado
  habilitado         Habilitado
  fechaRegistro      DateTime   @default(now())
  fechaActualizacion DateTime   @updatedAt
}
```

## 🧪 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build
npm run start

# Prisma
npx prisma studio          # Abrir Prisma Studio
npx prisma migrate dev     # Crear nueva migración
npx prisma db seed         # Poblar base de datos
npx prisma generate        # Generar Prisma Client

# Linting
npm run lint
```

## 🎨 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Estilos**: Tailwind CSS
- **Gestión de Estado**: TanStack Query (React Query)
- **Validación**: Zod
- **Formularios**: React Hook Form

## 📝 Licencia

MIT

## 👥 Autor

Desarrollado para el Colegio de Profesionales
