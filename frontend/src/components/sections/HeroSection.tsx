import React from 'react'
import { useTranslation } from 'react-i18next'
import type { CmsSettings } from '../../types'
import { ScrollReveal } from '../common/ScrollReveal'
import { Sparkles, ArrowRight, Gauge, Zap, Compass, ShieldCheck } from 'lucide-react'

import { useLocale } from '../../contexts/LocaleContext'

interface HeroSectionProps {
  cmsSettings?: CmsSettings | null
  onExploreFleet?: () => void
  onBookTestRide?: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  cmsSettings,
  onExploreFleet,
  onBookTestRide,
}) => {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const isArabic = locale === 'ar'

  // In Arabic, use the native Arabic translation strings.
  // In English, use CMS settings (scrubbed of trailing punctuation) or fall back to English keys.
  const headlinePrefix = isArabic
    ? t('hero.titlePrefix')
    : (cmsSettings?.homepage_hero_headline?.prefix?.replace(/[.\s]+$/, '') || t('hero.titlePrefix'))

  const headlineHighlight = isArabic
    ? t('hero.titleHighlight')
    : (cmsSettings?.homepage_hero_headline?.highlight?.replace(/[.\s]+$/, '') || t('hero.titleHighlight'))

  const headlineSuffix = t('hero.titleSuffix')

  const subtitle = isArabic
    ? t('hero.subtitle')
    : (cmsSettings?.homepage_hero_headline?.subhead || t('hero.subtitle'))

  return (
    <section className="relative overflow-hidden pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Split Grid Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
        
        {/* Left Column: Editorial & Vision */}
        <div className="lg:col-span-7 flex flex-col items-start w-full">
          <ScrollReveal delay={0.05} direction="down">
            <div className="pill-interactive inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-theme-elevated border border-theme-subtle hover:border-theme-gold/40 mb-6 text-xs font-mono text-theme-gold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.badge')}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-display font-extrabold tracking-tight text-theme-primary leading-[1.12] max-w-full">
              {headlinePrefix}{' '}
              <span className="text-theme-gold relative inline-block">
                {headlineHighlight}
                <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-theme-gold/30 rounded-full" />
              </span>{' '}
              {headlineSuffix}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="mt-6 text-base sm:text-lg text-theme-muted leading-relaxed max-w-xl font-normal">
              {subtitle}
            </p>
          </ScrollReveal>

          {/* Dual VIP CTAs */}
          <ScrollReveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                onClick={onExploreFleet}
                className="btn-luxury-gold group px-6 py-3.5 rounded-[4px] text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <span>{t('hero.exploreFleet')}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5" />
              </a>

              <button
                type="button"
                onClick={onBookTestRide}
                className="btn-luxury-ghost px-6 py-3.5 rounded-[4px] text-xs uppercase tracking-wider font-semibold shadow-sm"
              >
                {t('hero.reserveSlot')}
              </button>
            </div>
          </ScrollReveal>

          {/* Trust Guarantees */}
          <ScrollReveal delay={0.25}>
            <div className="mt-10 flex items-center gap-6 text-xs font-mono text-theme-muted border-t border-theme-subtle pt-6 w-full">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-theme-gold" />
                <span>Authorized Distributor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Direct Factory Warranty</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Architectural Flagship Showcase Card */}
        <div className="lg:col-span-5 relative w-full max-w-md lg:max-w-none mx-auto">
          <ScrollReveal delay={0.2} direction="left">
            <div className="relative rounded-[8px] bg-gradient-to-b from-theme-elevated to-theme-surface border border-theme-subtle hover:border-theme-gold/50 p-6 overflow-hidden shadow-2xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] group transition-all duration-300">
              
              {/* Card Header & Marque Seal */}
              <div className="flex items-center justify-between border-b border-theme-subtle pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-theme-gold block">
                    FLAGSHIP SPOTLIGHT // 2026
                  </span>
                  <h3 className="font-display font-bold text-xl text-theme-primary mt-0.5 group-hover:text-theme-gold transition-colors duration-200">
                    Ducati Panigale V4 S
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded bg-theme-base border border-theme-subtle text-[11px] font-mono text-theme-muted">
                  Bologna, IT
                </div>
              </div>

              {/* Machinery Visual Profile */}
              <div className="relative my-6 flex items-center justify-center min-h-[220px]">
                <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <img
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"
                  alt="Ducati Panigale V4 S"
                  className="w-full h-48 object-cover rounded-[4px] filter saturate-[1.1] contrast-[1.05] group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />

                {/* Performance HUD badge */}
                <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-[4px] border border-white/10 text-white flex items-center gap-2 shadow-sm group-hover:border-theme-gold/40 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-mono tracking-wider uppercase font-bold">
                    Desmosedici Stradale
                  </span>
                </div>
              </div>

              {/* Floating Live Telemetry Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-theme-subtle">
                <div className="p-3 rounded-[4px] bg-theme-base border border-theme-subtle hover:border-theme-gold/40 hover:bg-theme-surface/80 hover:-translate-y-0.5 transition-all duration-200 text-center cursor-default">
                  <div className="flex items-center justify-center gap-1 text-theme-gold text-[10px] font-mono uppercase">
                    <Zap className="w-3 h-3" />
                    <span>Power</span>
                  </div>
                  <div className="font-mono font-bold text-base text-theme-primary mt-1 telemetry-val">
                    215.5 <span className="text-[10px] text-theme-muted font-normal">BHP</span>
                  </div>
                </div>

                <div className="p-3 rounded-[4px] bg-theme-base border border-theme-subtle hover:border-theme-crimson/40 hover:bg-theme-surface/80 hover:-translate-y-0.5 transition-all duration-200 text-center cursor-default">
                  <div className="flex items-center justify-center gap-1 text-theme-crimson text-[10px] font-mono uppercase">
                    <Gauge className="w-3 h-3" />
                    <span>0-100</span>
                  </div>
                  <div className="font-mono font-bold text-base text-theme-primary mt-1 telemetry-val">
                    2.8 <span className="text-[10px] text-theme-muted font-normal">SEC</span>
                  </div>
                </div>

                <div className="p-3 rounded-[4px] bg-theme-base border border-theme-subtle hover:border-theme-gold/40 hover:bg-theme-surface/80 hover:-translate-y-0.5 transition-all duration-200 text-center cursor-default">
                  <div className="flex items-center justify-center gap-1 text-theme-muted text-[10px] font-mono uppercase">
                    <Compass className="w-3 h-3" />
                    <span>Engine</span>
                  </div>
                  <div className="font-mono font-bold text-base text-theme-primary mt-1 telemetry-val">
                    1,103 <span className="text-[10px] text-theme-muted font-normal">CC</span>
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* Regional Showroom Metric Ribbon */}
      <ScrollReveal delay={0.3}>
        <div className="mt-16 pt-8 border-t border-theme-subtle grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-[4px] bg-theme-surface/40 hover:bg-theme-surface/80 border border-theme-subtle hover:border-theme-gold/40 hover:-translate-y-1 transition-all duration-200 shadow-sm cursor-default">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-theme-primary block telemetry-val">
              4
            </span>
            <span className="text-xs font-mono text-theme-muted uppercase tracking-wider mt-1 block">
              {t('hero.stats.marquesCount')}
            </span>
          </div>

          <div className="p-4 rounded-[4px] bg-theme-surface/40 hover:bg-theme-surface/80 border border-theme-subtle hover:border-theme-gold/40 hover:-translate-y-1 transition-all duration-200 shadow-sm cursor-default">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-theme-gold block telemetry-val">
              10+
            </span>
            <span className="text-xs font-mono text-theme-muted uppercase tracking-wider mt-1 block">
              {t('hero.stats.curatedModels')}
            </span>
          </div>

          <div className="p-4 rounded-[4px] bg-theme-surface/40 hover:bg-theme-surface/80 border border-theme-subtle hover:border-theme-gold/40 hover:-translate-y-1 transition-all duration-200 shadow-sm cursor-default">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-theme-primary block telemetry-val">
              3
            </span>
            <span className="text-xs font-mono text-theme-muted uppercase tracking-wider mt-1 block">
              {t('hero.stats.regionalHubs')} (DXB / RUH / DOH)
            </span>
          </div>

          <div className="p-4 rounded-[4px] bg-theme-surface/40 hover:bg-theme-surface/80 border border-theme-subtle hover:border-theme-crimson/40 hover:-translate-y-1 transition-all duration-200 shadow-sm cursor-default">
            <span className="text-2xl sm:text-3xl font-display font-extrabold text-theme-crimson block telemetry-val">
              100%
            </span>
            <span className="text-xs font-mono text-theme-muted uppercase tracking-wider mt-1 block">
              {t('hero.stats.dynoCertified')}
            </span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
