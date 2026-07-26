'use client'
import { useState, useEffect, useRef } from 'react'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import styles from './TestDriveModal.module.css'

const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM',
]

export default function TestDriveModal({ isOpen, onClose, vehicle = '' }) {
  const { getToken } = useRecaptcha()
  const modalBodyRef = useRef(null)
  const successRef   = useRef(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    vehicle: vehicle, preferredDate: '', preferredTime: '', notes: '',
  })
  const [errors, setErrors]   = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  useEffect(() => {
    setForm(f => ({ ...f, vehicle }))
  }, [vehicle])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      if (!isOpen) { setSubmitted(false); setErrors({}) }
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const upd = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(p => { const n = { ...p }; delete n[name]; return n })
  }

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required.'
    if (!form.lastName.trim())  errs.lastName  = 'Last name is required.'
    if (!form.phone.trim())           errs.phone = 'Phone number is required.'
    else if (!phoneRe.test(form.phone.trim())) errs.phone = 'Enter a valid phone number.'
    if (!form.email.trim())           errs.email = 'Email is required.'
    else if (!emailRe.test(form.email.trim())) errs.email = 'Enter a valid email address.'
    if (!form.preferredDate) errs.preferredDate = 'Please select a preferred date.'
    if (!form.preferredTime) errs.preferredTime = 'Please select a preferred time.'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      const firstKey = Object.keys(errs)[0]
      setTimeout(() => {
        const el = modalBodyRef.current?.querySelector(`[name="${firstKey}"]`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }
    setSubmitting(true)
    try {
      const recaptchaToken = await getToken('test_drive')
      const res = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={modalBodyRef} className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {submitted ? (
          <div ref={successRef} className={styles.success}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h3>Test Drive Scheduled!</h3>
            <p>We&apos;ll contact you shortly to confirm your appointment.</p>
            <button className={styles.doneBtn} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.headerIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <div>
                <h2 className={styles.title}>Schedule a Test Drive</h2>
                <p className={styles.sub}>Fill in your details and we&apos;ll confirm your appointment.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* Name row */}
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label>First Name <span className={styles.req}>*</span></label>
                  <input name="firstName" value={form.firstName} onChange={upd} placeholder="John" className={errors.firstName ? styles.inputErr : ''} />
                  {errors.firstName && <span className={styles.err}>{errors.firstName}</span>}
                </div>
                <div className={styles.field}>
                  <label>Last Name <span className={styles.req}>*</span></label>
                  <input name="lastName" value={form.lastName} onChange={upd} placeholder="Smith" className={errors.lastName ? styles.inputErr : ''} />
                  {errors.lastName && <span className={styles.err}>{errors.lastName}</span>}
                </div>
              </div>

              {/* Phone + Email */}
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label>Phone <span className={styles.req}>*</span></label>
                  <input name="phone" value={form.phone} onChange={upd} placeholder="(313) 555-0100" className={errors.phone ? styles.inputErr : ''} />
                  {errors.phone && <span className={styles.err}>{errors.phone}</span>}
                </div>
                <div className={styles.field}>
                  <label>Email <span className={styles.req}>*</span></label>
                  <input name="email" type="email" value={form.email} onChange={upd} placeholder="john@email.com" className={errors.email ? styles.inputErr : ''} />
                  {errors.email && <span className={styles.err}>{errors.email}</span>}
                </div>
              </div>

              {/* Vehicle */}
              <div className={styles.field}>
                <label>Vehicle of Interest</label>
                <input name="vehicle" value={form.vehicle} onChange={upd} placeholder="e.g. 2020 Honda Accord" />
              </div>

              {/* Date + Time */}
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label>Preferred Date <span className={styles.req}>*</span></label>
                  <input name="preferredDate" type="date" min={today} value={form.preferredDate} onChange={upd} className={errors.preferredDate ? styles.inputErr : ''} />
                  {errors.preferredDate && <span className={styles.err}>{errors.preferredDate}</span>}
                </div>
                <div className={styles.field}>
                  <label>Preferred Time <span className={styles.req}>*</span></label>
                  <select name="preferredTime" value={form.preferredTime} onChange={upd} className={errors.preferredTime ? styles.inputErr : ''}>
                    <option value="">Select a time</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.preferredTime && <span className={styles.err}>{errors.preferredTime}</span>}
                </div>
              </div>

              {/* Notes */}
              <div className={styles.field}>
                <label>Additional Notes</label>
                <textarea name="notes" value={form.notes} onChange={upd} rows={3} placeholder="Any questions or special requests..." />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting
                  ? <><span className="btn-spinner" />Submitting...</>
                  : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px',verticalAlign:'middle'}}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>Schedule Test Drive</>
                }
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
