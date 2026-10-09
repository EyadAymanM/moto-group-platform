import React, { useState } from 'react'
import type { Motorcycle, Brand } from '../../types'
import { useTranslation } from 'react-i18next'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import { MotorcycleFormModal } from './MotorcycleFormModal'

interface InventoryTableViewProps {
  motorcycles: Motorcycle[]
  brands: Brand[]
  isAdmin: boolean
  isModerator: boolean
  moderatorBrandId?: number | null
  onRefresh: () => Promise<void>
  onSaveMotorcycle: (data: Partial<Motorcycle>, id?: number) => Promise<void>
  onDeleteMotorcycle: (id: number) => Promise<void>
  onToggleStatus: (motorcycle: Motorcycle) => Promise<void>
}

export const InventoryTableView: React.FC<InventoryTableViewProps> = ({
  motorcycles,
  brands,
  isAdmin,
  isModerator,
  moderatorBrandId,
  onSaveMotorcycle,
  onDeleteMotorcycle,
  onToggleStatus,
}) => {
  const { t, i18n } = useTranslation()

  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(
    isModerator && moderatorBrandId ? moderatorBrandId : null
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBike, setEditingBike] = useState<Motorcycle | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtered bikes
  const filteredBikes = motorcycles.filter((bike) => {
    // Brand filter
    if (isModerator && moderatorBrandId && bike.brand_id !== moderatorBrandId) {
      return false
    }
    if (selectedBrandId && bike.brand_id !== selectedBrandId) {
      return false
    }
    // Category filter
    if (selectedCategory !== 'ALL' && bike.category !== selectedCategory) {
      return false
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = bike.name.toLowerCase().includes(q)
      const matchBrand = bike.brand?.name.toLowerCase().includes(q) || false
      const matchTagline = bike.tagline?.toLowerCase().includes(q) || false
      if (!matchName && !matchBrand && !matchTagline) return false
    }
    return true
  })

  const handleOpenCreate = () => {
    setEditingBike(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (bike: Motorcycle) => {
    setEditingBike(bike)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async (id: number) => {
    setIsDeleting(true)
    try {
      await onDeleteMotorcycle(id)
      setDeleteConfirmId(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-theme-subtle">
        <div>
          <h2 className="text-xl font-display font-bold text-theme-primary">
            {t('admin.inventoryManagement', 'Fleet Inventory Management')}
          </h2>
          <p className="text-xs font-mono text-theme-muted mt-0.5">
            {filteredBikes.length}{' '}
            {t(
              'admin.inventorySubtitle',
              'machines indexed · Scoped catalog CRUD & telemetry specs'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-[4px] bg-theme-gold hover:bg-theme-gold/90 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.newMachine', 'New Machine')}</span>
        </button>
      </div>

      {/* Filter Ribbon: Brands, Category & Search */}
      <div className="p-4 rounded-[6px] bg-theme-surface border border-theme-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand Filter Pills (Admin only) */}
        {isAdmin ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedBrandId(null)}
              className={`px-3 py-1 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                selectedBrandId === null
                  ? 'bg-theme-gold text-slate-950 font-bold shadow-sm'
                  : 'bg-theme-base text-theme-muted hover:text-theme-primary border border-theme-subtle'
              }`}
            >
              {t('admin.allMarques', 'All Marques')} ({motorcycles.length})
            </button>
            {brands.map((b) => {
              const count = motorcycles.filter((m) => m.brand_id === b.id).length
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBrandId(b.id)}
                  className={`px-3 py-1 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    selectedBrandId === b.id
                      ? 'bg-theme-gold text-slate-950 font-bold shadow-sm'
                      : 'bg-theme-base text-theme-muted hover:text-theme-primary border border-theme-subtle'
                  }`}
                >
                  {b.name} ({count})
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-xs font-mono text-theme-gold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-theme-gold" />
            <span>
              {t('admin.marque', 'Marque')}:{' '}
              {brands.find((b) => b.id === moderatorBrandId)?.name || 'Assigned Brand'}
            </span>
          </div>
        )}

        {/* Search & Category Selector */}
        <div className="flex items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-3 pe-8 rounded-[4px] bg-theme-base border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none cursor-pointer"
            >
              <option value="ALL">{t('admin.allCategories', 'All Categories')}</option>
              <option value="Performance">{t('catalog.categories.Performance', 'Performance')}</option>
              <option value="Adventure & Touring">{t('catalog.categories.Adventure & Touring', 'Adventure & Touring')}</option>
              <option value="Urban Mobility">{t('catalog.categories.Urban Mobility', 'Urban Mobility')}</option>
              <option value="Premium Heritage">{t('catalog.categories.Premium Heritage', 'Premium Heritage')}</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-theme-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('admin.searchModelPlaceholder', 'Search model name...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 ps-8 pe-3 rounded-[4px] bg-theme-base border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
            />
          </div>
        </div>
      </div>

      {/* High-Density Operational Inventory Table */}
      <div className="rounded-[8px] bg-theme-surface border border-theme-subtle overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-theme-subtle/80 bg-theme-base/60 text-[10px] font-mono uppercase tracking-wider text-theme-muted">
                <th className="py-3 px-4 text-start">{t('admin.thMachine', 'Machine & Marque')}</th>
                <th className="py-3 px-4 text-start">{t('admin.thCategory', 'Category')}</th>
                <th className="py-3 px-4 text-start">{t('admin.thDynoSpecs', 'Dyno Specs')}</th>
                <th className="py-3 px-4 text-start">{t('admin.thRetailPrice', 'Retail Price')}</th>
                <th className="py-3 px-4 text-center">{t('admin.thStatus', 'Status')}</th>
                <th className="py-3 px-4 text-end">{t('admin.thActions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle/60">
              {filteredBikes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-mono text-theme-muted">
                    {t('admin.noMotorcyclesFound', 'No motorcycles found matching current filter criteria.')}
                  </td>
                </tr>
              ) : (
                filteredBikes.map((bike) => (
                  <tr
                    key={bike.id}
                    className="hover:bg-theme-elevated/40 transition-colors group"
                  >
                    {/* Machine Thumbnail + Model & Brand */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-[4px] bg-theme-base border border-theme-subtle overflow-hidden shrink-0 flex items-center justify-center">
                          {bike.image_url ? (
                            <img
                              src={bike.image_url}
                              alt={bike.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <span className="text-[9px] font-mono text-theme-muted">N/A</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-theme-primary truncate">
                            {bike.name}
                          </div>
                          <div className="text-[10px] font-mono text-theme-gold uppercase tracking-wider">
                            {bike.brand?.name || 'Marque'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-mono bg-theme-base border border-theme-subtle text-theme-muted">
                        {t(`catalog.categories.${bike.category}`, bike.category)}
                      </span>
                    </td>

                    {/* Dyno Specs */}
                    <td className="py-3 px-4 font-mono text-[11px] text-theme-muted">
                      <span className="text-theme-primary font-bold telemetry-val">
                        {bike.horsepower || '—'} BHP
                      </span>{' '}
                      · <span>{bike.engine_cc || '—'} CC</span> ·{' '}
                      <span>{bike.torque_nm || '—'} Nm</span>
                    </td>

                    {/* Price Starting At */}
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-theme-primary telemetry-val">
                      {Number(bike.price_starting_at).toLocaleString(
                        i18n.language === 'ar' ? 'ar-EG' : 'en-US'
                      )}{' '}
                      {bike.currency || (i18n.language === 'ar' ? 'د.إ' : 'AED')}
                    </td>

                    {/* Status Pill Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(bike)}
                        title={t('admin.toggleVisibility', 'Click to toggle catalog visibility')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          bike.is_active
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-slate-500/15 text-slate-400 border border-slate-500/30 hover:bg-slate-500/25'
                        }`}
                      >
                        {bike.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{t('admin.statusActive', 'Active')}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>{t('admin.statusDraft', 'Draft')}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(bike)}
                          title={t('admin.edit', 'Edit Specifications')}
                          className="p-1.5 rounded-[4px] bg-theme-base hover:bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(bike.id)}
                          title={t('admin.delete', 'Delete Machine')}
                          className="p-1.5 rounded-[4px] bg-theme-base hover:bg-red-500/20 border border-theme-subtle text-theme-muted hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[8px] bg-theme-elevated border border-theme-subtle p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-theme-primary">
                {t('admin.confirmDeleteTitle', 'Confirm Deletion')}
              </h4>
            </div>
            <p className="text-xs text-theme-muted leading-relaxed">
              {t(
                'admin.confirmDeleteDesc',
                'Are you sure you want to delete this motorcycle record from the regional inventory? This operation cannot be undone.'
              )}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-[4px] bg-theme-base border border-theme-subtle text-xs font-mono text-theme-muted hover:text-theme-primary cursor-pointer"
              >
                {t('admin.cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-[4px] bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? t('admin.deleting', 'Deleting...') : t('admin.confirm', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Form */}
      <MotorcycleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          await onSaveMotorcycle(data, editingBike?.id)
        }}
        initialData={editingBike}
        brands={brands}
        isModerator={isModerator}
        moderatorBrandId={moderatorBrandId}
      />
    </div>
  )
}
