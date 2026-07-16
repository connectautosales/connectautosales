'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

const defaultForm = {
  businessName: '', tagline: '', phone: '', email: '',
  address: '', city: '', state: '', zip: '', mapLink: '',
  hoursMF: '', hoursSat: '', hoursSun: '',
  facebook: '', instagram: '', tiktok: '', youtube: '',
  googlePlaceId: '', googleApiKey: '',
  logoUrl: '',
  inspFeeA: '100', inspFeeB: '100', inspFeePaper: '50', inspFeeNote: '',
  defaultApr: '6.99',
}

export default function SettingsPage() {
  const [form, setForm]           = useState(defaultForm)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState('')
  const [logoPreview, setLogoPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef                   = useRef(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        setForm(f => ({ ...f, ...data }))
        if (data.logoUrl) setLogoPreview(data.logoUrl)
        setLoading(false)
      })
  }, [])

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoPreview(URL.createObjectURL(file))
    setUploading(true)
    const fd = new FormData()
    fd.append('logo', file)
    const res = await fetch('/api/admin/upload-logo', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) setForm(f => ({ ...f, logoUrl: data.logoUrl }))
    else setError(data.error || 'Logo upload failed')
    setUploading(false)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else { const d = await res.json(); setError(d.error || 'Save failed') }
    setSaving(false)
  }

  if (loading) return <div className={styles.page}><div className={styles.loading}>Loading settings...</div></div>

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <i className="fa-solid fa-gear" />
          <div>
            <h1 className={styles.title}>Website Settings</h1>
            <p className={styles.sub}>Changes apply across the entire website instantly.</p>
          </div>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-floppy-disk" /> Save Changes</>}
        </button>
      </div>

      {saved  && <div className={styles.successBanner}><i className="fa-solid fa-circle-check" /> Settings saved successfully!</div>}
      {error  && <div className={styles.errorBanner}><i className="fa-solid fa-circle-xmark" /> {error}</div>}

      <div className={styles.content}>

        {/* Logo */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-image" /> Website Logo</h2>
          <div className={styles.logoUploadRow}>
            <div className={styles.logoPreviewBox}>
              {logoPreview
                ? <Image src={logoPreview} alt="Logo" width={200} height={70} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: 70 }} unoptimized />
                : <span className={styles.logoPlaceholder}><i className="fa-solid fa-image" /> No logo</span>
              }
            </div>
            <div className={styles.logoUploadActions}>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>
                Upload your business logo. Recommended: PNG with transparent background, min 400px wide.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                style={{ display: 'none' }}
                onChange={handleLogoChange}
              />
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading
                  ? <><i className="fa-solid fa-spinner fa-spin" /> Uploading...</>
                  : <><i className="fa-solid fa-arrow-up-from-bracket" /> {logoPreview ? 'Change Logo' : 'Upload Logo'}</>
                }
              </button>
              {logoPreview && (
                <button
                  type="button"
                  className={styles.removeLogo}
                  onClick={() => { setLogoPreview(null); setForm(f => ({ ...f, logoUrl: '' })) }}
                >
                  <i className="fa-solid fa-trash" /> Remove
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Business Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-building" /> Business Information</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Business Name</label>
              <input value={form.businessName || ''} onChange={e => set('businessName', e.target.value)} placeholder="Connect Auto Sales" />
            </div>
            <div className={styles.field}>
              <label>Tagline</label>
              <input value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} placeholder="Quality pre-owned vehicles..." />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-address-book" /> Contact Information</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Phone Number</label>
              <div className={styles.inputIcon}>
                <i className="fa-solid fa-phone" />
                <input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="3134133400" />
              </div>
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <div className={styles.inputIcon}>
                <i className="fa-solid fa-envelope" />
                <input value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="info@connectautosales.com" />
              </div>
            </div>
          </div>
        </section>

        {/* Address */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-location-dot" /> Address</h2>
          <div className={styles.field} style={{marginBottom:14}}>
            <label>Street Address</label>
            <input value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="4413 S Beech Daly St" />
          </div>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label>City</label>
              <input value={form.city || ''} onChange={e => set('city', e.target.value)} placeholder="Dearborn Heights" />
            </div>
            <div className={styles.field}>
              <label>State</label>
              <input value={form.state || ''} onChange={e => set('state', e.target.value)} placeholder="MI" />
            </div>
            <div className={styles.field}>
              <label>ZIP Code</label>
              <input value={form.zip || ''} onChange={e => set('zip', e.target.value)} placeholder="48125" />
            </div>
          </div>
          <div className={styles.field} style={{marginTop:14}}>
            <label>Google Maps Link (optional — leave blank to auto-generate)</label>
            <div className={styles.inputIcon}>
              <i className="fa-solid fa-map" />
              <input value={form.mapLink || ''} onChange={e => set('mapLink', e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-clock" /> Business Hours</h2>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label>Monday – Friday</label>
              <input value={form.hoursMF || ''} onChange={e => set('hoursMF', e.target.value)} placeholder="10AM–6PM" />
            </div>
            <div className={styles.field}>
              <label>Saturday</label>
              <input value={form.hoursSat || ''} onChange={e => set('hoursSat', e.target.value)} placeholder="10AM–4PM" />
            </div>
            <div className={styles.field}>
              <label>Sunday</label>
              <input value={form.hoursSun || ''} onChange={e => set('hoursSun', e.target.value)} placeholder="Closed" />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-share-nodes" /> Social Media Links</h2>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label><i className="fa-brands fa-facebook" style={{color:'#1877F2'}} /> Facebook URL</label>
              <input value={form.facebook || ''} onChange={e => set('facebook', e.target.value)} placeholder="https://facebook.com/yourpage" />
            </div>
            <div className={styles.field}>
              <label><i className="fa-brands fa-instagram" style={{color:'#d6249f'}} /> Instagram URL</label>
              <input value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} placeholder="https://instagram.com/yourhandle" />
            </div>
            <div className={styles.field}>
              <label><i className="fa-brands fa-tiktok" /> TikTok URL</label>
              <input value={form.tiktok || ''} onChange={e => set('tiktok', e.target.value)} placeholder="https://tiktok.com/@yourhandle" />
            </div>
            <div className={styles.field}>
              <label><i className="fa-brands fa-youtube" style={{color:'#FF0000'}} /> YouTube URL</label>
              <input value={form.youtube || ''} onChange={e => set('youtube', e.target.value)} placeholder="https://youtube.com/@yourchannel" />
            </div>
          </div>
        </section>


        {/* Salvage Inspection Fees */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-car-burst" /> Salvage Inspection Fees</h2>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label>TR13A – Mechanic Inspection ($)</label>
              <input type="number" min="0" step="0.01" value={form.inspFeeA || ''} onChange={e => set('inspFeeA', e.target.value)} placeholder="100" />
            </div>
            <div className={styles.field}>
              <label>TR13B – Salvage Vehicle Inspection ($)</label>
              <input type="number" min="0" step="0.01" value={form.inspFeeB || ''} onChange={e => set('inspFeeB', e.target.value)} placeholder="100" />
            </div>
            <div className={styles.field}>
              <label>Paperwork Processing Fee ($)</label>
              <input type="number" min="0" step="0.01" value={form.inspFeePaper || ''} onChange={e => set('inspFeePaper', e.target.value)} placeholder="50" />
            </div>
          </div>
          <div className={styles.field} style={{marginTop:14}}>
            <label>Fee Note (displayed below the total)</label>
            <input value={form.inspFeeNote || ''} onChange={e => set('inspFeeNote', e.target.value)} placeholder="Fees shown apply to standard passenger vehicles. Motorcycle and trailer fees may vary." />
          </div>
          <div style={{marginTop:12,padding:'10px 14px',background:'#f0fdf4',border:'1px solid #86efac',borderRadius:6,fontSize:13,color:'#166534'}}>
            <i className="fa-solid fa-calculator" /> Calculated Total: <strong>${(parseFloat(form.inspFeeA||0)+parseFloat(form.inspFeeB||0)+parseFloat(form.inspFeePaper||0)).toFixed(2)}</strong>
          </div>
        </section>

        {/* Financing APR */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><i className="fa-solid fa-percent" /> Financing Calculator</h2>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label>Default APR (%)</label>
              <input type="number" min="0" max="99" step="0.01" value={form.defaultApr || ''} onChange={e => set('defaultApr', e.target.value)} placeholder="6.99" />
            </div>
          </div>
          <p style={{marginTop:10,fontSize:12,color:'#6b7280'}}>This rate is used for the estimated monthly payment calculator on vehicle detail pages. Shown to customers as an estimate only.</p>
        </section>

      </div>

      <div className={styles.footer}>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-floppy-disk" /> Save Changes</>}
        </button>
      </div>
    </div>
  )
}
