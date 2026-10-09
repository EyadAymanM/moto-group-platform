import React from 'react'
import type { Motorcycle, TestRideRequest, Brand } from '../../types'
import { useTranslation } from 'react-i18next'
import {
  Bike,
  CalendarCheck2,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import type { AdminTab } from './SidebarNav'

interface OverviewViewProps {
  motorcycles: Motorcycle[]
  leads: TestRideRequest[]
  brands: Brand[]
  onNavigateTab: (tab: AdminTab) => void
  isAdmin: boolean
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  motorcycles,
  leads,
  brands,
  onNavigateTab,
  isAdmin,
}) => {
  const { t, i18n } = useTranslation()

  const pendingLeads = leads.filter((l) => l.status === 'pending')
  const confirmedLeads = leads.filter((l) => l.status === 'confirmed')
  const completedLeads = leads.filter((l) => l.status === 'completed')

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return t('admin.statusPending', 'Pending')
      case 'confirmed':
        return t('admin.statusConfirmed', 'Confirmed')
      case 'completed':
        return t('admin.statusCompleted', 'Completed')
      case 'cancelled':
        return t('admin.statusCancelled', 'Cancelled')
      default:
        return status
    }
  }

  const activeMotorcycles = motorcycles.filter((m) => m.is_active)
  const averageHorsepower =
    activeMotorcycles.length > 0
      ? Math.round(
          activeMotorcycles.reduce((acc, m) => acc + (m.horsepower || 0), 0) /
            activeMotorcycles.length
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Top Welcome & Operational Status Ribbon */}
      <div className="p-6 rounded-[8px] bg-theme-surface border border-theme-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-theme-muted uppercase tracking-widest">
              {t('admin.liveCockpit', 'Live Operations Cockpit')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-theme-primary mt-1">
            {t('admin.regionalOverview', 'Regional Automotive Overview')}
          </h2>
          <p className="text-xs text-theme-muted mt-1 max-w-xl">
            {t(
              'admin.regionalOverviewSubtitle',
              'Real-time telemetry, boutique inventory allocation, and VIP test-ride concierge bookings across the United Arab Emirates, Kingdom of Saudi Arabia, and State of Qatar.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('leads')}
            className="px-3.5 py-2 rounded-[4px] bg-theme-elevated hover:bg-theme-surface border border-theme-subtle text-xs font-mono text-theme-primary hover:text-theme-gold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t('admin.reviewLeads', 'Review Leads')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('inventory')}
            className="px-3.5 py-2 rounded-[4px] bg-theme-gold text-slate-950 font-bold hover:bg-theme-gold/90 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <span>{t('admin.fleetInventory', 'Fleet Inventory')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* 4-Column Technical KPI Cards (Stitch Tokens: 8px container, mono metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Fleet Models */}
        <div className="p-5 rounded-[8px] bg-theme-surface border border-theme-subtle space-y-2">
          <div className="flex items-center justify-between text-theme-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {t('admin.fleetInventory', 'Fleet Inventory')}
            </span>
            <Bike className="w-4 h-4 text-theme-gold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-theme-primary telemetry-val">
              {motorcycles.length}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              ({activeMotorcycles.length} {t('admin.active', 'active')})
            </span>
          </div>
          <p className="text-[11px] font-sans text-theme-muted">
            {t('admin.fleetInventoryDesc', 'Across authorized GCC distribution marques')}
          </p>
        </div>

        {/* KPI 2: VIP Concierge Inquiries */}
        <div className="p-5 rounded-[8px] bg-theme-surface border border-theme-subtle space-y-2">
          <div className="flex items-center justify-between text-theme-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {t('admin.pendingBookings', 'Pending Bookings')}
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-theme-primary telemetry-val">
              {pendingLeads.length}
            </span>
            <span className="text-xs font-mono text-amber-400">
              {t('admin.awaitingContact', 'awaiting dealer contact')}
            </span>
          </div>
          <p className="text-[11px] font-sans text-theme-muted">
            {confirmedLeads.length} {t('admin.confirmed', 'confirmed')} ·{' '}
            {completedLeads.length} {t('admin.completed', 'completed')}
          </p>
        </div>

        {/* KPI 3: Dyno Telemetry Average */}
        <div className="p-5 rounded-[8px] bg-theme-surface border border-theme-subtle space-y-2">
          <div className="flex items-center justify-between text-theme-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {t('admin.fleetPowerAvg', 'Fleet Power Avg')}
            </span>
            <TrendingUp className="w-4 h-4 text-theme-gold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-theme-primary telemetry-val">
              {averageHorsepower}
            </span>
            <span className="text-xs font-mono text-theme-gold">BHP</span>
          </div>
          <p className="text-[11px] font-sans text-theme-muted">
            {t('admin.fleetPowerAvgDesc', 'Engineering dyno benchmark across active showroom bikes')}
          </p>
        </div>

        {/* KPI 4: Sovereign Distribution Hubs */}
        <div className="p-5 rounded-[8px] bg-theme-surface border border-theme-subtle space-y-2">
          <div className="flex items-center justify-between text-theme-muted">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {t('admin.flagshipHubs', 'Flagship Hubs')}
            </span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-theme-primary telemetry-val">
              3
            </span>
            <span className="text-xs font-mono text-emerald-400">
              Dubai · Riyadh · Doha
            </span>
          </div>
          <p className="text-[11px] font-sans text-theme-muted">
            {t('admin.flagshipHubsDesc', 'Private VIP lounges & temperature-controlled dyno bays')}
          </p>
        </div>
      </div>

      {/* Two-Column Technical Feed: Recent Leads & Inventory Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent VIP Concierge Leads */}
        <div className="lg:col-span-7 rounded-[8px] bg-theme-surface border border-theme-subtle p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-theme-subtle/80 pb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="w-4 h-4 text-theme-gold" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-theme-primary">
                {t('admin.recentLeads', 'Recent VIP Concierge Leads')}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-mono text-theme-gold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t('admin.viewAll', 'View All')}</span>
              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-theme-muted">
              {t('admin.noLeads', 'No test ride bookings recorded yet.')}
            </div>
          ) : (
            <div className="space-y-2.5">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-[4px] bg-theme-elevated/70 border border-theme-subtle/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-theme-primary truncate">
                      {lead.customer_name}
                    </div>
                    <div className="text-[11px] font-mono text-theme-muted truncate mt-0.5">
                      {lead.motorcycle?.name || 'General Inquiry'} ·{' '}
                      <span className="text-theme-primary font-medium">{lead.preferred_city}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-[3px] text-[10px] font-mono uppercase tracking-wider font-bold ${
                        lead.status === 'confirmed'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : lead.status === 'completed'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : lead.status === 'cancelled'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {getStatusLabel(lead.status)}
                    </span>
                    <span className="text-[10px] font-mono text-theme-muted hidden sm:inline">
                      {new Date(lead.created_at).toLocaleDateString(
                        i18n.language === 'ar' ? 'ar-EG' : 'en-US'
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Marque Fleet Allocation Summary */}
        <div className="lg:col-span-5 rounded-[8px] bg-theme-surface border border-theme-subtle p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-theme-subtle/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-theme-gold" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-theme-primary">
                {t('admin.marqueDistribution', 'Marque Distribution')}
              </h3>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => onNavigateTab('cms')}
                className="text-xs font-mono text-theme-gold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{t('admin.cms', 'Storefront CMS')}</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {brands.map((brand) => {
              const brandBikes = motorcycles.filter((m) => m.brand_id === brand.id)
              return (
                <div
                  key={brand.id}
                  className="p-3 rounded-[4px] bg-theme-elevated/70 border border-theme-subtle/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-theme-gold" />
                    <div>
                      <div className="font-semibold text-xs text-theme-primary">
                        {brand.name}
                      </div>
                      <div className="text-[10px] font-mono text-theme-muted uppercase tracking-wider">
                        {brand.origin_country || t('admin.officialMarque', 'Official Marque')}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="font-mono text-sm font-bold text-theme-primary telemetry-val">
                      {brandBikes.length}
                    </span>
                    <span className="text-[10px] font-mono text-theme-muted block">
                      {t('admin.modelsInFleet', 'Models in Fleet')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
