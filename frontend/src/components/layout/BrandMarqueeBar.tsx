import React from 'react'
import { useTranslation } from 'react-i18next'
import type { Brand } from '../../types'
import { ChevronRight } from 'lucide-react'

interface BrandMarqueeBarProps {
  brands: Brand[]
  selectedBrandId: number | null
  onSelectBrand: (brandId: number | null) => void
  isLoading?: boolean
}

export const BrandMarqueeBar: React.FC<BrandMarqueeBarProps> = ({
  brands = [],
  selectedBrandId,
  onSelectBrand,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const safeBrands = Array.isArray(brands) ? brands : []

  return (
    <section id="marques" className="w-full py-8 border-b border-theme-subtle bg-theme-surface/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-theme-gold animate-pulse" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-theme-muted">
              {t('marquesBar.title')}
            </h2>
          </div>
          
          {/* Quick Clear / All Filter */}
          <button
            onClick={() => onSelectBrand(null)}
            className={`pill-interactive text-xs font-mono transition-colors focus:outline-none flex items-center gap-1.5 cursor-pointer ${
              selectedBrandId === null
                ? 'text-theme-gold font-bold'
                : 'text-theme-muted hover:text-theme-primary'
            }`}
          >
            <span>{t('marquesBar.all')}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-theme-elevated border border-theme-subtle">
              {safeBrands.reduce((acc, b) => acc + (b.motorcycles_count || 0), 0)}
            </span>
          </button>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-[4px] bg-theme-elevated/40 border border-theme-subtle animate-pulse"
              />
            ))
          ) : (
            safeBrands.map((brand) => {
              const isSelected = selectedBrandId === brand.id

              return (
                <button
                  key={brand.id}
                  onClick={() => onSelectBrand(isSelected ? null : brand.id)}
                  className={`relative p-5 rounded-[4px] text-start transition-all duration-200 group focus:outline-none border cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                    isSelected
                      ? 'bg-theme-elevated border-theme-gold ring-1 ring-theme-gold/30 shadow-lg'
                      : 'bg-theme-elevated/50 hover:bg-theme-elevated border-theme-subtle hover:border-theme-gold/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-theme-muted uppercase block">
                        {brand.origin_country || 'Official Marque'}
                      </span>
                      <h3 className="font-display font-bold text-lg text-theme-primary mt-1 group-hover:text-theme-gold transition-colors duration-200">
                        {brand.name}
                      </h3>
                    </div>

                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'bg-theme-gold text-slate-950'
                          : 'bg-theme-surface text-theme-muted group-hover:text-theme-gold group-hover:bg-theme-gold/10'
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </div>
                  </div>

                  {/* Tagline & Allocations Counter */}
                  <div className="mt-4 pt-3 border-t border-theme-subtle flex items-center justify-between text-xs">
                    <span className="text-theme-muted truncate max-w-[120px]">
                      {brand.tagline || 'Bespoke Engineering'}
                    </span>
                    <span className="text-[11px] font-semibold text-theme-gold bg-theme-gold-subtle px-2 py-0.5 rounded inline-flex items-center gap-1">
                      <span className="telemetry-val font-mono">{brand.motorcycles_count ?? 0}</span>
                      <span>{t('marquesBar.modelsCount')}</span>
                    </span>
                  </div>
                </button>
              )
            })
          )}
        </div>

      </div>
    </section>
  )
}
