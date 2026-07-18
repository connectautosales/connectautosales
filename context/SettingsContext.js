'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const defaultSettings = {
  businessName: 'Connect Auto Sales',
  tagline: '',
  phone: '3134133400',
  email: 'info@connectautosales.com',
  address: '4413 S Beech Daly St',
  city: 'Dearborn Heights',
  state: 'MI',
  zip: '48125',
  mapLink: '',
  hoursMF: '10AM–6PM',
  hoursSat: '10AM–4PM',
  hoursSun: 'Closed',
  facebook: 'https://facebook.com/connectautosales',
  instagram: 'https://instagram.com/connectautosales',
  tiktok: 'https://tiktok.com/@connectautosales',
  youtube: '',
  aboutText: '',
  logoUrl: '/images/logo.png',
}

const SettingsContext = createContext(defaultSettings)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          const merged = { ...defaultSettings, ...data }
          if (!merged.facebook) merged.facebook = defaultSettings.facebook
          if (!merged.instagram) merged.instagram = defaultSettings.instagram
          if (!merged.tiktok) merged.tiktok = defaultSettings.tiktok
          setSettings(merged)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
