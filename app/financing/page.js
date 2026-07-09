'use client';
import { useState } from 'react';
import styles from './page.module.css';

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const sidebarSteps = [
  { num: 1, label: 'Personal Info', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { num: 2, label: 'Residence', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { num: 3, label: 'Employment', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  { num: 4, label: 'Desired Vehicle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { num: 5, label: 'Payment / References', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { num: 6, label: 'Agreement & Signature', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

const faqs = [
  { q: 'Do I need good credit to get approved?', a: 'No. We welcome all credit types including good credit, bad credit, first-time buyers, and no credit. We work with multiple lenders to find the best option for you.' },
  { q: 'How long does approval take?', a: 'Most financing applications are reviewed quickly. Our team will contact you as soon as possible after receiving your application.' },
  { q: 'Can I finance a rebuilt title vehicle?', a: 'Yes. Financing may be available on rebuilt title vehicles depending on the lender and vehicle qualifications.' },
  { q: 'Can I trade in my current vehicle?', a: 'Yes. We accept trade-ins. Mention your trade-in vehicle in the financing application and our team will evaluate it.' },
  { q: 'Can I use my own bank or credit union?', a: 'Yes. You are welcome to use your own financing institution. We can work with outside lenders to complete your purchase.' },
  { q: 'Can I apply online?', a: 'Yes. You can start your financing application right here on our website. Your information is encrypted and securely transmitted.' },
];

const features = [
  { label: 'All Credit\nTypes Welcome', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: 'Fast Approval\nProcess', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M6 2L2 6M22 6l-4-4" strokeWidth="1.2"/></svg> },
  { label: 'Financing Options\nAvailable', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: 'Secure Online\nApplication', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M9 11V9a3 3 0 0 1 6 0v2"/></svg> },
];

const docs = [
  { label: "Driver's License", icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h3"/></svg> },
  { label: 'Proof of Income', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: 'Proof of Residence', icon: <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e10001" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
];

const TOTAL_STEPS = 6;

export default function FinancingPage() {
  const [step, setStep] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    firstName: '', middleName: '', lastName: '',
    dob: '', phone: '', email: '',
    ssn: '', dlNumber: '', dlState: '',
    // Step 2
    address: '', city: '', state: '', zip: '',
    housingType: '', yearsAtAddress: '',
    monthlyRent: '',
    // Step 3
    employerName: '', jobTitle: '', employmentType: '',
    monthlyIncome: '', yearsEmployed: '',
    // Step 4
    vehicleYear: '', vehicleMake: '', vehicleModel: '',
    vehicleVin: '', downPayment: '', hasTradeIn: 'no',
    tradeInYear: '', tradeInMake: '', tradeInModel: '',
    // Step 5
    monthlyBudget: '',
    ref1Name: '', ref1Phone: '', ref1Relation: '',
    ref2Name: '', ref2Phone: '', ref2Relation: '',
    // Step 6
    agreeTerms: false, signature: '',
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleNext() {
    if (step < TOTAL_STEPS) setStep(step + 1);
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <h1 className={styles.heroTitle}>
            FINANCING<br /><span>MADE EASY</span>
          </h1>
        </div>
      </section>

      {/* ── Features bar ── */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresBar}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <span className={styles.featureLabel}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className={styles.formSection}>
        <div className="container">

          {/* Header */}
          <div className={styles.formHeader}>
            <div className={styles.formHeaderIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#020300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                <line x1="12" y1="16" x2="12" y2="16" strokeWidth="3"/>
              </svg>
            </div>
            <div>
              <h2 className={styles.formHeaderTitle}>Start Your Secure Financing Application</h2>
              <p className={styles.formHeaderSub}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Your information is encrypted and securely transmitted.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className={styles.successBox}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
              <h3>Application Submitted!</h3>
              <p>Thank you. Our financing team will review your application and contact you shortly.</p>
            </div>
          ) : (
            <div className={styles.formCard}>
              {/* Sidebar */}
              <div className={styles.sidebar}>
                {sidebarSteps.map(s => (
                  <button
                    key={s.num}
                    type="button"
                    className={`${styles.sidebarItem} ${step === s.num ? styles.sidebarActive : ''} ${step > s.num ? styles.sidebarDone : ''}`}
                    onClick={() => step > s.num && setStep(s.num)}
                  >
                    <div className={styles.sidebarNum}>
                      {step > s.num
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : s.num}
                    </div>
                    <div className={styles.sidebarIcon}>{s.icon}</div>
                    <span className={styles.sidebarLabel}>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Step Content */}
              <div className={styles.stepContent}>
                <form onSubmit={handleSubmit}>

                  {/* ── Step 1: Personal Info ── */}
                  {step === 1 && (
                    <div>
                      <h3 className={styles.stepTitle}>Personal Information</h3>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>First Name <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Middle Name</label>
                          <input className={styles.input} name="middleName" value={form.middleName} onChange={handleChange} placeholder="Middle Name" />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Last Name <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Date of Birth <span className={styles.req}>*</span></label>
                          <input className={styles.input} type="date" name="dob" value={form.dob} onChange={handleChange} placeholder="MM/DD/YYYY" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Phone <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} placeholder="(000) 000-0000" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Email <span className={styles.req}>*</span></label>
                          <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Social Security Number <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="ssn" value={form.ssn} onChange={handleChange} placeholder="XXX-XX-XXXX" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Driver's License Number <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="dlNumber" value={form.dlNumber} onChange={handleChange} placeholder="Driver's License Number" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>State of Issuance <span className={styles.req}>*</span></label>
                          <select className={styles.input} name="dlState" value={form.dlState} onChange={handleChange} required>
                            <option value="">Select State</option>
                            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Step 2: Residence ── */}
                  {step === 2 && (
                    <div>
                      <h3 className={styles.stepTitle}>Residence</h3>
                      <div className={styles.row1}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Street Address <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="address" value={form.address} onChange={handleChange} placeholder="Street Address" required />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>City <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>State <span className={styles.req}>*</span></label>
                          <select className={styles.input} name="state" value={form.state} onChange={handleChange} required>
                            <option value="">Select State</option>
                            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>ZIP Code <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP Code" required />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Housing Type <span className={styles.req}>*</span></label>
                          <select className={styles.input} name="housingType" value={form.housingType} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="own">Own</option>
                            <option value="rent">Rent</option>
                            <option value="living-with-family">Living with Family</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Years at Address <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="yearsAtAddress" value={form.yearsAtAddress} onChange={handleChange} placeholder="e.g. 2" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Monthly Payment / Rent</label>
                          <input className={styles.input} name="monthlyRent" value={form.monthlyRent} onChange={handleChange} placeholder="$0.00" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Step 3: Employment ── */}
                  {step === 3 && (
                    <div>
                      <h3 className={styles.stepTitle}>Employment</h3>
                      <div className={styles.row2}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Employer Name <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="employerName" value={form.employerName} onChange={handleChange} placeholder="Employer Name" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Job Title <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" required />
                        </div>
                      </div>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Employment Type <span className={styles.req}>*</span></label>
                          <select className={styles.input} name="employmentType" value={form.employmentType} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="self-employed">Self-Employed</option>
                            <option value="retired">Retired</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Monthly Income <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="monthlyIncome" value={form.monthlyIncome} onChange={handleChange} placeholder="$0.00" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Years Employed <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="yearsEmployed" value={form.yearsEmployed} onChange={handleChange} placeholder="e.g. 3" required />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Step 4: Desired Vehicle ── */}
                  {step === 4 && (
                    <div>
                      <h3 className={styles.stepTitle}>Desired Vehicle</h3>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Year</label>
                          <input className={styles.input} name="vehicleYear" value={form.vehicleYear} onChange={handleChange} placeholder="e.g. 2022" />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Make</label>
                          <input className={styles.input} name="vehicleMake" value={form.vehicleMake} onChange={handleChange} placeholder="e.g. Toyota" />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Model</label>
                          <input className={styles.input} name="vehicleModel" value={form.vehicleModel} onChange={handleChange} placeholder="e.g. Camry" />
                        </div>
                      </div>
                      <div className={styles.row2}>
                        <div className={styles.fg}>
                          <label className={styles.label}>VIN (Optional)</label>
                          <input className={styles.input} name="vehicleVin" value={form.vehicleVin} onChange={handleChange} placeholder="Vehicle Identification Number" />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Down Payment</label>
                          <input className={styles.input} name="downPayment" value={form.downPayment} onChange={handleChange} placeholder="$0.00" />
                        </div>
                      </div>
                      <div className={styles.row1}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Do you have a trade-in?</label>
                          <select className={styles.input} name="hasTradeIn" value={form.hasTradeIn} onChange={handleChange}>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        </div>
                      </div>
                      {form.hasTradeIn === 'yes' && (
                        <div className={styles.row3}>
                          <div className={styles.fg}>
                            <label className={styles.label}>Trade-In Year</label>
                            <input className={styles.input} name="tradeInYear" value={form.tradeInYear} onChange={handleChange} placeholder="Year" />
                          </div>
                          <div className={styles.fg}>
                            <label className={styles.label}>Trade-In Make</label>
                            <input className={styles.input} name="tradeInMake" value={form.tradeInMake} onChange={handleChange} placeholder="Make" />
                          </div>
                          <div className={styles.fg}>
                            <label className={styles.label}>Trade-In Model</label>
                            <input className={styles.input} name="tradeInModel" value={form.tradeInModel} onChange={handleChange} placeholder="Model" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Step 5: Payment / References ── */}
                  {step === 5 && (
                    <div>
                      <h3 className={styles.stepTitle}>Payment / References</h3>
                      <div className={styles.row1}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Desired Monthly Payment Budget</label>
                          <input className={styles.input} name="monthlyBudget" value={form.monthlyBudget} onChange={handleChange} placeholder="$0.00 per month" />
                        </div>
                      </div>
                      <p className={styles.refHeading}>Reference 1</p>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Full Name <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="ref1Name" value={form.ref1Name} onChange={handleChange} placeholder="Full Name" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Phone <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="ref1Phone" value={form.ref1Phone} onChange={handleChange} placeholder="Phone" required />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Relationship <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="ref1Relation" value={form.ref1Relation} onChange={handleChange} placeholder="e.g. Friend" required />
                        </div>
                      </div>
                      <p className={styles.refHeading}>Reference 2</p>
                      <div className={styles.row3}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Full Name</label>
                          <input className={styles.input} name="ref2Name" value={form.ref2Name} onChange={handleChange} placeholder="Full Name" />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Phone</label>
                          <input className={styles.input} name="ref2Phone" value={form.ref2Phone} onChange={handleChange} placeholder="Phone" />
                        </div>
                        <div className={styles.fg}>
                          <label className={styles.label}>Relationship</label>
                          <input className={styles.input} name="ref2Relation" value={form.ref2Relation} onChange={handleChange} placeholder="e.g. Family" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Step 6: Agreement ── */}
                  {step === 6 && (
                    <div>
                      <h3 className={styles.stepTitle}>Agreement &amp; Signature</h3>
                      <div className={styles.agreementBox}>
                        <p>By submitting this financing application, I certify that the information provided is accurate and complete to the best of my knowledge. I authorize Connect Auto Sales to obtain credit reports and share my information with financing lenders for the purpose of obtaining vehicle financing.</p>
                        <p>I understand that submitting this application does not guarantee financing approval. Approval is subject to lender review and qualifications.</p>
                      </div>
                      <div className={styles.row1}>
                        <div className={styles.fg}>
                          <label className={styles.label}>Full Name (Signature) <span className={styles.req}>*</span></label>
                          <input className={styles.input} name="signature" value={form.signature} onChange={handleChange} placeholder="Type your full name as your signature" required style={{ fontStyle: 'italic' }} />
                        </div>
                      </div>
                      <div className={styles.checkRow}>
                        <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} required className={styles.checkbox} />
                        <label htmlFor="agreeTerms" className={styles.checkLabel}>I agree to the terms above and authorize Connect Auto Sales to process my financing application.</label>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className={styles.navRow}>
                    {step > 1 && (
                      <button type="button" className={styles.backBtn} onClick={handleBack}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        BACK
                      </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < TOTAL_STEPS ? (
                      <button type="button" className={styles.nextBtn} onClick={handleNext}>
                        NEXT STEP
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    ) : (
                      <button type="submit" className={styles.nextBtn}>
                        SUBMIT APPLICATION
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── Bottom: Docs + FAQ ── */}
      <section className={styles.bottomSection}>
        <div className="container">
          <div className={styles.bottomGrid}>

            {/* Required Docs */}
            <div className={styles.docsCol}>
              <h3 className={styles.docsTitle}>Required Documents</h3>
              <div className={styles.docsTitleLine} />
              <div className={styles.docsGrid}>
                {docs.map((d, i) => (
                  <div key={i} className={styles.docCard}>
                    <div className={styles.docIcon}>{d.icon}</div>
                    <p className={styles.docLabel}>{d.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className={styles.faqCol}>
              <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
              <div className={styles.faqTitleLine} />
              <div className={styles.faqList}>
                {faqs.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{faq.q}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    {openFaq === i && <p className={styles.faqA}>{faq.a}</p>}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
