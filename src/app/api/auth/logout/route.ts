import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/lib/auth-utils';

/**
 * POST /api/auth/logout
 */
export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return Response.json({ success: true });
}
