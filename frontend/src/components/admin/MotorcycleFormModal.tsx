import React, { useState, useEffect } from 'react'
import type { Motorcycle, Brand } from '../../types'
import { useTranslation } from 'react-i18next'
import { X, Save, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface MotorcycleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Motorcycle>) => Promise<void>
  initialData?: Motorcycle | null
  brands: Brand[]
  isModerator: boolean
  moderatorBrandId?: number | null
}

const CATEGORIES: Array<Motorcycle['category']> = [
  'Performance',
  'Adventure & Touring',
  'Urban Mobility',
  'Premium Heritage',
]

export const MotorcycleFormModal: React.FC<MotorcycleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  brands,
  isModerator,
  moderatorBrandId,
}) => {
  const { t } = useTranslation()

  const [formData, setFormData] = useState<Partial<Motorcycle>>({
    name: '',
    slug: '',
    brand_id: isModerator && moderatorBrandId ? moderatorBrandId : brands[0]?.id || 1,
    category: 'Performance',
    tagline: '',
    description: '',
    engine_cc: 1000,
    horsepower: 200,
    torque_nm: 120,
    weight_kg: 195,
    top_speed_kmh: 299,
    acceleration_0_100: '3.0s',
    fuel_capacity_liters: 16,
    seat_height_mm: 835,
    price_starting_at: 120000,
    currency: 'AED',
    image_url: '',
    is_featured: false,
    is_active: true,
    order_index: 0,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        brand_id: isModerator && moderatorBrandId ? moderatorBrandId : brands[0]?.id || 1,
        category: 'Performance',
        tagline: '',
        description: '',
        engine_cc: 1000,
        horsepower: 200,
        torque_nm: 120,
        weight_kg: 195,
        top_speed_kmh: 299,
        acceleration_0_100: '3.0s',
        fuel_capacity_liters: 16,
        seat_height_mm: 835,
        price_starting_at: 120000,
        currency: 'AED',
        image_url: '',
        is_featured: false,
        is_active: true,
        order_index: 0,
      })
    }
    setError(null)
  }, [initialData, isOpen, isModerator, moderatorBrandId, brands])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim()) {
      setError(t('admin.fieldNameRequired', 'Motorcycle model name is required.'))
      return
    }
    if (!formData.price_starting_at) {
      setError(t('admin.fieldPriceRequired', 'Starting price is required.'))
      return
    }

    setSaving(true)
    setError(null)
    try {
      await onSave(formData)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to save motorcycle record.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-[8px] bg-theme-elevated border border-theme-subtle shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
            <div>
              <h3 className="text-base font-display font-bold uppercase tracking-wider text-theme-primary">
                {initialData
                  ? `${t('admin.editTitle', 'Edit Motorcycle')} · ${initialData.name}`
                  : t('admin.createTitle', 'New Fleet Motorcycle')}
              </h3>
              <p className="text-xs font-mono text-theme-muted mt-0.5">
                {t(
                  'admin.modalSubtitle',
                  'Configure dyno telemetry, specifications, and regional retail pricing'
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3 rounded-[4px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Primary Details: Brand, Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-1.5">
                  {t('admin.fieldBrand', 'Marque / Brand')} *
                </label>
                <select
                  disabled={isModerator}
                  value={formData.brand_id}
                  onChange={(e) => setFormData({ ...formData, brand_id: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono focus:border-theme-gold outline-none disabled:opacity-60"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-1.5">
                  {t('admin.fieldName', 'Model Name')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Panigale V4 S"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono focus:border-theme-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-1.5">
                  {t('admin.fieldCategory', 'Category')} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as Motorcycle['category'],
                    })
                  }
                  className="w-full h-10 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono focus:border-theme-gold outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {t(`catalog.categories.${c}`, c)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tagline & Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-1.5">
                  {t('admin.fieldTagline', 'Marketing Tagline')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Science of Speed"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full h-10 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono focus:border-theme-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-1.5">
                  {t('admin.fieldImage', 'Primary Studio Image URL')}
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full h-10 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono focus:border-theme-gold outline-none"
                />
              </div>
            </div>

            {/* Dyno Telemetry Specifications Matrix (High Density) */}
            <div className="border border-theme-subtle/80 rounded-[6px] p-4 bg-theme-base/50 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-theme-gold block font-semibold">
                {t('admin.dynoMatrixTitle', 'Dyno Telemetry & Engineering Matrix')}
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-theme-muted mb-1">
                    {t('admin.fieldHorsepower', 'Horsepower (BHP)')}
                  </label>
                  <input
                    type="number"
                    value={formData.horsepower || ''}
                    onChange={(e) => setFormData({ ...formData, horsepower: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-theme-muted mb-1">
                    {t('admin.fieldTorque', 'Torque (Nm)')}
                  </label>
                  <input
                    type="number"
                    value={formData.torque_nm || ''}
                    onChange={(e) => setFormData({ ...formData, torque_nm: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-theme-muted mb-1">
                    {t('admin.fieldDisplacement', 'Displacement (CC)')}
                  </label>
                  <input
                    type="number"
                    value={formData.engine_cc || ''}
                    onChange={(e) => setFormData({ ...formData, engine_cc: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-theme-muted mb-1">
                    {t('admin.fieldAccel', '0-100 km/h (sec)')}
                  </label>
                  <input
                    type="text"
                    value={formData.acceleration_0_100 || ''}
                    onChange={(e) => setFormData({ ...formData, acceleration_0_100: e.target.value })}
                    className="w-full h-9 px-2.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-theme-muted mb-1">
                    {t('admin.fieldTopSpeed', 'Top Speed (km/h)')}
                  </label>
                  <input
                    type="number"
                    value={formData.top_speed_kmh || ''}
                    onChange={(e) => setFormData({ ...formData, top_speed_kmh: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-theme-muted mb-1">
                    {t('admin.fieldWeight', 'Dry Weight (kg)')}
                  </label>
                  <input
                    type="number"
                    value={formData.weight_kg || ''}
                    onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-theme-muted mb-1">
                    {t('admin.fieldFuel', 'Fuel Tank (Liters)')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fuel_capacity_liters || ''}
                    onChange={(e) => setFormData({ ...formData, fuel_capacity_liters: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-theme-muted mb-1">
                    {t('admin.fieldSeat', 'Seat Height (mm)')}
                  </label>
                  <input
                    type="number"
                    value={formData.seat_height_mm || ''}
                    onChange={(e) => setFormData({ ...formData, seat_height_mm: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-1.5">
                  {t('admin.fieldPrice', 'Retail Price (AED)')} *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price_starting_at || ''}
                  onChange={(e) => setFormData({ ...formData, price_starting_at: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono focus:border-theme-gold outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-theme-subtle bg-theme-base accent-emerald-500"
                  />
                  <span className="text-xs font-mono text-theme-primary">
                    {t('admin.fieldActive', 'Active in Catalog')}
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded border-theme-subtle bg-theme-base accent-amber-500"
                  />
                  <span className="text-xs font-mono text-theme-primary">
                    {t('admin.fieldFeatured', 'Featured Hero Badge')}
                  </span>
                </label>
              </div>
            </div>
          </form>

          {/* Footer Controls */}
          <div className="p-4 border-t border-theme-subtle flex items-center justify-end gap-3 bg-theme-surface">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-muted hover:text-theme-primary text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              {t('admin.cancel', 'Cancel')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2 rounded-[4px] bg-theme-gold hover:bg-theme-gold/90 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? t('admin.saving', 'Saving...') : t('admin.saveMotorcycle', 'Save Motorcycle')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
