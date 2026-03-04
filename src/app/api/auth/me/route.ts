import { verifyAdminSession } from '@/lib/auth-utils';

/**
 * GET /api/auth/me
 * Retorna si el usuario está autenticado como admin
 */
export async function GET() {
    const isAdmin = await verifyAdminSession();
    return Response.json({ isAdmin });
}
