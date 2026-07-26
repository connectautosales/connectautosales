'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(6px)'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return <div ref={ref}>{children}</div>
}
