'use client'
import { useEffect } from 'react'

const SITE_KEY = '6LdhzWYtAAAAAOSA8uZed4Bxb2aFKTm75YA1L2UY'

// reCAPTCHA is about 340 KB of script and close to a second of CPU on a
// phone, so it's no longer in the site-wide layout. It loads only on pages
// (or in the modal) that actually have a form, and getToken() always waits
// for it, because the form APIs reject a submission without a token.
let loading = null

function loadRecaptcha() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.grecaptcha?.execute) return Promise.resolve(window.grecaptcha)
  if (!loading) {
    loading = new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
      script.async = true
      script.onload = () => resolve(window.grecaptcha || null)
      script.onerror = () => {
        loading = null
        resolve(null)
      }
      document.head.appendChild(script)
    })
  }
  return loading
}

// preload: start loading as soon as the form is on screen, so the token is
// ready by the time the visitor submits. The test drive modal passes its open
// state so a closed modal doesn't load anything.
export function useRecaptcha({ preload = true } = {}) {
  useEffect(() => {
    if (preload) loadRecaptcha()
  }, [preload])

  const getToken = async (action = 'submit') => {
    const grecaptcha = await loadRecaptcha()
    if (!grecaptcha) return null
    return new Promise((resolve) => {
      grecaptcha.ready(async () => {
        try {
          resolve(await grecaptcha.execute(SITE_KEY, { action }))
        } catch {
          resolve(null)
        }
      })
    })
  }
  return { getToken }
}
