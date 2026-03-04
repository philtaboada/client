'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

/**
 * Login oculto en el footer - solo visible al hacer clic en enlace discreto
 * Usuario: adminCOP | Contraseña: Lalistaoficial
 */

export function LoginFooter() {
    const { isAdmin, isLoading, login, logout } = useAuth();
    const [showForm, setShowForm] = React.useState(false);
    const [usuario, setUsuario] = React.useState('');
    const [contraseña, setContraseña] = React.useState('');
    const [error, setError] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const ok = await login(usuario, contraseña);
            if (ok) {
                setShowForm(false);
                setUsuario('');
                setContraseña('');
            } else {
                setError('Credenciales incorrectas');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAdmin) {
        return (
            <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-green-600 font-medium">Admin</span>
                <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 underline"
                >
                    Cerrar sesión
                </button>
            </div>
        );
    }

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="text-gray-400 hover:text-gray-500 text-xs"
                title="Acceso administrador"
            >
                ·
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-center justify-center gap-2"
        >
            <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
            />
            <Button type="submit" variant="outline" size="sm" isLoading={isSubmitting}>
                Entrar
            </Button>
            <button
                type="button"
                onClick={() => {
                    setShowForm(false);
                    setError('');
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
            >
                Cancelar
            </button>
            {error && (
                <span className="w-full text-center text-xs text-red-600">{error}</span>
            )}
        </form>
    );
}
