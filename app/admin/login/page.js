'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.css'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [logoUrl, setLogoUrl] = useState(null)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setLogoUrl(d.logoUrl || null)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      window.location.href = '/admin'
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          {logoUrl ? (
            <div className={styles.logoWrap}>
              <Image src={logoUrl} alt="Logo" width={160} height={52} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} unoptimized />
            </div>
          ) : (
            <div className={styles.brandIcon}>
              <i className="fa-solid fa-car-side" />
            </div>
          )}
          <h1 className={styles.brandName}>Connect <span>Auto</span> Sales</h1>
          <p className={styles.brandTagline}>Manage your dealership operations from one place.</p>
          <ul className={styles.featureList}>
            {['Inventory Management', 'Financing Applications', 'Auction Requests', 'Salvage Inspections', 'Customer Messages'].map(f => (
              <li key={f}>
                <i className="fa-solid fa-circle-check" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.lockIcon}>
              <i className="fa-solid fa-lock" />
            </div>
            <h2 className={styles.cardTitle}>Admin Sign In</h2>
            <p className={styles.cardSub}>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email Address</label>
              <div className={styles.inputWrap}>
                <i className="fa-regular fa-envelope" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@connectautosales.com"
                  required
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.inputWrap}>
                <i className="fa-solid fa-key" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                  <i className={showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                </button>
              </div>
            </div>
            {error && (
              <div className={styles.errorBox}>
                <i className="fa-solid fa-circle-exclamation" />
                {error}
              </div>
            )}
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin" /> Signing in...</>
                : <><i className="fa-solid fa-right-to-bracket" /> Sign In</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
