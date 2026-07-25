'use client';
import { useState, useRef, useEffect } from 'react';
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

function FileUpload({ label, icon, name, hasError, onFileChange, maxFiles = 1 }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  function addFiles(newFiles) {
    setFiles(prev => {
      const combined = [...prev];
      for (const f of newFiles) {
        if (combined.length < maxFiles && !combined.find(x => x.name === f.name)) {
          combined.push(f);
        }
      }
      const dt = new DataTransfer();
      combined.forEach(f => dt.items.add(f));
      if (inputRef.current) inputRef.current.files = dt.files;
      onFileChange?.(combined);
      return combined;
    });
  }

  function removeFile(idx) {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== idx);
      const dt = new DataTransfer();
      next.forEach(f => dt.items.add(f));
      if (inputRef.current) inputRef.current.files = dt.files;
      onFileChange?.(next);
      return next;
    });
  }

  function handleFile(e) {
    addFiles(Array.from(e.target.files || []));
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files || []));
  }

  const canAddMore = files.length < maxFiles;

  return (
    <div
      className={`${styles.uploadBox} ${hasError ? styles.uploadBoxError : ''}`}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className={styles.uploadIcon}>{icon}</div>
      <p className={styles.uploadLabel}>{label}</p>
      {maxFiles > 1 && <p className={styles.uploadDrag} style={{fontSize:11,color:'#9ca3af'}}>Up to {maxFiles} files</p>}
      {files.length > 0 && (
        <div style={{width:'100%',display:'flex',flexDirection:'column',gap:4,margin:'4px 0'}}>
          {files.map((f, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:6,justifyContent:'space-between'}}>
              <span className={styles.uploadFileName} style={{flex:1,textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</span>
              <button type="button" onClick={() => removeFile(i)} style={{background:'none',border:'none',color:'#9ca3af',cursor:'pointer',padding:'0 2px',fontSize:14,lineHeight:1,flexShrink:0}}>&#10005;</button>
            </div>
          ))}
        </div>
      )}
      {files.length === 0 && (
        <>
          <p className={styles.uploadDrag}>Drag &amp; Drop</p>
          <p className={styles.uploadOr}>or</p>
        </>
      )}
      {canAddMore && (
        <button type="button" className={styles.chooseFileBtn} onClick={() => inputRef.current?.click()}>
          {files.length > 0 ? 'Add More' : 'Choose File'}
        </button>
      )}
      <input ref={inputRef} name={name} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

export default function SalvageInspectionsPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', notes: '' });
  const [noMajorParts, setNoMajorParts] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [salvageFiles, setSalvageFiles] = useState([]);
  const [idFiles, setIdFiles] = useState([]);
  const [receiptFiles, setReceiptFiles] = useState([]);
  const formRef = useRef(null);
  const [fees, setFees] = useState(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setFees({
        inspFeeA:     parseFloat(d.inspFeeA)     || 100,
        inspFeeB:     parseFloat(d.inspFeeB)     || 100,
        inspFeePaper: parseFloat(d.inspFeePaper) || 50,
        inspFeeNote:  d.inspFeeNote || '',
      });
    }).catch(() => {
      setFees({ inspFeeA: 100, inspFeeB: 100, inspFeePaper: 50, inspFeeNote: '' });
    });
  }, []);

  const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => { const n={...p}; delete n[e.target.name]; return n });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First Name cannot be blank.';
    if (!form.lastName.trim())  errs.lastName  = 'Last Name cannot be blank.';
    if (!form.phone.trim())     errs.phone     = 'Phone Number cannot be blank.';
    else if (!phoneRe.test(form.phone.trim())) errs.phone = 'Enter a valid phone number.';
    if (!form.email.trim())     errs.email     = 'Email cannot be blank.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Enter a valid email address.';
    if (salvageFiles.length === 0)  errs.salvageTitle = 'Please upload your Salvage Title.';
    if (idFiles.length === 0)       errs.validId      = 'Please upload a Valid ID.';
    if (!noMajorParts && receiptFiles.length === 0) errs.receipts = 'Please upload Receipts for Major Parts.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const uploadOne = async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        return data.url;
      };

      const uploadAll = async (files) => {
        const urls = [];
        for (const file of files) urls.push(await uploadOne(file));
        if (urls.length === 0) return null;
        return urls.length === 1 ? urls[0] : JSON.stringify(urls);
      };

      const [salvageTitleUrl, validIdUrl, receiptsUrl] = await Promise.all([
        uploadAll(salvageFiles),
        uploadAll(idFiles),
        noMajorParts ? Promise.resolve(null) : uploadAll(receiptFiles),
      ]);

      const res = await fetch('/api/inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          partsChanged: form.notes,
          salvageTitle: salvageTitleUrl,
          validId: validIdUrl,
          receipts: receiptsUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      setErrors({});
      setForm({ firstName: '', lastName: '', phone: '', email: '', notes: '' });
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const leftFaqs = faqs.slice(0, 4);
  const rightFaqs = faqs.slice(4);

  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>SALVAGE VEHICLE <span>INSPECTIONS</span></h1>
          <p className={styles.heroSub}>Michigan state-certified salvage inspections — {fees ? `$${(fees.inspFeeA + fees.inspFeeB + fees.inspFeePaper).toFixed(0)} total fee` : 'state-certified'}.</p>
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
                    <span className={styles.feePrice}>{fees ? `$${fees.inspFeeA % 1 === 0 ? fees.inspFeeA : fees.inspFeeA.toFixed(2)}` : '—'}</span>
                  </div>
                  <div className={styles.feeRow}>
                    <div className={styles.feeIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><rect x="2" y="2" width="20" height="14" rx="2"/><path d="M8 6h8M8 10h5"/></svg>
                    </div>
                    <div className={styles.feeInfo}>
                      <span className={styles.feeCode}>TR13B</span>
                      <span className={styles.feeName}>Salvage Vehicle Inspection</span>
                    </div>
                    <span className={styles.feePrice}>{fees ? `$${fees.inspFeeB % 1 === 0 ? fees.inspFeeB : fees.inspFeeB.toFixed(2)}` : '—'}</span>
                  </div>
                  <div className={styles.feeRow}>
                    <div className={styles.feeIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <div className={styles.feeInfo}>
                      <span className={styles.feeName}>Paperwork Processing Fee</span>
                    </div>
                    <span className={styles.feePrice}>{fees ? `$${fees.inspFeePaper % 1 === 0 ? fees.inspFeePaper : fees.inspFeePaper.toFixed(2)}` : '—'}</span>
                  </div>
                </div>
                <div className={styles.totalBox}>
                  <span className={styles.totalLabel}>TOTAL COST</span>
                  <span className={styles.totalAmount}>{fees ? `$${(fees.inspFeeA + fees.inspFeeB + fees.inspFeePaper) % 1 === 0 ? (fees.inspFeeA + fees.inspFeeB + fees.inspFeePaper) : (fees.inspFeeA + fees.inspFeeB + fees.inspFeePaper).toFixed(2)}` : '—'}</span>
                </div>
                <p className={styles.feeNote}>* {fees ? (fees.inspFeeNote || 'Fees shown apply to standard passenger vehicles. Motorcycle and trailer fees may vary.') : ''}</p>
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
      <section ref={formRef} className={styles.formSection}>
        <div className="container">
          <div className={styles.formCard}>
            {submitted ? (
              <div style={{padding:'48px',textAlign:'center'}}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <h3 style={{marginTop:16}}>Documents Submitted!</h3>
                <p style={{marginTop:8,color:'#6b7280'}}>We will contact you to schedule your inspection appointment.</p>
              </div>
            ) : (
            <form ref={formRef} onSubmit={handleSubmit}>
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
                    <div>
                      <input className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name *" />
                      {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
                    </div>
                    <div>
                      <input className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name *" />
                      {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <input className={`${styles.input} ${errors.phone ? styles.inputError : ''}`} name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" />
                    {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                  </div>
                  <div style={{marginBottom:12}}>
                    <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`} name="email" value={form.email} onChange={handleChange} placeholder="Email Address *" />
                    {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                  </div>

                  <div className={styles.uploadsRow}>
                    <div>
                      <FileUpload
                        name="salvageTitle"
                        label="UPLOAD SALVAGE TITLE *"
                        maxFiles={5}
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="12 18 12 12"/><polyline points="9 15 12 12 15 15"/></svg>}
                        hasError={!!errors.salvageTitle}
                        onFileChange={files => { setSalvageFiles(files); setErrors(p => { const n={...p}; delete n.salvageTitle; return n }) }}
                      />
                      {errors.salvageTitle && <span className={styles.fieldError}>{errors.salvageTitle}</span>}
                    </div>
                    <div>
                      <FileUpload
                        name="validId"
                        label="UPLOAD VALID ID *"
                        maxFiles={2}
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h3"/></svg>}
                        hasError={!!errors.validId}
                        onFileChange={files => { setIdFiles(files); setErrors(p => { const n={...p}; delete n.validId; return n }) }}
                      />
                      {errors.validId && <span className={styles.fieldError}>{errors.validId}</span>}
                    </div>
                    <div>
                      <label style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,cursor:'pointer',fontSize:13,fontWeight:600,color:'#374151'}}>
                        <input
                          type="checkbox"
                          checked={noMajorParts}
                          onChange={e => { setNoMajorParts(e.target.checked); setErrors(p => { const n={...p}; delete n.receipts; return n }) }}
                          style={{accentColor:'#e50202',width:15,height:15}}
                        />
                        No Major Parts Replaced
                      </label>
                      {!noMajorParts && (
                        <>
                          <FileUpload
                            name="receipts"
                            label="UPLOAD RECEIPTS FOR MAJOR PARTS *"
                            maxFiles={10}
                            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>}
                            hasError={!!errors.receipts}
                            onFileChange={files => { setReceiptFiles(files); setErrors(p => { const n={...p}; delete n.receipts; return n }) }}
                          />
                          {errors.receipts && <span className={styles.fieldError}>{errors.receipts}</span>}
                        </>
                      )}
                      {noMajorParts && (
                        <div style={{padding:'16px',border:'1px solid #e5e7eb',borderRadius:8,background:'#f9fafb',fontSize:13,color:'#6b7280',textAlign:'center'}}>
                          No receipts required
                        </div>
                      )}
                    </div>
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
                  <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting
                      ? <><span className="btn-spinner" />SUBMITTING...</>
                      : <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'8px',verticalAlign:'middle'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 12 11 14 15 10"/></svg>SUBMIT DOCUMENTS FOR REVIEW</>
                    }
                  </button>
                </div>
              </div>
            </form>
            )}
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
