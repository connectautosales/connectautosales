'use client'
import { useState, useEffect, useRef } from 'react'

const DEFAULT_PROMPT = `You are overlaying graphic text elements onto the uploaded car photo. DO NOT repaint, redraw, or alter the vehicle or background in any way. The uploaded photo is the complete background — keep it 100% intact.

Output: 1080x1080 square image. The uploaded photo fills the entire canvas exactly as-is.

Add these graphic overlays on top of the photo:

TOP-LEFT AREA:
- A thin horizontal checkered flag strip (black and white squares) running across the very top edge
- Below it: website text "www.ConnectAuto-Sales.com" — black bold text, "Auto-Sales" portion in red
- Below that on next line: "{{year}} {{make}}" in large black bold text
- Below that: "{{model}}" in a MASSIVE font — ultra-bold, red gradient color (bright red to dark red), with a thick black outline/stroke. This should be the largest text on the entire image, spanning almost the full width
- Below the model name: a red rounded rectangle badge with white bold text "{{trim}}" (only if trim is provided)

TOP-RIGHT AREA:
- A black rounded rectangle with a red border outline, containing: a red phone icon on the left, then bold white text "313-413-3400" — large and prominent

BOTTOM-LEFT (floating box, does not span full width):
- A small black rounded rectangle box, semi-transparent black background
- Inside: "FINANCE PRICE" in small bold white text on top
- Below: "{{finance_price}}" in large bold white text with a red diagonal strikethrough line across the price number

BOTTOM-CENTER:
- A bold solid red arrow pointing right → between the two pricing boxes

BOTTOM-RIGHT (floating box, larger than left box):
- A large red rounded rectangle box
- At the top of this box: a small yellow badge/pill with black bold text "-$1,000 DISCOUNT!"
- Below: "WHEN PAY IN FULL" in small white text
- Below: "{{cash_price}}" in very large bold yellow/gold text

STRICT RULES:
- The vehicle photo background must remain completely unaltered — same colors, same lighting, same background
- Do NOT add any banners, strips, or overlays that cover the vehicle itself
- Do NOT add: Clean Title Guaranteed, Great Value, Buy With Confidence, Luxury & Performance, Reliable & Efficient, or any other badges not listed above
- All text elements float on top of the photo naturally
- Overall style: bold, high-contrast automotive advertisement`

export default function ImageTemplatePage() {
  const [prompt, setPrompt]     = useState('')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(true)

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

  useEffect(() => {
    fetch('/api/admin/watermark-prompt')
      .then(r => r.json())
      .then(d => { setPrompt(d.prompt || DEFAULT_PROMPT); setLoading(false) })
  }, [])

  const handleSave = async () => {
    setSaving(true); setSaved(false); setError('')
    const res = await fetch('/api/admin/watermark-prompt', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else { const d = await res.json(); setError(d.error || 'Save failed') }
    setSaving(false)
  }

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
    setGenStep('Generating AI image...')
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
      setGenStep('')
    } catch (err) {
      setGenError(err.message || 'Generation failed')
    } finally {
      setGenerating(false)
      setGenStep('')
    }
  }

  if (loading) return (
    <div style={{ padding: 40, color: '#64748b', fontSize: 14 }}>Loading...</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '28px 32px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0', gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Image Template
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '2px 0 0' }}>
            Customize the AI prompt used to generate feature images. Use the preview to test before saving.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: saving ? '#94a3b8' : '#e50202', color: '#fff',
            padding: '10px 20px', borderRadius: 8, border: 'none',
            fontWeight: 700, fontSize: '0.84rem', cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-floppy-disk" /> Save Prompt</>}
        </button>
      </div>

      {saved && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 32px', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-circle-check" /> Prompt saved successfully.
        </div>
      )}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 32px', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-circle-xmark" /> {error}
        </div>
      )}

      <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* LEFT: Prompt Editor */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-pen-to-square" style={{ color: '#e50202' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>AI Prompt</span>
          </div>

          <div style={{ padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Variables</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['{{year}}', '{{make}}', '{{model}}', '{{trim}}', '{{cash_price}}', '{{finance_price}}', '{{trim_line}}'].map(v => (
                <code key={v} style={{ background: '#e2e8f0', color: '#0f172a', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontFamily: 'monospace' }}>{v}</code>
              ))}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            style={{
              width: '100%', minHeight: 500, padding: '16px 20px',
              border: 'none', outline: 'none', resize: 'vertical',
              fontSize: '0.82rem', lineHeight: 1.7, color: '#1e293b',
              fontFamily: 'monospace', boxSizing: 'border-box',
            }}
          />

          <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{prompt.length} characters</span>
            <button
              onClick={() => setPrompt(DEFAULT_PROMPT)}
              style={{ fontSize: '0.78rem', color: '#64748b', background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}
            >
              Reset to Default
            </button>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-sliders" style={{ color: '#e50202' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Test Data</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Year', val: previewYear, set: setPreviewYear, type: 'number' },
                { label: 'Make', val: previewMake, set: setPreviewMake },
                { label: 'Model', val: previewModel, set: setPreviewModel },
                { label: 'Trim', val: previewTrim, set: setPreviewTrim },
                { label: 'Cash Price', val: previewPrice, set: setPreviewPrice, type: 'number' },
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

            <div style={{ padding: '0 20px 16px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Test Car Photo</label>
              <div
                onClick={() => fileRef.current.click()}
                style={{
                  border: '2px dashed #e2e8f0', borderRadius: 8, padding: '14px',
                  textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
                }}
              >
                {previewImg
                  ? <img src={previewImg} alt="" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain', borderRadius: 4 }} />
                  : <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}><i className="fa-solid fa-image" /> Click to upload</span>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>

            <div style={{ padding: '0 20px 16px' }}>
              <button
                onClick={handleGenerate}
                disabled={generating || !previewFile}
                style={{
                  width: '100%', padding: '11px 0',
                  background: generating ? '#64748b' : (!previewFile ? '#e2e8f0' : '#e50202'),
                  color: !previewFile ? '#94a3b8' : '#fff',
                  border: 'none', borderRadius: 8, fontWeight: 700,
                  fontSize: '0.9rem', cursor: generating || !previewFile ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {generating
                  ? <><i className="fa-solid fa-spinner fa-spin" /> {genStep || 'Generating...'}</>
                  : <><i className="fa-solid fa-wand-magic-sparkles" /> Generate Preview</>
                }
              </button>
              {genError && (
                <div style={{ marginTop: 8, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.78rem', color: '#991b1b' }}>
                  <i className="fa-solid fa-triangle-exclamation" /> {genError}
                </div>
              )}
            </div>
          </div>

          {genResult && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-eye" style={{ color: '#16a34a' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Preview Result</span>
              </div>
              <div style={{ padding: 16 }}>
                <img src={genResult} alt="Generated" style={{ width: '100%', borderRadius: 8, display: 'block' }} />
              </div>
              <div style={{ padding: '0 16px 16px', display: 'flex', gap: 10 }}>
                <a
                  href={genResult}
                  download="preview.png"
                  style={{
                    flex: 1, padding: '9px 0', background: '#f1f5f9', color: '#475569',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontWeight: 600,
                    fontSize: '0.82rem', textAlign: 'center', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <i className="fa-solid fa-download" /> Download
                </a>
                <button
                  onClick={() => { setGenResult(null); setGenStep('') }}
                  style={{
                    flex: 1, padding: '9px 0', background: 'none', color: '#64748b',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontWeight: 600,
                    fontSize: '0.82rem', cursor: 'pointer',
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
