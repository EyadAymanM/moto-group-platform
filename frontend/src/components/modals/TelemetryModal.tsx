import React, { useEffect, useState } from 'react'
import type { Motorcycle } from '../../types'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../contexts/LocaleContext'
import { motion, AnimatePresence } from 'motion/react'
import { X, Calendar, Gauge, Zap, Flame, Compass } from 'lucide-react'

interface TelemetryModalProps {
  motorcycle: Motorcycle | null
  onClose: () => void
  onBookRide: (motorcycle: Motorcycle) => void
}

export const TelemetryModal: React.FC<TelemetryModalProps> = ({
  motorcycle,
  onClose,
  onBookRide,
}) => {
  const { t } = useTranslation()
  const { locale } = useLocale()

  // Gallery active index state
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeColor, setActiveColor] = useState<string>('')

  // Reset image and selected colorway when motorcycle changes
  useEffect(() => {
    if (motorcycle) {
      setActiveImageIndex(0)
      setActiveColor(motorcycle.color_options?.[0] || '')
    }
  }, [motorcycle])

  // Escape key listener & Body scroll lock
  useEffect(() => {
    if (!motorcycle) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [motorcycle, onClose])

  if (!motorcycle) return null

  // Ensure images array has at least the main image
  const images = [
    motorcycle.image_url,
    ...(motorcycle.gallery_images || []).filter((url) => url !== motorcycle.image_url),
  ]

  const formattedPrice = Number(motorcycle.price_starting_at).toLocaleString(
    locale === 'ar' ? 'ar-AE' : 'en-US'
  )

  const specs = [
    {
      label: t('telemetry.engine'),
      val: motorcycle.engine_cc ? `${motorcycle.engine_cc} CC` : 'Electric EV',
      sub: motorcycle.engine_cc ? (locale === 'ar' ? 'سعة المحرك' : 'Displacement') : 'Zero-Emission',
      icon: <Zap className="w-4 h-4 text-theme-gold" />,
    },
    {
      label: t('telemetry.power'),
      val: motorcycle.horsepower ? `${motorcycle.horsepower} ${locale === 'ar' ? 'حصان' : 'BHP'}` : '—',
      sub: locale === 'ar' ? 'القوة القصوى' : 'Max Dyno Output',
      icon: <Flame className="w-4 h-4 text-theme-crimson" />,
    },
    {
      label: t('telemetry.torque'),
      val: motorcycle.torque_nm ? `${motorcycle.torque_nm} ${locale === 'ar' ? 'ن.م' : 'Nm'}` : '—',
      sub: locale === 'ar' ? 'عزم الدوران الأقصى' : 'Peak Torque',
      icon: <Gauge className="w-4 h-4 text-theme-gold" />,
    },
    {
      label: t('telemetry.accel'),
      val: motorcycle.acceleration_0_100 ? `${motorcycle.acceleration_0_100} ${locale === 'ar' ? 'ث' : 's'}` : '—',
      sub: '0 - 100 km/h',
      icon: <Compass className="w-4 h-4 text-theme-crimson" />,
    },
    {
      label: t('telemetry.topSpeed'),
      val: motorcycle.top_speed_kmh ? `${motorcycle.top_speed_kmh} km/h` : '—',
      sub: locale === 'ar' ? 'السرعة القصوى' : 'Track Homologated',
      icon: <Zap className="w-4 h-4 text-theme-gold" />,
    },
    {
      label: t('telemetry.weight'),
      val: motorcycle.weight_kg ? `${motorcycle.weight_kg} kg` : '—',
      sub: locale === 'ar' ? 'الوزن الجاف' : 'Dry Weight',
      icon: <Gauge className="w-4 h-4 text-theme-muted" />,
    },
    {
      label: t('telemetry.fuel'),
      val: motorcycle.fuel_capacity_liters ? `${motorcycle.fuel_capacity_liters} L` : '—',
      sub: locale === 'ar' ? 'سعة خزان الوقود' : 'Fuel Tank Capacity',
      icon: <Flame className="w-4 h-4 text-theme-gold" />,
    },
    {
      label: t('telemetry.seatHeight'),
      val: motorcycle.seat_height_mm ? `${motorcycle.seat_height_mm} mm` : '—',
      sub: locale === 'ar' ? 'ارتفاع المقعد' : 'Seat Height',
      icon: <Compass className="w-4 h-4 text-theme-muted" />,
    },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Acrylic Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
        />

        {/* Modal Window Container (Stitch 12px precision radius) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl rounded-[12px] bg-theme-elevated border border-theme-subtle shadow-2xl overflow-hidden my-auto z-10"
        >
          {/* Top Hairline Gold Highlight */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-theme-gold to-transparent" />

          {/* Modal Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-surface/60">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-gold font-bold">
                {motorcycle.brand?.name}
              </span>
              <h2 className="text-xs font-mono uppercase tracking-widest text-theme-muted">
                {t('telemetry.modalTitle')} // 2026
              </h2>
            </div>

            {/* Close Button (4px radius) */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-muted hover:text-theme-primary hover:border-theme-focus transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-h-[75vh] overflow-y-auto">
            {/* Left Column: Visual Gallery & Colorways */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Studio Canvas Display */}
              <div className="relative aspect-[16/10] rounded-[8px] bg-black/70 border border-theme-subtle overflow-hidden flex items-center justify-center p-4">
                <img
                  src={images[activeImageIndex] || motorcycle.image_url}
                  alt={motorcycle.name}
                  className="w-full h-full object-cover object-center transform transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 start-3 z-10">
                  <span className="text-[11px] font-mono text-white/90 bg-black/70 px-2.5 py-1 rounded-[4px] border border-white/10 backdrop-blur-md">
                    {motorcycle.category}
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails (if multiple images) */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-[4px] overflow-hidden border transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-theme-gold ring-1 ring-theme-gold'
                          : 'border-theme-subtle opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Factory Colorways Chips */}
              {motorcycle.color_options && motorcycle.color_options.length > 0 && (
                <div className="rounded-[8px] bg-theme-base/60 border border-theme-subtle p-3.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-theme-muted block mb-2">
                    {t('telemetry.colors')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {motorcycle.color_options.map((color) => {
                      const isSelected = activeColor === color
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setActiveColor(color)}
                          className={`px-2.5 py-1 rounded-[4px] text-xs font-mono transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-theme-gold text-slate-950 font-bold border border-theme-gold shadow-sm'
                              : 'bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-primary'
                          }`}
                        >
                          {color}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Engineering Blueprint / Description */}
              {motorcycle.description && (
                <p className="text-xs text-theme-muted leading-relaxed font-normal">
                  {motorcycle.description}
                </p>
              )}
            </div>

            {/* Right Column: Engineering Telemetry Matrix & Booking Action */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full gap-5">
              <div>
                {/* Title & Pricing Block */}
                <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-theme-subtle">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-theme-primary tracking-tight">
                      {motorcycle.name}
                    </h1>
                    {motorcycle.tagline && (
                      <p className="text-xs text-theme-muted italic mt-0.5">
                        "{motorcycle.tagline}"
                      </p>
                    )}
                  </div>
                  <div className="text-end shrink-0">
                    <span className="text-[10px] font-mono text-theme-muted block uppercase">
                      {t('catalog.startingAt')}
                    </span>
                    <span className="text-xl font-bold font-mono text-theme-primary telemetry-val">
                      {motorcycle.currency} {formattedPrice}
                    </span>
                  </div>
                </div>

                {/* 2-Column Telemetry Matrix Grid (Stitch Spec) */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {specs.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-[6px] bg-theme-base/80 border border-theme-subtle p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-theme-muted">
                          {item.label}
                        </span>
                        {item.icon}
                      </div>
                      <div className="mt-1">
                        <span className="text-base font-bold font-mono telemetry-val text-theme-primary">
                          {item.val}
                        </span>
                        <span className="text-[9px] font-mono text-theme-muted block mt-0.5">
                          {item.sub}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VIP Concierge Test Ride Trigger */}
              <div className="pt-4 border-t border-theme-subtle">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onBookRide(motorcycle)
                  }}
                  className="w-full py-3.5 px-4 rounded-[4px] bg-theme-gold hover:brightness-110 active:scale-[0.98] text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('telemetry.reserveBtn')}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
