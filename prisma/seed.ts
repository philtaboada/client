import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed database with example data from original HTML
 */
async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.agremiado.deleteMany();
    console.log('✅ Cleared existing agremiados');

    // Create example agremiados from original HTML
    const agremiados = await prisma.agremiado.createMany({
        data: [
            {
                cop: '0015',
                nombres: 'MARÍA TORIBIA',
                apellidos: 'BARRIONUEVO SILVERIO',
                colegio: 'III_LIMA_CALLAO',
                estado: 'ACTIVO',
                habilitado: 'INACTIVO',
            },
            {
                cop: '0047',
                nombres: 'MARÍA AURORA',
                apellidos: 'VERASTEGUI HIDALGO',
                colegio: 'III_LIMA_CALLAO',
                estado: 'ACTIVO',
                habilitado: 'INACTIVO',
            },
            {
                cop: '0061',
                nombres: 'MARÍA ALEJANDRINA',
                apellidos: 'ROJAS DULANTO',
                colegio: 'III_LIMA_CALLAO',
                estado: 'ACTIVO',
                habilitado: 'INACTIVO',
            },
            {
                cop: '0123',
                nombres: 'JUAN CARLOS',
                apellidos: 'PÉREZ GONZÁLEZ',
                colegio: 'I_LIMA',
                estado: 'ACTIVO',
                habilitado: 'ACTIVO',
            },
            {
                cop: '0234',
                nombres: 'ANA MARÍA',
                apellidos: 'LÓPEZ FERNÁNDEZ',
                colegio: 'II_AREQUIPA',
                estado: 'ACTIVO',
                habilitado: 'ACTIVO',
            },
            {
                cop: '0345',
                nombres: 'PEDRO ANTONIO',
                apellidos: 'GARCÍA MARTÍNEZ',
                colegio: 'IV_TRUJILLO',
                estado: 'SUSPENDIDO',
                habilitado: 'INACTIVO',
            },
            {
                cop: '0456',
                nombres: 'ROSA ELENA',
                apellidos: 'TORRES SÁNCHEZ',
                colegio: 'V_PIURA',
                estado: 'ACTIVO',
                habilitado: 'ACTIVO',
            },
            {
                cop: '0567',
                nombres: 'LUIS ALBERTO',
                apellidos: 'RAMÍREZ CASTRO',
                colegio: 'VI_CUSCO',
                estado: 'RETIRADO',
                habilitado: 'INACTIVO',
            },
        ],
    });

    console.log(`✅ Created ${agremiados.count} agremiados`);
    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
