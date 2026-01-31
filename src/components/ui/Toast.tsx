'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Toast notification system
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
    undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const showToast = React.useCallback(
        (message: string, type: ToastType = 'info') => {
            const id = Math.random().toString(36).substring(7);
            const newToast: Toast = { id, message, type };

            setToasts((prev) => [...prev, newToast]);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, 5000);
        },
        []
    );

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({
    toast,
    onClose,
}: {
    toast: Toast;
    onClose: () => void;
}) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    };

    const variants = {
        success: 'bg-green-50 border-green-500 text-green-800',
        error: 'bg-red-50 border-red-500 text-red-800',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800',
    };

    return (
        <div
            className={cn(
                'flex items-center gap-3 px-6 py-4 rounded-lg border-l-4 shadow-lg',
                'animate-in slide-in-from-right duration-300',
                'min-w-[300px] max-w-md',
                variants[toast.type]
            )}
        >
            <span className="text-2xl">{icons[toast.type]}</span>
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
