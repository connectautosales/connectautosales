'use client'
import { useState, useRef } from 'react'

export default function ImageTemplatePage() {
  const [previewFile,    setPreviewFile]    = useState(null)
  const [previewImg,     setPreviewImg]     = useState(null)
  const [previewYear,    setPreviewYear]    = useState('2021')
  const [previewMake,    setPreviewMake]    = useState('Toyota')
  const [previewModel,   setPreviewModel]   = useState('RAV4')
  const [previewTrim,    setPreviewTrim]    = useState('LE')
  const [previewPrice,   setPreviewPrice]   = useState('14998')
  const [previewFinance, setPreviewFinance] = useState('15998')
  const [generating,     setGenerating]     = useState(false)
  const [genResult,      setGenResult]      = useState(null)
  const [genError,       setGenError]       = useState('')
  const [genStep,        setGenStep]        = useState('')
  const fileRef = useRef()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreviewFile(file)
    setPreviewImg(URL.createObjectURL(file))
    setGenResult(null)
  }

  const handleGenerate = async () => {
    if (!previewFile) { setGenError('Upload a car photo first.'); return }
    setGenerating(true); setGenResult(null); setGenError('')
    setGenStep('Generating image...')
    try {
      const fd = new FormData()
      fd.append('photo', previewFile)
      fd.append('year', previewYear)
      fd.append('make', previewMake)
      fd.append('model', previewModel)
      fd.append('trim', previewTrim)
      fd.append('price', previewPrice)
      fd.append('financePrice', previewFinance)
      const res = await fetch('/api/admin/watermark', { method: 'POST', body: fd })
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { throw new Error(text.slice(0, 200)) }
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setGenResult(data.base64)
    } catch (err) {
      setGenError(err.message || 'Generation failed')
    } finally {
      setGenerating(false)
      setGenStep('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '28px 32px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0',
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Image Template Preview
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '2px 0 0' }}>
            Test the feature image generator with any vehicle data and photo.
          </p>
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>

        {/* LEFT: Test Data */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-sliders" style={{ color: '#e50202' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Test Vehicle Data</span>
          </div>
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Year',          val: previewYear,    set: setPreviewYear,    type: 'number' },
              { label: 'Make',          val: previewMake,    set: setPreviewMake },
              { label: 'Model',         val: previewModel,   set: setPreviewModel },
              { label: 'Trim',          val: previewTrim,    set: setPreviewTrim },
              { label: 'Cash Price',    val: previewPrice,   set: setPreviewPrice,   type: 'number' },
              { label: 'Finance Price', val: previewFinance, set: setPreviewFinance, type: 'number' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>

          {/* Photo upload */}
          <div style={{ padding: '0 20px 16px' }}>
            <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Car Photo</label>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: '2px dashed #e2e8f0', borderRadius: 8, padding: '14px',
                textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
              }}
            >
              {previewImg
                ? <img src={previewImg} alt="" style={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain', borderRadius: 4 }} />
                : <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}><i className="fa-solid fa-image" /> Click to upload</span>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            <button
              onClick={handleGenerate}
              disabled={generating || !previewFile}
              style={{
                width: '100%', padding: '13px 0',
                background: generating ? '#64748b' : (!previewFile ? '#e2e8f0' : '#e50202'),
                color: !previewFile ? '#94a3b8' : '#fff',
                border: 'none', borderRadius: 8, fontWeight: 700,
                fontSize: '0.95rem', cursor: generating || !previewFile ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {generating
                ? <><i className="fa-solid fa-spinner fa-spin" /> {genStep || 'Generating...'}</>
                : <><i className="fa-solid fa-image" /> Generate Preview</>
              }
            </button>
            {genError && (
              <div style={{ marginTop: 8, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.78rem', color: '#991b1b' }}>
                <i className="fa-solid fa-triangle-exclamation" /> {genError}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Result */}
        <div>
          {genResult ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Generated Image</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a
                    href={genResult}
                    download="feature-image.png"
                    style={{
                      padding: '7px 16px', background: '#f1f5f9', color: '#475569',
                      border: '1px solid #e2e8f0', borderRadius: 7, fontWeight: 600,
                      fontSize: '0.82rem', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <i className="fa-solid fa-download" /> Download
                  </a>
                  <button
                    onClick={() => { setGenResult(null); setGenStep('') }}
                    style={{
                      padding: '7px 16px', background: 'none', color: '#64748b',
                      border: '1px solid #e2e8f0', borderRadius: 7, fontWeight: 600,
                      fontSize: '0.82rem', cursor: 'pointer',
                    }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <img src={genResult} alt="Generated feature image" style={{ width: '100%', maxWidth: 600, display: 'block', borderRadius: 8 }} />
              </div>
            </div>
          ) : (
            <div style={{
              borderRadius: 12, border: '2px dashed #e2e8f0',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 400, color: '#94a3b8', gap: 12,
            }}>
              <i className="fa-solid fa-image" style={{ fontSize: 48, opacity: 0.3 }} />
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Upload a photo and click Generate Preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
