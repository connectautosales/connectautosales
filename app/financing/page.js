'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function FinancingPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    employer: '', income: '', creditScore: '',
    vehicleInterest: '', downPayment: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <div className={styles.pageHero}>
        <div className="container">
          <h1 className={styles.pageHeroTitle}>Apply for Financing</h1>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Financing</span>
          </div>
        </div>
      </div>

      <section className={styles.financeIntro}>
        <div className="container">
          <div className={styles.introGrid}>
            {[
              { icon: '✓', title: 'All Credit Welcome', desc: 'Good, bad, or no credit — we work with all situations.' },
              { icon: '⚡', title: 'Fast Approval', desc: 'Get pre-approved in minutes. Drive today.' },
              { icon: '$', title: 'Low Down Payment', desc: 'Flexible down payment options to fit your budget.' },
              { icon: '🤝', title: 'Multiple Lenders', desc: 'We partner with many lenders to find you the best rate.' },
            ].map(item => (
              <div key={item.title} className={styles.introCard}>
                <div className={styles.introCardIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          {submitted ? (
            <div className={styles.successBox}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <h2>Application Submitted!</h2>
              <p>Thank you for applying. Our financing team will contact you within 24 hours.</p>
              <Link href="/inventory" className="btn-primary">Browse Inventory</Link>
            </div>
          ) : (
            <div className={styles.formWrap}>
              <h2 className={styles.formTitle}>Financing Application</h2>
              <p className={styles.formSubtitle}>Fill out the form below and our team will be in touch shortly.</p>
              <form onSubmit={handleSubmit}>
                <div className={styles.formSection2}>
                  <h3 className={styles.formSectionTitle}>Personal Information</h3>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}><label>First Name *</label><input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First name" /></div>
                    <div className={styles.formGroup}><label>Last Name *</label><input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last name" /></div>
                    <div className={styles.formGroup}><label>Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Email" /></div>
                    <div className={styles.formGroup}><label>Phone *</label><input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone number" /></div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Address</label><input name="address" value={form.address} onChange={handleChange} placeholder="Street address" /></div>
                    <div className={styles.formGroup}><label>City</label><input name="city" value={form.city} onChange={handleChange} placeholder="City" /></div>
                    <div className={styles.formGroup}><label>State</label><input name="state" value={form.state} onChange={handleChange} placeholder="State" /></div>
                  </div>
                </div>

                <div className={styles.formSection2}>
                  <h3 className={styles.formSectionTitle}>Financial Information</h3>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}><label>Employer</label><input name="employer" value={form.employer} onChange={handleChange} placeholder="Employer name" /></div>
                    <div className={styles.formGroup}><label>Monthly Income</label><input name="income" value={form.income} onChange={handleChange} placeholder="Monthly income" /></div>
                    <div className={styles.formGroup}>
                      <label>Credit Score (approx.)</label>
                      <select name="creditScore" value={form.creditScore} onChange={handleChange}>
                        <option value="">Select range</option>
                        <option value="excellent">Excellent (720+)</option>
                        <option value="good">Good (660–719)</option>
                        <option value="fair">Fair (580–659)</option>
                        <option value="poor">Poor (below 580)</option>
                        <option value="unknown">I don&apos;t know</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.formSection2}>
                  <h3 className={styles.formSectionTitle}>Vehicle of Interest</h3>
                  <div className={styles.formGrid2}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Vehicle Interested In</label><input name="vehicleInterest" value={form.vehicleInterest} onChange={handleChange} placeholder="e.g. 2020 Ford Edge or Any SUV" /></div>
                    <div className={styles.formGroup}><label>Down Payment Available</label><input name="downPayment" value={form.downPayment} onChange={handleChange} placeholder="e.g. $1,000" /></div>
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn}>Submit Application</button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
