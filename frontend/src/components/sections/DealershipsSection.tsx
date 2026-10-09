import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../contexts/LocaleContext'
import { motion, AnimatePresence } from 'motion/react'
import {
  ExternalLink,
  Sparkles,
  Camera,
  MapPin,
} from 'lucide-react'

export type CityKey = 'Dubai' | 'Riyadh' | 'Doha'

interface DealershipsSectionProps {
  onReserveLounge: (city: CityKey) => void
}

interface BoutiqueInfo {
  key: CityKey
  nameKey: string
  subtitleKey: string
  address: string
  hours: string
  phone: string
  architecturalCaption: string
  imageUrl: string
  mapsUrl: string
  mapEmbedUrl: string
}

export const DealershipsSection: React.FC<DealershipsSectionProps> = ({
  onReserveLounge,
}) => {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const [activeCity, setActiveCity] = useState<CityKey>('Doha')
  const [activeSlide, setActiveSlide] = useState<'image' | 'map'>('image')

  const boutiques: Record<CityKey, BoutiqueInfo> = {
    Dubai: {
      key: 'Dubai',
      nameKey: 'dealers.dubai.city',
      subtitleKey: 'dealers.dubai.country',
      address: 'Sheikh Zayed Road, Exit 43, Al Quoz 1',
      hours: 'Daily 10:00–22:00',
      phone: '+971 4 388 9000',
      architecturalCaption:
        locale === 'ar' ? 'تفاصيل معمارية · صالة دبي' : 'Architectural detail · Dubai flagship',
      imageUrl:
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      mapsUrl: 'https://maps.google.com/?q=Sheikh+Zayed+Road+Dubai+Al+Quoz',
      mapEmbedUrl:
        'https://maps.google.com/maps?q=Sheikh+Zayed+Road+Exit+43+Al+Quoz+1+Dubai&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    Riyadh: {
      key: 'Riyadh',
      nameKey: 'dealers.riyadh.city',
      subtitleKey: 'dealers.riyadh.country',
      address: 'King Fahd Road, Al Malqa District',
      hours: 'Daily 10:00–22:00',
      phone: '+966 11 450 8800',
      architecturalCaption:
        locale === 'ar' ? 'تفاصيل معمارية · صالة الرياض' : 'Architectural detail · Riyadh pavilion',
      imageUrl:
        'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80',
      mapsUrl: 'https://maps.google.com/?q=Al+Malqa+King+Fahd+Road+Riyadh',
      mapEmbedUrl:
        'https://maps.google.com/maps?q=King+Fahd+Road+Al+Malqa+District+Riyadh&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    Doha: {
      key: 'Doha',
      nameKey: 'dealers.doha.city',
      subtitleKey: 'dealers.doha.country',
      address: 'Porto Arabia, Tower 22, The Pearl-Qatar',
      hours: 'Daily 10:00–22:00',
      phone: '+974 44 888 123',
      architecturalCaption:
        locale === 'ar' ? 'تفاصيل معمارية · صالة اللؤلؤة' : 'Architectural detail · Doha boutique',
      imageUrl:
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80',
      mapsUrl: 'https://maps.google.com/?q=The+Pearl+Qatar+Porto+Arabia',
      mapEmbedUrl:
        'https://maps.google.com/maps?q=Porto+Arabia+Tower+22+The+Pearl+Qatar+Doha&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
  }

  const currentBoutique = boutiques[activeCity]

  return (
    <section id="dealers" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
      {/* Flagship Showroom Card Container (Stitch MCP 8px container) */}
      <div className="rounded-[8px] bg-theme-elevated border border-theme-subtle p-5 sm:p-7 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* =========================================================================
              LEFT COLUMN: Carousel Slider (Showroom Architecture vs Embedded Map)
              ========================================================================= */}
          <div className="lg:col-span-7 relative">
            <div className="rounded-[8px] overflow-hidden relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] bg-theme-base border border-theme-subtle group">
              {/* Media Switcher Floating Pill Header */}
              <div className="absolute top-3 end-3 z-20 flex items-center bg-slate-950/85 backdrop-blur-md p-1 rounded-[6px] border border-white/10 shadow-lg text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveSlide('image')}
                  className={`pill-interactive flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] transition-all cursor-pointer ${
                    activeSlide === 'image'
                      ? 'bg-theme-gold text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t('dealers.mediaPhoto', 'Showroom')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide('map')}
                  className={`pill-interactive flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] transition-all cursor-pointer ${
                    activeSlide === 'map'
                      ? 'bg-theme-gold text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('dealers.mediaMap', 'Interactive Map')}</span>
                </button>
              </div>

              {/* Slide Content Viewport with Motion Crossfade & Scale */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentBoutique.key}-${activeSlide}`}
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {activeSlide === 'image' ? (
                    <>
                      <img
                        src={currentBoutique.imageUrl}
                        alt={t(currentBoutique.nameKey, currentBoutique.key)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Subtle Obsidian Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />

                      {/* Architectural Detail Caption */}
                      <div className="absolute bottom-3.5 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                        <span className="text-[11px] font-mono text-slate-300/80 tracking-wide drop-shadow-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-theme-gold" />
                          {currentBoutique.architecturalCaption}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300/60 hidden sm:inline-block">
                          {currentBoutique.key} Flagship
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="relative w-full h-full bg-slate-950">
                      {/* Embedded Interactive Google Map */}
                      <iframe
                        src={currentBoutique.mapEmbedUrl}
                        title={`${currentBoutique.key} Flagship Location`}
                        className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />

                      {/* Subtle Map Overlay Caption */}
                      <div className="absolute bottom-3.5 left-4 right-16 z-10 flex items-center justify-between pointer-events-none">
                        <span className="text-[11px] font-mono text-slate-200/90 tracking-wide drop-shadow-md flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-[4px] border border-white/10">
                          <MapPin className="w-3.5 h-3.5 text-theme-gold shrink-0" />
                          <span className="truncate">{currentBoutique.address}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom Pagination Dots */}
              <div className="absolute bottom-3 end-4 z-20 flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveSlide('image')}
                  aria-label="Showroom Photo"
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === 'image' ? 'w-5 bg-theme-gold' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setActiveSlide('map')}
                  aria-label="Interactive Map"
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === 'map' ? 'w-5 bg-theme-gold' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: City Switcher & Boutique Details
              ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* City Switcher Pill Tabs (Stitch MCP 4px buttons) */}
            <div className="flex items-center gap-2 mb-6">
              {(['Dubai', 'Riyadh', 'Doha'] as CityKey[]).map((city) => {
                const isActive = activeCity === city
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setActiveCity(city)}
                    className={`pill-interactive px-4 py-1.5 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'btn-luxury-gold shadow-sm font-bold'
                        : 'btn-luxury-ghost text-theme-muted hover:text-theme-primary'
                    }`}
                  >
                    {t(`dealers.${city.toLowerCase()}.city`, city)}
                  </button>
                )
              })}
            </div>

            {/* Active Boutique Content Canvas */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBoutique.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-theme-primary tracking-tight">
                    {t(currentBoutique.nameKey, currentBoutique.key)}
                  </h3>
                  <p className="text-xs sm:text-sm text-theme-muted font-sans mt-1">
                    {t(currentBoutique.subtitleKey, `Flagship boutique · ${currentBoutique.key}`)}
                  </p>
                </div>

                <div className="pt-2 border-t border-theme-subtle/60">
                  <p className="text-xs sm:text-sm font-sans font-semibold text-theme-primary">
                    {t(`dealers.${currentBoutique.key.toLowerCase()}.address`, currentBoutique.address)}
                  </p>
                  <p className="text-xs font-mono text-theme-muted telemetry-val mt-1.5">
                    {t(`dealers.${currentBoutique.key.toLowerCase()}.hours`, currentBoutique.hours)} ·{' '}
                    <span className="text-theme-gold">{currentBoutique.phone}</span>
                  </p>
                </div>

                {/* Primary CTA: Reserve VIP Private Lounge */}
                <div className="pt-3 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => onReserveLounge(currentBoutique.key)}
                    className="btn-luxury-ghost group w-full py-3.5 px-5 rounded-[4px] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-theme-gold hover:text-theme-gold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-theme-gold transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
                    <span>{t('dealers.reserveLounge', 'Reserve the VIP private lounge')}</span>
                  </button>

                  {/* Secondary CTA: Directions */}
                  <a
                    href={currentBoutique.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury-ghost group w-full py-3 px-5 rounded-[4px] text-theme-muted hover:text-theme-primary font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span>{t('dealers.directions', 'Directions')}</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

