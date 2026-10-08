import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, LogOut, ArrowLeft } from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-base flex items-center justify-center text-theme-muted font-mono">
        Authenticating session...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary">
      {/* Simple Top Navigation */}
      <header className="h-16 border-b border-theme-subtle px-6 flex items-center justify-between bg-theme-surface">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xs font-mono text-theme-muted hover:text-theme-gold flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Showroom</span>
          </Link>
          <span className="text-theme-subtle">|</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-theme-gold" />
            <h1 className="font-display font-bold text-sm tracking-wide">
              CMS Operations Cockpit
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-theme-muted">
                {user.email} (
                <span className="text-theme-gold uppercase font-bold">{user.role}</span>
                {user.brand && ` - ${user.brand.name}`})
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded bg-theme-elevated text-theme-muted hover:text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="text-xs font-mono text-theme-gold hover:underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="p-8 rounded-[4px] bg-theme-surface border border-theme-subtle">
          <h2 className="text-xl font-display font-bold text-theme-primary">
            Admin Management Console (Phase 3)
          </h2>
          <p className="text-sm text-theme-muted mt-2">
            This operational dashboard is decoupled from the showroom. Full motorcycle inventory CRUD and lead management workflows will be implemented in Phase 3.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-5 rounded bg-theme-elevated border border-theme-subtle">
              <span className="text-xs font-mono text-theme-muted uppercase">Catalog Mode</span>
              <p className="text-lg font-bold text-theme-primary mt-1">10 Seeded Models</p>
              <span className="text-[11px] text-green-400 font-mono mt-1 block">API Active & Ready</span>
            </div>

            <div className="p-5 rounded bg-theme-elevated border border-theme-subtle">
              <span className="text-xs font-mono text-theme-muted uppercase">Test Ride Leads</span>
              <p className="text-lg font-bold text-theme-primary mt-1">4 Sample Leads</p>
              <span className="text-[11px] text-theme-gold font-mono mt-1 block">Dubai, Riyadh, Doha</span>
            </div>

            <div className="p-5 rounded bg-theme-elevated border border-theme-subtle">
              <span className="text-xs font-mono text-theme-muted uppercase">CMS Settings</span>
              <p className="text-lg font-bold text-theme-primary mt-1">Dynamic Headers</p>
              <span className="text-[11px] text-blue-400 font-mono mt-1 block">Customizable</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
