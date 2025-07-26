"use client"
import React, { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlowingEffectProps {
  blur?: number
  inactiveZone?: number
  proximity?: number
  spread?: number
  variant?: "default" | "white"
  glow?: boolean
  className?: string
  disabled?: boolean
  movementDuration?: number
  borderWidth?: number
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  variant = "default",
  glow = false,
  className,
  disabled = true,
  movementDuration = 2,
  borderWidth = 1,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(glow)
  const [angle, setAngle] = useState(0)
  const [rafId, setRafId] = useState<number | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [rafId])

  // Only show effect on hover/touch unless glow is true
  useEffect(() => {
    if (glow) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [glow])

  // Animate angle for smoothness (60fps)
  const animateAngle = (from: number, to: number) => {
    const duration = (movementDuration ?? 2) * 100
    const start = performance.now()
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const value = from + (to - from) * progress
      setAngle(value)
      if (progress < 1) {
        setRafId(requestAnimationFrame(step))
      }
    }
    setRafId(requestAnimationFrame(step))
  }

  const handlePointer = (clientX: number, clientY: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = clientX - centerX
    const dy = clientY - centerY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const radius = Math.min(rect.width, rect.height) * 0.5 * (inactiveZone ?? 0.7)
    if (dist < radius) {
      if (!glow) setActive(false)
      return
    }
    setActive(true)
    const newAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    animateAngle(angle, newAngle)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointer(e.clientX, e.clientY)
  }
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0]
    if (t) handlePointer(t.clientX, t.clientY)
  }
  const handleMouseLeave = () => {
    if (!glow) setActive(false)
  }
  const handleTouchEnd = () => {
    if (!glow) setActive(false)
  }

  // CSS variables for border
  const style = {
    "--blur": `${blur}px`,
    "--spread": spread,
    "--start": angle,
    "--active": active ? 1 : 0,
    "--glowingeffect-border-width": `${borderWidth}px`,
    "--repeating-conic-gradient-times": "5",
    "--gradient":
      variant === "white"
        ? `repeating-conic-gradient(from 236.84deg at 50% 50%, var(--black), var(--black) calc(25% / var(--repeating-conic-gradient-times)))`
        : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
            radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
            radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
            radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
            repeating-conic-gradient(from 236.84deg at 50% 50%, #dd7bbb 0%, #d79f1e calc(25% / var(--repeating-conic-gradient-times)), #5a922c calc(50% / var(--repeating-conic-gradient-times)), #4c7894 calc(75% / var(--repeating-conic-gradient-times)), #dd7bbb calc(100% / var(--repeating-conic-gradient-times)))`,
  } as any

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-auto absolute inset-0 rounded-[inherit] z-10",
        className,
        disabled && "hidden"
      )}
      style={style}
      onMouseMove={disabled ? undefined : handleMouseMove}
      onMouseLeave={disabled ? undefined : handleMouseLeave}
      onTouchMove={disabled ? undefined : handleTouchMove}
      onTouchEnd={disabled ? undefined : handleTouchEnd}
      {...props}
    >
      <div
        className={cn(
          "glow rounded-[inherit] after:content-[''] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:[border:var(--glowingeffect-border-width)_solid_transparent] after:[background:var(--gradient)] after:[background-attachment:fixed] after:opacity-[var(--active)] after:transition-opacity after:duration-300 after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]",
          blur > 0 && "blur-[var(--blur)]"
        )}
      />
    </div>
  )
}
