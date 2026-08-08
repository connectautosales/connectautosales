'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import styles from './page.module.css'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
const YEARS_AT  = ['0','1','2','3','4','5','6','7','8','9','10+']
const MONTHS_AT = ['0','1','2','3','4','5','6','7','8','9','10','11']

const STEPS = [
  { id:1, label:'Personal Info',         icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  { id:2, label:'Residence',             icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg> },
  { id:3, label:'Employment',            icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
  { id:4, label:'Desired Vehicle',       icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H3v-5l2.5-6h13L21 12v5h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg> },
  { id:5, label:'Payment / References',  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  { id:6, label:'Agreement & Signature', icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
]

const FAQS = [
  { q:'Do I need good credit to get approved?', a:'No! We work with all credit types including bad credit, no credit, and first-time buyers. Our network of lenders specializes in helping everyone get approved.' },
  { q:'How long does approval take?', a:'Most applications receive a response within 24-48 hours. In many cases we can get you pre-approved the same day.' },
  { q:'Can I finance a rebuilt title vehicle?', a:'Yes, we offer financing options for rebuilt title vehicles. Terms may vary based on the lender and vehicle condition.' },
  { q:'Can I trade in my current vehicle?', a:'Absolutely! We accept trade-ins. The value of your trade-in can be applied toward your down payment.' },
  { q:'Can I use my own bank or credit union?', a:'Yes, you are welcome to arrange your own financing through your bank or credit union. We will work with any lender you choose.' },
  { q:'Can I apply online?', a:'Yes! You can complete our full financing application online right here. Our team will follow up with you shortly after submission.' },
]

const EMPTY_FORM = {
  // Step 1
  firstName:'', middleName:'', lastName:'',
  dob:'', phone:'', homePhone:'', email:'',
  ssn:'', idType:'drivers-license', driversLicense:'', idExpiration:'', stateIssuance:'',
  // Step 2
  address:'', city:'', state:'', zip:'',
  timeAtAddressYr:'0', timeAtAddressMo:'0',
  housingStatus:'', monthlyRent:'',
  landlordName:'', landlordPhone:'',
  prevAddress:'', prevCity:'', prevState:'', prevZip:'',
  prevTimeAtAddressYr:'0', prevTimeAtAddressMo:'0', prevMonthlyRent:'',
  // Step 3
  employmentStatus:'', incomeSource:'', incomeAmount:'', incomeFrequency:'', hoursPerWeek:'',
  occupation:'', employer:'', employerAddress:'', employerCity:'', employerState:'', employerZip:'', employerPhone:'', supervisor:'',
  timeEmployedYr:'0', timeEmployedMo:'0',
  jobTitle:'', monthlyIncome:'',
  prevEmployer:'',
  addlIncome:'no', addlIncomeSource:'', addlIncomeAmount:'', addlIncomeFreq:'',
  // Step 4
  vehicleYear:'', vehicleMake:'', vehicleModel:'', vehicleMileage:'', stockNumber:'',
  tradeIn:'no', tradeInPaidOff:'', tradeInPayoff:'',
  tradeInYear:'', tradeInMake:'', tradeInModel:'', tradeInMileage:'', tradeInVin:'',
  // Step 5
  loanAmount:'', downPayment:'', desiredMonthly:'',
  additionalComments:'', referralSource:'',
  hasReference:'no', refName:'', refPhone:'', refRelation:'', refAddress:'',
  // Step 6
  agreeTerms:false,
}

function Field({ label, req, children, col3, col2, error }) {
  return (
    <div className={`${styles.field} ${col3 ? styles.col3 : ''} ${col2 ? styles.col2 : ''}`}>
      <label>{label}{req && <span className={styles.req}> *</span>}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  )
}

function SectionLabel({ title }) {
  return <div className={styles.sectionLabel}>{title}</div>
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div className={styles.radioGroup}>
      {options.map(opt => (
        <label key={opt.value} className={`${styles.radioOption} ${value === opt.value ? styles.radioChecked : ''}`}>
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={onChange} />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ssnRe   = /^(\d{3}-\d{2}-\d{4}|\d{9})$/

function isAdult(dobStr) {
  if (!dobStr) return false
  const dob = new Date(dobStr)
  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - 18)
  return dob <= cutoff
}

export default function FinancingPage() {
  const { getToken } = useRecaptcha()
  const successRef = useRef(null)
  const [step, setStep]         = useState(1)
  const [openFaq, setOpenFaq]   = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [signature, setSignature] = useState('')
  const [form, setForm]         = useState(EMPTY_FORM)
  const [errors, setErrors]     = useState({})
  const formRef = useRef(null)

  const scrollToFirstError = (errs) => {
    const firstKey = Object.keys(errs)[0]
    if (!firstKey) return
    setTimeout(() => {
      const el = document.querySelector(`[name="${firstKey}"]`) || document.getElementById(firstKey)
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 120
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      }
    }, 50)
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const upd = e => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [e.target.name]: v }))
    if (errors[e.target.name]) setErrors(prev => { const n = {...prev}; delete n[e.target.name]; return n })
  }

  const noIncome    = ['unemployed', 'student'].includes(form.employmentStatus)
  const showEmployer = ['employed', 'self-employed', 'military', 'retired-military'].includes(form.employmentStatus)

  function validateStep(s) {
    const errs = {}
    if (s === 1) {
      if (!form.firstName.trim())      errs.firstName    = 'First Name cannot be blank.'
      if (!form.lastName.trim())       errs.lastName     = 'Last Name cannot be blank.'
      if (!form.dob)                   errs.dob          = 'Date of Birth cannot be blank.'
      else if (!isAdult(form.dob))     errs.dob          = 'You must be at least 18 years old.'
      if (!form.phone.trim() && !form.homePhone.trim()) errs.phone = 'At least one phone number is required.'
      else if (form.phone.trim() && !phoneRe.test(form.phone.trim()))     errs.phone     = 'Enter a valid phone number.'
      else if (form.homePhone.trim() && !phoneRe.test(form.homePhone.trim())) errs.homePhone = 'Enter a valid phone number.'
      if (!form.email.trim())          errs.email        = 'Email cannot be blank.'
      else if (!emailRe.test(form.email.trim())) errs.email = 'Enter a valid email address.'
      if (!form.ssn.trim())            errs.ssn          = 'SSN# cannot be blank.'
      else if (!ssnRe.test(form.ssn.trim())) errs.ssn    = 'Enter SSN in format XXX-XX-XXXX.'
      if (!form.driversLicense.trim()) errs.driversLicense = 'ID Number cannot be blank.'
      if (!form.idExpiration)          errs.idExpiration = 'Expiration Date cannot be blank.'
      if (!form.stateIssuance)         errs.stateIssuance = 'Issuing State cannot be blank.'
    }
    if (s === 2) {
      if (!form.address.trim())        errs.address      = 'Address cannot be blank.'
      if (!form.city.trim())           errs.city         = 'City cannot be blank.'
      if (!form.state)                 errs.state        = 'State cannot be blank.'
      if (!form.zip.trim())            errs.zip          = 'ZIP Code cannot be blank.'
      if (!form.housingStatus)         errs.housingStatus = 'Housing Status cannot be blank.'
      const yrs = parseInt(form.timeAtAddressYr || '0')
      if (yrs < 2) {
        if (!form.prevAddress.trim())  errs.prevAddress  = 'Previous address is required.'
        if (!form.prevCity.trim())     errs.prevCity     = 'City is required.'
        if (!form.prevState)           errs.prevState    = 'State is required.'
        if (!form.prevZip.trim())      errs.prevZip      = 'ZIP is required.'
      }
    }
    if (s === 3) {
      if (!form.employmentStatus)      errs.employmentStatus = 'Employment Status cannot be blank.'
      if (!noIncome && form.employmentStatus) {
        if (!form.monthlyIncome.trim()) errs.monthlyIncome = 'Monthly Income cannot be blank.'
        if (showEmployer) {
          if (!form.occupation.trim())    errs.occupation    = 'Occupation cannot be blank.'
          if (!form.employer.trim())      errs.employer      = 'Employer Name cannot be blank.'
          if (!form.employerCity.trim())  errs.employerCity  = 'Employer City cannot be blank.'
          if (!form.employerState)        errs.employerState = 'Employer State cannot be blank.'
          if (!form.employerPhone.trim()) errs.employerPhone = 'Employer Phone cannot be blank.'
          if (!form.supervisor.trim())    errs.supervisor    = 'Supervisor Name cannot be blank.'
        }
        if (form.addlIncome === 'yes') {
          if (!form.addlIncomeSource.trim()) errs.addlIncomeSource = 'Income source cannot be blank.'
          if (!form.addlIncomeAmount.trim()) errs.addlIncomeAmount = 'Income amount cannot be blank.'
        }
      }
    }
    if (s === 4) {
      if (!form.vehicleYear.trim())  errs.vehicleYear  = 'Year is required.'
      if (!form.vehicleMake.trim())  errs.vehicleMake  = 'Make is required.'
      if (!form.vehicleModel.trim()) errs.vehicleModel = 'Model is required.'
      if (form.tradeIn === 'yes') {
        if (!form.tradeInPaidOff) errs.tradeInPaidOff = 'Please select if trade-in is paid off.'
        if (!form.tradeInVin.trim())     errs.tradeInVin     = 'VIN is required for trade-in.'
        if (!form.tradeInMileage.trim()) errs.tradeInMileage = 'Mileage is required for trade-in.'
      }
    }
    if (s === 5) {
      if (!form.loanAmount.trim())     errs.loanAmount   = 'Desired Loan Amount cannot be blank.'
      if (!form.downPayment.trim())    errs.downPayment  = 'Down Payment cannot be blank.'
    }
    if (s === 6) {
      if (!signature.trim())           errs.signature    = 'E-Signature cannot be blank.'
      if (!form.agreeTerms)            errs.agreeTerms   = 'You must agree to the terms.'
    }
    return errs
  }

  function goNext() {
    const errs = validateStep(step)
    if (Object.keys(errs).length) { setErrors(errs); scrollToFirstError(errs); return }
    setErrors({})
    setStep(s => s + 1)
    setTimeout(scrollToForm, 50)
  }

  // Conditional: show previous address if < 2 yrs at current address
  const showPrevAddress = parseInt(form.timeAtAddressYr || '0') < 2

  // Conditional: show landlord fields if renting
  const showLandlord = form.housingStatus === 'rent'

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validateStep(6)
    if (Object.keys(errs).length) { setErrors(errs); scrollToFirstError(errs); return }
    setSubmitting(true)
    try {
      const recaptchaToken = await getToken('financing')
      const res = await fetch('/api/financing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, signature, recaptchaToken }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Submission failed. Please try again.')
      }
      setSubmitError('')
      setSubmitted(true)
      setTimeout(() => {
        const el = successRef.current
        if (!el) return
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      }, 100)
    } catch {
      setSubmitError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.successWrap}>
        <div ref={successRef} className={styles.successBox}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <h2>Application Submitted!</h2>
          <p>Our financing team will contact you within 24 hours.</p>
          <Link href="/inventory" className={styles.backBtn}>Browse Inventory</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>FINANCING <span className={styles.red}>MADE EASY</span></h1>
          <p>Simple process. Fast approvals. Drive home today.</p>
        </div>
      </section>

      {/* Badges */}
      <section className={styles.badgesSection}>
        <div className={styles.badgesCard}>
          {[
            { label:'All Credit Types Welcome', icon:<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.5"><circle cx="9" cy="7" r="3"/><path d="M2 20c0-3.3 3.1-6 7-6"/><circle cx="16" cy="9" r="3"/><path d="M22 20c0-3.3-2.7-6-6-6"/></svg> },
            { label:'Fast Approval Process',    icon:<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg> },
            { label:'Financing Options Available', icon:<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 6v1m0 10v1M9 9.2C9 8 10.3 7 12 7s3 1 3 2.2c0 2.5-3 2.8-3 5.3M12 17h.01"/></svg> },
            { label:'Secure Online Application', icon:<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.5"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/><circle cx="12" cy="16" r="1.2" fill="#e50202" stroke="none"/></svg> },
          ].map(b => (
            <div key={b.label} className={styles.badge}>
              {b.icon}
              <span className={styles.badgeLabel}>{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Form Card */}
      <section ref={formRef} className={styles.formSection}>
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
            <div>
              <h2 className={styles.cardTitle}>Start Your Secure Financing Application</h2>
              <p className={styles.cardSub}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
                Your information is encrypted and securely transmitted.
              </p>
            </div>
          </div>

          <div className={styles.formLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              {STEPS.map(s => (
                <button key={s.id} type="button"
                  className={`${styles.stepBtn} ${step === s.id ? styles.stepActive : ''} ${step > s.id ? styles.stepDone : ''}`}
                  onClick={() => { if (s.id < step) { setErrors({}); setStep(s.id) } }}
                  style={{ cursor: s.id < step ? 'pointer' : 'default' }}
                >
                  <span className={styles.stepCircle}>
                    {step > s.id
                      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : s.id}
                  </span>
                  <span className={styles.stepIcon}>{s.icon}</span>
                  <span className={styles.stepLabel}>{s.label}</span>
                </button>
              ))}
            </aside>

            {/* Form Body */}
            <div className={styles.formBody}>
              <form onSubmit={handleSubmit}>

                {/* â”€â”€ STEP 1: Personal Info â”€â”€ */}
                {step === 1 && (
                  <>
                    <h3 className={styles.stepTitle}>Personal Information</h3>
                    <div className={styles.grid3}>
                      <Field label="First Name" req error={errors.firstName}><input name="firstName" value={form.firstName} onChange={upd} placeholder="First Name" className={errors.firstName ? styles.inputError : ''} /></Field>
                      <Field label="Middle Name"><input name="middleName" value={form.middleName} onChange={upd} placeholder="Middle Name" /></Field>
                      <Field label="Last Name" req error={errors.lastName}><input name="lastName" value={form.lastName} onChange={upd} placeholder="Last Name" className={errors.lastName ? styles.inputError : ''} /></Field>
                      <Field label="Date of Birth" req error={errors.dob}><input name="dob" type="date" value={form.dob} onChange={upd} className={errors.dob ? styles.inputError : ''} /></Field>
                      <Field label="Cell Phone" req error={errors.phone}><input name="phone" value={form.phone} onChange={upd} placeholder="(000) 000-0000" className={errors.phone ? styles.inputError : ''} /></Field>
                      <Field label="Home Phone" error={errors.homePhone}><input name="homePhone" value={form.homePhone} onChange={upd} placeholder="(000) 000-0000" className={errors.homePhone ? styles.inputError : ''} /></Field>
                      <Field label="Email" req col2 error={errors.email}><input name="email" type="email" value={form.email} onChange={upd} placeholder="you@example.com" className={errors.email ? styles.inputError : ''} /></Field>
                      <Field label="Social Security Number" req error={errors.ssn}><input name="ssn" value={form.ssn} onChange={upd} placeholder="XXX-XX-XXXX" className={errors.ssn ? styles.inputError : ''} /></Field>
                    </div>

                    <SectionLabel title="ID Information" />
                    <div className={styles.grid3}>
                      <Field label="ID Type" req>
                        <select name="idType" value={form.idType} onChange={upd}>
                          <option value="drivers-license">Driver&apos;s License</option>
                          <option value="passport">Passport</option>
                          <option value="government-id">Government ID</option>
                          <option value="military-id">Military ID</option>
                          <option value="other">Other</option>
                        </select>
                      </Field>
                      <Field label="ID Number" req error={errors.driversLicense}><input name="driversLicense" value={form.driversLicense} onChange={upd} placeholder="ID / License Number" className={errors.driversLicense ? styles.inputError : ''} /></Field>
                      <Field label="Expiration Date" req error={errors.idExpiration}><input name="idExpiration" type="date" value={form.idExpiration} onChange={upd} className={errors.idExpiration ? styles.inputError : ''} /></Field>
                      <Field label="Issuing State" req error={errors.stateIssuance}>
                        <select name="stateIssuance" value={form.stateIssuance} onChange={upd} className={errors.stateIssuance ? styles.inputError : ''}>
                          <option value="">Select State</option>
                          {US_STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                    </div>
                  </>
                )}

                {/* â”€â”€ STEP 2: Residence â”€â”€ */}
                {step === 2 && (
                  <>
                    <h3 className={styles.stepTitle}>Residence Information</h3>
                    <div className={styles.grid3}>
                      <Field label="Street Address" req col3 error={errors.address}><input name="address" value={form.address} onChange={upd} placeholder="Street Address" className={errors.address ? styles.inputError : ''} /></Field>
                      <Field label="City" req error={errors.city}><input name="city" value={form.city} onChange={upd} placeholder="City" className={errors.city ? styles.inputError : ''} /></Field>
                      <Field label="State" req error={errors.state}>
                        <select name="state" value={form.state} onChange={upd} className={errors.state ? styles.inputError : ''}>
                          <option value="">Select State</option>
                          {US_STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="ZIP Code" req error={errors.zip}><input name="zip" value={form.zip} onChange={upd} placeholder="ZIP Code" className={errors.zip ? styles.inputError : ''} /></Field>
                    </div>

                    <SectionLabel title="Time at Current Address" />
                    <div className={styles.grid3}>
                      <Field label="Years">
                        <select name="timeAtAddressYr" value={form.timeAtAddressYr} onChange={upd}>
                          {YEARS_AT.map(y => <option key={y} value={y}>{y} year{y !== '1' ? 's' : ''}</option>)}
                        </select>
                      </Field>
                      <Field label="Months">
                        <select name="timeAtAddressMo" value={form.timeAtAddressMo} onChange={upd}>
                          {MONTHS_AT.map(m => <option key={m} value={m}>{m} month{m !== '1' ? 's' : ''}</option>)}
                        </select>
                      </Field>
                      <Field label="Housing Status" req error={errors.housingStatus}>
                        <select name="housingStatus" value={form.housingStatus} onChange={upd} className={errors.housingStatus ? styles.inputError : ''}>
                          <option value="">Select</option>
                          <option value="own">Own</option>
                          <option value="rent">Rent</option>
                          <option value="mortgage">Mortgage</option>
                          <option value="military">Military Housing</option>
                          <option value="family">Living with Family</option>
                          <option value="other">Other</option>
                        </select>
                      </Field>
                      <Field label="Monthly Rent / Mortgage (enter 0 if none)">
                        <input name="monthlyRent" value={form.monthlyRent} onChange={upd} placeholder="$0" />
                      </Field>
                    </div>

                    {/* Conditional: Landlord info if renting */}
                    {showLandlord && (
                      <>
                        <SectionLabel title="Landlord Information" />
                        <div className={styles.grid3}>
                          <Field label="Landlord Name"><input name="landlordName" value={form.landlordName} onChange={upd} placeholder="Landlord Full Name" /></Field>
                          <Field label="Landlord Phone"><input name="landlordPhone" value={form.landlordPhone} onChange={upd} placeholder="(000) 000-0000" /></Field>
                        </div>
                      </>
                    )}

                    {/* Conditional: Previous address if < 2 years */}
                    {showPrevAddress && (
                      <>
                        <SectionLabel title="Previous Address (less than 2 years at current address)" />
                        <div className={styles.grid3}>
                          <Field label="Street Address" req col3 error={errors.prevAddress}><input name="prevAddress" value={form.prevAddress} onChange={upd} placeholder="Previous Street Address" className={errors.prevAddress ? styles.inputError : ''} /></Field>
                          <Field label="City" req error={errors.prevCity}><input name="prevCity" value={form.prevCity} onChange={upd} placeholder="City" className={errors.prevCity ? styles.inputError : ''} /></Field>
                          <Field label="State" req error={errors.prevState}>
                            <select name="prevState" value={form.prevState} onChange={upd} className={errors.prevState ? styles.inputError : ''}>
                              <option value="">Select State</option>
                              {US_STATES.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </Field>
                          <Field label="ZIP" req error={errors.prevZip}><input name="prevZip" value={form.prevZip} onChange={upd} placeholder="ZIP" className={errors.prevZip ? styles.inputError : ''} /></Field>
                          <Field label="Years at Previous Address">
                            <select name="prevTimeAtAddressYr" value={form.prevTimeAtAddressYr} onChange={upd}>
                              {YEARS_AT.map(y => <option key={y} value={y}>{y} year{y !== '1' ? 's' : ''}</option>)}
                            </select>
                          </Field>
                          <Field label="Months">
                            <select name="prevTimeAtAddressMo" value={form.prevTimeAtAddressMo} onChange={upd}>
                              {MONTHS_AT.map(m => <option key={m} value={m}>{m} month{m !== '1' ? 's' : ''}</option>)}
                            </select>
                          </Field>
                          <Field label="Monthly Rent / Mortgage at Previous Address">
                            <input name="prevMonthlyRent" value={form.prevMonthlyRent} onChange={upd} placeholder="$0" />
                          </Field>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* â”€â”€ STEP 3: Employment â”€â”€ */}
                {step === 3 && (
                  <>
                    <h3 className={styles.stepTitle}>Employment Information</h3>
                    <div className={styles.grid3}>
                      <Field label="Employment Status" req col2 error={errors.employmentStatus}>
                        <select name="employmentStatus" value={form.employmentStatus} onChange={upd} className={errors.employmentStatus ? styles.inputError : ''}>
                          <option value="">Select Status</option>
                          <option value="employed">Employed</option>
                          <option value="self-employed">Self Employed</option>
                          <option value="retired">Retired</option>
                          <option value="military">Active Military</option>
                          <option value="student">Student</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="other">Other</option>
                        </select>
                      </Field>
                    </div>

                    {noIncome && (
                      <div className={styles.warningBox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Unfortunately, we are unable to provide financing without a verifiable source of income.
                      </div>
                    )}

                    {!noIncome && form.employmentStatus && (
                      <>
                        <SectionLabel title="Income Details" />
                        <div className={styles.grid3}>
                          <Field label="Income Source" req>
                            <select name="incomeSource" value={form.incomeSource} onChange={upd}>
                              <option value="">Select</option>
                              <option value="salary">Salary</option>
                              <option value="fixed-income">Fixed Income</option>
                              <option value="ssi">SSI</option>
                              <option value="cash">Cash Income</option>
                              <option value="other">Other</option>
                            </select>
                          </Field>
                          <Field label="Income Amount ($)" req error={errors.monthlyIncome}><input name="monthlyIncome" value={form.monthlyIncome} onChange={upd} placeholder="$0" className={errors.monthlyIncome ? styles.inputError : ''} /></Field>
                          <Field label="Income Frequency" req>
                            <select name="incomeFrequency" value={form.incomeFrequency} onChange={upd}>
                              <option value="">Select</option>
                              <option value="weekly">Weekly</option>
                              <option value="bi-weekly">Bi-Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="hourly">Per Hour</option>
                            </select>
                          </Field>
                          {form.incomeFrequency === 'hourly' && (
                            <Field label="Hours Per Week"><input name="hoursPerWeek" value={form.hoursPerWeek} onChange={upd} placeholder="e.g. 40" /></Field>
                          )}
                        </div>

                        {showEmployer && (
                          <>
                            <SectionLabel title="Employer Information" />
                            <div className={styles.grid3}>
                              <Field label="Occupation" req error={errors.occupation}><input name="occupation" value={form.occupation} onChange={upd} placeholder="Job Title / Occupation" className={errors.occupation ? styles.inputError : ''} /></Field>
                              <Field label="Employer Name" req error={errors.employer}><input name="employer" value={form.employer} onChange={upd} placeholder="Employer Name" className={errors.employer ? styles.inputError : ''} /></Field>
                              <Field label="Employer Street Address" col3><input name="employerAddress" value={form.employerAddress} onChange={upd} placeholder="Street Address" /></Field>
                              <Field label="Employer City" req error={errors.employerCity}><input name="employerCity" value={form.employerCity} onChange={upd} placeholder="City" className={errors.employerCity ? styles.inputError : ''} /></Field>
                              <Field label="Employer State" req error={errors.employerState}>
                                <select name="employerState" value={form.employerState} onChange={upd} className={errors.employerState ? styles.inputError : ''}>
                                  <option value="">Select State</option>
                                  {US_STATES.map(s => <option key={s}>{s}</option>)}
                                </select>
                              </Field>
                              <Field label="Employer ZIP" error={errors.employerZip}><input name="employerZip" value={form.employerZip} onChange={upd} placeholder="ZIP Code" className={errors.employerZip ? styles.inputError : ''} /></Field>
                              <Field label="Employer Phone" req error={errors.employerPhone}><input name="employerPhone" value={form.employerPhone} onChange={upd} placeholder="(000) 000-0000" className={errors.employerPhone ? styles.inputError : ''} /></Field>
                              <Field label="Supervisor Name" req error={errors.supervisor}><input name="supervisor" value={form.supervisor} onChange={upd} placeholder="Supervisor Name" className={errors.supervisor ? styles.inputError : ''} /></Field>
                            </div>

                            <SectionLabel title="Time at Current Job" />
                            <div className={styles.grid3}>
                              <Field label="Years">
                                <select name="timeEmployedYr" value={form.timeEmployedYr} onChange={upd}>
                                  {YEARS_AT.map(y => <option key={y} value={y}>{y} year{y !== '1' ? 's' : ''}</option>)}
                                </select>
                              </Field>
                              <Field label="Months">
                                <select name="timeEmployedMo" value={form.timeEmployedMo} onChange={upd}>
                                  {MONTHS_AT.map(m => <option key={m} value={m}>{m} month{m !== '1' ? 's' : ''}</option>)}
                                </select>
                              </Field>
                            </div>
                          </>
                        )}

                        <SectionLabel title="Additional Income" />
                        <div className={styles.grid3}>
                          <Field label="Do you have additional income?" col3>
                            <RadioGroup name="addlIncome" value={form.addlIncome} onChange={upd}
                              options={[{ value:'yes', label:'Yes' }, { value:'no', label:'No' }]} />
                          </Field>
                          {form.addlIncome === 'yes' && (
                            <>
                              <Field label="Income Source" error={errors.addlIncomeSource}><input name="addlIncomeSource" value={form.addlIncomeSource} onChange={upd} placeholder="Source of additional income" className={errors.addlIncomeSource ? styles.inputError : ''} /></Field>
                              <Field label="Amount ($)" error={errors.addlIncomeAmount}><input name="addlIncomeAmount" value={form.addlIncomeAmount} onChange={upd} placeholder="$0" className={errors.addlIncomeAmount ? styles.inputError : ''} /></Field>
                              <Field label="Frequency">
                                <select name="addlIncomeFreq" value={form.addlIncomeFreq} onChange={upd}>
                                  <option value="">Select</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="bi-weekly">Bi-Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="yearly">Yearly</option>
                                </select>
                              </Field>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* â”€â”€ STEP 4: Desired Vehicle â”€â”€ */}
                {step === 4 && (
                  <>
                    <h3 className={styles.stepTitle}>Desired Vehicle</h3>
                    <div className={styles.grid3}>
                      <Field label="Year" req error={errors.vehicleYear}><input name="vehicleYear" value={form.vehicleYear} onChange={upd} placeholder="e.g. 2022" className={errors.vehicleYear ? styles.inputError : ''} /></Field>
                      <Field label="Make" req error={errors.vehicleMake}><input name="vehicleMake" value={form.vehicleMake} onChange={upd} placeholder="e.g. Toyota" className={errors.vehicleMake ? styles.inputError : ''} /></Field>
                      <Field label="Model" req error={errors.vehicleModel}><input name="vehicleModel" value={form.vehicleModel} onChange={upd} placeholder="e.g. Camry" className={errors.vehicleModel ? styles.inputError : ''} /></Field>
                      <Field label="Mileage"><input name="vehicleMileage" value={form.vehicleMileage} onChange={upd} placeholder="e.g. 45,000" /></Field>
                      <Field label="Stock Number"><input name="stockNumber" value={form.stockNumber} onChange={upd} placeholder="Stock #" /></Field>
                    </div>

                    <SectionLabel title="Trade-In Vehicle" />
                    <div className={styles.grid3}>
                      <Field label="Do you have a trade-in?" col3>
                        <RadioGroup name="tradeIn" value={form.tradeIn} onChange={upd}
                          options={[{ value:'no', label:'No' }, { value:'yes', label:'Yes' }]} />
                      </Field>

                      {form.tradeIn === 'yes' && (
                        <>
                          <Field label="Is the vehicle paid off?" col3 error={errors.tradeInPaidOff}>
                            <RadioGroup name="tradeInPaidOff" value={form.tradeInPaidOff} onChange={upd}
                              options={[{ value:'yes', label:'Yes - Paid Off' }, { value:'no', label:'No - Still Has a Loan' }]} />
                          </Field>

                          {form.tradeInPaidOff === 'no' && (
                            <Field label="Payoff Amount on Current Loan">
                              <input name="tradeInPayoff" value={form.tradeInPayoff} onChange={upd} placeholder="$0" />
                            </Field>
                          )}

                          <SectionLabel title="Trade-In Vehicle Details" />
                          <Field label="Year"><input name="tradeInYear" value={form.tradeInYear} onChange={upd} placeholder="e.g. 2019" /></Field>
                          <Field label="Make"><input name="tradeInMake" value={form.tradeInMake} onChange={upd} placeholder="e.g. Honda" /></Field>
                          <Field label="Model"><input name="tradeInModel" value={form.tradeInModel} onChange={upd} placeholder="e.g. Civic" /></Field>
                          <Field label="Mileage *" error={errors.tradeInMileage}><input name="tradeInMileage" value={form.tradeInMileage} onChange={upd} placeholder="e.g. 80,000" /></Field>
                          <Field label="VIN *" error={errors.tradeInVin}><input name="tradeInVin" value={form.tradeInVin} onChange={upd} placeholder="Vehicle Identification Number" /></Field>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* â”€â”€ STEP 5: Payment & References â”€â”€ */}
                {step === 5 && (
                  <>
                    <h3 className={styles.stepTitle}>Payment &amp; References</h3>
                    <div className={styles.grid3}>
                      <Field label="Desired Loan Amount" req error={errors.loanAmount}><input name="loanAmount" value={form.loanAmount} onChange={upd} placeholder="$0" className={errors.loanAmount ? styles.inputError : ''} /></Field>
                      <Field label="Available Down Payment" req error={errors.downPayment}><input name="downPayment" value={form.downPayment} onChange={upd} placeholder="$0" className={errors.downPayment ? styles.inputError : ''} /></Field>
                      <Field label="Desired Monthly Payment"><input name="desiredMonthly" value={form.desiredMonthly} onChange={upd} placeholder="$0" /></Field>
                      <Field label="Additional Comments" col3>
                        <textarea name="additionalComments" value={form.additionalComments} onChange={upd} placeholder="Any additional information..." rows={3} style={{resize:'vertical'}} />
                      </Field>
                    </div>

                    <SectionLabel title="How Did You Hear About Us?" />
                    <div className={styles.grid3}>
                      <Field label="" col3>
                        <RadioGroup name="referralSource" value={form.referralSource} onChange={upd}
                          options={[
                            { value:'referral', label:'Referral' },
                            { value:'past-customer', label:'Past Customer' },
                            { value:'website', label:'Website' },
                            { value:'social-media', label:'Social Media' },
                            { value:'other', label:'Other' },
                          ]} />
                      </Field>
                    </div>

                    <SectionLabel title="References" />
                    <div className={styles.grid3}>
                      <Field label="Do you have a reference?" col3>
                        <RadioGroup name="hasReference" value={form.hasReference} onChange={upd}
                          options={[{ value:'no', label:'No' }, { value:'yes', label:'Yes' }]} />
                      </Field>

                      {form.hasReference === 'yes' && (
                        <>
                          <Field label="Reference Name"><input name="refName" value={form.refName} onChange={upd} placeholder="Full Name" /></Field>
                          <Field label="Relationship to You"><input name="refRelation" value={form.refRelation} onChange={upd} placeholder="e.g. Friend, Family" /></Field>
                          <Field label="Reference Phone"><input name="refPhone" value={form.refPhone} onChange={upd} placeholder="(000) 000-0000" /></Field>
                          <Field label="Reference Address" col3><input name="refAddress" value={form.refAddress} onChange={upd} placeholder="Street Address" /></Field>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* â”€â”€ STEP 6: Agreement & Signature â”€â”€ */}
                {step === 6 && (
                  <>
                    <h3 className={styles.stepTitle}>Agreement &amp; Signature</h3>
                    <div className={styles.agreementBox}>
                      <p>I represent, warrant and affirm that the above information is true and correct and have been made in order to induce you, the dealer, to grant me credit to acquire a vehicle by relying on the above knowledge. By submitting this form I authorize you, the dealer, to verify the correctness of the information by verifying my employment and residence and also to acquire other reports, including but not limited to credit bureau reports, to analyze my creditworthiness. I authorize you to retain this application and any credit agreement as your property. I certify that I am 18 years of age or older and that I have read, understand, and agree to all terms stated herein.</p>
                    </div>
                    <div className={styles.signWrap}>
                      <label className={styles.signLabel}>E-Signature <span className={styles.req}>*</span></label>
                      <input
                        className={`${styles.signInput} ${errors.signature ? styles.inputError : ''}`}
                        placeholder="Type your full name as your electronic signature"
                        value={signature}
                        onChange={e => { setSignature(e.target.value); if (errors.signature) setErrors(p => { const n={...p}; delete n.signature; return n }) }}
                      />
                      {errors.signature && <span className={styles.fieldError}>{errors.signature}</span>}
                      <label className={styles.checkRow} style={errors.agreeTerms ? {color:'#c00'} : {}}>
                        <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={upd} />
                        I have read and agree to the terms and conditions above.
                      </label>
                      {errors.agreeTerms && <span className={styles.fieldError}>{errors.agreeTerms}</span>}
                    </div>
                  </>
                )}

                <div className={styles.navRow}>
                  {step > 1 && (
                    <button type="button" onClick={() => { setErrors({}); setStep(s => s - 1); setTimeout(scrollToForm, 50) }} className={styles.prevBtn}>&larr; PREV STEP</button>
                  )}
                  {step < 6
                    ? <button type="button" onClick={goNext} className={styles.nextBtn}>NEXT STEP <span style={{fontSize:'1.1em',lineHeight:1}}>&#8250;</span></button>
                    : <>
                        {submitError && (
                          <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:6,padding:'12px 16px',marginBottom:12,fontSize:13,color:'#991b1b',fontWeight:500,textAlign:'center'}}>
                            {submitError}
                          </div>
                        )}
                        <button type="submit" className={styles.nextBtn} disabled={submitting}>{submitting ? <><span className="btn-spinner" />SUBMITTING...</> : 'SUBMIT APPLICATION'}</button>
                      </>
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Docs + FAQ */}
      <section className={styles.docFaqSection}>
        <div className={styles.docFaqInner}>
          <div>
            <h3 className={styles.blockTitle}>Required Documents</h3>
            <div className={styles.docsRow}>
              {[
                { label:"Driver's License", icon:<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.4"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="7.5" cy="11" r="2"/><path d="M14 9h4M14 13h3M4 17h2"/></svg> },
                { label:'Proof of Income',  icon:<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.4"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg> },
                { label:'Proof of Residence', icon:<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="1.4"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg> },
              ].map(d => (
                <div key={d.label} className={styles.docCard}>
                  <div className={styles.docIconBox}>{d.icon}</div>
                  <span className={styles.docLabel}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className={styles.blockTitle}>Frequently Asked Questions</h3>
            <div className={styles.faqList}>
              {FAQS.map((f, i) => (
                <div key={i} className={styles.faqItem}>
                  <button type="button" className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e50202" strokeWidth="2.5">
                      {openFaq === i ? <line x1="5" y1="12" x2="19" y2="12"/> : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
                    </svg>
                  </button>
                  {openFaq === i && <p className={styles.faqA}>{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
