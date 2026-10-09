import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../contexts/LocaleContext'
import { Link } from 'react-router-dom'
import { ShieldCheck, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export const Footer: React.FC = () => {
  const { t } = useTranslation()
  const { locale, setLocale } = useLocale()

  const [popover, setPopover] = useState<'privacy' | 'terms' | null>(null)
  const popoverContainerRef = useRef<HTMLDivElement>(null)

  // Dismiss popover on outside click or Escape key
  useEffect(() => {
    if (!popover) return

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (
        popoverContainerRef.current &&
        !popoverContainerRef.current.contains(e.target as Node)
      ) {
        setPopover(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopover(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [popover])

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en')
  }

  return (
    <footer className="border-t border-theme-subtle/70 bg-theme-base/90 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-theme-muted">
          {/* =========================================================================
              LEFT: Group Name · Regional Cities & Copyright
              ========================================================================= */}
          <div className="text-center sm:text-start space-y-1">
            <p className="font-semibold text-theme-primary">
              MOTO GROUP · Dubai · Riyadh · Doha
            </p>
            <p className="font-mono text-[11px] text-theme-muted">
              © {new Date().getFullYear()} MOTO GROUP. {t('footer.rights', 'All rights reserved.')}
            </p>
          </div>

          {/* =========================================================================
              RIGHT: Language Switcher, Privacy, Terms & Admin Portal
              ========================================================================= */}
          <div
            ref={popoverContainerRef}
            className="relative flex items-center gap-3 font-mono text-xs text-theme-muted"
          >
            {/* Interactive Language Switcher Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-theme-primary hover:text-theme-gold transition-colors font-bold cursor-pointer"
            >
              EN | العربية
            </button>

            <span className="text-theme-subtle">·</span>

            {/* Privacy Popover Trigger */}
            <button
              type="button"
              onClick={() => setPopover(prev => (prev === 'privacy' ? null : 'privacy'))}
              aria-expanded={popover === 'privacy'}
              className={`transition-colors cursor-pointer ${
                popover === 'privacy'
                  ? 'text-theme-gold font-bold underline underline-offset-4 decoration-theme-gold/60'
                  : 'hover:text-theme-primary'
              }`}
            >
              {t('footer.privacy', 'Privacy')}
            </button>

            <span className="text-theme-subtle">·</span>

            {/* Terms Popover Trigger */}
            <button
              type="button"
              onClick={() => setPopover(prev => (prev === 'terms' ? null : 'terms'))}
              aria-expanded={popover === 'terms'}
              className={`transition-colors cursor-pointer ${
                popover === 'terms'
                  ? 'text-theme-gold font-bold underline underline-offset-4 decoration-theme-gold/60'
                  : 'hover:text-theme-primary'
              }`}
            >
              {t('footer.terms', 'Terms')}
            </button>

            <span className="text-theme-subtle">·</span>

            {/* Subtle Dealer & Moderator Portal Access */}
            <Link
              to="/admin/login"
              className="hover:text-theme-gold transition-colors text-[11px] opacity-80 hover:opacity-100"
            >
              {t('footer.adminAccess', 'Portal')}
            </Link>

            {/* =========================================================================
                POPOVER: Floating Luxury Legal Content Panel
                ========================================================================= */}
            <AnimatePresence>
              {popover && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  role="dialog"
                  aria-modal="false"
                  aria-label={popover === 'privacy' ? t('footer.privacyTitle') : t('footer.termsTitle')}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:end-0 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] rounded-[8px] bg-theme-elevated/98 backdrop-blur-md border border-theme-subtle shadow-2xl shadow-black/70 p-4 sm:p-5 z-50 text-start space-y-3.5"
                >
                  {/* Subtle Anchor Caret pointing to active button */}
                  <div
                    aria-hidden="true"
                    className={`hidden sm:block absolute -bottom-1.5 w-3 h-3 bg-theme-elevated border-b border-e border-theme-subtle transform rotate-45 transition-all duration-200 ${
                      popover === 'terms' ? 'end-16' : 'end-28'
                    }`}
                  />

                  {/* Header: Title + Switcher Tabs + Close Button */}
                  <div className="flex items-center justify-between border-b border-theme-subtle/80 pb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck className="w-4 h-4 text-theme-gold shrink-0" />
                      <h4 className="text-xs font-bold font-display uppercase tracking-wider text-theme-primary truncate">
                        {popover === 'privacy' ? t('footer.privacyTitle') : t('footer.termsTitle')}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Document Quick Switcher Tabs */}
                      <div className="flex items-center bg-theme-base p-0.5 rounded-[4px] border border-theme-subtle/80 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setPopover('privacy')}
                          className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                            popover === 'privacy'
                              ? 'bg-theme-gold text-black font-bold'
                              : 'text-theme-muted hover:text-theme-primary'
                          }`}
                        >
                          {t('footer.privacy', 'Privacy')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPopover('terms')}
                          className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                            popover === 'terms'
                              ? 'bg-theme-gold text-black font-bold'
                              : 'text-theme-muted hover:text-theme-primary'
                          }`}
                        >
                          {t('footer.terms', 'Terms')}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPopover(null)}
                        aria-label={t('footer.close', 'Close')}
                        className="p-1 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content with Localized Paragraphs */}
                  <div className="text-xs text-theme-muted leading-relaxed space-y-2.5 max-h-56 overflow-y-auto pe-1.5 scrollbar-thin">
                    {popover === 'privacy' ? (
                      <>
                        <p>{t('footer.privacyText1')}</p>
                        <p>{t('footer.privacyText2')}</p>
                      </>
                    ) : (
                      <>
                        <p>{t('footer.termsText1')}</p>
                        <p>{t('footer.termsText2')}</p>
                      </>
                    )}
                  </div>

                  {/* Popover Footer: Sovereign Assurance & Close Action */}
                  <div className="pt-2 border-t border-theme-subtle/60 flex items-center justify-between text-[10px] font-mono text-theme-muted">
                    <span className="text-theme-gold/90 font-medium">
                      GCC Sovereign Compliance
                    </span>
                    <button
                      type="button"
                      onClick={() => setPopover(null)}
                      className="px-2.5 py-1 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary hover:border-theme-gold transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      {t('footer.close', 'Close')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  )
}
