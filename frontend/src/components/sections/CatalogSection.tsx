import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../contexts/LocaleContext'
import { api } from '../../services/api'
import type { Brand, Motorcycle } from '../../types'
import { MotorcycleCard } from '../cards/MotorcycleCard'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles } from 'lucide-react'

interface CatalogSectionProps {
  brands: Brand[]
  selectedBrandId: number | null
  onSelectBrand: (brandId: number | null) => void
  onSelectTelemetry: (motorcycle: Motorcycle) => void
  onBookRide: (motorcycle: Motorcycle) => void
}

type CategoryKey = 'all' | 'Performance' | 'Adventure & Touring' | 'Urban Mobility' | 'Premium Heritage'

interface SegmentTheme {
  gradient: string
  accentBorder: string
  badgeBg: string
  badgeText: string
  pipColor: string
  watermarkColor: string
  watermarkFont: string
  label: string
}

const SEGMENT_THEMES: Record<CategoryKey, SegmentTheme> = {
  all: {
    gradient: 'from-[#0B0F17] via-[#131924] to-[#0B0F17]',
    accentBorder: 'border-theme-gold/30',
    badgeBg: 'bg-theme-gold/15 border-theme-gold/30',
    badgeText: 'text-theme-gold',
    pipColor: 'bg-theme-gold',
    watermarkColor: 'text-theme-gold opacity-[0.06]',
    watermarkFont: 'font-display font-black tracking-tighter',
    label: 'ALL',
  },
  Performance: {
    gradient: 'from-red-950/40 via-[#0B0F17] to-[#131924]',
    accentBorder: 'border-red-500/40',
    badgeBg: 'bg-red-500/15 border-red-500/30',
    badgeText: 'text-red-400',
    pipColor: 'bg-red-500',
    watermarkColor: 'text-red-500 opacity-[0.06]',
    watermarkFont: 'font-display font-black italic tracking-tighter',
    label: 'PERFORMANCE',
  },
  'Adventure & Touring': {
    gradient: 'from-amber-950/40 via-[#0B0F17] to-[#131924]',
    accentBorder: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/15 border-amber-500/30',
    badgeText: 'text-amber-400',
    pipColor: 'bg-amber-500',
    watermarkColor: 'text-amber-500 opacity-[0.06]',
    watermarkFont: 'font-mono font-black tracking-tight',
    label: 'ADVENTURE',
  },
  'Urban Mobility': {
    gradient: 'from-emerald-950/40 via-[#0B0F17] to-[#131924]',
    accentBorder: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30',
    badgeText: 'text-emerald-400',
    pipColor: 'bg-emerald-500',
    watermarkColor: 'text-emerald-400 opacity-[0.06]',
    watermarkFont: 'font-display font-extrabold tracking-wide',
    label: 'URBAN EV',
  },
  'Premium Heritage': {
    gradient: 'from-orange-950/40 via-[#0B0F17] to-[#131924]',
    accentBorder: 'border-orange-500/40',
    badgeBg: 'bg-orange-500/15 border-orange-500/30',
    badgeText: 'text-orange-400',
    pipColor: 'bg-orange-500',
    watermarkColor: 'text-orange-400 opacity-[0.06]',
    watermarkFont: 'font-display font-black tracking-tight',
    label: 'HERITAGE',
  },
}

const CATEGORIES: CategoryKey[] = [
  'all',
  'Performance',
  'Adventure & Touring',
  'Urban Mobility',
  'Premium Heritage',
]

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  brands,
  selectedBrandId,
  onSelectBrand,
  onSelectTelemetry,
  onBookRide,
}) => {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all')
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch motorcycles when category or brand filter changes
  useEffect(() => {
    let isMounted = true
    const fetchBikes = async () => {
      setLoading(true)
      try {
        const data = await api.getMotorcycles({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          brand_id: selectedBrandId || undefined,
        })
        if (isMounted) {
          setMotorcycles(data)
        }
      } catch (err) {
        console.error('Failed to fetch catalog motorcycles:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchBikes()
    return () => {
      isMounted = false
    }
  }, [selectedCategory, selectedBrandId])

  const activeBrand = useMemo(
    () => brands.find((b) => b.id === selectedBrandId),
    [brands, selectedBrandId]
  )

  const currentTheme = SEGMENT_THEMES[selectedCategory]

  return (
    <section id="catalog" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-theme-subtle">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-theme-elevated border border-theme-subtle text-theme-gold text-xs font-mono mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest">{t('catalog.title')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-theme-primary tracking-tight">
            {locale === 'ar' ? 'أسطول صالة العرض النخبوي' : 'SHOWROOM FLEET ALLOCATIONS'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-theme-muted max-w-2xl font-normal">
            {t('catalog.subtitle')}
          </p>
        </div>

        {/* Marque Quick-Filter Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectBrand(null)}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              selectedBrandId === null
                ? 'bg-theme-gold text-slate-950 font-bold shadow-sm'
                : 'bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-primary hover:border-theme-focus'
            }`}
          >
            {t('catalog.allMarques')}
          </button>
          {brands.map((brand) => {
            const isSelected = selectedBrandId === brand.id
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => onSelectBrand(isSelected ? null : brand.id)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-theme-gold text-slate-950 font-bold shadow-sm'
                    : 'bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-primary hover:border-theme-focus'
                }`}
              >
                <span>{brand.name}</span>
                {isSelected && <span className="text-[10px]">✕</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Editorial Segment Ribbon */}
      <div className="mb-8">
        {/* Segment Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-theme-subtle">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            const tabTheme = SEGMENT_THEMES[cat]
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2.5 rounded-[4px] text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isActive ? 'text-theme-primary font-bold' : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-catalog-segment-tab"
                    className="absolute inset-0 rounded-[4px] bg-theme-elevated border border-theme-subtle shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {isActive && <span className={`w-1.5 h-1.5 rounded-full ${tabTheme.pipColor}`} />}
                  <span>{t(`catalog.categories.${cat}`, cat)}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Architectural Segment Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`mt-4 rounded-[8px] p-6 bg-gradient-to-r ${currentTheme.gradient} border ${currentTheme.accentBorder} relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg`}
          >
            {/* Subtle Engineering Grid Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />

            {/* Ambient Background Faded Typography Silhouette with dynamic per-segment styling */}
            <div
              className={`absolute -end-6 -bottom-6 pointer-events-none select-none z-0 text-7xl sm:text-9xl uppercase whitespace-nowrap transition-all duration-500 ${currentTheme.watermarkColor} ${currentTheme.watermarkFont}`}
            >
              {currentTheme.label}
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-[4px] border font-bold ${currentTheme.badgeBg} ${currentTheme.badgeText}`}
                >
                  {t(`catalog.categories.${selectedCategory}`, selectedCategory)}
                </span>
                {activeBrand && (
                  <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-[4px] bg-black/60 border border-white/10 text-white/80">
                    {t('catalog.showingBrand')}: <span className="text-white font-bold">{activeBrand.name}</span>
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-100/95 leading-relaxed font-normal">
                {t(`catalog.segmentDescriptions.${selectedCategory}`)}
              </p>
            </div>

            {/* Segment Stock Counter & Reset Action */}
            <div className="relative z-10 flex items-center gap-5 shrink-0 border-t md:border-t-0 md:border-s border-white/10 pt-3 md:pt-0 md:ps-6">
              <div className="text-end">
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                  {motorcycles.length}
                </div>
                <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                  {t('marquesBar.modelsCount')}
                </div>
              </div>

              {(selectedBrandId !== null || selectedCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all')
                    onSelectBrand(null)
                  }}
                  className="px-3 py-1.5 rounded-[4px] text-xs font-mono uppercase tracking-wider text-theme-gold border border-white/15 hover:border-theme-gold bg-black/40 hover:bg-black/60 transition-all cursor-pointer"
                >
                  {t('catalog.clearFilter')}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Motorcycle Cards Grid */}
      {loading ? (
        /* Loading Skeleton matching 8px containers and 4px chips */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-[8px] bg-theme-elevated/40 border border-theme-subtle h-96 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="h-44 bg-theme-base/60 rounded-[4px]" />
              <div className="space-y-3">
                <div className="h-6 bg-theme-base/60 rounded-[4px] w-3/4" />
                <div className="h-16 bg-theme-base/40 rounded-[4px]" />
                <div className="h-8 bg-theme-base/60 rounded-[4px]" />
              </div>
            </div>
          ))}
        </div>
      ) : motorcycles.length > 0 ? (
        /* Render High-Density Dyno Cockpit Cards */
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {motorcycles.map((bike) => (
              <MotorcycleCard
                key={bike.id}
                motorcycle={bike}
                onSelectTelemetry={onSelectTelemetry}
                onBookRide={onBookRide}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-[8px] bg-theme-elevated/30 border border-dashed border-theme-subtle">
          <div className="w-12 h-12 mx-auto mb-3 rounded-[4px] bg-theme-base border border-theme-subtle flex items-center justify-center text-xl text-theme-gold">
            ⚡
          </div>
          <h3 className="text-base font-bold font-display text-theme-primary">
            {t('catalog.noModels')}
          </h3>
          <p className="mt-1 text-xs text-theme-muted max-w-md mx-auto">
            {locale === 'ar'
              ? 'جرّب إزالة التصفية الحالية لاستعراض طرازات المصنعين الآخرين.'
              : 'Try clearing the selected filters to view models from our other premier marques.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all')
              onSelectBrand(null)
            }}
            className="mt-5 px-5 py-2.5 rounded-[4px] bg-theme-gold text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
          >
            {t('catalog.clearFilter')}
          </button>
        </div>
      )}
    </section>
  )
}
