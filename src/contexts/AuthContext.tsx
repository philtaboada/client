'use client';

import * as React from 'react';

interface AuthContextValue {
    isAdmin: boolean;
    isLoading: boolean;
    login: (usuario: string, contraseña: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const checkAuth = React.useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            const data = await res.json();
            setIsAdmin(!!data.isAdmin);
        } catch {
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = React.useCallback(async (usuario: string, contraseña: string): Promise<boolean> => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ usuario, contraseña }),
        });
        if (!res.ok) return false;
        setIsAdmin(true);
        return true;
    }, []);

    const logout = React.useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        setIsAdmin(false);
    }, []);

    const value: AuthContextValue = {
        isAdmin,
        isLoading,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = React.useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return ctx;
}
