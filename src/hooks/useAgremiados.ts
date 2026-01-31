'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Agremiado } from '@/types/agremiado';
import type { CreateAgremiadoInput, UpdateAgremiadoInput } from '@/lib/validations';

/**
 * React Query hooks for Agremiados API
 * Provides data fetching, caching, and mutations
 */

const API_BASE = '/api/agremiados';

// ===== QUERIES =====

/**
 * Fetch all agremiados with pagination
 */
export function useAgremiados(page: number = 1, limit: number = 50) {
    return useQuery({
        queryKey: ['agremiados', page, limit],
        queryFn: async () => {
            const response = await fetch(`${API_BASE}?page=${page}&limit=${limit}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al cargar agremiados');
            }
            return response.json();
        },
    });
}

/**
 * Fetch single agremiado by ID
 */
export function useAgremiado(id: number) {
    return useQuery({
        queryKey: ['agremiado', id],
        queryFn: async () => {
            const response = await fetch(`${API_BASE}/${id}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al cargar agremiado');
            }
            const data = await response.json();
            return data.data as Agremiado;
        },
        enabled: !!id,
    });
}

/**
 * Search agremiados
 */
export function useSearchAgremiados(searchTerm: string, page: number = 1) {
    return useQuery({
        queryKey: ['agremiados', 'search', searchTerm, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                q: searchTerm,
                page: page.toString(),
                limit: '50',
            });
            const response = await fetch(`${API_BASE}/search?${params}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error en la búsqueda');
            }
            return response.json();
        },
        enabled: searchTerm.length > 0,
    });
}

// ===== MUTATIONS =====

/**
 * Create new agremiado
 */
export function useCreateAgremiado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateAgremiadoInput) => {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al crear agremiado');
            }

            const result = await response.json();
            return result.data as Agremiado;
        },
        onSuccess: () => {
            // Invalidate all agremiados queries to refetch
            queryClient.invalidateQueries({ queryKey: ['agremiados'] });
        },
    });
}

/**
 * Update existing agremiado
 */
export function useUpdateAgremiado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: UpdateAgremiadoInput;
        }) => {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al actualizar agremiado');
            }

            const result = await response.json();
            return result.data as Agremiado;
        },
        onSuccess: (_, variables) => {
            // Invalidate specific agremiado and list
            queryClient.invalidateQueries({ queryKey: ['agremiado', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['agremiados'] });
        },
    });
}

/**
 * Delete agremiado
 */
export function useDeleteAgremiado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al eliminar agremiado');
            }
        },
        onSuccess: () => {
            // Invalidate all agremiados queries
            queryClient.invalidateQueries({ queryKey: ['agremiados'] });
        },
    });
}
