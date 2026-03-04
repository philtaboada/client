import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_USER = 'adminCOP';
export const ADMIN_PASS = 'Lalistaoficial';
const COOKIE_NAME = 'admin_session';
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 horas

function getSecret(): string {
    return process.env.ADMIN_SESSION_SECRET || 'default-secret-change-in-production';
}

export function createSignedCookie(): string {
    const payload = `${ADMIN_USER}:${Date.now()}`;
    const signature = createHash('sha256').update(`${payload}:${getSecret()}`).digest('hex');
    return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

export function isAdminCookie(value: string): boolean {
    try {
        const decoded = Buffer.from(value, 'base64url').toString('utf-8');
        const parts = decoded.split(':');
        if (parts.length < 3) return false;
        const signature = parts.pop()!;
        const payload = parts.join(':');
        if (!payload.startsWith(ADMIN_USER)) return false;
        const expected = createHash('sha256').update(`${payload}:${getSecret()}`).digest('hex');
        return timingSafeEqual(Buffer.from(signature, 'utf-8'), Buffer.from(expected, 'utf-8'));
    } catch {
        return false;
    }
}

/**
 * Verifica si la petición tiene sesión de admin válida
 */
export async function verifyAdminSession(): Promise<boolean> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    if (!sessionCookie?.value) return false;
    return isAdminCookie(sessionCookie.value);
}

export { COOKIE_NAME };
