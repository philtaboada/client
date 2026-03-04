/**
 * Tipos para Supabase - tabla agremiados
 */

export interface Database {
    public: {
        Tables: {
            agremiados: {
                Row: {
                    id: string;
                    cop: string;
                    nombres: string;
                    apellidos: string;
                    colegio: string;
                    estado: string;
                    habilitado: string;
                    fecha_registro: string;
                    fecha_actualizacion: string;
                };
                Insert: {
                    id?: string;
                    cop: string;
                    nombres: string;
                    apellidos: string;
                    colegio: string;
                    estado?: string;
                    habilitado?: string;
                    fecha_registro?: string;
                    fecha_actualizacion?: string;
                };
                Update: {
                    id?: string;
                    cop?: string;
                    nombres?: string;
                    apellidos?: string;
                    colegio?: string;
                    estado?: string;
                    habilitado?: string;
                    fecha_registro?: string;
                    fecha_actualizacion?: string;
                };
            };
        };
    };
}
