import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Shield, Calendar, Menu, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLocale } from '../../contexts/LocaleContext'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { BrandLogo } from '../common/BrandLogo'

interface NavbarProps {
  onOpenTestRideDrawer?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTestRideDrawer }) => {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale } = useLocale()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auto-close mobile drawer when viewport expands to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-theme-subtle transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity / Logo */}
          <Link to="/" className="flex items-center group focus:outline-none" aria-label="Moto Group Home">
            <BrandLogo variant="mark" size="md" showText={true} />
          </Link>

          {/* Desktop Navigation Links with Directional Fill Animation */}
          <nav className="hidden lg:flex items-center gap-5">
            <a
              href="#marques"
              onClick={(e) => handleScrollTo(e, 'marques')}
              className="nav-fill-link group px-3.5 py-1.5 text-sm font-medium text-theme-muted hover:text-theme-primary cursor-pointer"
            >
              <span className="nav-fill-bg" aria-hidden="true" />
              <span className="nav-fill-line" aria-hidden="true" />
              <span className="relative z-10 transition-colors duration-200 group-hover:text-theme-gold">
                {t('nav.marques')}
              </span>
            </a>
            <a
              href="#catalog"
              onClick={(e) => handleScrollTo(e, 'catalog')}
              className="nav-fill-link group px-3.5 py-1.5 text-sm font-medium text-theme-muted hover:text-theme-primary cursor-pointer"
            >
              <span className="nav-fill-bg" aria-hidden="true" />
              <span className="nav-fill-line" aria-hidden="true" />
              <span className="relative z-10 transition-colors duration-200 group-hover:text-theme-gold">
                {t('nav.fleet')}
              </span>
            </a>
            <a
              href="#dealers"
              onClick={(e) => handleScrollTo(e, 'dealers')}
              className="nav-fill-link group px-3.5 py-1.5 text-sm font-medium text-theme-muted hover:text-theme-primary cursor-pointer"
            >
              <span className="nav-fill-bg" aria-hidden="true" />
              <span className="nav-fill-line" aria-hidden="true" />
              <span className="relative z-10 transition-colors duration-200 group-hover:text-theme-gold">
                {t('nav.dealers')}
              </span>
            </a>
          </nav>

          {/* Action Controls & Utilities */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('theme.toggleLight') : t('theme.toggleDark')}
              className="p-2.5 rounded-[4px] bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-gold hover:border-theme-gold/60 hover:shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all duration-200 focus:outline-none cursor-pointer"
              title={theme === 'dark' ? 'Light Mode (Desert Sand)' : 'Dark Mode (Obsidian)'}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </motion.div>
            </motion.button>

            {/* Hardware-Accelerated Segmented Language Switcher */}
            <div className="relative inline-flex items-center p-1 rounded-[6px] bg-theme-elevated border border-theme-subtle text-xs font-mono select-none">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`relative z-10 px-3 py-1 text-xs font-bold tracking-wider rounded-[4px] transition-all duration-150 focus:outline-none cursor-pointer hover:scale-[1.03] active:scale-95 ${
                  locale === 'en'
                    ? 'text-slate-950 font-extrabold'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {locale === 'en' && (
                  <motion.span
                    layoutId="active-locale-pill-desktop"
                    className="absolute inset-0 bg-theme-gold rounded-[4px] shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('ar')}
                className={`relative z-10 px-3 py-1 text-xs font-bold font-arabic rounded-[4px] transition-all duration-150 focus:outline-none cursor-pointer hover:scale-[1.03] active:scale-95 ${
                  locale === 'ar'
                    ? 'text-slate-950 font-extrabold'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {locale === 'ar' && (
                  <motion.span
                    layoutId="active-locale-pill-desktop"
                    className="absolute inset-0 bg-theme-gold rounded-[4px] shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                العربية
              </button>
            </div>

            {/* If Authenticated: Show Prominent Dashboard Button */}
            {user && (
              <Link
                to="/admin"
                className="btn-luxury-ghost flex items-center gap-2 px-3.5 py-2 rounded-[4px] border-theme-gold/40 text-xs font-mono text-theme-gold hover:bg-theme-gold/10 hover:border-theme-gold shadow-sm"
                title="Go to CMS Dashboard"
              >
                <Shield className="w-3.5 h-3.5 text-theme-gold" />
                <span className="font-semibold uppercase tracking-wider">
                  {user.role === 'admin' ? 'Dashboard' : `${user.brand?.name || 'Moderator'}`}
                </span>
              </Link>
            )}

            {/* VIP Test Ride CTA Button */}
            <button
              onClick={onOpenTestRideDrawer}
              className="btn-luxury-gold group flex items-center gap-2 px-5 py-2.5 rounded-[4px] text-xs tracking-wide uppercase shadow-sm focus:outline-none"
            >
              <Calendar className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>{t('nav.bookTestRide')}</span>
            </button>
          </div>

          {/* Mobile Controls (Theme, Language, Hamburger) */}
          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              onClick={toggleTheme}
              className="p-2 rounded-[4px] bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-gold hover:border-theme-gold/50 cursor-pointer transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Mobile Language Switcher */}
            <div className="relative inline-flex items-center p-0.5 rounded-[4px] bg-theme-elevated border border-theme-subtle text-xs font-mono select-none">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`relative z-10 px-2 py-1 text-[11px] font-bold rounded-[3px] transition-colors duration-150 cursor-pointer ${
                  locale === 'en' ? 'text-slate-950 font-bold' : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {locale === 'en' && (
                  <motion.span
                    layoutId="active-locale-pill-mobile"
                    className="absolute inset-0 bg-theme-gold rounded-[3px] shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('ar')}
                className={`relative z-10 px-2 py-1 text-[11px] font-bold font-arabic rounded-[3px] transition-colors duration-150 cursor-pointer ${
                  locale === 'ar' ? 'text-slate-950 font-bold' : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {locale === 'ar' && (
                  <motion.span
                    layoutId="active-locale-pill-mobile"
                    className="absolute inset-0 bg-theme-gold rounded-[3px] shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                عر
              </button>
            </div>

            {/* Animated Hamburger Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.06 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-[4px] bg-theme-elevated border border-theme-subtle text-theme-muted hover:text-theme-primary hover:border-theme-gold/50 focus:outline-none cursor-pointer transition-all"
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </motion.button>
          </div>

        </div>
      </div>

      {/* Animated Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden lg:hidden glass-panel border-t border-theme-subtle px-4 pt-3 pb-6 space-y-3"
          >
            <nav className="flex flex-col space-y-2">
              <a
                href="#marques"
                onClick={(e) => handleScrollTo(e, 'marques')}
                className="nav-fill-link group px-4 py-2.5 rounded text-sm text-theme-muted hover:text-theme-primary cursor-pointer w-full text-start"
              >
                <span className="nav-fill-bg" aria-hidden="true" />
                <span className="nav-fill-line" aria-hidden="true" />
                <span className="relative z-10 transition-colors duration-200 group-hover:text-theme-gold">
                  {t('nav.marques')}
                </span>
              </a>
              <a
                href="#catalog"
                onClick={(e) => handleScrollTo(e, 'catalog')}
                className="nav-fill-link group px-4 py-2.5 rounded text-sm text-theme-muted hover:text-theme-primary cursor-pointer w-full text-start"
              >
                <span className="nav-fill-bg" aria-hidden="true" />
                <span className="nav-fill-line" aria-hidden="true" />
                <span className="relative z-10 transition-colors duration-200 group-hover:text-theme-gold">
                  {t('nav.fleet')}
                </span>
              </a>
              <a
                href="#dealers"
                onClick={(e) => handleScrollTo(e, 'dealers')}
                className="nav-fill-link group px-4 py-2.5 rounded text-sm text-theme-muted hover:text-theme-primary cursor-pointer w-full text-start"
              >
                <span className="nav-fill-bg" aria-hidden="true" />
                <span className="nav-fill-line" aria-hidden="true" />
                <span className="relative z-10 transition-colors duration-200 group-hover:text-theme-gold">
                  {t('nav.dealers')}
                </span>
              </a>
              {user && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-luxury-ghost px-4 py-2.5 rounded border border-theme-gold/40 text-xs font-mono text-theme-gold flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-theme-gold" />
                    <span className="font-semibold uppercase tracking-wider">
                      {user.role === 'admin' ? 'Admin Dashboard' : `${user.brand?.name || 'Moderator'} Dashboard`}
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-theme-gold text-slate-950 font-bold uppercase">
                    {user.role}
                  </span>
                </Link>
              )}
            </nav>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                if (onOpenTestRideDrawer) onOpenTestRideDrawer()
              }}
              className="btn-luxury-gold w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-[4px] text-xs uppercase tracking-wider shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('nav.bookTestRide')}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
