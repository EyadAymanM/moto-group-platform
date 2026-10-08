import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type Locale = 'en' | 'ar'

interface LocaleContextType {
  locale: Locale
  isRTL: boolean
  toggleLocale: () => void
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation()
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('moto_locale') as Locale | null
    return saved === 'ar' ? 'ar' : 'en'
  })

  useEffect(() => {
    const isArabic = locale === 'ar'
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
    i18n.changeLanguage(locale)
    localStorage.setItem('moto_locale', locale)
  }, [locale, i18n])

  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return
    setLocaleState(newLocale)
  }

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en')
  }

  return (
    <LocaleContext.Provider
      value={{
        locale,
        isRTL: locale === 'ar',
        toggleLocale,
        setLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
