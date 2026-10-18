'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { NOTIFY_STATUSES } from '@/lib/statusNotify'
import { templateFor, unfilledBlanks } from '@/lib/customerMessageTemplates'
import styles from './DetailView.module.css'

function parseFileUrls(value) {
  let urls = []
  try { urls = JSON.parse(value) } catch { urls = [value] }
  return (Array.isArray(urls) ? urls : [value]).filter(Boolean)
}

// Vercel Blob serves a file as an attachment when ?download=1 is added.
function downloadUrl(url) {
  return url + (url.includes('?') ? '&' : '?') + 'download=1'
}

function extensionOf(url) {
  const m = url.split('?')[0].match(/\.([a-z0-9]{2,5})$/i)
  return m ? m[1].toLowerCase() : 'bin'
}

const PRIORITY_CONFIG = {
  high:   { label: 'High Priority',   color: '#15803d', bg: '#dcfce7' },
  medium: { label: 'Medium Priority', color: '#1d4ed8', bg: '#dbeafe' },
  low:    { label: 'Low Priority',    color: '#7c3aed', bg: '#ede9fe' },
}

export default function DetailView({ type, item, fields, statusOptions, title, backHref, showPriority }) {
  const router = useRouter()
  const [status, setStatus] = useState(item.status || '')
  const [priority, setPriorityState] = useState(item.priority || '')
  const [notes, setNotes] = useState(item.adminNotes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveResult, setSaveResult] = useState('')

  // Customer email: offered only for a real status change to a status worth
  // telling the customer about. The admin can untick it or add a message.
  const savedStatus = useRef(item.status || '')
  const canEmail = type !== 'contact' && !!item.email && !!statusOptions
  const statusChanged = status !== savedStatus.current
  const emailableStatus = NOTIFY_STATUSES.includes(status)
  const [notifyChoice, setNotifyChoice] = useState(null)
  const notify = canEmail && statusChanged && emailableStatus && (notifyChoice ?? true)
  const [customerMessage, setCustomerMessage] = useState('')
  const [preview, setPreview] = useState(null)
  const [previewing, setPreviewing] = useState(false)

  const fileFields = fields.filter(f => f.type === 'file' && f.value)
  const [zipping, setZipping] = useState(false)

  // Owner-written default message for this status, if any; the admin edits it.
  const blanks = notify ? unfilledBlanks(customerMessage) : []

  const changeStatus = (value) => {
    setStatus(value)
    setNotifyChoice(null)
    setCustomerMessage(templateFor(type, value))
  }

  const showPreview = async () => {
    setPreviewing(true)
    try {
      const res = await fetch('/api/admin/status/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id: item.id, status, customerMessage }),
      })
      const data = await res.json()
      setPreview(res.ok ? data : { error: data.error || 'Could not build the preview.' })
    } catch {
      setPreview({ error: 'Could not build the preview.' })
    } finally {
      setPreviewing(false)
    }
  }

  const downloadAll = async () => {
    setZipping(true)
    try {
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()
      for (const f of fileFields) {
        const urls = parseFileUrls(f.value)
        for (let i = 0; i < urls.length; i++) {
          const res = await fetch(urls[i])
          if (!res.ok) throw new Error(`could not fetch ${f.label}`)
          const suffix = urls.length > 1 ? ` ${i + 1}` : ''
          zip.file(`${f.label}${suffix}.${extensionOf(urls[i])}`, await res.blob())
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}-documents.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch (e) {
      alert(`Download failed: ${e.message}. You can still download each file separately.`)
    } finally {
      setZipping(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type, id: item.id, status, adminNotes: notes, isRead: status !== 'unread',
        notify, customerMessage: notify ? customerMessage : '',
      }),
    })
    const data = await res.json().catch(() => ({}))
    savedStatus.current = status
    setSaveResult(
      !res.ok ? 'Save failed, please try again.'
        : data.emailed ? `Saved. Email sent to ${item.email}.`
        : notify ? 'Saved, but the email could not be sent.'
        : 'Saved. No email was sent.'
    )
    setCustomerMessage('')
    setNotifyChoice(null)
    if (showPriority) {
      await fetch(`/api/admin/financing/${item.id}/priority`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: priority || null }),
      })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setTimeout(() => setSaveResult(''), 6000)
    router.refresh()
  }

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button onClick={() => router.push(backHref)} className={styles.back}>
            <i className="fa-solid fa-arrow-left" /> Back
          </button>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.sub} suppressHydrationWarning>
            <i className="fa-regular fa-clock" />
            Submitted: {new Date(item.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <div className={styles.topBarRight}>
          <span className={`${styles.statusChip} ${styles[status]}`}>{status}</span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.content}>
        <div className={styles.layout}>
          {/* Left: Submission data */}
          <div className={styles.dataCard}>
            <div className={styles.cardHeader}>
              <i className="fa-solid fa-list-check" />
              <h3 className={styles.cardTitle}>Submission Details</h3>
              {fileFields.length > 0 && (
                <button type="button" onClick={downloadAll} disabled={zipping} className={styles.downloadAllBtn}>
                  {zipping
                    ? <><i className="fa-solid fa-spinner fa-spin" /> Preparing...</>
                    : <><i className="fa-solid fa-file-zipper" /> Download all</>}
                </button>
              )}
            </div>
            <dl className={styles.fields}>
              {fields.map(f =>
                f.value ? (
                  <div key={f.label} className={styles.fieldRow}>
                    <dt>{f.label}</dt>
                    <dd>
                      {f.type === 'file'
                        ? (() => {
                            const urls = parseFileUrls(f.value)
                            return (
                              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                                {urls.map((url, idx) => (
                                  <div key={idx} className={styles.fileRow}>
                                    <span className={styles.fileName}>
                                      <i className="fa-regular fa-file" /> File {urls.length > 1 ? idx + 1 : ''}
                                    </span>
                                    <a href={url} target="_blank" rel="noreferrer" className={styles.fileLink}>
                                      <i className="fa-regular fa-eye" /> View
                                    </a>
                                    <a href={downloadUrl(url)} className={styles.fileLink}>
                                      <i className="fa-solid fa-download" /> Download
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )
                          })()
                        : f.value
                      }
                    </dd>
                  </div>
                ) : null
              )}
            </dl>
          </div>

          {/* Right: Admin controls */}
          <div className={styles.adminCard}>
            <div className={styles.cardHeader}>
              <i className="fa-solid fa-sliders" />
              <h3 className={styles.cardTitle}>Admin Actions</h3>
            </div>

            {statusOptions && (
              <div className={styles.field}>
                <label><i className="fa-solid fa-tag" /> Status</label>
                <select value={status} onChange={e => changeStatus(e.target.value)}>
                  {statusOptions.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}

            {showPriority && status === 'approved' && (
              <div className={styles.field}>
                <label><i className="fa-solid fa-flag" /> Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriorityState(e.target.value)}
                  style={priority && PRIORITY_CONFIG[priority] ? {
                    background: PRIORITY_CONFIG[priority].bg,
                    color: PRIORITY_CONFIG[priority].color,
                    fontWeight: 700,
                    border: `1.5px solid ${PRIORITY_CONFIG[priority].color}`,
                  } : {}}
                >
                  <option value="">No Priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                {priority && PRIORITY_CONFIG[priority] && (
                  <div style={{
                    marginTop: 8, padding: '6px 10px', borderRadius: 6,
                    background: PRIORITY_CONFIG[priority].bg,
                    color: PRIORITY_CONFIG[priority].color,
                    fontWeight: 700, fontSize: 13, display: 'inline-block',
                  }}>
                    {PRIORITY_CONFIG[priority].label}
                  </div>
                )}
              </div>
            )}

            {canEmail && statusChanged && emailableStatus && (
              <div className={styles.emailBox}>
                <label className={styles.emailToggle}>
                  <input
                    type="checkbox"
                    checked={notify}
                    onChange={e => setNotifyChoice(e.target.checked)}
                  />
                  Email the customer about this change
                </label>
                {notify && (
                  <>
                    <textarea
                      value={customerMessage}
                      onChange={e => setCustomerMessage(e.target.value)}
                      rows={customerMessage.split('\n').length > 3 ? 10 : 4}
                      placeholder="Optional message to the customer, e.g. We'll call you to set a time."
                    />
                    {blanks.length > 0 && (
                      <p className={styles.blanksWarning}>
                        Fill in {blanks.join(', ')} before sending.
                      </p>
                    )}
                    <button type="button" onClick={showPreview} disabled={previewing} className={styles.previewBtn}>
                      {previewing ? 'Building preview...' : <><i className="fa-regular fa-eye" /> Preview email</>}
                    </button>
                    <p className={styles.emailHint}>Sent to {item.email}. Internal notes are never included.</p>
                  </>
                )}
              </div>
            )}
            {canEmail && statusChanged && !emailableStatus && (
              <p className={styles.emailHintBox}>This status does not email the customer.</p>
            )}

            <div className={styles.field}>
              <label><i className="fa-solid fa-note-sticky" /> Internal Notes (never emailed)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={6}
                placeholder="Internal notes visible only to admin..."
              />
            </div>

            <button onClick={handleSave} disabled={saving || blanks.length > 0} className={styles.saveBtn}>
              {saving
                ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</>
                : saved
                ? <><i className="fa-solid fa-circle-check" /> Saved!</>
                : <><i className="fa-solid fa-floppy-disk" /> {notify ? 'Save & Email Customer' : 'Save Changes'}</>
              }
            </button>
            {saveResult && <p className={styles.saveResult}>{saveResult}</p>}
          </div>
        </div>
      </div>

      {preview && (
        <div className={styles.previewOverlay} onClick={() => setPreview(null)}>
          <div className={styles.previewModal} onClick={e => e.stopPropagation()}>
            <div className={styles.previewHead}>
              <div>
                <strong>Email preview</strong>
                {!preview.error && <p>To: {preview.to}<br />Subject: {preview.subject}</p>}
              </div>
              <button type="button" onClick={() => setPreview(null)} className={styles.previewClose} aria-label="Close preview">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            {preview.error
              ? <p className={styles.previewError}>{preview.error}</p>
              : <iframe title="Email preview" srcDoc={preview.html} className={styles.previewFrame} />}
          </div>
        </div>
      )}
    </div>
  )
}
