import React, { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Shield, ArrowLeft } from 'lucide-react'

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (user) {
    const from = (location.state as any)?.from?.pathname || '/admin'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      const from = (location.state as any)?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-theme-base flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-[4px] bg-theme-surface border border-theme-subtle shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-xs font-mono text-theme-muted hover:text-theme-gold flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Showroom</span>
          </Link>
          <div className="w-8 h-8 rounded bg-theme-elevated flex items-center justify-center text-theme-gold">
            <Shield className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-2xl font-display font-bold text-theme-primary">Portal Login</h1>
        <p className="text-xs text-theme-muted mt-1 font-mono">
          Authorized personnel, group administrators & moderators
        </p>

        {error && (
          <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-theme-muted mb-1">
              Work Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@motogroup.com"
                className="w-full px-3 py-2.5 rounded-[4px] bg-theme-elevated border border-theme-subtle text-theme-primary text-sm focus:outline-none focus:border-theme-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-theme-muted mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-[4px] bg-theme-elevated border border-theme-subtle text-theme-primary text-sm focus:outline-none focus:border-theme-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-[4px] bg-theme-gold text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-theme-subtle text-center text-[11px] font-mono text-theme-muted">
          Demo: <span className="text-theme-gold">admin@motogroup.com</span> / <span className="text-theme-gold">password</span>
        </div>
      </div>
    </div>
  )
}
