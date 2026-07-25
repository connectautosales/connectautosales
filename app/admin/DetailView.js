'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './DetailView.module.css'

export default function DetailView({ type, item, fields, statusOptions, title, backHref }) {
  const router = useRouter()
  const [status, setStatus] = useState(item.status || '')
  const [notes, setNotes] = useState(item.adminNotes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id: item.id, status, adminNotes: notes, isRead: status !== 'unread' }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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
            </div>
            <dl className={styles.fields}>
              {fields.map(f =>
                f.value ? (
                  <div key={f.label} className={styles.fieldRow}>
                    <dt>{f.label}</dt>
                    <dd>
                      {f.type === 'file'
                        ? (() => {
                            let urls = []
                            try { urls = JSON.parse(f.value) } catch { urls = [f.value] }
                            if (!Array.isArray(urls)) urls = [f.value]
                            return (
                              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                                {urls.map((url, idx) => (
                                  <a key={idx} href={url} target="_blank" rel="noreferrer" className={styles.fileLink}>
                                    <i className="fa-solid fa-file-arrow-down" /> File {urls.length > 1 ? idx + 1 : ''} — View / Download
                                  </a>
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
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  {statusOptions.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className={styles.field}>
              <label><i className="fa-solid fa-note-sticky" /> Admin Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={6}
                placeholder="Internal notes visible only to admin..."
              />
            </div>

            <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
              {saving
                ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</>
                : saved
                ? <><i className="fa-solid fa-circle-check" /> Saved!</>
                : <><i className="fa-solid fa-floppy-disk" /> Save Changes</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
