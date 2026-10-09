import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Bike,
  CalendarCheck2,
  SlidersHorizontal,
  ExternalLink,
  LogOut,
  Shield,
} from 'lucide-react'

export type AdminTab = 'overview' | 'inventory' | 'leads' | 'cms'

interface SidebarNavProps {
  activeTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  pendingLeadsCount?: number
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  pendingLeadsCount = 0,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  const isAdmin = user?.role === 'admin'

  const handleTabSelect = (tab: AdminTab) => {
    onSelectTab(tab)
    if (onCloseMobile) onCloseMobile()
  }

  const navItems: Array<{
    id: AdminTab
    labelKey: string
    defaultLabel: string
    icon: React.ElementType
    adminOnly?: boolean
    badge?: number | string
  }> = [
    {
      id: 'overview',
      labelKey: 'admin.overview',
      defaultLabel: 'Operations Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'inventory',
      labelKey: 'admin.inventory',
      defaultLabel: 'Fleet Inventory',
      icon: Bike,
    },
    {
      id: 'leads',
      labelKey: 'admin.leads',
      defaultLabel: 'VIP Test-Ride Leads',
      icon: CalendarCheck2,
      badge: pendingLeadsCount > 0 ? pendingLeadsCount : undefined,
    },
    {
      id: 'cms',
      labelKey: 'admin.cms',
      defaultLabel: 'Storefront CMS',
      icon: SlidersHorizontal,
      adminOnly: true,
    },
  ]

  const sidebarContent = (
    <>
      {/* Top Section: Marque Identity & User Profile */}
      <div className="p-5 border-b border-theme-subtle/80 space-y-4">
        {/* Operations Center Logo Seal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-theme-elevated border border-theme-subtle flex items-center justify-center text-theme-gold shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-wide text-theme-primary leading-tight">
                MOTO GROUP
              </div>
              <div className="font-mono text-[10px] text-theme-muted uppercase tracking-widest">
                {t('admin.cockpitTitle', 'Operations Cockpit')}
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-muted hover:text-theme-primary"
            >
              <LogOut className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>

        {/* User Identity & Role Badge */}
        {user && (
          <div className="p-3 rounded-[6px] bg-theme-base/80 border border-theme-subtle/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-theme-muted uppercase tracking-wider truncate max-w-[140px]">
                {user.email}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-[3px] text-[9px] font-mono uppercase tracking-wider font-bold ${
                  isAdmin
                    ? 'bg-theme-gold/15 text-theme-gold border border-theme-gold/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isAdmin
                  ? t('admin.groupAdmin', 'Group Admin')
                  : t('admin.moderator', 'Moderator')}
              </span>
            </div>
            {user.brand && (
              <div className="text-[11px] font-sans font-medium text-theme-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  {t('admin.marque', 'Marque')}: {user.brand.name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Section: Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-theme-muted/70">
          {t('admin.managementConsole', 'Management Console')}
        </div>
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[4px] text-xs font-sans transition-all cursor-pointer ${
                  isActive
                    ? 'bg-theme-elevated text-theme-gold font-semibold border-s-2 border-theme-gold shadow-sm'
                    : 'text-theme-muted hover:text-theme-primary hover:bg-theme-elevated/50 border-s-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-theme-gold' : 'text-theme-muted'
                    }`}
                  />
                  <span className="truncate">
                    {t(item.labelKey, item.defaultLabel)}
                  </span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
      </nav>

      {/* Bottom Section: Showroom Link & Sign Out */}
      <div className="p-4 border-t border-theme-subtle/80 space-y-2 bg-theme-surface/50">
        {/* Public Showroom Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-[4px] bg-theme-base hover:bg-theme-elevated border border-theme-subtle text-[11px] font-mono text-theme-muted hover:text-theme-primary transition-colors"
        >
          <span>{t('admin.showroom', 'Showroom')}</span>
          <ExternalLink className="w-3 h-3 text-theme-gold" />
        </Link>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[4px] bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('admin.signOut', 'Sign Out')}</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 sm:w-72 bg-theme-surface border-e border-theme-subtle flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[85vw] bg-theme-surface border-e border-theme-subtle flex flex-col justify-between h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
