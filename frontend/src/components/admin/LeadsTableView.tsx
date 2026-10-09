import React, { useState } from 'react'
import type { TestRideRequest } from '../../types'
import { useTranslation } from 'react-i18next'
import {
  Search,
  MessageCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
} from 'lucide-react'

interface LeadsTableViewProps {
  leads: TestRideRequest[]
  onUpdateStatus: (id: number, status: string, adminNotes?: string) => Promise<void>
}

export const LeadsTableView: React.FC<LeadsTableViewProps> = ({
  leads,
  onUpdateStatus,
}) => {
  const { t, i18n } = useTranslation()

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedCity, setSelectedCity] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [activeNotesLead, setActiveNotesLead] = useState<TestRideRequest | null>(null)

  const filteredLeads = leads.filter((lead) => {
    if (selectedStatus !== 'ALL' && lead.status !== selectedStatus) {
      return false
    }
    if (selectedCity !== 'ALL' && lead.preferred_city !== selectedCity) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = lead.customer_name.toLowerCase().includes(q)
      const matchEmail = lead.email.toLowerCase().includes(q)
      const matchPhone = lead.phone.toLowerCase().includes(q)
      const matchBike = lead.motorcycle?.name.toLowerCase().includes(q) || false
      if (!matchName && !matchEmail && !matchPhone && !matchBike) return false
    }
    return true
  })

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    setUpdatingId(leadId)
    try {
      await onUpdateStatus(leadId, newStatus)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      case 'completed':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      case 'cancelled':
        return 'bg-red-500/15 text-red-400 border-red-500/30'
      default:
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    }
  }

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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-theme-subtle">
        <div>
          <h2 className="text-xl font-display font-bold text-theme-primary">
            {t('admin.leadsTitle', 'VIP Test-Ride Concierge Leads')}
          </h2>
          <p className="text-xs font-mono text-theme-muted mt-0.5">
            {filteredLeads.length}{' '}
            {t(
              'admin.leadsSubtitle',
              'bookings indexed · Real-time pipeline & direct dealer WhatsApp handoff'
            )}
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-[6px] bg-theme-surface border border-theme-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(
            (status) => {
              const count =
                status === 'ALL'
                  ? leads.length
                  : leads.filter((l) => l.status === status).length
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    selectedStatus === status
                      ? 'bg-theme-gold text-slate-950 font-bold shadow-sm'
                      : 'bg-theme-base text-theme-muted hover:text-theme-primary border border-theme-subtle'
                  }`}
                >
                  {status === 'ALL' ? 'ALL' : getStatusLabel(status)} ({count})
                </button>
              )
            }
          )}
        </div>

        {/* City Filter & Search */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-9 px-3 rounded-[4px] bg-theme-base border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none cursor-pointer"
          >
            <option value="ALL">{t('admin.allHubs', 'All Hubs (GCC)')}</option>
            <option value="Dubai">{t('dealers.dubai.city', 'Dubai')}</option>
            <option value="Riyadh">{t('dealers.riyadh.city', 'Riyadh')}</option>
            <option value="Doha">{t('dealers.doha.city', 'Doha')}</option>
          </select>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-theme-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('admin.searchLeadsPlaceholder', 'Search client, email, phone...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 ps-8 pe-3 rounded-[4px] bg-theme-base border border-theme-subtle text-xs font-mono text-theme-primary focus:border-theme-gold outline-none"
            />
          </div>
        </div>
      </div>

      {/* High-Density Leads Table */}
      <div className="rounded-[8px] bg-theme-surface border border-theme-subtle overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-theme-subtle/80 bg-theme-base/60 text-[10px] font-mono uppercase tracking-wider text-theme-muted">
                <th className="py-3 px-4 text-start">{t('admin.thLeadRef', 'Lead Ref / Date')}</th>
                <th className="py-3 px-4 text-start">{t('admin.thClient', 'Client Dossier')}</th>
                <th className="py-3 px-4 text-start">{t('admin.thRequested', 'Requested Machine')}</th>
                <th className="py-3 px-4 text-start">{t('admin.thHubDate', 'Hub / Session Date')}</th>
                <th className="py-3 px-4 text-center">{t('admin.thPipeline', 'Pipeline Status')}</th>
                <th className="py-3 px-4 text-end">{t('admin.thContact', 'Concierge Contact')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-subtle/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-mono text-theme-muted">
                    {t('admin.noLeadsFound', 'No concierge booking leads found for the selected criteria.')}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, '')
                  const waGreeting = encodeURIComponent(
                    `Hello ${lead.customer_name}, this is the MOTO GROUP VIP Concierge regarding your test ride reservation for the ${
                      lead.motorcycle?.name || 'motorcycle'
                    } at our ${lead.preferred_city} boutique.`
                  )
                  const waLink = `https://wa.me/${cleanPhone}?text=${waGreeting}`

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-theme-elevated/40 transition-colors group"
                    >
                      {/* Ref ID & Created Date */}
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-theme-gold">
                          #MG-VIP-{String(lead.id).padStart(4, '0')}
                        </span>
                        <div className="text-[10px] text-theme-muted flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(lead.created_at).toLocaleDateString(
                              i18n.language === 'ar' ? 'ar-EG' : 'en-US'
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-theme-primary flex items-center gap-1.5">
                          <User className="w-3 h-3 text-theme-gold shrink-0" />
                          <span>{lead.customer_name}</span>
                        </div>
                        <div className="text-[11px] font-mono text-theme-muted flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[160px]">{lead.email}</span>
                        </div>
                        <div className="text-[11px] font-mono text-theme-muted flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span className="telemetry-val">{lead.phone}</span>
                        </div>
                      </td>

                      {/* Machine & Marque */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-theme-primary">
                          {lead.motorcycle?.name || 'General Fleet Inquiry'}
                        </div>
                        <div className="text-[10px] font-mono text-theme-gold uppercase tracking-wider">
                          {lead.brand?.name || t('admin.officialMarque', 'Authorized Marque')}
                        </div>
                        {lead.experience_level && (
                          <span className="inline-block px-1.5 py-0.5 rounded-[2px] bg-theme-base border border-theme-subtle text-[9px] font-mono text-theme-muted mt-1">
                            {t(`testRide.levels.${lead.experience_level}`, lead.experience_level)}
                          </span>
                        )}
                      </td>

                      {/* Flagship Hub & Session Date */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-theme-primary flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-theme-gold shrink-0" />
                          <span>
                            {t(`dealers.${lead.preferred_city.toLowerCase()}.city`, lead.preferred_city)}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-theme-muted flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span className="telemetry-val">{lead.preferred_date || 'Date Pending'}</span>
                        </div>
                        {lead.notes && (
                          <button
                            type="button"
                            onClick={() => setActiveNotesLead(lead)}
                            className="text-[10px] font-mono text-theme-gold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span>{t('admin.viewNotes', 'View Notes')}</span>
                          </button>
                        )}
                      </td>

                      {/* Status Switcher Select */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-block relative">
                          <select
                            disabled={updatingId === lead.id}
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-[4px] text-[10px] font-mono uppercase tracking-wider font-bold border outline-none cursor-pointer disabled:opacity-50 ${getStatusBadgeClass(
                              lead.status
                            )}`}
                          >
                            <option value="pending" className="bg-theme-surface text-amber-500">
                              {t('admin.statusPending', 'Pending')}
                            </option>
                            <option value="confirmed" className="bg-theme-surface text-emerald-500">
                              {t('admin.statusConfirmed', 'Confirmed')}
                            </option>
                            <option value="completed" className="bg-theme-surface text-blue-500">
                              {t('admin.statusCompleted', 'Completed')}
                            </option>
                            <option value="cancelled" className="bg-theme-surface text-red-500">
                              {t('admin.statusCancelled', 'Cancelled')}
                            </option>
                          </select>
                        </div>
                      </td>

                      {/* Concierge WhatsApp CTA */}
                      <td className="py-3 px-4 text-end">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Contact client via official WhatsApp Concierge"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{t('admin.whatsApp', 'WhatsApp')}</span>
                        </a>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Modal Dialog */}
      {activeNotesLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[8px] bg-theme-elevated border border-theme-subtle p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-theme-gold" />
                <h4 className="font-display font-bold text-sm uppercase tracking-wider text-theme-primary">
                  {t('admin.notesTitle', 'Client Notes')} · #MG-VIP-{String(activeNotesLead.id).padStart(4, '0')}
                </h4>
              </div>
            </div>
            <div className="p-3.5 rounded-[4px] bg-theme-base border border-theme-subtle text-xs font-mono text-theme-muted leading-relaxed whitespace-pre-wrap">
              {activeNotesLead.notes || t('admin.noNotes', 'No special requests submitted.')}
            </div>
            <div className="text-end pt-2">
              <button
                type="button"
                onClick={() => setActiveNotesLead(null)}
                className="px-4 py-1.5 rounded-[4px] bg-theme-base border border-theme-subtle text-xs font-mono text-theme-primary hover:border-theme-gold cursor-pointer"
              >
                {t('admin.close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
