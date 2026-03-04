'use client';

import * as React from 'react';
import Image from 'next/image';
import { useAgremiados, useDeleteAgremiado } from '@/hooks/useAgremiados';
import { BusquedaAgremiados } from '@/components/agremiados/BusquedaAgremiados';
import { TablaAgremiados } from '@/components/agremiados/TablaAgremiados';
import { ModalDetalles } from '@/components/agremiados/ModalDetalles';
import { FormularioRegistro } from '@/components/agremiados/FormularioRegistro';
import { LoginFooter } from '@/components/auth/LoginFooter';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { exportToCSV, formatDate } from '@/lib/utils';
import type { Agremiado } from '@/types/agremiado';

/**
 * Main page component - Consulta Pública de Agremiados
 * Styled with institutional colors: Burgundy (#6a0032) & Gold (#d4af37)
 */

type TabType = 'busqueda' | 'lista';

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

const PAGE_SIZE = 25;

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('busqueda');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedAgremiado, setSelectedAgremiado] = React.useState<Agremiado | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [agremiadoToEdit, setAgremiadoToEdit] = React.useState<Agremiado | undefined>(undefined);
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);

  const { isAdmin } = useAuth();
  const { data, isLoading } = useAgremiados(currentPage, PAGE_SIZE);
  const deleteMutation = useDeleteAgremiado();
  const { showToast } = useToast();

  const agremiados = data?.data || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleView = (agremiado: Agremiado) => {
    setSelectedAgremiado(agremiado);
    setIsModalOpen(true);
  };

  const handleEdit = (agremiado: Agremiado) => {
    setAgremiadoToEdit(agremiado);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (agremiado: Agremiado) => {
    if (!confirm(`¿Eliminar a ${agremiado.nombres} ${agremiado.apellidos} (COP ${agremiado.cop})?`)) return;
    try {
      await deleteMutation.mutateAsync(agremiado.id);
      showToast('Agremiado eliminado', 'success');
      if (selectedAgremiado?.id === agremiado.id) setIsModalOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar', 'error');
    }
  };

  const handleOpenCreateForm = () => {
    setAgremiadoToEdit(undefined);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setAgremiadoToEdit(undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = async () => {
    if (totalCount === 0) {
      showToast('No hay datos para exportar', 'warning');
      return;
    }
    try {
      const limit = Math.min(totalCount, 1000);
      const response = await fetch(`/api/agremiados?page=1&limit=${limit}`);
      const result = await response.json();
      const allData = result.data || [];
      if (allData.length === 0) {
        showToast('No hay datos para exportar', 'warning');
        return;
      }
      const exportData = allData.map((a: Agremiado) => ({
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
    } catch {
      showToast('Error al exportar datos', 'error');
    }
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
              <BusquedaAgremiados
                onView={handleView}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
              <div className="flex gap-2">
                {isAdmin && (
                  <Button variant="primary" onClick={handleOpenCreateForm}>
                    Registrar
                  </Button>
                )}
                <Button variant="accent" onClick={handleExport}>
                <DownloadIcon className="w-4 h-4" />
                Exportar CSV
              </Button>
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-[#6a0032]/20 border-t-[#6a0032] rounded-full animate-spin" />
                  <p className="mt-4 text-gray-500">Cargando...</p>
                </div>
              ) : (
                <>
                <TablaAgremiados
                    agremiados={agremiados}
                    onView={handleView}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    total={totalCount}
                    limit={PAGE_SIZE}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveTab('busqueda')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'busqueda'
                ? 'bg-[#6a0032] text-white shadow-md'
                : 'bg-white text-[#6a0032] border border-[#6a0032] hover:bg-[#6a0032] hover:text-white'
              }`}
          >
            <SearchIcon className="w-4 h-4" />
            Buscar
          </button>
          <button
            onClick={() => setActiveTab('lista')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'lista'
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
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Colegio de Obstetras del Perú
            </p>
            <LoginFooter />
          </div>
        </div>
      </footer>

      {/* Modal Detalles */}
      <ModalDetalles
        agremiado={selectedAgremiado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal Formulario (crear/editar) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setAgremiadoToEdit(undefined); }}
        title={agremiadoToEdit ? 'Editar Agremiado' : 'Registrar Agremiado'}
        size="lg"
      >
        <FormularioRegistro
          key={agremiadoToEdit?.id ?? 'new'}
          agremiado={agremiadoToEdit}
          onSuccess={handleFormSuccess}
        />
      </Modal>
    </div>
  );
}
