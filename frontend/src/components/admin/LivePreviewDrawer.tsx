import React, { useState } from 'react'
import type { CmsSettings } from '../../types'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Shield,
  Layers,
  MapPin,
  Bike,
  CalendarCheck2,
  ArrowRight,
} from 'lucide-react'
import { motion } from 'motion/react'

interface LivePreviewDrawerProps {
  draftSettings: CmsSettings
  isDirty: boolean
  onClose: () => void
}

export const LivePreviewDrawer: React.FC<LivePreviewDrawerProps> = ({
  draftSettings,
  isDirty,
  onClose,
}) => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')

  const headline = draftSettings.homepage_hero_headline || {
    prefix: 'PRECISION ENGINEERING',
    highlight: 'DESERT SOVEREIGNTY',
    subhead:
      'Official authorized distributor of the world’s most prestigious motorcycle marques across the Middle East.',
  }

  const visibility = draftSettings.section_visibility || {
    brand_marques_bar: true,
    featured_telemetry_showcase: true,
    catalog_filter_grid: true,
    test_ride_concierge_drawer: true,
    regional_showrooms_map: true,
  }

  const slideInitial = isRtl ? { x: '-100%', opacity: 0 } : { x: '100%', opacity: 0 }
  const slideExit = isRtl ? { x: '-100%', opacity: 0 } : { x: '100%', opacity: 0 }

  return (
    <motion.aside
      initial={slideInitial}
      animate={{ x: 0, opacity: 1 }}
      exit={slideExit}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="w-full xl:w-[500px] 2xl:w-[560px] shrink-0 border-s border-theme-subtle bg-theme-surface flex flex-col h-full shadow-2xl relative z-20 select-none overflow-hidden"
    >
      {/* Top Header & Viewport Switcher */}
      <div className="p-3.5 border-b border-theme-subtle flex items-center justify-between bg-theme-elevated/70">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-gold" />
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-theme-primary uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-theme-gold" />
            <span>{t('admin.livePreview', 'Live Preview')}</span>
          </div>
          {isDirty && (
            <span className="px-1.5 py-0.5 rounded-[3px] bg-theme-gold/15 text-theme-gold text-[9px] font-mono font-bold border border-theme-gold/30">
              {t('admin.draftStaged', 'Draft Staged')}
            </span>
          )}
        </div>

        {/* Device Mode Switcher & Minimize Button */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-theme-base p-0.5 rounded-[4px] border border-theme-subtle text-theme-muted">
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              title={t('admin.desktopView', 'Desktop View')}
              className={`p-1 rounded-[2px] transition-colors cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-theme-elevated text-theme-gold font-bold shadow-sm'
                  : 'hover:text-theme-primary'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              title={t('admin.mobileView', 'Mobile View')}
              className={`p-1 rounded-[2px] transition-colors cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-theme-elevated text-theme-gold font-bold shadow-sm'
                  : 'hover:text-theme-primary'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            title={t('admin.minimizePreview', 'Minimize Preview')}
            className="p-1 rounded-[4px] bg-theme-base hover:bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
          >
            {isRtl ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Preview Viewport Canvas (Adapts dynamically to Light/Dark Mode & RTL/LTR) */}
      <div className="flex-1 overflow-y-auto p-3.5 bg-slate-950/70 flex flex-col items-center justify-start">
        <div
          className={`w-full transition-all duration-300 rounded-[8px] border border-theme-subtle overflow-hidden bg-theme-base shadow-2xl relative flex flex-col ${
            deviceMode === 'mobile' ? 'max-w-[360px]' : 'max-w-full'
          }`}
        >
          {/* Simulated Browser Chrome Bar */}
          <div className="h-7 bg-slate-900 border-b border-theme-subtle/80 px-3 flex items-center justify-between text-[9px] font-mono text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
            <div className="truncate max-w-[190px] px-2 py-0.5 rounded bg-slate-950 border border-white/5 text-[9px] text-slate-300 flex items-center gap-1">
              <span className="text-theme-gold">https://</span>
              <span>motogroup.ae</span>
              <span className="text-slate-500">
                {deviceMode === 'mobile' ? ' (375px)' : ' (1440px)'}
              </span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[8px]">
              LIVE
            </span>
          </div>

          {/* Full-Page Sequential Showroom Mockup */}
          <div className="p-3 sm:p-4 space-y-4 bg-theme-base text-theme-primary transition-colors">
            {/* ------------------------------------------------------------- */}
            {/* BLOCK 1: STICKY NAVIGATION BAR */}
            {/* ------------------------------------------------------------- */}
            <div className="rounded-[6px] bg-theme-surface border border-theme-subtle p-2.5 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-[3px] bg-theme-elevated border border-theme-subtle flex items-center justify-center text-theme-gold">
                    <Shield className="w-3 h-3" />
                  </div>
                  <span className="font-display font-bold text-[10px] tracking-wide text-theme-primary">
                    MOTO GROUP
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[9px] font-mono">
                  <span className="hidden sm:inline text-theme-muted hover:text-theme-primary">
                    {t('nav.home', 'Showroom')}
                  </span>
                  <span className="hidden sm:inline text-theme-muted hover:text-theme-primary">
                    {t('nav.marques', 'Marques')}
                  </span>
                  <span className="hidden sm:inline text-theme-muted hover:text-theme-primary">
                    {t('nav.fleet', 'Fleet')}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-theme-gold text-slate-950 font-bold text-[8px] uppercase">
                    {t('nav.bookTestRide', 'Book Test Ride')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-theme-subtle/40 text-[8px] font-mono text-theme-muted">
                <span className="flex items-center gap-1">
                  <Layers className="w-2.5 h-2.5 text-theme-gold" />
                  <span>{t('admin.previewNav', 'Sticky Navigation Bar')}</span>
                </span>
                <span className="text-emerald-400 font-semibold uppercase">
                  {t('admin.sectionActive', 'Active')}
                </span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* BLOCK 2: AUTHORIZED MARQUES BAR */}
            {/* ------------------------------------------------------------- */}
            {visibility.brand_marques_bar ? (
              <div className="rounded-[6px] bg-theme-surface/90 border border-theme-subtle p-2.5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-theme-gold font-bold uppercase tracking-wider">
                    {t('marquesBar.title', 'Authorized Manufacturer Marquees')}
                  </span>
                  <span className="text-slate-400 text-[8px]">
                    4 {t('marquesBar.modelsCount', 'models')}
                  </span>
                </div>

                {/* 4 Marque Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] font-mono">
                  <div className="p-1.5 rounded-[4px] bg-theme-base border border-theme-subtle flex items-center justify-between">
                    <span className="font-bold text-red-500">DUCATI</span>
                    <span className="text-[8px] text-theme-muted">IT</span>
                  </div>
                  <div className="p-1.5 rounded-[4px] bg-theme-base border border-theme-subtle flex items-center justify-between">
                    <span className="font-bold text-blue-400">BMW</span>
                    <span className="text-[8px] text-theme-muted">DE</span>
                  </div>
                  <div className="p-1.5 rounded-[4px] bg-theme-base border border-theme-subtle flex items-center justify-between">
                    <span className="font-bold text-emerald-400">VESPA</span>
                    <span className="text-[8px] text-theme-muted">IT</span>
                  </div>
                  <div className="p-1.5 rounded-[4px] bg-theme-base border border-theme-subtle flex items-center justify-between">
                    <span className="font-bold text-amber-500">HARLEY</span>
                    <span className="text-[8px] text-theme-muted">US</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-theme-subtle/40 text-[8px] font-mono text-theme-muted">
                  <span className="flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5 text-theme-gold" />
                    <span>{t('admin.previewMarques', 'Authorized Marquees Bar')}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold uppercase">
                    {t('admin.sectionActive', 'Active')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-[6px] border border-dashed border-red-500/30 bg-red-500/5 p-2.5 flex items-center justify-between text-[9px] font-mono text-red-400/80">
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>
                    {t('admin.previewMarques', 'Authorized Marquees Bar')} —{' '}
                    {t('admin.sectionDisabled', 'Section Hidden in Storefront CMS')}
                  </span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-red-400">
                  {t('admin.off', 'OFF')}
                </span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* BLOCK 3: HERO SHOWCASE (LIVE REACTIVE COPY & TELEMETRY HUD) */}
            {/* ------------------------------------------------------------- */}
            {visibility.featured_telemetry_showcase ? (
              <div className="relative rounded-[8px] bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-theme-subtle p-4 overflow-hidden shadow-inner space-y-3">
                {/* Golden Ambient Blur Glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-theme-gold/10 rounded-full blur-2xl pointer-events-none" />

                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-theme-gold/15 border border-theme-gold/30 text-[9px] font-mono text-theme-gold font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>{t('admin.flagshipShowcase', 'GCC Flagship Showcase')}</span>
                </div>

                {/* Live Reactive Headlines */}
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                    {headline.prefix || 'PRECISION ENGINEERING'}
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-black text-theme-primary uppercase tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-theme-gold via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                      {headline.highlight || 'DESERT SOVEREIGNTY'}
                    </span>
                  </h3>
                </div>

                {/* Live Reactive Subhead */}
                <p className="text-[10px] font-sans text-slate-300/80 leading-relaxed max-w-sm line-clamp-2">
                  {headline.subhead ||
                    'Official authorized distributor of the world’s most prestigious motorcycle marques across the Middle East.'}
                </p>

                {/* Telemetry HUD Grid (Power, 0-100, Displacement) */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/10 font-mono text-center">
                  <div className="p-1 rounded-[3px] bg-slate-900/90 border border-white/5">
                    <div className="text-[8px] text-slate-400 uppercase">
                      {t('admin.power', 'Power')}
                    </div>
                    <div className="text-xs font-bold text-theme-gold">215.5 BHP</div>
                  </div>
                  <div className="p-1 rounded-[3px] bg-slate-900/90 border border-white/5">
                    <div className="text-[8px] text-slate-400 uppercase">
                      {t('admin.accel', '0-100')}
                    </div>
                    <div className="text-xs font-bold text-theme-primary">2.8s</div>
                  </div>
                  <div className="p-1 rounded-[3px] bg-slate-900/90 border border-white/5">
                    <div className="text-[8px] text-slate-400 uppercase">
                      {t('admin.displacement', 'Displacement')}
                    </div>
                    <div className="text-xs font-bold text-slate-300">1,103 CC</div>
                  </div>
                </div>

                {/* Dual CTAs Representation */}
                <div className="flex items-center gap-2 pt-1 text-[9px] font-mono">
                  <span className="px-2.5 py-1 rounded-[3px] bg-theme-gold text-slate-950 font-bold">
                    {t('admin.previewExploreFleet', 'Explore Showroom Fleet')}
                  </span>
                  <span className="px-2 py-1 rounded-[3px] bg-slate-800 text-slate-300 border border-white/10">
                    {t('admin.previewReserveSlot', 'Request Test Ride')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[8px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5 text-theme-gold" />
                    <span>{t('admin.previewHero', 'Hero Telemetry Showcase')}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold uppercase">
                    {t('admin.sectionActive', 'Active')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-[6px] border border-dashed border-red-500/30 bg-red-500/5 p-2.5 flex items-center justify-between text-[9px] font-mono text-red-400/80">
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>
                    {t('admin.previewHero', 'Hero Telemetry Showcase')} —{' '}
                    {t('admin.sectionDisabled', 'Section Hidden in Storefront CMS')}
                  </span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-red-400">
                  {t('admin.off', 'OFF')}
                </span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* BLOCK 4: MULTI-BRAND CATALOG FILTER & MOTORCYCLE CARDS GRID */}
            {/* ------------------------------------------------------------- */}
            {visibility.catalog_filter_grid ? (
              <div className="rounded-[8px] bg-theme-surface border border-theme-subtle p-3 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-xs text-theme-primary uppercase">
                      {t('catalog.title', 'Showroom Inventory')}
                    </div>
                    <div className="text-[9px] font-mono text-theme-muted">
                      {t('catalog.subtitle', 'Track-tested precision machinery engineered for the Gulf region.')}
                    </div>
                  </div>
                  <Bike className="w-3.5 h-3.5 text-theme-gold" />
                </div>

                {/* 4 Segment Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[8px] font-mono">
                  <span className="px-2 py-0.5 rounded-[3px] bg-theme-gold text-slate-950 font-bold shrink-0">
                    {t('catalog.categories.all', 'All Segments')}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-theme-base border border-theme-subtle text-theme-muted shrink-0">
                    {t('catalog.categories.Performance', 'Performance')}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-theme-base border border-theme-subtle text-theme-muted shrink-0">
                    {t('catalog.categories.Adventure & Touring', 'Adventure')}
                  </span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-theme-base border border-theme-subtle text-theme-muted shrink-0">
                    {t('catalog.categories.Urban Mobility', 'Urban')}
                  </span>
                </div>

                {/* 2x2 Miniature Motorcycle Cards Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Mini Card 1: Panigale V4 S */}
                  <div className="p-2 rounded-[5px] bg-theme-base border border-theme-subtle space-y-1.5 shadow-sm">
                    <div className="h-14 rounded-[3px] bg-slate-900/60 border border-theme-subtle flex items-center justify-center relative overflow-hidden">
                      <div className="w-10 h-6 bg-red-500/20 rounded border border-red-500/30 flex items-center justify-center text-[7px] font-mono text-red-400 font-bold">
                        V4 S
                      </div>
                      <span className="absolute top-1 start-1 px-1 py-0.2 rounded bg-theme-surface text-[7px] font-mono text-theme-gold">
                        DUCATI
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[9px] text-theme-primary truncate">
                        Panigale V4 S
                      </div>
                      <div className="text-[8px] font-mono text-theme-muted truncate">
                        145,000 AED · 215.5 BHP
                      </div>
                    </div>
                    {/* Animated Skeleton Shimmer Line */}
                    <div className="h-1.5 w-full rounded bg-theme-elevated overflow-hidden">
                      <div className="h-full w-2/3 bg-theme-gold/40 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Mini Card 2: BMW M 1000 RR */}
                  <div className="p-2 rounded-[5px] bg-theme-base border border-theme-subtle space-y-1.5 shadow-sm">
                    <div className="h-14 rounded-[3px] bg-slate-900/60 border border-theme-subtle flex items-center justify-center relative overflow-hidden">
                      <div className="w-10 h-6 bg-blue-500/20 rounded border border-blue-500/30 flex items-center justify-center text-[7px] font-mono text-blue-400 font-bold">
                        M RR
                      </div>
                      <span className="absolute top-1 start-1 px-1 py-0.2 rounded bg-theme-surface text-[7px] font-mono text-theme-gold">
                        BMW
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[9px] text-theme-primary truncate">
                        M 1000 RR
                      </div>
                      <div className="text-[8px] font-mono text-theme-muted truncate">
                        165,000 AED · 212 BHP
                      </div>
                    </div>
                    {/* Animated Skeleton Shimmer Line */}
                    <div className="h-1.5 w-full rounded bg-theme-elevated overflow-hidden">
                      <div className="h-full w-3/4 bg-blue-400/40 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Mini Card 3: Vespa GTS Super */}
                  <div className="p-2 rounded-[5px] bg-theme-base border border-theme-subtle space-y-1.5 shadow-sm">
                    <div className="h-14 rounded-[3px] bg-slate-900/60 border border-theme-subtle flex items-center justify-center relative overflow-hidden">
                      <div className="w-10 h-6 bg-emerald-500/20 rounded border border-emerald-500/30 flex items-center justify-center text-[7px] font-mono text-emerald-400 font-bold">
                        GTS
                      </div>
                      <span className="absolute top-1 start-1 px-1 py-0.2 rounded bg-theme-surface text-[7px] font-mono text-theme-gold">
                        VESPA
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[9px] text-theme-primary truncate">
                        GTS 300 Super
                      </div>
                      <div className="text-[8px] font-mono text-theme-muted truncate">
                        38,000 AED · 23.8 BHP
                      </div>
                    </div>
                    {/* Animated Skeleton Shimmer Line */}
                    <div className="h-1.5 w-full rounded bg-theme-elevated overflow-hidden">
                      <div className="h-full w-1/2 bg-emerald-400/40 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Mini Card 4: Harley Pan America */}
                  <div className="p-2 rounded-[5px] bg-theme-base border border-theme-subtle space-y-1.5 shadow-sm">
                    <div className="h-14 rounded-[3px] bg-slate-900/60 border border-theme-subtle flex items-center justify-center relative overflow-hidden">
                      <div className="w-10 h-6 bg-amber-500/20 rounded border border-amber-500/30 flex items-center justify-center text-[7px] font-mono text-amber-400 font-bold">
                        1250
                      </div>
                      <span className="absolute top-1 start-1 px-1 py-0.2 rounded bg-theme-surface text-[7px] font-mono text-theme-gold">
                        HARLEY
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[9px] text-theme-primary truncate">
                        Pan America
                      </div>
                      <div className="text-[8px] font-mono text-theme-muted truncate">
                        89,000 AED · 150 BHP
                      </div>
                    </div>
                    {/* Animated Skeleton Shimmer Line */}
                    <div className="h-1.5 w-full rounded bg-theme-elevated overflow-hidden">
                      <div className="h-full w-4/5 bg-amber-400/40 rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-theme-subtle/40 text-[8px] font-mono text-theme-muted">
                  <span className="flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5 text-theme-gold" />
                    <span>{t('admin.previewCatalog', 'Multi-Brand Fleet Catalog Grid')}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold uppercase">
                    {t('admin.sectionActive', 'Active')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-[6px] border border-dashed border-red-500/30 bg-red-500/5 p-2.5 flex items-center justify-between text-[9px] font-mono text-red-400/80">
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>
                    {t('admin.previewCatalog', 'Multi-Brand Fleet Catalog Grid')} —{' '}
                    {t('admin.sectionDisabled', 'Section Hidden in Storefront CMS')}
                  </span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-red-400">
                  {t('admin.off', 'OFF')}
                </span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* BLOCK 5: VIP TEST-RIDE CONCIERGE DRAWER & WIZARD */}
            {/* ------------------------------------------------------------- */}
            {visibility.test_ride_concierge_drawer ? (
              <div className="rounded-[8px] bg-theme-surface border border-theme-subtle p-3 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-display font-bold text-theme-primary">
                    <CalendarCheck2 className="w-3.5 h-3.5 text-theme-gold" />
                    <span>{t('testRide.drawerTitle', 'VIP Test Ride Concierge')}</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-theme-gold/15 text-theme-gold text-[8px] font-mono font-bold">
                    3-Step Wizard
                  </span>
                </div>

                {/* 3 Step Indicator Pills */}
                <div className="grid grid-cols-3 gap-1 text-[8px] font-mono text-center">
                  <div className="p-1 rounded bg-theme-base border border-emerald-500/30 text-emerald-400 font-bold">
                    ✓ 1. {t('testRide.steps.machine', 'Machine')}
                  </div>
                  <div className="p-1 rounded bg-theme-base border border-emerald-500/30 text-emerald-400 font-bold">
                    ✓ 2. {t('testRide.steps.schedule', 'Schedule')}
                  </div>
                  <div className="p-1 rounded bg-theme-gold text-slate-950 font-bold">
                    3. {t('testRide.steps.contact', 'VIP Contact')}
                  </div>
                </div>

                {/* Mini Boarding Pass Simulator */}
                <div className="p-2 rounded-[4px] bg-theme-base border border-theme-subtle flex items-center justify-between text-[8px] font-mono text-theme-muted">
                  <div>
                    <span className="text-theme-primary font-bold block">
                      Panigale V4 S · Dubai Flagship
                    </span>
                    <span>VIP Client Handoff via WhatsApp</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-theme-gold rtl:rotate-180" />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-theme-subtle/40 text-[8px] font-mono text-theme-muted">
                  <span className="flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5 text-theme-gold" />
                    <span>{t('admin.previewConcierge', 'VIP Test-Ride Concierge Wizard')}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold uppercase">
                    {t('admin.sectionActive', 'Active')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-[6px] border border-dashed border-red-500/30 bg-red-500/5 p-2.5 flex items-center justify-between text-[9px] font-mono text-red-400/80">
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>
                    {t('admin.previewConcierge', 'VIP Test-Ride Concierge Wizard')} —{' '}
                    {t('admin.sectionDisabled', 'Section Hidden in Storefront CMS')}
                  </span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-red-400">
                  {t('admin.off', 'OFF')}
                </span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* BLOCK 6: REGIONAL FLAGSHIP HUBS (DUBAI · RIYADH · DOHA) */}
            {/* ------------------------------------------------------------- */}
            {visibility.regional_showrooms_map ? (
              <div className="rounded-[8px] bg-theme-surface border border-theme-subtle p-3 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-xs text-theme-primary uppercase">
                      {t('dealers.title', 'Regional Dealership Boutiques')}
                    </div>
                    <div className="text-[8px] font-mono text-theme-muted">
                      Dubai · Riyadh · Doha Flagships
                    </div>
                  </div>
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                {/* City Switcher Tabs */}
                <div className="grid grid-cols-3 gap-1 text-[8px] font-mono text-center">
                  <div className="p-1 rounded bg-theme-gold text-slate-950 font-bold">
                    Dubai
                  </div>
                  <div className="p-1 rounded bg-theme-base border border-theme-subtle text-theme-muted">
                    Riyadh
                  </div>
                  <div className="p-1 rounded bg-theme-base border border-theme-subtle text-theme-muted">
                    Doha
                  </div>
                </div>

                {/* Boutique Info Card */}
                <div className="p-2 rounded-[4px] bg-theme-base border border-theme-subtle space-y-1 text-[8px] font-mono text-theme-muted">
                  <div className="text-theme-primary font-bold">
                    Sheikh Zayed Road, Exit 43 · Al Quoz 1
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Daily 10:00 - 22:00</span>
                    <span className="text-theme-gold font-bold">Directions ↗</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-theme-subtle/40 text-[8px] font-mono text-theme-muted">
                  <span className="flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5 text-theme-gold" />
                    <span>{t('admin.previewHubs', 'Regional Flagship Boutiques (Dubai · Riyadh · Doha)')}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold uppercase">
                    {t('admin.sectionActive', 'Active')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-[6px] border border-dashed border-red-500/30 bg-red-500/5 p-2.5 flex items-center justify-between text-[9px] font-mono text-red-400/80">
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>
                    {t('admin.previewHubs', 'Regional Flagship Boutiques')} —{' '}
                    {t('admin.sectionDisabled', 'Section Hidden in Storefront CMS')}
                  </span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-red-400">
                  {t('admin.off', 'OFF')}
                </span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* BLOCK 7: AUTOMOTIVE GROUP LEGAL FOOTER */}
            {/* ------------------------------------------------------------- */}
            <div className="rounded-[6px] bg-theme-surface/70 border border-theme-subtle p-2.5 space-y-1.5 shadow-sm text-[8px] font-mono text-theme-muted">
              <div className="flex items-center justify-between">
                <span>© MOTO GROUP · All rights reserved</span>
                <div className="flex items-center gap-1.5 text-theme-primary font-bold">
                  <span>{t('footer.privacy', 'Privacy')}</span>
                  <span>·</span>
                  <span>{t('footer.terms', 'Terms')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-theme-subtle/40">
                <span className="flex items-center gap-1">
                  <Layers className="w-2.5 h-2.5 text-theme-gold" />
                  <span>{t('admin.previewFooter', 'Automotive Group Legal Footer')}</span>
                </span>
                <span className="text-emerald-400 font-semibold uppercase">
                  {t('admin.sectionActive', 'Active')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Badge */}
      <div className="p-3 border-t border-theme-subtle bg-theme-surface/70 flex items-center justify-between text-[10px] font-mono text-theme-muted">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-theme-gold" />
          <span>{t('admin.realtimeDraft', 'Real-time local draft')}</span>
        </span>
        <span className="text-slate-400">{t('admin.requiresSave', 'Requires explicit save')}</span>
      </div>
    </motion.aside>
  )
}
