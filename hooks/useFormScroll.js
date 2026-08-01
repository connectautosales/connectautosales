'use client'
import { useRef, useCallback } from 'react'

export function useFormScroll() {
  const successRef = useRef(null)

  const scrollToFirstError = useCallback((errs) => {
    const firstKey = Object.keys(errs)[0]
    if (!firstKey) return
    setTimeout(() => {
      const el =
        document.querySelector(`[name="${firstKey}"]`) ||
        document.getElementById(firstKey)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }, [])

  const scrollToSuccess = useCallback(() => {
    setTimeout(() => {
      const el = successRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }, 100)
  }, [])

  return { successRef, scrollToFirstError, scrollToSuccess }
}
