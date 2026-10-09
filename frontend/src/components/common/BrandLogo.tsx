import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import logoMarkTransparent from '../../assets/logo-mark-transparent.png'
import logoMarkLightTransparent from '../../assets/logo-mark-light-transparent.png'
import logoFullDark from '../../assets/logo-full-dark.png'
import logoFullLight from '../../assets/logo-full-light.png'

export interface BrandLogoProps {
  /**
   * 'mark': Graphic motorcycle emblem (with optional styled text beside it)
   * 'full': Complete lockup image containing both emblem and official typography
   */
  variant?: 'mark' | 'full'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  subtitle?: string
  className?: string
  alt?: string
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'mark',
  size = 'md',
  showText = true,
  subtitle = 'MIDDLE EAST // OFFICIAL',
  className = '',
  alt = 'Moto Group Official Logo',
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Full Lockup Variant
  if (variant === 'full') {
    const fullHeightClasses = {
      sm: 'h-8 sm:h-9',
      md: 'h-11 sm:h-12',
      lg: 'h-14 sm:h-16',
      xl: 'h-20 sm:h-24',
    }

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={isDark ? logoFullDark : logoFullLight}
          alt={alt}
          className={`${fullHeightClasses[size]} w-auto object-contain transition-opacity duration-200`}
        />
      </div>
    )
  }

  // Emblem Mark Variant (with optional typographic pairing)
  const emblemSizeClasses = {
    sm: 'h-7 w-10',
    md: 'h-9 w-13',
    lg: 'h-12 w-18',
    xl: 'h-16 w-24',
  }

  const titleSizeClasses = {
    sm: 'text-sm tracking-tight',
    md: 'text-lg sm:text-xl tracking-tight',
    lg: 'text-2xl tracking-tight',
    xl: 'text-3xl tracking-tight',
  }

  const subSizeClasses = {
    sm: 'text-[8px] tracking-widest mt-0.5',
    md: 'text-[9px] sm:text-[10px] tracking-widest mt-0.5',
    lg: 'text-xs tracking-widest mt-1',
    xl: 'text-sm tracking-widest mt-1',
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Emblem Capsule */}
      <div
        className={`relative ${emblemSizeClasses[size]} rounded-[6px] bg-theme-elevated/80 border border-theme-subtle flex items-center justify-center p-1 shadow-sm overflow-hidden group-hover:border-theme-gold/60 group-hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] group-hover:scale-105 transition-all duration-300`}
      >
        <img
          src={isDark ? logoMarkTransparent : logoMarkLightTransparent}
          alt={alt}
          className="h-full w-full object-contain filter group-hover:brightness-110 transition-all duration-300"
          loading="eager"
        />
      </div>

      {/* Styled Wordmark */}
      {showText && (
        <div className="flex flex-col text-start">
          <span
            className={`font-display font-extrabold ${titleSizeClasses[size]} text-theme-primary leading-none group-hover:text-theme-gold transition-colors duration-200`}
          >
            MOTO GROUP
          </span>
          {subtitle && (
            <span
              className={`font-mono uppercase ${subSizeClasses[size]} text-theme-muted group-hover:text-theme-primary/80 transition-colors duration-200`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
