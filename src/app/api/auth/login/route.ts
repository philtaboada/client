import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {
    ADMIN_USER,
    ADMIN_PASS,
    createSignedCookie,
    COOKIE_NAME,
    COOKIE_MAX_AGE,
} from '@/lib/auth-utils';

/**
 * POST /api/auth/login
 * Login con usuario y contraseña (hardcoded, sin DB)
 * Usuario: adminCOP | Contraseña: Lalistaoficial
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const usuario = String(body.usuario || '').trim();
        const contraseña = String(body.contraseña || '').trim();

        if (usuario !== ADMIN_USER || contraseña !== ADMIN_PASS) {
            return Response.json(
                { error: 'Credenciales incorrectas' },
                { status: 401 }
            );
        }

        const token = createSignedCookie();
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: COOKIE_MAX_AGE,
            path: '/',
        });

        return Response.json({ success: true });
    } catch {
        return Response.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        );
    }
}
