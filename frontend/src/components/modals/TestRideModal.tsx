import React, { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { Brand, Motorcycle, TestRideRequest } from '../../types'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../contexts/LocaleContext'
import { api } from '../../services/api'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MapPin,
  ShieldCheck,
  MessageSquare,
  RotateCcw,
} from 'lucide-react'

interface TestRideModalProps {
  isOpen: boolean
  preSelectedMotorcycle: Motorcycle | null
  initialCity?: CityKey
  brands: Brand[]
  onClose: () => void
}

type CityKey = 'Dubai' | 'Riyadh' | 'Doha'
type ExperienceKey = 'Beginner' | 'Intermediate' | 'Expert'

export const TestRideModal: React.FC<TestRideModalProps> = ({
  isOpen,
  preSelectedMotorcycle,
  initialCity,
  brands,
  onClose,
}) => {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const isRtl = locale === 'ar'

  // Wizard Stage & Animation Direction
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [direction, setDirection] = useState<1 | -1>(1)

  // Machine Selection
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null)
  const [availableBikes, setAvailableBikes] = useState<Motorcycle[]>([])
  const [loadingBikes, setLoadingBikes] = useState<boolean>(false)
  const [isChangingBike, setIsChangingBike] = useState<boolean>(false)

  // Hub & Schedule
  const [preferredCity, setPreferredCity] = useState<CityKey>('Dubai')
  const [preferredDate, setPreferredDate] = useState<string>('')
  const [showCustomDateInput, setShowCustomDateInput] = useState<boolean>(false)
  const [experienceLevel, setExperienceLevel] = useState<ExperienceKey>('Intermediate')
  const [notes, setNotes] = useState<string>('')

  // Contact Credentials
  const [customerName, setCustomerName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<number | null>(null)

  // Fluid Animated Height Ref & State
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (!contentRef.current) return

    const updateHeight = () => {
      if (contentRef.current) {
        const h = contentRef.current.offsetHeight
        if (h > 60) setContentHeight(h)
      }
    }

    updateHeight()

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height
        if (h > 60) {
          setContentHeight(Math.round(h))
        }
      }
    })

    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [step, isChangingBike, showCustomDateInput])

  // Compute next 6 upcoming session date slots
  const sessionSlots = useMemo(() => {
    const slots = []
    const today = new Date()
    for (let i = 1; i <= 8; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = d.toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', { weekday: 'short' })
      const monthName = d.toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', { month: 'short' })
      slots.push({ dateStr, dayName, dayNum: d.getDate(), monthName })
      if (slots.length === 6) break
    }
    return slots
  }, [locale])

  // Initialize or reset state on modal open
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setDirection(1)
      setErrorMessage(null)
      setBookingId(null)
      setShowCustomDateInput(false)
      setContentHeight('auto')

      if (preSelectedMotorcycle) {
        setSelectedMotorcycle(preSelectedMotorcycle)
        setSelectedBrandId(preSelectedMotorcycle.brand_id)
        setIsChangingBike(false)
      } else if (brands.length > 0) {
        setSelectedBrandId(brands[0].id)
        setIsChangingBike(true)
      }

      // Pre-select city if passed from boutique concierge
      if (initialCity) {
        setPreferredCity(initialCity)
      }

      // Default preferred date to first upcoming session slot
      if (sessionSlots.length > 0) {
        setPreferredDate(sessionSlots[0].dateStr)
      }
    }
  }, [isOpen, preSelectedMotorcycle, initialCity, brands, sessionSlots])

  // Fetch motorcycles when brand changes (only when user is choosing or changing bike)
  useEffect(() => {
    if (!selectedBrandId) return
    let isMounted = true
    const fetchBrandBikes = async () => {
      setLoadingBikes(true)
      try {
        const bikes = await api.getMotorcycles({ brand_id: selectedBrandId })
        if (isMounted) {
          setAvailableBikes(bikes)
          if (!selectedMotorcycle || selectedMotorcycle.brand_id !== selectedBrandId) {
            setSelectedMotorcycle(bikes[0] || null)
          }
        }
      } catch (err) {
        console.error('Failed to fetch brand motorcycles:', err)
      } finally {
        if (isMounted) setLoadingBikes(false)
      }
    }

    fetchBrandBikes()
    return () => {
      isMounted = false
    }
  }, [selectedBrandId])

  // Escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const goToStep = (nextStep: 1 | 2 | 3) => {
    setDirection(nextStep > step ? 1 : -1)
    setStep(nextStep)
  }

  // Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!customerName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage(
        locale === 'ar'
          ? 'يرجى إدخال جميع الحقول المطلوبة (الاسم، البريد، والهاتف).'
          : 'Please complete all required contact fields.'
      )
      return
    }

    if (!selectedBrandId) {
      setErrorMessage(locale === 'ar' ? 'يرجى اختيار الدراجة المطلوبة.' : 'Please select a motorcycle.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload: Partial<TestRideRequest> = {
        brand_id: selectedBrandId,
        motorcycle_id: selectedMotorcycle?.id || undefined,
        customer_name: customerName,
        email: email,
        phone: phone,
        preferred_city: preferredCity,
        preferred_date: preferredDate || undefined,
        experience_level: experienceLevel,
        notes: notes || undefined,
      }

      const res = await api.submitTestRide(payload)
      setBookingId(res.booking_id || Math.floor(1000 + Math.random() * 9000))
      setStep(4)
    } catch (err: any) {
      console.error('Test ride booking error:', err)
      setErrorMessage(
        err.message ||
          (locale === 'ar'
            ? 'تعذر إرسال طلب الحجز، يرجى المحاولة مرة أخرى.'
            : 'Failed to submit booking request. Please check inputs.')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const cities: Array<{ key: CityKey; name: string; hub: string }> = [
    {
      key: 'Dubai',
      name: locale === 'ar' ? 'دبي' : 'Dubai',
      hub: locale === 'ar' ? 'الشارع الرئيسي' : 'Sheikh Zayed Rd',
    },
    {
      key: 'Riyadh',
      name: locale === 'ar' ? 'الرياض' : 'Riyadh',
      hub: locale === 'ar' ? 'حي الملقا' : 'Al Malqa Boutique',
    },
    {
      key: 'Doha',
      name: locale === 'ar' ? 'الدوحة' : 'Doha',
      hub: locale === 'ar' ? 'صالة اللؤلؤة' : 'The Pearl Boutique',
    },
  ]

  const experienceLevels: Array<{ key: ExperienceKey; title: string; desc: string }> = [
    {
      key: 'Beginner',
      title: locale === 'ar' ? 'مبتدئ' : 'Novice',
      desc: locale === 'ar' ? 'أقل من سنتين / رخصة A2' : 'Under 2 years / A2 License',
    },
    {
      key: 'Intermediate',
      title: locale === 'ar' ? 'متوسط' : 'Experienced',
      desc: locale === 'ar' ? '2-5 سنوات قيادة' : '2-5 years street & track',
    },
    {
      key: 'Expert',
      title: locale === 'ar' ? 'محترف' : 'Master Track',
      desc: locale === 'ar' ? '5+ سنوات / تدريب حلبات' : '5+ years track certified',
    },
  ]

  // Slide Animation Variants (crisp subtle horizontal glide without layout jumps)
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? (isRtl ? -18 : 18) : (isRtl ? 18 : -18),
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? (isRtl ? 18 : -18) : (isRtl ? -18 : 18),
    }),
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop Acrylic Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
        />

        {/* Modal Window Container (Fluid animated height & Stitch MCP 12px radius) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full max-w-xl rounded-t-[16px] sm:rounded-[12px] bg-theme-elevated border border-theme-subtle shadow-2xl overflow-hidden my-auto z-10 flex flex-col"
        >
          {/* Top Hairline Gold Highlight */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-theme-gold to-transparent shrink-0" />

          {/* Clean Modal Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-theme-subtle bg-theme-surface/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-theme-gold animate-pulse" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-theme-primary font-bold">
                {t('testRide.drawerTitle')}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-muted hover:text-theme-primary hover:border-theme-gold/60 hover:scale-110 active:scale-90 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Bar (Readable Typography & Micro-pills) */}
          {step < 4 && (
            <div className="px-5 sm:px-6 py-2.5 border-b border-theme-subtle bg-theme-base/50 shrink-0">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { s: 1, title: t('testRide.steps.machine', 'Machine') },
                  { s: 2, title: t('testRide.steps.schedule', 'Schedule') },
                  { s: 3, title: t('testRide.steps.contact', 'Contact') },
                ].map((item) => {
                  const isActive = step === item.s
                  const isPassed = step > item.s
                  return (
                    <div
                      key={item.s}
                      onClick={() => {
                        if (isPassed) goToStep(item.s as 1 | 2 | 3)
                      }}
                      className={`flex items-center gap-2 cursor-pointer transition-colors ${
                        isActive
                          ? 'text-theme-gold font-bold'
                          : isPassed
                          ? 'text-theme-primary font-medium'
                          : 'text-theme-muted opacity-60'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-[4px] flex items-center justify-center text-[10px] font-mono shrink-0 transition-colors ${
                          isActive
                            ? 'bg-theme-gold text-slate-950 font-bold'
                            : isPassed
                            ? 'bg-theme-surface border border-theme-gold/40 text-theme-gold'
                            : 'bg-theme-base border border-theme-subtle text-theme-muted'
                        }`}
                      >
                        {isPassed ? '✓' : item.s}
                      </span>
                      <span className="text-xs truncate font-sans">
                        {item.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Smooth Fluid Animated Height Content Container */}
          <motion.div
            animate={{ height: contentHeight }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="overflow-y-auto overflow-x-hidden relative max-h-[calc(88dvh-130px)]"
          >
            <div ref={contentRef} className="p-5 sm:p-6">
              {errorMessage && (
                <div className="mb-4 p-3 rounded-[4px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              <AnimatePresence mode="wait" custom={direction} initial={false}>
              {/* =========================================================================
                  STAGE 1: Machine & Flagship Hub
                  ========================================================================= */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  {/* Selected Machine Card / Machine Picker */}
                  {!isChangingBike && selectedMotorcycle ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-theme-muted">
                          {t('testRide.selectedMotorcycle')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsChangingBike(true)}
                          className="text-[11px] font-mono text-theme-gold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{t('testRide.changeBike', 'Change Machine')}</span>
                        </button>
                      </div>

                      <div className="rounded-[8px] bg-theme-base/80 border border-theme-subtle p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={selectedMotorcycle.image_url}
                            alt={selectedMotorcycle.name}
                            className="w-16 h-12 rounded-[4px] object-cover bg-black/40 border border-theme-subtle shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-theme-gold uppercase font-bold block truncate">
                              {selectedMotorcycle.brand?.name}
                            </span>
                            <h4 className="text-sm font-display font-bold text-theme-primary truncate">
                              {selectedMotorcycle.name}
                            </h4>
                            <span className="text-[10px] font-mono text-theme-muted telemetry-val block truncate">
                              {selectedMotorcycle.engine_cc
                                ? `${selectedMotorcycle.engine_cc} CC • ${selectedMotorcycle.horsepower} BHP`
                                : 'EV Maxi-Scooter'}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-theme-surface border border-theme-subtle text-theme-muted shrink-0 hidden sm:inline-block">
                          {selectedMotorcycle.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Machine Choice Flow (Brand Pills -> Bike Grid) */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-theme-muted">
                          {t('testRide.chooseBike', 'Select Marque & Model')}
                        </span>
                        {selectedMotorcycle && (
                          <button
                            type="button"
                            onClick={() => setIsChangingBike(false)}
                            className="text-[11px] font-mono text-theme-muted hover:text-theme-primary cursor-pointer"
                          >
                            ✕ Cancel
                          </button>
                        )}
                      </div>

                      {/* Brand Quick Tabs */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {brands.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBrandId(b.id)}
                            className={`py-2 px-1 rounded-[4px] text-[11px] font-mono uppercase tracking-wider transition-all truncate text-center cursor-pointer ${
                              selectedBrandId === b.id
                                ? 'bg-theme-gold text-slate-950 font-bold shadow-sm'
                                : 'bg-theme-base border border-theme-subtle text-theme-muted hover:text-theme-primary'
                            }`}
                          >
                            {b.name.split(' ')[0]}
                          </button>
                        ))}
                      </div>

                      {/* Model Cards */}
                      {loadingBikes ? (
                        <div className="h-24 rounded-[6px] bg-theme-base/60 animate-pulse" />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pe-1">
                          {availableBikes.map((bike) => {
                            const isPicked = selectedMotorcycle?.id === bike.id
                            return (
                              <button
                                key={bike.id}
                                type="button"
                                onClick={() => {
                                  setSelectedMotorcycle(bike)
                                  setIsChangingBike(false)
                                }}
                                className={`p-2 rounded-[6px] border text-start flex items-center gap-2.5 transition-all cursor-pointer ${
                                  isPicked
                                    ? 'bg-theme-surface border-theme-gold'
                                    : 'bg-theme-base/70 border-theme-subtle hover:border-theme-focus'
                                }`}
                              >
                                <img
                                  src={bike.image_url}
                                  alt={bike.name}
                                  className="w-10 h-8 rounded-[4px] object-cover bg-black/40 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold font-display text-theme-primary truncate">
                                    {bike.name}
                                  </div>
                                  <div className="text-[10px] font-mono text-theme-muted telemetry-val truncate">
                                    {bike.engine_cc ? `${bike.engine_cc} CC` : 'EV'}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flagship Hub Cards */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-theme-muted block mb-2">
                      {t('testRide.preferredCity')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {cities.map((city) => {
                        const isSelected = preferredCity === city.key
                        return (
                          <button
                            key={city.key}
                            type="button"
                            onClick={() => setPreferredCity(city.key)}
                            className={`p-3 rounded-[6px] border text-start transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                              isSelected
                                ? 'bg-theme-surface border-theme-gold shadow-md shadow-amber-500/10 ring-1 ring-theme-gold/30'
                                : 'bg-theme-base/80 border-theme-subtle hover:border-theme-focus'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-sans text-theme-primary">
                                {city.name}
                              </span>
                              <MapPin
                                className={`w-3.5 h-3.5 ${
                                  isSelected ? 'text-theme-gold' : 'text-theme-muted'
                                }`}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-theme-muted leading-tight truncate">
                              {city.hub}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* =========================================================================
                  STAGE 2: Custom Date Slot Selector & Experience
                  ========================================================================= */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  {/* Luxury Styled Date Slot Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-theme-muted">
                        {t('testRide.quickDates', 'Select Date Slot')}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCustomDateInput(!showCustomDateInput)}
                        className="text-[11px] font-mono text-theme-gold hover:underline cursor-pointer"
                      >
                        {showCustomDateInput ? 'Pick Quick Slot' : 'Calendar Picker'}
                      </button>
                    </div>

                    {!showCustomDateInput ? (
                      /* Slot Cards Carousel */
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {sessionSlots.map((slot) => {
                          const isSelected = preferredDate === slot.dateStr
                          return (
                            <button
                              key={slot.dateStr}
                              type="button"
                              onClick={() => setPreferredDate(slot.dateStr)}
                              className={`p-2 rounded-[6px] border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                isSelected
                                  ? 'bg-theme-surface border-theme-gold ring-1 ring-theme-gold/40 shadow-sm'
                                  : 'bg-theme-base/80 border-theme-subtle hover:border-theme-focus'
                              }`}
                            >
                              <span className="text-[10px] font-mono uppercase text-theme-muted">
                                {slot.dayName}
                              </span>
                              <span className="text-base font-bold font-mono telemetry-val text-theme-primary">
                                {slot.dayNum}
                              </span>
                              <span className="text-[9px] font-mono text-theme-gold uppercase">
                                {slot.monthName}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      /* Custom Styled Date Input */
                      <div className="relative">
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono focus:border-theme-gold focus:outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Experience Level Cards */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-theme-muted block mb-2">
                      {t('testRide.experienceLevel')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {experienceLevels.map((lvl) => {
                        const isSelected = experienceLevel === lvl.key
                        return (
                          <button
                            key={lvl.key}
                            type="button"
                            onClick={() => setExperienceLevel(lvl.key)}
                            className={`p-3 rounded-[6px] border text-start transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                              isSelected
                                ? 'bg-theme-surface border-theme-gold ring-1 ring-theme-gold/30 shadow-sm'
                                : 'bg-theme-base/80 border-theme-subtle hover:border-theme-focus'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-sans text-theme-primary">
                                {lvl.title}
                              </span>
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isSelected ? 'bg-theme-gold' : 'bg-theme-subtle'
                                }`}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-theme-muted leading-tight">
                              {lvl.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Special Requests & Helmet Size */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-theme-muted block mb-1.5">
                      {t('testRide.notes')}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t('testRide.notesPlaceholder')}
                      className="w-full px-3.5 py-2 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-sans placeholder:text-theme-muted focus:border-theme-gold focus:outline-none transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* =========================================================================
                  STAGE 3: VIP Contact Credentials
                  ========================================================================= */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-theme-muted block mb-1">
                      {t('testRide.fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t('testRide.fullNamePlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-sans placeholder:text-theme-muted focus:border-theme-gold focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-theme-muted block mb-1">
                        {t('testRide.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('testRide.emailPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono placeholder:text-theme-muted focus:border-theme-gold focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-theme-muted block mb-1">
                        {t('testRide.phone')} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('testRide.phonePlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-[4px] bg-theme-base border border-theme-subtle text-theme-primary text-xs font-mono placeholder:text-theme-muted focus:border-theme-gold focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 rounded-[6px] bg-theme-base/90 border border-theme-subtle text-xs font-mono space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-theme-gold mb-1">
                      VIP SESSION RECAP
                    </div>
                    <div className="flex justify-between text-theme-muted">
                      <span>Machine:</span>
                      <span className="text-theme-primary font-bold">
                        {selectedMotorcycle?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-theme-muted">
                      <span>Boutique:</span>
                      <span className="text-theme-primary font-bold">
                        {cities.find((c) => c.key === preferredCity)?.name}
                      </span>
                    </div>
                    {preferredDate && (
                      <div className="flex justify-between text-theme-muted">
                        <span>Date:</span>
                        <span className="text-theme-primary font-bold">{preferredDate}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* =========================================================================
                  STAGE 4: VIP Boarding Pass Confirmation
                  ========================================================================= */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-2 space-y-5 text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-theme-gold/15 border border-theme-gold/40 flex items-center justify-center text-theme-gold shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-theme-gold font-bold block mb-1">
                      ALLOCATION CONFIRMED // VIP PASS
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-theme-primary tracking-tight">
                      {t('testRide.successTitle')}
                    </h3>
                    <p className="mt-1.5 text-xs text-theme-muted max-w-sm mx-auto leading-relaxed font-sans">
                      {t('testRide.successMessage')}
                    </p>
                  </div>

                  {/* Boarding Pass Card */}
                  <div className="max-w-sm mx-auto rounded-[8px] bg-theme-base border border-theme-gold/40 p-4 shadow-xl relative overflow-hidden text-start">
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-theme-gold to-transparent absolute top-0 inset-x-0" />

                    <div className="flex items-center justify-between border-b border-theme-subtle pb-2 mb-2.5">
                      <div>
                        <span className="text-[9px] font-mono text-theme-muted block uppercase">
                          Reference ID
                        </span>
                        <span className="text-sm font-bold font-mono text-theme-gold">
                          #MG-VIP-{bookingId || '7842'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-[4px] border border-emerald-500/30">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Client:</span>
                        <span className="text-theme-primary font-bold">{customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Model:</span>
                        <span className="text-theme-primary font-bold">
                          {selectedMotorcycle?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-theme-muted">Hub:</span>
                        <span className="text-theme-primary font-bold">
                          {cities.find((c) => c.key === preferredCity)?.name}
                        </span>
                      </div>
                      {preferredDate && (
                        <div className="flex justify-between">
                          <span className="text-theme-muted">Date:</span>
                          <span className="text-theme-primary font-bold">{preferredDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VIP Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <a
                      href={`https://wa.me/971501234567?text=${encodeURIComponent(
                        `Hello Moto Group VIP Concierge, I would like to confirm my test ride reservation #MG-VIP-${bookingId} for the ${selectedMotorcycle?.name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-[4px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Concierge</span>
                    </a>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-[4px] bg-theme-base border border-theme-subtle hover:border-theme-focus text-theme-primary font-semibold text-xs uppercase tracking-wider transition-all"
                    >
                      {t('testRide.close')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

          {/* Sticky Modal Footer Controls */}
          {step < 4 && (
            <div className="px-5 sm:px-6 py-3.5 border-t border-theme-subtle bg-theme-surface/70 shrink-0 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep((step - 1) as 1 | 2)}
                  className="btn-luxury-ghost px-3.5 py-2 rounded-[4px] text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  <span>{locale === 'ar' ? 'السابق' : 'Back'}</span>
                </button>
              ) : (
                <span />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => goToStep((step + 1) as 2 | 3)}
                  className="btn-luxury-gold px-5 py-2.5 rounded-[4px] text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm font-bold"
                >
                  <span>{locale === 'ar' ? 'المتابعة' : 'Continue'}</span>
                  {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-luxury-gold px-6 py-2.5 rounded-[4px] text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md font-bold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t('testRide.submitting')}</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t('testRide.submit')}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
