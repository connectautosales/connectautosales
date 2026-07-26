'use client'

const SITE_KEY = '6LdhzWYtAAAAAOSA8uZed4Bxb2aFKTm75YA1L2UY'

export function useRecaptcha() {
  const getToken = async (action = 'submit') => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.grecaptcha) {
        resolve(null)
        return
      }
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(SITE_KEY, { action })
          resolve(token)
        } catch {
          resolve(null)
        }
      })
    })
  }
  return { getToken }
}
