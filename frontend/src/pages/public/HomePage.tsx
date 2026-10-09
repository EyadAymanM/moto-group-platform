import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/layout/Navbar'
import { BrandMarqueeBar } from '../../components/layout/BrandMarqueeBar'
import { HeroSection } from '../../components/sections/HeroSection'
import { CatalogSection } from '../../components/sections/CatalogSection'
import { DealershipsSection, type CityKey } from '../../components/sections/DealershipsSection'
import { Footer } from '../../components/layout/Footer'
import { TelemetryModal } from '../../components/modals/TelemetryModal'
import { TestRideModal } from '../../components/modals/TestRideModal'
import { ScrollReveal } from '../../components/common/ScrollReveal'
import { api } from '../../services/api'
import type { Brand, CmsSettings, Motorcycle } from '../../types'
import { useLocale } from '../../contexts/LocaleContext'
import { motion, AnimatePresence } from 'motion/react'

export const HomePage: React.FC = () => {
  const { locale } = useLocale()
  const [brands, setBrands] = useState<Brand[]>([])
  const [cmsSettings, setCmsSettings] = useState<CmsSettings | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
  const [telemetryModalBike, setTelemetryModalBike] = useState<Motorcycle | null>(null)
  const [testRideBike, setTestRideBike] = useState<Motorcycle | null>(null)
  const [testRideInitialCity, setTestRideInitialCity] = useState<CityKey | undefined>(undefined)
  const [isTestRideModalOpen, setIsTestRideModalOpen] = useState(false)
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
      <Navbar onOpenTestRideDrawer={() => setIsTestRideModalOpen(true)} />

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
              onBookTestRide={() => setIsTestRideModalOpen(true)}
            />
          )}

          {/* Section: Multi-Brand Catalog Grid & Editorial Segment Showcase (Block 3) */}
          {cmsSettings?.section_visibility?.catalog_filter_grid !== false && (
            <ScrollReveal delay={0.08}>
              <CatalogSection
                brands={brands}
                selectedBrandId={selectedBrandId}
                onSelectBrand={(id) => setSelectedBrandId(id)}
                onSelectTelemetry={(bike) => setTelemetryModalBike(bike)}
                onBookRide={(bike) => {
                  setTestRideBike(bike)
                  setIsTestRideModalOpen(true)
                }}
              />
            </ScrollReveal>
          )}

          {/* Section: Regional Flagship Hubs (Block 6) */}
          {cmsSettings?.section_visibility?.regional_showrooms_map !== false && (
            <ScrollReveal delay={0.08}>
              <DealershipsSection
                onReserveLounge={(city) => {
                  setTestRideInitialCity(city)
                  setIsTestRideModalOpen(true)
                }}
              />
            </ScrollReveal>
          )}

          {/* Block 4: Engineering Telemetry Modal */}
          <TelemetryModal
            motorcycle={telemetryModalBike}
            onClose={() => setTelemetryModalBike(null)}
            onBookRide={(bike) => {
              setTelemetryModalBike(null)
              setTestRideBike(bike)
              setIsTestRideModalOpen(true)
            }}
          />

          {/* Block 5: VIP Test-Ride Concierge Wizard Modal */}
          {cmsSettings?.section_visibility?.test_ride_concierge_drawer !== false && (
            <TestRideModal
              isOpen={isTestRideModalOpen}
              preSelectedMotorcycle={testRideBike}
              initialCity={testRideInitialCity}
              brands={brands}
              onClose={() => {
                setIsTestRideModalOpen(false)
                setTestRideBike(null)
                setTestRideInitialCity(undefined)
              }}
            />
          )}
        </motion.main>
      </AnimatePresence>

      {/* Block 6: Regional Automotive Group Footer */}
      <Footer />
    </div>
  )
}
