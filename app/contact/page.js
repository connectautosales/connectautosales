'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

const faqs = [
  {
    q: 'Do I need an appointment?',
    a: 'Appointments are recommended, but walk-ins are welcome during business hours.',
  },
  {
    q: 'Can I test drive a vehicle?',
    a: 'Yes. Please bring a valid driver\'s license for all test drives.',
  },
  {
    q: 'Do you offer financing?',
    a: 'Yes. Financing options are available for many of our vehicles.',
  },
  {
    q: 'Do you sell rebuilt title vehicles?',
    a: 'Yes. We sell both clean title and rebuilt title vehicles. Information about previous damage is available for rebuilt vehicles.',
  },
  {
    q: 'Where are you located?',
    a: 'Connect Auto Sales is located at 4413 S Beech Daly St, Dearborn Heights, MI 48125.',
  },
  {
    q: 'Can I contact you outside business hours?',
    a: 'Yes. Feel free to send us a message through the website at any time. We will respond during the next business day.',
  },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ firstName: '', phone: '', email: '', topic: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ firstName: '', phone: '', email: '', topic: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>CONTACT <span>US</span></h1>
          <p className={styles.heroSub}>We&apos;re here to help — reach out anytime.</p>
        </div>
      </section>

      {/* ── 4 Contact Cards ───────────────────────── */}
      <section className={styles.contactCards}>
        <div className="container">
          <div className={styles.cardsGrid}>
            <a href="tel:3134133400" className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div className={styles.cardLabel}>CALL</div>
              <div className={styles.cardValue}>(313) 413-3400</div>
            </a>

            <a href="sms:3134133400" className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div className={styles.cardLabel}>TEXT</div>
              <div className={styles.cardValue}>(313) 413-3400</div>
            </a>

            <a href="https://maps.google.com/?q=4413+S+Beech+Daly+St+Dearborn+Heights+MI+48125" target="_blank" rel="noreferrer" className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className={styles.cardLabel}>VISIT</div>
              <div className={styles.cardValue}>4413 S Beech Daly St<br/>Dearborn Heights, MI 48125</div>
            </a>

            <a href="mailto:sales@connectautosales.com" className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className={styles.cardLabel}>EMAIL</div>
              <div className={styles.cardValue}>sales@connectautosales.com</div>
            </a>
          </div>
        </div>
      </section>

      {/* ── Hours + Map ───────────────────────────── */}
      <section className={styles.mapSection}>
        <div className="container">
          <div className={styles.mapGrid}>
            {/* Left — Hours + Social */}
            <div className={styles.hoursCol}>
              <div className={styles.hoursBox}>
                <div className={styles.hoursHead}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className={styles.hoursTitle}>BUSINESS HOURS</span>
                </div>
                <div className={styles.hoursDivider} />
                <div className={styles.hoursRows}>
                  <div className={styles.hoursRow}><span>Mon – Fri</span><span>10:00 AM – 6:00 PM</span></div>
                  <div className={styles.hoursRow}><span>Sat</span><span>10:00 AM – 4:00 PM</span></div>
                  <div className={styles.hoursRow}><span>Sun</span><span>Closed</span></div>
                </div>
              </div>

              <div className={styles.followBox}>
                <p className={styles.followTitle}>FOLLOW US</p>
                <div className={styles.followIcons}>
                  <a href="https://facebook.com/connectautosales" target="_blank" rel="noreferrer" className={styles.followIcon} style={{background:'#1877F2'}} aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  </a>
                  <a href="https://instagram.com/connectautosales" target="_blank" rel="noreferrer" className={styles.followIcon} style={{background:'radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285AEB 90%)'}} aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="https://tiktok.com/@connectautosales" target="_blank" rel="noreferrer" className={styles.followIcon} style={{background:'#010101'}} aria-label="TikTok">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
                  </a>
                  <a href="https://youtube.com/@connectautosales" target="_blank" rel="noreferrer" className={styles.followIcon} style={{background:'#FF0000'}} aria-label="YouTube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right — Map */}
            <div className={styles.mapCol}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2950.123456!2d-83.2784!3d42.3055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883b4f1d2e1b1b1b%3A0x1b1b1b1b1b1b1b1b!2s4413%20S%20Beech%20Daly%20St%2C%20Dearborn%20Heights%2C%20MI%2048125!5e0!3m2!1sen!2sus!4v1234567890"
                className={styles.mapIframe}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Connect Auto Sales Location"
              />
            </div>
          </div>

          {/* GET DIRECTIONS */}
          <a
            href="https://maps.google.com/?q=4413+S+Beech+Daly+St+Dearborn+Heights+MI+48125"
            target="_blank"
            rel="noreferrer"
            className={styles.directionsBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            GET DIRECTIONS
          </a>
        </div>
      </section>

      {/* ── Message + FAQ ─────────────────────────── */}
      <section className={styles.bottomSection}>
        <div className="container">
          <div className={styles.bottomGrid}>

            {/* Message Form */}
            <div>
              <h2 className={styles.sectionHeading}>MESSAGE US</h2>
              <div className={styles.headingLine} />

              {submitted ? (
                <div className={styles.successMsg}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Message sent! We'll respond during business hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.inputWrap}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.inputIcon}>
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className={styles.input} required />
                    </div>
                    <div className={styles.inputWrap}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.inputIcon}>
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className={styles.input} type="tel" />
                    </div>
                  </div>

                  <div className={styles.inputWrap}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.inputIcon}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className={styles.input} type="email" required />
                  </div>

                  <div className={styles.inputWrap}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.inputIcon}>
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <select name="topic" value={form.topic} onChange={handleChange} className={`${styles.input} ${styles.select}`}>
                      <option value="">What can we help you with?</option>
                      <option value="inventory">Vehicle Inquiry</option>
                      <option value="financing">Financing</option>
                      <option value="warranty">Warranty</option>
                      <option value="auction">Auction Services</option>
                      <option value="inspection">Salvage Inspection</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={styles.inputWrap}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${styles.inputIcon} ${styles.textareaIcon}`}>
                      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" className={`${styles.input} ${styles.textarea}`} rows={5} />
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    SEND MESSAGE
                  </button>
                  <p className={styles.secureNote}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Your information is secure and will never be shared.
                  </p>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className={styles.sectionHeading}>FAQ</h2>
              <div className={styles.headingLine} />

              <div className={styles.faqList}>
                {faqs.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <button
                      className={styles.faqQ}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{faq.q}</span>
                      <svg
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className={styles.faqA}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
