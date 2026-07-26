'use client'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }) {
  const pathname = usePathname()
  return (
    <div key={pathname} style={{ animation: 'pageFadeIn 0.3s ease both' }}>
      {children}
    </div>
  )
}
