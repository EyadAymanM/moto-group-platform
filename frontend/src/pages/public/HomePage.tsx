import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/layout/Navbar'
import { BrandMarqueeBar } from '../../components/layout/BrandMarqueeBar'
import { HeroSection } from '../../components/sections/HeroSection'
import { ScrollReveal } from '../../components/common/ScrollReveal'
import { api } from '../../services/api'
import type { Brand, CmsSettings } from '../../types'
import { useLocale } from '../../contexts/LocaleContext'
import { motion, AnimatePresence } from 'motion/react'

export const HomePage: React.FC = () => {
  const { locale } = useLocale()
  const [brands, setBrands] = useState<Brand[]>([])
  const [cmsSettings, setCmsSettings] = useState<CmsSettings | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsData, settingsData] = await Promise.allSettled([
          api.getBrands(),
          api.getCmsSettings(),
        ])

        if (brandsData.status === 'fulfilled') {
          setBrands(Array.isArray(brandsData.value) ? brandsData.value : [])
        }
        if (settingsData.status === 'fulfilled') {
          setCmsSettings(settingsData.value)
        }
      } catch (err) {
        console.error('Failed to load initial data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary flex flex-col transition-colors duration-200">
      {/* Sticky Navigation Bar */}
      <Navbar onOpenTestRideDrawer={() => alert('Test Ride Drawer will open here (Block 5)')} />

      {/* Main Content with Hardware-Accelerated Locale Crossfade */}
      <AnimatePresence mode="wait">
        <motion.main
          key={locale}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          {/* Section: Authorized Brand Marquees Bar */}
          {cmsSettings?.section_visibility?.brand_marques_bar !== false && (
            <ScrollReveal delay={0.05}>
              <BrandMarqueeBar
                brands={brands}
                selectedBrandId={selectedBrandId}
                onSelectBrand={(id) => setSelectedBrandId(id)}
                isLoading={loading}
              />
            </ScrollReveal>
          )}

          {/* Section: Isolated Hero Showcase (Block 2) */}
          {cmsSettings?.section_visibility?.featured_telemetry_showcase !== false && (
            <HeroSection
              cmsSettings={cmsSettings}
              onExploreFleet={() => {
                const el = document.getElementById('catalog')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              onBookTestRide={() => alert('Booking drawer ready in Block 5')}
            />
          )}
        </motion.main>
      </AnimatePresence>

      {/* Temporary Minimal Footer */}
      <footer className="border-t border-theme-subtle py-8 px-4 text-center text-xs font-mono text-theme-muted">
        <p>© {new Date().getFullYear()} MOTO GROUP. All rights reserved.</p>
      </footer>
    </div>
  )
}
