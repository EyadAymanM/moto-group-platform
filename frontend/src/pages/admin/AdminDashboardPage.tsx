import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useLocale } from '../../contexts/LocaleContext'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SidebarNav, type AdminTab } from '../../components/admin/SidebarNav'
import { OverviewView } from '../../components/admin/OverviewView'
import { InventoryTableView } from '../../components/admin/InventoryTableView'
import { LeadsTableView } from '../../components/admin/LeadsTableView'
import { CmsSettingsView } from '../../components/admin/CmsSettingsView'
import { api } from '../../services/api'
import type { Brand, Motorcycle, TestRideRequest, CmsSettings } from '../../types'
import { Loader2, Menu, Sun, Moon, Languages } from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { user, isLoading: authLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale } = useLocale()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [leads, setLeads] = useState<TestRideRequest[]>([])
  const [cmsSettings, setCmsSettings] = useState<CmsSettings | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  const isAdmin = user?.role === 'admin'
  const isModerator = user?.role === 'moderator'
  const moderatorBrandId = user?.brand_id || null

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en')
  }

  // Fetch initial admin datasets
  const fetchDashboardData = useCallback(async () => {
    setDataLoading(true)
    try {
      const [brandsRes, bikesRes, leadsRes, settingsRes] = await Promise.allSettled([
        api.getBrands(),
        api.admin.getMotorcycles(),
        api.admin.getTestRides(),
        api.getCmsSettings(),
      ])

      if (brandsRes.status === 'fulfilled') {
        setBrands(Array.isArray(brandsRes.value) ? brandsRes.value : [])
      }
      if (bikesRes.status === 'fulfilled') {
        setMotorcycles(Array.isArray(bikesRes.value) ? bikesRes.value : [])
      }
      if (leadsRes.status === 'fulfilled') {
        setLeads(Array.isArray(leadsRes.value) ? leadsRes.value : [])
      }
      if (settingsRes.status === 'fulfilled') {
        setCmsSettings(settingsRes.value)
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login')
      return
    }
    if (user) {
      fetchDashboardData()
    }
  }, [user, authLoading, navigate, fetchDashboardData])

  // Guard against moderators accessing CMS tab
  useEffect(() => {
    if (isModerator && activeTab === 'cms') {
      setActiveTab('overview')
    }
  }, [isModerator, activeTab])

  // Motorcycle CRUD Handlers
  const handleSaveMotorcycle = async (data: Partial<Motorcycle>, id?: number) => {
    if (id) {
      await api.admin.updateMotorcycle(id, data)
    } else {
      await api.admin.createMotorcycle(data)
    }
    const updated = await api.admin.getMotorcycles()
    setMotorcycles(Array.isArray(updated) ? updated : [])
  }

  const handleDeleteMotorcycle = async (id: number) => {
    await api.admin.deleteMotorcycle(id)
    setMotorcycles((prev) => prev.filter((m) => m.id !== id))
  }

  const handleToggleMotorcycleStatus = async (bike: Motorcycle) => {
    const updatedStatus = !bike.is_active
    await api.admin.updateMotorcycle(bike.id, { is_active: updatedStatus })
    setMotorcycles((prev) =>
      prev.map((m) => (m.id === bike.id ? { ...m, is_active: updatedStatus } : m))
    )
  }

  // Leads Status Handler
  const handleUpdateLeadStatus = async (id: number, status: string, notes?: string) => {
    await api.admin.updateTestRideStatus(id, status, notes)
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: status as TestRideRequest['status'] } : lead
      )
    )
  }

  // CMS Settings Save Handler
  const handleSaveCmsSettings = async (updated: Partial<CmsSettings>) => {
    if (updated.homepage_hero_headline) {
      await api.admin.updateCmsSetting(
        'homepage_hero_headline',
        updated.homepage_hero_headline
      )
    }
    if (updated.section_visibility) {
      await api.admin.updateCmsSetting(
        'section_visibility',
        updated.section_visibility
      )
    }
    const fresh = await api.getCmsSettings()
    setCmsSettings(fresh)
  }

  if (authLoading || (dataLoading && !user)) {
    return (
      <div className="min-h-screen bg-theme-base flex flex-col items-center justify-center text-theme-muted font-mono space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-theme-gold" />
        <span className="text-xs uppercase tracking-widest">
          {t('admin.authenticatingSession', 'Authenticating Sovereign Session...')}
        </span>
      </div>
    )
  }

  const pendingLeadsCount = leads.filter((l) => l.status === 'pending').length

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return t('admin.overview', 'Operations Overview')
      case 'inventory':
        return t('admin.inventory', 'Fleet Inventory')
      case 'leads':
        return t('admin.leads', 'VIP Test-Ride Leads')
      case 'cms':
        return t('admin.cms', 'Storefront CMS')
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary flex flex-col lg:flex-row overflow-x-hidden">
      {/* Technical Navigation Sidebar */}
      <SidebarNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        pendingLeadsCount={pendingLeadsCount}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Operations Canvas */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Operations Header Bar: Breadcrumb, Live Telemetry, Theme & Lang Switchers */}
        <header className="sticky top-0 z-30 px-5 py-3 sm:px-7 sm:py-3.5 bg-theme-surface/90 backdrop-blur-md border-b border-theme-subtle flex items-center justify-between gap-4 select-none">
          {/* Left: Mobile Hamburger & Active Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-[4px] bg-theme-base hover:bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
              title={t('admin.menuToggle', 'Toggle Navigation')}
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 truncate">
              <span className="font-mono text-[10px] text-theme-muted uppercase tracking-widest hidden sm:inline">
                {t('admin.topBarTitle', 'OPERATIONS COCKPIT')}
              </span>
              <span className="text-theme-muted hidden sm:inline font-mono text-xs">/</span>
              <span className="font-display font-bold text-xs sm:text-sm text-theme-primary truncate">
                {getTabTitle()}
              </span>
            </div>
          </div>

          {/* Right: Theme Toggle, Language Toggle & User Role */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={
                theme === 'dark'
                  ? t('theme.toggleLight', 'Switch to Light Mode')
                  : t('theme.toggleDark', 'Switch to Dark Mode')
              }
              className="p-2 rounded-[4px] bg-theme-base hover:bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-gold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-theme-gold" />
                  <span className="text-[10px] font-mono uppercase hidden sm:inline text-theme-primary">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-theme-gold" />
                  <span className="text-[10px] font-mono uppercase hidden sm:inline text-theme-primary">Dark</span>
                </>
              )}
            </button>

            {/* Quick Language Switcher Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={locale === 'en' ? 'تبديل للعربية' : 'Switch to English'}
              className="p-2 rounded-[4px] bg-theme-base hover:bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-primary transition-colors cursor-pointer font-mono text-[11px] font-bold flex items-center gap-1.5"
            >
              <Languages className="w-3.5 h-3.5 text-theme-gold" />
              <span>{locale === 'en' ? 'AR' : 'EN'}</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-5 sm:p-7 lg:p-8">
          {activeTab === 'overview' && (
            <OverviewView
              motorcycles={motorcycles}
              leads={leads}
              brands={brands}
              onNavigateTab={(tab) => setActiveTab(tab)}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTableView
              motorcycles={motorcycles}
              brands={brands}
              isAdmin={isAdmin}
              isModerator={isModerator}
              moderatorBrandId={moderatorBrandId}
              onRefresh={fetchDashboardData}
              onSaveMotorcycle={handleSaveMotorcycle}
              onDeleteMotorcycle={handleDeleteMotorcycle}
              onToggleStatus={handleToggleMotorcycleStatus}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsTableView
              leads={leads}
              onUpdateStatus={handleUpdateLeadStatus}
            />
          )}

          {activeTab === 'cms' && isAdmin && (
            <CmsSettingsView
              cmsSettings={cmsSettings}
              onSaveSettings={handleSaveCmsSettings}
            />
          )}
        </div>
      </main>
    </div>
  )
}
