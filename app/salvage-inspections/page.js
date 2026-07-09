'use client';
import { useState, useRef } from 'react';
import styles from './page.module.css';

const faqs = [
  { q: 'Do I need an appointment?', a: 'Yes. An appointment is required. Please submit your documents through the website first. Connect Auto Sales will review your paperwork and contact you with an available inspection date and time.' },
  { q: 'What documents do I need?', a: 'You will need a salvage title, a valid ID, receipts for any replaced major parts, and the vehicle itself when you come for the inspection appointment.' },
  { q: 'What major parts require receipts?', a: 'Receipts are required for any major parts that were replaced during the repair process, including the engine, transmission, passenger vehicle body or truck cab, frame, pickup cargo box, hood, deck lid, tailgate or hatchback, doors, fenders, quarter panels, front and rear bumpers, and trunk floor pan.' },
  { q: 'Can I bring my vehicle immediately after uploading documents?', a: 'No. Please wait until Connect Auto Sales contacts you with an approved inspection date and time before bringing your vehicle.' },
  { q: 'How long does the inspection take?', a: 'Most inspections take approximately 15 to 30 minutes once all paperwork has been reviewed and the appointment has been scheduled.' },
  { q: 'Can you inspect out-of-state salvage vehicles?', a: 'Yes. We can perform salvage vehicle inspections for out-of-state vehicles. Please submit your paperwork and our team will review the documentation and guide you through the process.' },
  { q: 'What happens after the inspection?', a: 'Once the inspection is completed, we will provide the necessary paperwork required to continue the rebuilt title process with the State of Michigan.' },
];

const steps = [
  { num: '1', label: 'Upload\nDocuments', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="12 18 12 12"/><polyline points="9 15 12 12 15 15"/></svg> },
  { num: '2', label: 'We Prepare\nYour Paperwork', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { num: '3', label: 'We Contact You\nTo Schedule', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg> },
  { num: '4', label: 'Bring Your\nVehicle', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { num: '5', label: 'Complete\nInspection\n(15–30 Minutes)', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
];

const requiredItems = [
  { label: 'Salvage Title', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { label: 'Receipts For\nMajor Parts', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="12" y1="17" x2="8" y2="17"/><line x1="16" y1="17" x2="14" y2="17"/></svg> },
  { label: 'Valid ID', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h3"/></svg> },
  { label: 'Vehicle', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
];

function FileUpload({ label, icon }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  }

  return (
    <div
      className={styles.uploadBox}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className={styles.uploadIcon}>{icon}</div>
      <p className={styles.uploadLabel}>{label}</p>
      {fileName ? (
        <p className={styles.uploadFileName}>{fileName}</p>
      ) : (
        <>
          <p className={styles.uploadDrag}>Drag &amp; Drop</p>
          <p className={styles.uploadOr}>or</p>
        </>
      )}
      <button type="button" className={styles.chooseFileBtn} onClick={() => inputRef.current?.click()}>
        Choose File
      </button>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

export default function SalvageInspectionsPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', notes: '' });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('Your documents have been submitted. We will contact you to schedule your inspection.');
  }

  const leftFaqs = faqs.slice(0, 4);
  const rightFaqs = faqs.slice(4);

  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <h1 className={styles.heroTitle}>
            MICHIGAN<br />
            <span>SALVAGE VEHICLE</span><br />
            INSPECTIONS
          </h1>
        </div>
      </section>

      {/* ── Fees + Process + Required Items ── */}
      <section className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoCard}>
            <div className={styles.infoGrid}>

              {/* Left: Fees */}
              <div className={styles.feesCol}>
                <h2 className={styles.colTitle}>INSPECTION FEES</h2>
                <div className={styles.colLine} />
                <div className={styles.feesList}>
                  <div className={styles.feeRow}>
                    <div className={styles.feeIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <div className={styles.feeInfo}>
                      <span className={styles.feeCode}>TR13A</span>
                      <span className={styles.feeName}>Mechanic Inspection</span>
                    </div>
                    <span className={styles.feePrice}>$100</span>
                  </div>
                  <div className={styles.feeRow}>
                    <div className={styles.feeIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><rect x="2" y="2" width="20" height="14" rx="2"/><path d="M8 6h8M8 10h5"/></svg>
                    </div>
                    <div className={styles.feeInfo}>
                      <span className={styles.feeCode}>TR13B</span>
                      <span className={styles.feeName}>Salvage Vehicle Inspection</span>
                    </div>
                    <span className={styles.feePrice}>$100</span>
                  </div>
                  <div className={styles.feeRow}>
                    <div className={styles.feeIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <div className={styles.feeInfo}>
                      <span className={styles.feeName}>Paperwork Processing Fee</span>
                    </div>
                    <span className={styles.feePrice}>$50</span>
                  </div>
                </div>
                <div className={styles.totalBox}>
                  <span className={styles.totalLabel}>TOTAL COST</span>
                  <span className={styles.totalAmount}>$250</span>
                </div>
                <p className={styles.feeNote}>* Fees shown apply to standard passenger vehicles.<br />Motorcycle and trailer fees may vary.</p>
              </div>

              {/* Right: Process + Required */}
              <div className={styles.processCol}>
                <h2 className={styles.colTitle}>INSPECTION PROCESS</h2>
                <div className={styles.colLine} />
                <div className={styles.stepsRow}>
                  {steps.map((step, i) => (
                    <div key={i} className={styles.stepWrap}>
                      <div className={styles.stepCircle}>{step.icon}</div>
                      <div className={styles.stepNum}>{step.num}</div>
                      <p className={styles.stepLabel}>{step.label}</p>
                      {i < steps.length - 1 && (
                        <div className={styles.stepArrow}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h3 className={styles.reqTitle}>REQUIRED ITEMS</h3>
                <div className={styles.colLine} />
                <div className={styles.reqGrid}>
                  {requiredItems.map((item, i) => (
                    <div key={i} className={styles.reqCard}>
                      <div className={styles.reqIcon}>{item.icon}</div>
                      <p className={styles.reqLabel}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Submit Documents Form ── */}
      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>

                {/* Left */}
                <div className={styles.formLeft}>
                  <h2 className={styles.formTitle}>SUBMIT DOCUMENTS FOR REVIEW</h2>
                  <div className={styles.formTitleLine} />

                  {/* Warning */}
                  <div className={styles.warningBox}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <p>Please do not bring the vehicle until Connect Auto Sales contacts you with an approved inspection date and time.</p>
                  </div>

                  <div className={styles.nameRow}>
                    <input className={styles.input} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
                    <input className={styles.input} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required />
                  </div>
                  <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />

                  <div className={styles.uploadsRow}>
                    <FileUpload
                      label="UPLOAD SALVAGE TITLE"
                      icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="12 18 12 12"/><polyline points="9 15 12 12 15 15"/></svg>}
                    />
                    <FileUpload
                      label="UPLOAD VALID ID"
                      icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h3"/></svg>}
                    />
                    <FileUpload
                      label="UPLOAD RECEIPTS FOR MAJOR PARTS"
                      icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>}
                    />
                  </div>

                  <p className={styles.uploadNote}>Please upload clear and readable copies of all required documents.</p>
                  <p className={styles.uploadNote}>Accepted formats: PDF, JPG, PNG</p>
                </div>

                {/* Right */}
                <div className={styles.formRight}>
                  <h2 className={styles.formTitle}>MAJOR PARTS CHANGED &amp;<br />REPAIRS COMPLETED</h2>
                  <div className={styles.formTitleLine} />
                  <p className={styles.notesLabel}>Describe the major parts changed and repairs completed...</p>
                  <textarea
                    className={styles.textarea}
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Describe the major parts changed and repairs completed..."
                    rows={10}
                  />
                  <button type="submit" className={styles.submitBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 12 11 14 15 10"/></svg>
                    SUBMIT DOCUMENTS FOR REVIEW
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqHeader}>
            <div className={styles.faqLine} />
            <h2 className={styles.faqTitle}>FREQUENTLY ASKED QUESTIONS</h2>
            <div className={styles.faqLine} />
          </div>
          <div className={styles.faqGrid}>
            <div className={styles.faqCol}>
              {leftFaqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openFaq === i && <p className={styles.faqA}>{faq.a}</p>}
                </div>
              ))}
            </div>
            <div className={styles.faqCol}>
              {rightFaqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === (i + 4) ? null : (i + 4))}>
                    <span>{faq.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: openFaq === (i + 4) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openFaq === (i + 4) && <p className={styles.faqA}>{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
