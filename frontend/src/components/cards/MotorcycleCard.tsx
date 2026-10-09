import React from 'react'
import type { Motorcycle } from '../../types'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../contexts/LocaleContext'
import { motion } from 'motion/react'

interface MotorcycleCardProps {
  motorcycle: Motorcycle
  onSelectTelemetry: (motorcycle: Motorcycle) => void
  onBookRide: (motorcycle: Motorcycle) => void
}

export const MotorcycleCard: React.FC<MotorcycleCardProps> = ({
  motorcycle,
  onSelectTelemetry,
  onBookRide,
}) => {
  const { t } = useTranslation()
  const { locale } = useLocale()

  // Format currency starting price
  const formattedPrice = Number(motorcycle.price_starting_at).toLocaleString(
    locale === 'ar' ? 'ar-AE' : 'en-US'
  )

  // Dyno power percentage
  const maxHorsepower = 220
  const hpPercent = Math.min(100, Math.round(((motorcycle.horsepower || 0) / maxHorsepower) * 100))

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between rounded-[8px] bg-gradient-to-b from-theme-elevated to-theme-surface border border-theme-subtle hover:border-theme-focus transition-all duration-300 shadow-xl overflow-hidden"
    >
      {/* Top Hairline Accent Highlight */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-theme-gold/30 to-transparent group-hover:via-theme-gold transition-all duration-300" />

      {/* Media Canvas */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black/60 flex items-center justify-center p-3 border-b border-theme-subtle">
        {/* Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {motorcycle.brand?.name && (
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-[4px] border border-theme-subtle backdrop-blur-md bg-theme-base/90 text-theme-gold font-bold">
                {motorcycle.brand.name}
              </span>
            )}
            {motorcycle.is_featured && (
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-[4px] bg-theme-gold-subtle text-theme-gold border border-theme-gold/30">
                ★ {locale === 'ar' ? 'مميز' : 'Featured'}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono uppercase text-theme-muted bg-theme-base/90 backdrop-blur-md px-2 py-0.5 rounded-[4px] border border-theme-subtle">
            {t(`catalog.categories.${motorcycle.category}`, motorcycle.category)}
          </span>
        </div>

        {/* Motorcycle Studio Image */}
        <img
          src={motorcycle.image_url}
          alt={motorcycle.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Displacement Tag */}
        {motorcycle.engine_cc ? (
          <div className="absolute bottom-2.5 end-3 z-10 px-2 py-0.5 rounded-[4px] bg-theme-base/90 backdrop-blur-md border border-theme-subtle text-xs font-mono text-white/90">
            <span className="telemetry-val font-bold">{motorcycle.engine_cc}</span>{' '}
            <span className="text-[10px] text-theme-muted">{t('catalog.displacement')}</span>
          </div>
        ) : (
          <div className="absolute bottom-2.5 end-3 z-10 px-2 py-0.5 rounded-[4px] bg-theme-base/90 backdrop-blur-md border border-theme-subtle text-xs font-mono text-emerald-400">
            <span>EV / {locale === 'ar' ? 'كهربائي' : 'Electric'}</span>
          </div>
        )}
      </div>

      {/* Main Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-5">
        <div>
          {/* Motorcycle Name & Tagline */}
          <h3 className="text-xl font-display font-bold text-theme-primary tracking-tight group-hover:text-theme-gold transition-colors">
            {motorcycle.name}
          </h3>
          {motorcycle.tagline && (
            <p className="mt-1 text-xs text-theme-muted line-clamp-1 italic">
              "{motorcycle.tagline}"
            </p>
          )}

          {/* Telemetry HUD Module */}
          <div className="mt-4 rounded-[4px] bg-theme-base/80 border border-theme-subtle p-3 grid grid-cols-3 gap-2">
            {/* Metric 1: Horsepower */}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-theme-muted uppercase tracking-wider">
                {t('catalog.power')}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono telemetry-val text-theme-primary">
                  {motorcycle.horsepower || '—'}
                </span>
                <span className="text-[10px] text-theme-muted">
                  {locale === 'ar' ? 'حصان' : 'bhp'}
                </span>
              </div>
              <div className="mt-1 h-1 w-full bg-theme-subtle rounded-[2px] overflow-hidden">
                <div
                  className="h-full bg-theme-gold rounded-[2px] transition-all duration-500"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Torque */}
            <div className="flex flex-col border-s border-theme-subtle ps-2">
              <span className="text-[10px] font-mono text-theme-muted uppercase tracking-wider">
                {t('catalog.torque')}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono telemetry-val text-theme-primary">
                  {motorcycle.torque_nm || '—'}
                </span>
                <span className="text-[10px] text-theme-muted">
                  {locale === 'ar' ? 'ن.م' : 'Nm'}
                </span>
              </div>
              <span className="mt-1 text-[9px] font-mono text-theme-muted line-clamp-1">
                {motorcycle.weight_kg ? `${motorcycle.weight_kg} kg` : 'Dry weight'}
              </span>
            </div>

            {/* Metric 3: Acceleration 0-100 */}
            <div className="flex flex-col border-s border-theme-subtle ps-2">
              <span className="text-[10px] font-mono text-theme-muted uppercase tracking-wider">
                {t('catalog.accel')}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-bold font-mono telemetry-val text-theme-primary">
                  {motorcycle.acceleration_0_100 || '—'}
                </span>
                <span className="text-[10px] text-theme-muted">
                  {locale === 'ar' ? 'ث' : 's'}
                </span>
              </div>
              <span className="mt-1 text-[9px] font-mono text-theme-muted line-clamp-1">
                {motorcycle.top_speed_kmh ? `${motorcycle.top_speed_kmh} km/h` : 'Top speed'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & Unified Actions */}
        <div className="pt-3 border-t border-theme-subtle flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-mono text-theme-muted uppercase">
              {t('catalog.startingAt')}
            </span>
            <div className="text-end">
              <span className="text-xs font-mono text-theme-muted me-1">
                {motorcycle.currency}
              </span>
              <span className="text-lg font-bold font-mono text-theme-primary telemetry-val tracking-tight">
                {formattedPrice}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelectTelemetry(motorcycle)}
              className="py-2.5 px-3 rounded-[4px] bg-theme-base border border-theme-subtle hover:border-theme-focus text-theme-primary font-semibold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center active:scale-[0.98] cursor-pointer"
            >
              <span>{t('catalog.viewSpecs')}</span>
            </button>
            <button
              type="button"
              onClick={() => onBookRide(motorcycle)}
              className="py-2.5 px-3 rounded-[4px] bg-theme-gold hover:brightness-110 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center shadow-md shadow-amber-500/10 active:scale-[0.98] cursor-pointer"
            >
              <span>{t('catalog.bookRide')}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
