import React, { useEffect, useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface Particle {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  radius: number
  baseAlpha: number
  alpha: number
  color: string
  pulseSpeed: number
  pulseOffset: number
  depth: number // Multi-plane parallax depth (0.25 to 1.0)
}

export const InteractiveBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0

    // Mouse coordinates: raw target vs smoothed delayed cursor
    const mouse = {
      targetX: -1000,
      targetY: -1000,
      currentX: -1000,
      currentY: -1000,
      prevX: -1000,
      prevY: -1000,
      speed: 0,
      isInside: false,
    }

    // Scroll state: delta accumulator and inertia dampener
    let currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0
    let scrollDelta = 0
    let auroraSwayY = 0

    // Palette configuration according to theme
    const goldColor = isDark ? '212, 175, 55' : '162, 123, 44'
    const crimsonColor = isDark ? '255, 51, 75' : '220, 38, 38'
    const ambientColor = isDark ? '148, 163, 184' : '120, 113, 108'

    const colorChoices = [
      `rgba(${goldColor},`,
      `rgba(${goldColor},`,
      `rgba(${crimsonColor},`,
      `rgba(${ambientColor},`,
    ]

    // Particle pool setup
    let particles: Particle[] = []
    const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 42 : 75

    const initParticles = () => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const depth = Math.random() * 0.75 + 0.25 // 0.25 (distant) to 1.0 (foreground)

        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: (Math.random() * 1.5 + 0.8) * (0.8 + depth * 0.4),
          baseAlpha: (Math.random() * 0.35 + 0.2) * (0.75 + depth * 0.35),
          alpha: 0.3,
          color: colorChoices[Math.floor(Math.random() * colorChoices.length)],
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
          depth,
        })
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.scale(dpr, dpr)

      if (particles.length === 0) {
        initParticles()
      } else {
        // Re-scale positions proportionally
        particles.forEach((p) => {
          p.x = (p.x / (canvas.width / dpr || width)) * width
          p.y = (p.y / (canvas.height / dpr || height)) * height
          p.originX = p.x
          p.originY = p.y
        })
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Track mouse movement
    const onPointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
      mouse.isInside = true

      // Initialize smoothly on first entrance
      if (mouse.currentX < -500) {
        mouse.currentX = e.clientX
        mouse.currentY = e.clientY
        mouse.prevX = e.clientX
        mouse.prevY = e.clientY
      }
    }

    const onPointerLeave = () => {
      mouse.isInside = false
    }

    // Track window scroll for parallax backdrop motion
    const onScroll = () => {
      const newY = window.scrollY
      const diff = newY - currentScrollY
      currentScrollY = newY
      scrollDelta += diff
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    let time = 0

    // Main 60fps render loop
    const render = () => {
      time += 0.016

      // Smooth delayed mouse lerp (luxury easing dampener)
      if (mouse.isInside) {
        const lerpFactor = 0.075
        mouse.currentX += (mouse.targetX - mouse.currentX) * lerpFactor
        mouse.currentY += (mouse.targetY - mouse.currentY) * lerpFactor

        // Calculate instantaneous speed for kinetic scattering shockwave
        const dx = mouse.targetX - mouse.prevX
        const dy = mouse.targetY - mouse.prevY
        mouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy), 40)
        mouse.prevX = mouse.targetX
        mouse.prevY = mouse.targetY
      } else {
        // Slowly glide away when pointer leaves window
        mouse.currentX += (-1000 - mouse.currentX) * 0.02
        mouse.currentY += (-1000 - mouse.currentY) * 0.02
        mouse.speed = 0
      }

      // Smoothly consume scrollDelta across frames for natural fluid inertia
      const scrollStep = scrollDelta * 0.28
      scrollDelta -= scrollStep

      // Aurora elastic vertical sway reacting to scroll acceleration
      auroraSwayY += (-scrollStep * 0.35 - auroraSwayY) * 0.12

      ctx.clearRect(0, 0, width, height)

      // -------------------------------------------------------------
      // 1. Atmosphere: Ambient Delayed Radial Aurora Glow with Scroll Sway
      // -------------------------------------------------------------
      const activeAuroraY = mouse.currentY + auroraSwayY
      if (mouse.currentX > -300 && activeAuroraY > -300) {
        const glowRadius = isDark ? 360 : 320
        const glowGradient = ctx.createRadialGradient(
          mouse.currentX,
          activeAuroraY,
          0,
          mouse.currentX,
          activeAuroraY,
          glowRadius
        )

        const glowAlpha = isDark ? 0.09 : 0.06
        const crimsonAlpha = isDark ? 0.04 : 0.025

        glowGradient.addColorStop(0, `rgba(${goldColor}, ${glowAlpha})`)
        glowGradient.addColorStop(0.45, `rgba(${crimsonColor}, ${crimsonAlpha})`)
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(mouse.currentX, activeAuroraY, glowRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      // -------------------------------------------------------------
      // 2. Telemetry Mesh Connections (Faint Architectural Grid)
      // -------------------------------------------------------------
      const maxConnectDist = isDark ? 85 : 75
      const connectDistSq = maxConnectDist * maxConnectDist

      ctx.lineWidth = 0.75
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]
          const distSq = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2

          if (distSq < connectDistSq) {
            const ratio = 1 - Math.sqrt(distSq) / maxConnectDist
            const lineAlpha = ratio * (isDark ? 0.08 : 0.05)
            ctx.strokeStyle = `rgba(${goldColor}, ${lineAlpha})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // -------------------------------------------------------------
      // 3. Kinetic Scattering, Multi-Plane Parallax Scroll & Particle Physics
      // -------------------------------------------------------------
      const scatterRadius = 150
      const scatterRadiusSq = scatterRadius * scatterRadius

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // 1. Multi-plane scroll parallax displacement
        p.y -= scrollStep * p.depth * 0.75

        // 2. Scroll velocity kinetic momentum push (lingers after scroll wheel stops)
        p.vy -= scrollStep * 0.035 * p.depth

        // 3. Distance from delayed mouse cursor
        const dx = p.x - mouse.currentX
        const dy = p.y - mouse.currentY
        const distSq = dx * dx + dy * dy

        if (distSq < scatterRadiusSq && distSq > 0.001) {
          const dist = Math.sqrt(distSq)
          // Scattering impulse factor (stronger closer to delayed cursor, plus mouse speed boost)
          const force = (1 - dist / scatterRadius) * (2.8 + mouse.speed * 0.06)
          const angle = Math.atan2(dy, dx)

          // Scatter outward away from cursor
          p.vx += Math.cos(angle) * force * 0.65
          p.vy += Math.sin(angle) * force * 0.65

          // Luminous flare on scatter interaction
          p.alpha = Math.min(1.0, p.baseAlpha + (1 - dist / scatterRadius) * 0.55)
        } else {
          // Fade back to breathing ambient alpha
          const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.15
          p.alpha += (p.baseAlpha + pulse - p.alpha) * 0.05
        }

        // Apply friction damping
        p.vx *= 0.92
        p.vy *= 0.92

        // Soft restorative drift / organic wander
        p.x += p.vx + Math.cos(time + i) * 0.35
        p.y += p.vy + Math.sin(time + i * 1.5) * 0.35

        // Smooth viewport wrap-around with position preservation
        if (p.x < -30) p.x = width + 30
        if (p.x > width + 30) p.x = -30
        if (p.y < -30) {
          p.y = height + 30
          p.x = (p.x + width) % width
        } else if (p.y > height + 30) {
          p.y = -30
          p.x = (p.x + width) % width
        }

        // Render particle with subtle bloom
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color} ${p.alpha.toFixed(3)})`
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  )
}
