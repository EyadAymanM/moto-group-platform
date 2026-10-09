import React, { useState, useEffect } from 'react'
import type { CmsSettings } from '../../types'
import { useTranslation } from 'react-i18next'
import {
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { LivePreviewDrawer } from './LivePreviewDrawer'
import { AnimatePresence } from 'motion/react'

interface CmsSettingsViewProps {
  cmsSettings: CmsSettings | null
  onSaveSettings: (updated: Partial<CmsSettings>) => Promise<void>
}

export const CmsSettingsView: React.FC<CmsSettingsViewProps> = ({
  cmsSettings,
  onSaveSettings,
}) => {
  const { t } = useTranslation()

  // Staging Draft State
  const [draftSettings, setDraftSettings] = useState<CmsSettings>({
    homepage_hero_headline: {
      prefix: 'PRECISION ENGINEERING',
      highlight: 'DESERT SOVEREIGNTY',
      subhead:
        'Official authorized distributor of the world’s most prestigious motorcycle marques across the Middle East.',
    },
    section_visibility: {
      brand_marques_bar: true,
      featured_telemetry_showcase: true,
      catalog_filter_grid: true,
      test_ride_concierge_drawer: true,
      regional_showrooms_map: true,
      vip_financing_section: true,
    },
  })

  const [isPreviewOpen, setIsPreviewOpen] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (cmsSettings) {
      setDraftSettings({
        homepage_hero_headline: cmsSettings.homepage_hero_headline || {
          prefix: 'PRECISION ENGINEERING',
          highlight: 'DESERT SOVEREIGNTY',
          subhead:
            'Official authorized distributor of the world’s most prestigious motorcycle marques across the Middle East.',
        },
        section_visibility: cmsSettings.section_visibility || {
          brand_marques_bar: true,
          featured_telemetry_showcase: true,
          catalog_filter_grid: true,
          test_ride_concierge_drawer: true,
          regional_showrooms_map: true,
          vip_financing_section: true,
        },
        regional_dealerships: cmsSettings.regional_dealerships,
      })
    }
  }, [cmsSettings])

  // Check dirty state
  const isDirty =
    JSON.stringify(draftSettings) !==
    JSON.stringify(
      cmsSettings || {
        homepage_hero_headline: {
          prefix: 'PRECISION ENGINEERING',
          highlight: 'DESERT SOVEREIGNTY',
          subhead:
            'Official authorized distributor of the world’s most prestigious motorcycle marques across the Middle East.',
        },
        section_visibility: {
          brand_marques_bar: true,
          featured_telemetry_showcase: true,
          catalog_filter_grid: true,
          test_ride_concierge_drawer: true,
          regional_showrooms_map: true,
          vip_financing_section: true,
        },
      }
    )

  const handleHeroChange = (field: 'prefix' | 'highlight' | 'subhead', value: string) => {
    setDraftSettings((prev) => ({
      ...prev,
      homepage_hero_headline: {
        ...prev.homepage_hero_headline,
        [field]: value,
      },
    }))
    setSaveSuccess(false)
    if (!isPreviewOpen) setIsPreviewOpen(true)
  }

  const handleVisibilityToggle = (
    key: keyof NonNullable<CmsSettings['section_visibility']>
  ) => {
    setDraftSettings((prev) => ({
      ...prev,
      section_visibility: {
        ...prev.section_visibility,
        [key]: !prev.section_visibility?.[key],
      },
    }))
    setSaveSuccess(false)
    if (!isPreviewOpen) setIsPreviewOpen(true)
  }

  const handleDiscard = () => {
    if (cmsSettings) {
      setDraftSettings({ ...cmsSettings })
    }
    setSaveSuccess(false)
    setErrorMessage(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setErrorMessage(null)
    try {
      await onSaveSettings(draftSettings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to persist CMS settings.')
    } finally {
      setSaving(false)
    }
  }

  const sectionsList: Array<{
    key: keyof NonNullable<CmsSettings['section_visibility']>
    label: string
    description: string
  }> = [
    {
      key: 'brand_marques_bar',
      label: t('admin.secBrandMarquesTitle', 'Brand Marques Seal Bar'),
      description: t(
        'admin.secBrandMarquesDesc',
        'Authorized distribution seals for Ducati, BMW Motorrad, Vespa & Harley-Davidson.'
      ),
    },
    {
      key: 'featured_telemetry_showcase',
      label: t('admin.secHeroTelemetryTitle', 'Hero Spotlight & Telemetry Ribbon'),
      description: t(
        'admin.secHeroTelemetryDesc',
        'Panigale V4 flagship showcase, dynamic headline, and live dyno benchmarks.'
      ),
    },
    {
      key: 'catalog_filter_grid',
      label: t('admin.secCatalogGridTitle', 'Multi-Brand Catalog Filter Grid'),
      description: t(
        'admin.secCatalogGridDesc',
        'Interactive motorcycle cards with segment filters and displacement specs.'
      ),
    },
    {
      key: 'test_ride_concierge_drawer',
      label: t('admin.secConciergeWizardTitle', 'VIP Test-Ride Concierge Wizard'),
      description: t(
        'admin.secConciergeWizardDesc',
        '3-stage guided reservation wizard and VIP Boarding Pass dialog.'
      ),
    },
    {
      key: 'regional_showrooms_map',
      label: t('admin.secRegionalMapTitle', 'Regional Flagship Hubs & Map Slider'),
      description: t(
        'admin.secRegionalMapDesc',
        'Architectural boutique gallery and embedded Google Maps for Dubai, Riyadh & Doha.'
      ),
    },
  ]

  return (
    <div className="flex flex-col xl:flex-row h-full gap-0 -m-5 sm:-m-7 lg:-m-8">
      {/* Left Column: Form Editor Canvas */}
      <div className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-subtle">
          <div>
            <h2 className="text-xl font-display font-bold text-theme-primary">
              {t('admin.cmsTitle', 'Storefront CMS & Component Visibility')}
            </h2>
            <p className="text-xs font-mono text-theme-muted mt-0.5">
              {t(
                'admin.cmsSubtitle',
                'Live staging environment · Real-time preview updates with explicit publish'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPreviewOpen((prev) => !prev)}
            className={`px-3 py-1.5 rounded-[4px] border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPreviewOpen
                ? 'bg-theme-gold/15 text-theme-gold border-theme-gold/30'
                : 'bg-theme-base text-theme-muted hover:text-theme-primary border-theme-subtle'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {isPreviewOpen
                ? t('admin.hidePreview', 'Hide Preview')
                : t('admin.showPreview', 'Show Live Preview')}
            </span>
          </button>
        </div>

        {/* Feedback Banners */}
        {saveSuccess && (
          <div className="p-3.5 rounded-[4px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {t(
                'admin.savedSuccess',
                'Storefront settings saved and published successfully to the public showroom!'
              )}
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-[4px] bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Part 1: Homepage Hero Copy Editor */}
        <div className="rounded-[8px] bg-theme-surface border border-theme-subtle p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-theme-subtle/80">
            <Sparkles className="w-4 h-4 text-theme-gold" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-theme-primary">
              {t('admin.heroSpotlightCopy', 'Homepage Hero Spotlight Copy')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-1.5">
                {t('admin.headlinePrefix', 'Eyebrow / Headline Prefix')}
              </label>
              <input
                type="text"
                value={draftSettings.homepage_hero_headline?.prefix || ''}
                onChange={(e) => handleHeroChange('prefix', e.target.value)}
                placeholder="PRECISION ENGINEERING"
                className="w-full h-10 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono focus:border-theme-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-gold mb-1.5">
                {t('admin.highlightTitle', 'Golden Highlight Title')}
              </label>
              <input
                type="text"
                value={draftSettings.homepage_hero_headline?.highlight || ''}
                onChange={(e) => handleHeroChange('highlight', e.target.value)}
                placeholder="DESERT SOVEREIGNTY"
                className="w-full h-10 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-gold text-xs font-mono font-bold focus:border-theme-gold outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-1.5">
                {t('admin.subheadCopy', 'Introductory Subhead Copy')}
              </label>
              <textarea
                rows={3}
                value={draftSettings.homepage_hero_headline?.subhead || ''}
                onChange={(e) => handleHeroChange('subhead', e.target.value)}
                placeholder="Official authorized distributor of the world’s most prestigious motorcycle marques..."
                className="w-full p-3 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-sans focus:border-theme-gold outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Part 2: Section Visibility Matrix */}
        <div className="rounded-[8px] bg-theme-surface border border-theme-subtle p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-theme-subtle/80">
            <Layers className="w-4 h-4 text-theme-gold" />
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-theme-primary">
              {t('admin.sectionVisibility', 'Public Showroom Section Visibility')}
            </h3>
          </div>

          <div className="divide-y divide-theme-subtle/60">
            {sectionsList.map((sec) => {
              const isEnabled = draftSettings.section_visibility?.[sec.key] !== false
              return (
                <div
                  key={sec.key}
                  className="py-3.5 flex items-center justify-between gap-4 first:pt-1 last:pb-1"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-theme-primary">
                      {sec.label}
                    </div>
                    <div className="text-[11px] font-sans text-theme-muted mt-0.5">
                      {sec.description}
                    </div>
                  </div>

                  {/* High-Contrast Luxury Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleVisibilityToggle(sec.key)}
                    role="switch"
                    aria-checked={isEnabled}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? 'bg-theme-gold' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Floating / Sticky Draft Staging Save Bar */}
        <div className="sticky bottom-0 z-10 p-4 rounded-[8px] bg-theme-elevated/95 backdrop-blur-md border border-theme-subtle shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            {isDirty ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 font-bold">
                  {t('admin.unsavedStaged', 'Unsaved Draft Changes Staged')}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-theme-muted">
                  {t('admin.allSynced', 'All Storefront Settings Synchronized')}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!isDirty || saving}
              className="px-3.5 py-2 rounded-[4px] bg-theme-base hover:bg-theme-surface border border-theme-subtle text-xs font-mono uppercase tracking-wider text-theme-muted hover:text-theme-primary transition-colors cursor-pointer disabled:opacity-40"
            >
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('admin.discard', 'Discard')}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="px-5 py-2 rounded-[4px] bg-theme-gold hover:bg-theme-gold/90 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-40 flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? t('admin.publishing', 'Publishing...') : t('admin.savePublish', 'Save & Publish')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview Drawer (Slide-Over with Framer Motion) */}
      <AnimatePresence>
        {isPreviewOpen && (
          <LivePreviewDrawer
            draftSettings={draftSettings}
            isDirty={isDirty}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
