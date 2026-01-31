'use client';

import * as React from 'react';
import Image from 'next/image';
import { useAgremiados } from '@/hooks/useAgremiados';
import { FormularioRegistro } from '@/components/agremiados/FormularioRegistro';
import { BusquedaAgremiados } from '@/components/agremiados/BusquedaAgremiados';
import { TablaAgremiados } from '@/components/agremiados/TablaAgremiados';
import { ModalDetalles } from '@/components/agremiados/ModalDetalles';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { exportToCSV, formatDate } from '@/lib/utils';
import type { Agremiado } from '@/types/agremiado';

/**
 * Main page component - Consulta Pública de Agremiados
 * Styled with institutional colors: Burgundy (#6a0032) & Gold (#d4af37)
 */

type TabType = 'registro' | 'busqueda' | 'lista';

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('busqueda');
  const [selectedAgremiado, setSelectedAgremiado] = React.useState<Agremiado | null>(null);
  const [editingAgremiado, setEditingAgremiado] = React.useState<Agremiado | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data, isLoading } = useAgremiados(1, 1000);
  const { showToast } = useToast();

  const agremiados = data?.data || [];
  const totalCount = data?.total || 0;

  const handleView = (agremiado: Agremiado) => {
    setSelectedAgremiado(agremiado);
    setIsModalOpen(true);
  };

  const handleEdit = (agremiado: Agremiado) => {
    setEditingAgremiado(agremiado);
    setActiveTab('registro');
  };

  const handleDelete = () => {
    setIsModalOpen(false);
  };

  const handleFormSuccess = () => {
    setEditingAgremiado(null);
    setActiveTab('lista');
  };

  const handleExport = () => {
    if (agremiados.length === 0) {
      showToast('No hay datos para exportar', 'warning');
      return;
    }

    const exportData = agremiados.map((a) => ({
      COP: a.cop,
      NOMBRES: a.nombres,
      APELLIDOS: a.apellidos,
      COLEGIO_REGIONAL: a.colegio,
      ESTADO: a.estado,
      HABILITADO: a.habilitado,
      FECHA_REGISTRO: formatDate(a.fechaRegistro),
    }));

    const filename = `agremiados_${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCSV(exportData, filename);
    showToast('Datos exportados exitosamente', 'success');
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Institucional */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/emblema.webp"
              alt="Emblema del Colegio de Obstetras del Perú"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-bold text-[#6a0032] tracking-tight uppercase">
                Colegio de Obstetras del Perú
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                D.L.N° 21210 - LEY N° 28686 • PROFESIÓN MÉDICA LEY N° 23346
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Search Card - Main View */}
        {activeTab === 'busqueda' && (
          <div className="bg-[#6a0032] rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-[#d4af37] mb-6">
                Buscar agremiado por COP o Apellidos y Nombres
              </h2>
              <BusquedaAgremiados onEdit={handleEdit} onView={handleView} />
            </div>
          </div>
        )}

        {/* Registration Tab */}
        {activeTab === 'registro' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-[#6a0032]/10 flex items-center justify-center">
                  <UserPlusIcon className="w-5 h-5 text-[#6a0032]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingAgremiado ? 'Editar Agremiado' : 'Registro de Nuevo Agremiado'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {editingAgremiado ? 'Modifica los datos del agremiado' : 'Complete el formulario para registrar'}
                  </p>
                </div>
              </div>
              <FormularioRegistro
                agremiado={editingAgremiado || undefined}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        )}

        {/* List Tab */}
        {activeTab === 'lista' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#6a0032]/10 flex items-center justify-center">
                  <ListIcon className="w-5 h-5 text-[#6a0032]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Lista de Agremiados
                  </h2>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-[#6a0032]">{totalCount}</span> registros encontrados
                  </p>
                </div>
              </div>
              <Button variant="accent" onClick={handleExport}>
                <DownloadIcon className="w-4 h-4" />
                Exportar CSV
              </Button>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-[#6a0032]/20 border-t-[#6a0032] rounded-full animate-spin" />
                  <p className="mt-4 text-gray-500">Cargando...</p>
                </div>
              ) : (
                <TablaAgremiados
                  agremiados={agremiados}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              )}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveTab('busqueda')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'busqueda'
                ? 'bg-[#6a0032] text-white shadow-md'
                : 'bg-white text-[#6a0032] border border-[#6a0032] hover:bg-[#6a0032] hover:text-white'
            }`}
          >
            <SearchIcon className="w-4 h-4" />
            Buscar
          </button>
          <button
            onClick={() => setActiveTab('registro')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'registro'
                ? 'bg-[#6a0032] text-white shadow-md'
                : 'bg-white text-[#6a0032] border border-[#6a0032] hover:bg-[#6a0032] hover:text-white'
            }`}
          >
            <UserPlusIcon className="w-4 h-4" />
            Registrar
          </button>
          <button
            onClick={() => setActiveTab('lista')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'lista'
                ? 'bg-[#6a0032] text-white shadow-md'
                : 'bg-white text-[#6a0032] border border-[#6a0032] hover:bg-[#6a0032] hover:text-white'
            }`}
          >
            <ListIcon className="w-4 h-4" />
            Ver Lista
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Colegio de Obstetras del Perú
          </p>
        </div>
      </footer>

      {/* Modal */}
      <ModalDetalles
        agremiado={selectedAgremiado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
