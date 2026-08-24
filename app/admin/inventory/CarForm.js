'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styles from './CarForm.module.css'

const MAKES = ['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Land Rover','Lexus','Lincoln','Mazda','Mercedes-Benz','Mitsubishi','Nissan','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo','Harley-Davidson','Kawasaki','Yamaha','Suzuki','Indian','Can-Am','Polaris','Ducati','KTM','Royal Enfield','Big Tex','PJ Trailers','Load Trail','Carry-On','Cargo Mate','Featherlite','Timpte','Utility Trailer','Other']

export default function CarForm({ car }) {
  const router = useRouter()
  const isEdit = !!car
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [deleting, setDeleting] = useState(false)

  const inList = MAKES.includes(car?.make)
  const [customMake, setCustomMake] = useState(!inList && car?.make ? car.make : '')
  const [makeSelect, setMakeSelect] = useState(inList ? (car?.make || '') : (car?.make ? 'Other' : ''))

  const [form, setForm] = useState({
    stock:        car?.stock || '',
    year:         car?.year || new Date().getFullYear(),
    make:         car?.make || '',
    model:        car?.model || '',
    trim:         car?.trim || '',
    type:         car?.type || '',
    vin:          car?.vin || '',
    price:        car?.price || '',
    financePrice: car?.financePrice || '',
    mileage:      car?.mileage || '',
    titleType:    car?.titleType || 'clean',
    drivetrain:   car?.drivetrain || '',
    transmission: car?.transmission || 'Automatic',
    fuelType:     car?.fuelType || 'Gasoline',
    color:        car?.color || '',
    description:  car?.description || '',
    features:     car?.features ? JSON.parse(car.features).join('\n') : '',
    status:       car?.status || 'available',
    isNewArrival: car?.isNewArrival || false,
    featured:     car?.featured || false,
  })

  // Images state: array of URLs
  const [mainPhotos,    setMainPhotos]    = useState(car?.images ? JSON.parse(car.images) : [])
  const [damagePhotos,  setDamagePhotos]  = useState(car?.damageImages ? JSON.parse(car.damageImages) : [])
  const [uploading,     setUploading]     = useState({ main: false, damage: false })
  const [uploadError,   setUploadError]   = useState({ main: '', damage: '' })

  const mainInputRef   = useRef()
  const damageInputRef = useRef()
  const genInputRef    = useRef()
  const dragIndex      = useRef(null)

  const handleDragStart = useCallback((i) => { dragIndex.current = i }, [])
  const handleDragOver  = useCallback((e) => { e.preventDefault() }, [])
  const handleDropPhoto = useCallback((i) => {
    if (dragIndex.current === null || dragIndex.current === i) return
    setMainPhotos(p => {
      const arr = [...p]
      const [moved] = arr.splice(dragIndex.current, 1)
      arr.splice(i, 0, moved)
      dragIndex.current = null
      return arr
    })
  }, [])
  const setAsFeature = useCallback((i) => {
    setMainPhotos(p => {
      const arr = [...p]
      const [picked] = arr.splice(i, 1)
      return [picked, ...arr]
    })
  }, [])

  // Watermark generator state
  const [featTab,     setFeatTab]     = useState('upload') // 'upload' | 'generate'
  const [genFile,     setGenFile]     = useState(null)
  const [genPreview,  setGenPreview]  = useState(null)
  const [generating,  setGenerating]  = useState(false)
  const [genStep,     setGenStep]     = useState('') // current step label
  const [genResult,   setGenResult]   = useState(null)
  const [genError,    setGenError]    = useState('')

  const set = (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [e.target.name]: v }))
  }

  // Upload files to server — use car.id for edits, stock number for new
  const uploadFiles = async (files, folder, setPhotos) => {
    const identifier = isEdit ? car.id : `stock-${form.stock}`
    if (!isEdit && !form.stock.trim()) {
      setError('Enter a Stock # before uploading photos.')
      return
    }
    const key = folder === 'main-photos' ? 'main' : 'damage'
    setUploading(p => ({ ...p, [key]: true }))
    setUploadError(p => ({ ...p, [key]: '' }))
    const uploaded = []
    const failed = []
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('carId', identifier)
      fd.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        uploaded.push(data.url)
      } else {
        failed.push(`${file.name}: ${data.error}`)
      }
    }
    if (uploaded.length) setPhotos(p => [...p, ...uploaded])
    if (failed.length) setUploadError(p => ({ ...p, [key]: failed.join(' · ') }))
    setUploading(p => ({ ...p, [key]: false }))
  }

  const handleMainDrop   = (e) => { e.preventDefault(); uploadFiles([...e.dataTransfer.files], 'main-photos', setMainPhotos) }
  const handleDamageDrop = (e) => { e.preventDefault(); uploadFiles([...e.dataTransfer.files], 'damage-history', setDamagePhotos) }

  const handleGenFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setGenFile(file)
    setGenResult(null)
    setGenError('')
    const reader = new FileReader()
    reader.onload = (ev) => setGenPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!genFile) return
    if (!isEdit && !form.stock.trim()) { setGenError('Enter a Stock # before generating.'); return }
    if (!form.price) { setGenError('Enter a Cash Price before generating.'); return }
    if (!form.make || !form.model) { setGenError('Enter Make and Model before generating.'); return }
    setGenerating(true)
    setGenStep('Preparing image...')
    setGenError('')
    setGenResult(null)
    try {
      setGenStep('Uploading photo to server...')
      const fd = new FormData()
      fd.append('photo', genFile)
      fd.append('carId', isEdit ? car.id : `stock-${form.stock}`)
      fd.append('year', form.year)
      fd.append('make', form.make)
      fd.append('model', form.model)
      fd.append('trim', form.trim)
      fd.append('price', form.price)
      fd.append('financePrice', form.financePrice || '')
      setGenStep('Generating image with AI...')
      const res = await fetch('/api/admin/watermark', { method: 'POST', body: fd })
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { throw new Error(text.slice(0, 200) || 'Generation failed') }
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      // Poll for result
      const { requestId } = data
      if (!requestId) throw new Error('No requestId returned')
      setGenStep('AI generating image...')
      const deadline = Date.now() + 180000
      let base64 = null
      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 4000))
        const poll = await fetch(`/api/admin/watermark-status?requestId=${requestId}`)
        const pollData = await poll.json()
        if (pollData.done) { base64 = pollData.base64; break }
      }
      if (!base64) throw new Error('Image generation timed out. Try again.')

      // Convert base64 to File and upload via existing upload route
      setGenStep('Saving to cloud...')
      const byteStr = atob(base64.split(',')[1])
      const ab = new ArrayBuffer(byteStr.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i)
      const file = new File([ab], 'watermark.jpg', { type: 'image/jpeg' })

      const uploadFd = new FormData()
      uploadFd.append('file', file)
      uploadFd.append('carId', isEdit ? car.id : `stock-${form.stock}`)
      uploadFd.append('folder', 'main-photos')
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: uploadFd })
      const uploadText = await uploadRes.text()
      let uploadData
      try { uploadData = JSON.parse(uploadText) } catch { throw new Error(uploadText.slice(0, 200) || 'Upload failed') }
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed')

      setGenStep('Done!')
      setGenResult(uploadData.url)
    } catch (err) {
      setGenError(err.message || 'Something went wrong. Check Make, Model, and Price are filled.')
    } finally {
      setGenerating(false)
      setGenStep('')
    }
  }

  const useGenAsFeature = () => {
    if (!genResult) return
    setMainPhotos(p => [genResult, ...p.filter(u => u !== genResult)])
    setGenResult(null)
    setGenFile(null)
    setGenPreview(null)
    setFeatTab('upload')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = {
      ...form,
      year:         parseInt(form.year),
      price:        parseFloat(form.price),
      financePrice: form.financePrice ? parseFloat(form.financePrice) : null,
      mileage:      parseInt(form.mileage),
      features:     JSON.stringify(form.features.split('\n').map(f => f.trim()).filter(Boolean)),
      images:       JSON.stringify(mainPhotos),
      damageImages: JSON.stringify(damagePhotos),
    }

    const res = await fetch(isEdit ? `/api/admin/cars/${car.id}` : '/api/admin/cars', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      // After creating new car, redirect to its edit page so photos can be uploaded
      if (!isEdit && data.id) {
        router.push(`/admin/inventory/${data.id}`)
      } else {
        router.push('/admin/inventory')
      }
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Something went wrong.')
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this vehicle? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/admin/cars/${car.id}`, { method: 'DELETE' })
    router.push('/admin/inventory')
    router.refresh()
  }

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button type="button" onClick={() => router.push('/admin/inventory')} className={styles.back}>
            <i className="fa-solid fa-arrow-left" /> Back to Inventory
          </button>
          <h1 className={styles.title}>
            {isEdit ? `${car.year} ${car.make} ${car.model}` : 'Add New Vehicle'}
          </h1>
          <p className={styles.sub}>
            {isEdit ? `Stock #${car.stock} · ID #${car.id}` : 'Fill in the details, then save to upload photos'}
          </p>
        </div>
        {isEdit && (
          <button type="button" onClick={handleDelete} disabled={deleting} className={styles.deleteBtn}>
            {deleting
              ? <><i className="fa-solid fa-spinner fa-spin" /> Deleting...</>
              : <><i className="fa-solid fa-trash" /> Delete Vehicle</>
            }
          </button>
        )}
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Basic Info */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-circle-info" />
              <h3 className={styles.sectionTitle}>Basic Information</h3>
            </div>
            <div className={styles.grid4}>
              <div className={styles.field}>
                <label>Stock # <span className={styles.req}>*</span></label>
                <input name="stock" value={form.stock} onChange={set} placeholder="STK-001" required />
              </div>
              <div className={styles.field}>
                <label>Year <span className={styles.req}>*</span></label>
                <input name="year" type="number" value={form.year} onChange={set} min="1990" max="2030" required />
              </div>
              <div className={styles.field}>
                <label>Make <span className={styles.req}>*</span></label>
                <select
                  value={makeSelect}
                  onChange={e => {
                    const v = e.target.value
                    setMakeSelect(v)
                    if (v !== 'Other') {
                      setCustomMake('')
                      setForm(f => ({ ...f, make: v }))
                    } else {
                      setForm(f => ({ ...f, make: '' }))
                    }
                  }}
                  required={makeSelect !== 'Other'}
                >
                  <option value="">Select Make</option>
                  {MAKES.map(m => <option key={m}>{m}</option>)}
                </select>
                {makeSelect === 'Other' && (
                  <input
                    style={{ marginTop: 8 }}
                    value={customMake}
                    onChange={e => {
                      setCustomMake(e.target.value)
                      setForm(f => ({ ...f, make: e.target.value }))
                    }}
                    placeholder="Type make (e.g. Harley-Davidson, Big Tex)"
                    required
                  />
                )}
              </div>
              <div className={styles.field}>
                <label>Model <span className={styles.req}>*</span></label>
                <input name="model" value={form.model} onChange={set} placeholder="Camry" required />
              </div>
              <div className={styles.field}>
                <label>Trim</label>
                <input name="trim" value={form.trim} onChange={set} placeholder="XLE" />
              </div>
              <div className={styles.field}>
                <label>Vehicle Type</label>
                <select name="type" value={form.type} onChange={set}>
                  <option value="">Select Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Van">Van</option>
                  <option value="Minivan">Minivan</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>VIN</label>
                <input name="vin" value={form.vin} onChange={set} placeholder="1HGBH41JXMN109186" />
              </div>
              <div className={styles.field}>
                <label>Mileage <span className={styles.req}>*</span></label>
                <input name="mileage" type="number" value={form.mileage} onChange={set} placeholder="45000" required />
              </div>
              <div className={styles.field}>
                <label>Color</label>
                <input name="color" value={form.color} onChange={set} placeholder="Pearl White" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-tag" />
              <h3 className={styles.sectionTitle}>Pricing</h3>
            </div>
            <div className={styles.grid4}>
              <div className={styles.field}>
                <label>Cash Price <span className={styles.req}>*</span></label>
                <input name="price" type="number" value={form.price} onChange={set} placeholder="24995" required />
              </div>
              <div className={styles.field}>
                <label>Finance Price</label>
                <input name="financePrice" type="number" value={form.financePrice} onChange={set} placeholder="26995" />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-car" />
              <h3 className={styles.sectionTitle}>Vehicle Details</h3>
            </div>
            <div className={styles.grid4}>
              <div className={styles.field}>
                <label>Title Type <span className={styles.req}>*</span></label>
                <select name="titleType" value={form.titleType} onChange={set}>
                  <option value="clean">Clean Title</option>
                  <option value="rebuilt">Rebuilt Title</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Drivetrain</label>
                <select name="drivetrain" value={form.drivetrain} onChange={set}>
                  <option value="">Select</option>
                  <option value="FWD">FWD</option>
                  <option value="RWD">RWD</option>
                  <option value="AWD">AWD</option>
                  <option value="4WD">4WD</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Transmission</label>
                <select name="transmission" value={form.transmission} onChange={set}>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Fuel Type</label>
                <select name="fuelType" value={form.fuelType} onChange={set}>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-align-left" />
              <h3 className={styles.sectionTitle}>Description &amp; Features</h3>
            </div>
            <div className={styles.field}>
              <label>Vehicle Description</label>
              <textarea name="description" value={form.description} onChange={set} rows={4} placeholder="Describe the vehicle condition, history, highlights..." />
            </div>
            <div className={styles.field} style={{ marginTop: 16 }}>
              <label>Features <span className={styles.hint}>(one per line)</span></label>
              <textarea name="features" value={form.features} onChange={set} rows={6} placeholder={"Leather Seats\nApple CarPlay\nBackup Camera\nHeated Seats"} />
            </div>
          </div>

          {/* Photos */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-images" />
              <h3 className={styles.sectionTitle}>Vehicle Photos</h3>
            </div>

            {!isEdit && !form.stock.trim() ? (
              <div className={styles.photosLocked}>
                <i className="fa-solid fa-circle-info" />
                <p>Enter a Stock # above to enable photo uploads.</p>
              </div>
            ) : (
              <div className={styles.photosWrap}>

                {/* Main Photos */}
                <div className={styles.photoBlock}>
                  <div className={styles.photoBlockHeader}>
                    <i className="fa-solid fa-camera" />
                    <span>Main Photos</span>
                    <span className={styles.photoCount}>{mainPhotos.length} photos</span>
                  </div>

                  {/* Tab Toggle */}
                  <div style={{ display: 'flex', gap: 0, marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
                    <button
                      type="button"
                      onClick={() => setFeatTab('upload')}
                      style={{
                        padding: '7px 18px', fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                        background: featTab === 'upload' ? '#0f172a' : '#f8fafc',
                        color: featTab === 'upload' ? '#fff' : '#64748b',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <i className="fa-solid fa-cloud-arrow-up" /> Upload Photos
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeatTab('generate')}
                      style={{
                        padding: '7px 18px', fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                        background: featTab === 'generate' ? '#e50202' : '#f8fafc',
                        color: featTab === 'generate' ? '#fff' : '#64748b',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles" /> Generate Feature Image
                    </button>
                  </div>

                  {featTab === 'upload' ? (
                    <>
                      {/* Drop Zone */}
                      <div
                        className={styles.dropZone}
                        onClick={() => mainInputRef.current.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleMainDrop}
                      >
                        {uploading.main ? (
                          <><i className="fa-solid fa-spinner fa-spin" /><span>Uploading...</span></>
                        ) : (
                          <>
                            <i className="fa-solid fa-cloud-arrow-up" />
                            <span>Click or drag photos here</span>
                            <small>JPG, PNG, WEBP — multiple files allowed</small>
                          </>
                        )}
                      </div>
                      <input
                        ref={mainInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => uploadFiles([...e.target.files], 'main-photos', setMainPhotos)}
                      />
                      {uploadError.main && (
                        <div className={styles.uploadErr}>
                          <i className="fa-solid fa-triangle-exclamation" />
                          {uploadError.main}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Generate Feature Image Panel */
                    <div style={{ border: '1px solid #fecaca', borderRadius: 10, padding: 20, background: '#fff5f5' }}>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 14px' }}>
                        Upload a plain car photo — the system will auto-apply the branded template (logo, phone, price overlay) and add it as the first photo.
                      </p>

                      {/* Plain photo upload */}
                      <div
                        className={styles.dropZone}
                        onClick={() => genInputRef.current.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { handleGenFileChange({ target: { files: [f] } }); } }}
                        style={{ marginBottom: 14 }}
                      >
                        {genPreview ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={genPreview} alt="preview" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 6, objectFit: 'contain' }} />
                        ) : (
                          <>
                            <i className="fa-solid fa-cloud-arrow-up" />
                            <span>Click or drag a plain car photo here</span>
                            <small>JPG, PNG, WEBP</small>
                          </>
                        )}
                      </div>
                      <input
                        ref={genInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleGenFileChange}
                      />

                      {genFile && !genResult && (
                        <>
                          <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={generating}
                            style={{
                              width: '100%', padding: '11px 0', background: generating ? '#64748b' : '#e50202',
                              color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700,
                              fontSize: '0.9rem', cursor: generating ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                              transition: 'background 0.2s',
                            }}
                          >
                            {generating
                              ? <><i className="fa-solid fa-spinner fa-spin" /> {genStep || 'Processing...'}</>
                              : <><i className="fa-solid fa-wand-magic-sparkles" /> Generate Watermark</>
                            }
                          </button>

                          {generating && (
                            <div style={{ marginTop: 12 }}>
                              {/* Progress bar */}
                              <div style={{ height: 4, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%', borderRadius: 99, background: '#e50202',
                                  animation: 'genProgress 3s ease-in-out infinite',
                                  width: '60%',
                                }} />
                              </div>
                              <style>{`
                                @keyframes genProgress {
                                  0%   { width: 5%;  margin-left: 0; }
                                  50%  { width: 40%; margin-left: 30%; }
                                  100% { width: 5%;  margin-left: 95%; }
                                }
                              `}</style>
                              {/* Steps */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                                {[
                                  { label: 'Preparing image',           step: 'Preparing image...' },
                                  { label: 'Uploading photo to server', step: 'Uploading photo to server...' },
                                  { label: 'Generating AI image',        step: 'Generating image with AI...' },
                                  { label: 'Saving to cloud',           step: 'Saving to cloud...' },
                                ].map((s, idx) => {
                                  const steps = ['Preparing image...', 'Uploading photo to server...', 'Generating image with AI...', 'Saving to cloud...']
                                  const currentIdx = steps.indexOf(genStep)
                                  const isDone = currentIdx > idx
                                  const isActive = currentIdx === idx
                                  return (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: isDone ? '#16a34a' : isActive ? '#e50202' : '#94a3b8' }}>
                                      {isDone
                                        ? <i className="fa-solid fa-circle-check" style={{ fontSize: 13 }} />
                                        : isActive
                                          ? <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 13 }} />
                                          : <i className="fa-regular fa-circle" style={{ fontSize: 13 }} />
                                      }
                                      <span style={{ fontWeight: isActive ? 700 : 400 }}>{s.label}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {genError && (
                        <div className={styles.uploadErr} style={{ marginTop: 10 }}>
                          <i className="fa-solid fa-triangle-exclamation" /> {genError}
                        </div>
                      )}

                      {genResult && (
                        <div style={{ marginTop: 14 }}>
                          <p style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, margin: '0 0 10px' }}>
                            <i className="fa-solid fa-circle-check" /> Generated successfully — preview:
                          </p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={genResult} alt="generated" style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />
                          <button
                            type="button"
                            onClick={useGenAsFeature}
                            style={{
                              width: '100%', padding: '10px 0', background: '#16a34a',
                              color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700,
                              fontSize: '0.9rem', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                          >
                            <i className="fa-solid fa-star" /> Use as Feature Image
                          </button>
                          <button
                            type="button"
                            onClick={() => { setGenResult(null); setGenFile(null); setGenPreview(null) }}
                            style={{
                              width: '100%', marginTop: 8, padding: '8px 0', background: 'transparent',
                              color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 8,
                              fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer',
                            }}
                          >
                            Try Again
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview Grid */}
                  {mainPhotos.length > 0 && (
                    <>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '10px 0 6px' }}>
                        <i className="fa-solid fa-grip-dots" /> Drag to reorder &nbsp;·&nbsp; <i className="fa-solid fa-star" /> Set as feature
                      </p>
                      <div className={styles.photoGrid} style={{ marginTop: 4 }}>
                        {mainPhotos.map((url, i) => (
                          <div
                            key={url}
                            className={styles.photoThumb}
                            draggable
                            onDragStart={() => handleDragStart(i)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDropPhoto(i)}
                            style={{ cursor: 'grab', position: 'relative' }}
                          >
                            {i === 0
                              ? <span className={styles.mainBadge}>Feature</span>
                              : (
                                <button
                                  type="button"
                                  title="Set as Feature Image"
                                  onClick={() => setAsFeature(i)}
                                  style={{
                                    position: 'absolute', top: 4, left: 4, zIndex: 2,
                                    background: 'rgba(0,0,0,0.55)', border: 'none',
                                    borderRadius: 4, color: '#facc15', cursor: 'pointer',
                                    padding: '2px 5px', fontSize: 11, lineHeight: 1,
                                  }}
                                >
                                  <i className="fa-solid fa-star" />
                                </button>
                              )
                            }
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" />
                            <button
                              type="button"
                              className={styles.removePhoto}
                              onClick={() => setMainPhotos(p => p.filter((_, idx) => idx !== i))}
                            >
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>


              </div>
            )}
          </div>

          {/* Damage History Photos — always visible, shown on website only if photos uploaded */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f59e0b' }} />
              <h3 className={styles.sectionTitle}>Damage History Photos</h3>
            </div>
            <p className={styles.photoNote}>Photos showing previous damage. Upload only if applicable — section will be hidden on the website if no photos are added.</p>

            <div className={styles.photosWrap}>
              <div className={styles.photoBlock}>
                <div
                  className={`${styles.dropZone} ${styles.dropZoneDamage}`}
                  onClick={() => damageInputRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDamageDrop}
                >
                  {uploading.damage ? (
                    <><i className="fa-solid fa-spinner fa-spin" /><span>Uploading...</span></>
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up" />
                      <span>Click or drag damage photos here</span>
                      <small>JPG, PNG, WEBP — multiple files allowed</small>
                    </>
                  )}
                </div>
                <input
                  ref={damageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => uploadFiles([...e.target.files], 'damage-history', setDamagePhotos)}
                />

                {uploadError.damage && (
                  <div className={styles.uploadErr}>
                    <i className="fa-solid fa-triangle-exclamation" />
                    {uploadError.damage}
                  </div>
                )}

                {damagePhotos.length > 0 && (
                  <>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '10px 0 6px' }}>
                      <i className="fa-solid fa-grip-dots" /> Drag to reorder
                    </p>
                    <div className={styles.photoGrid}>
                      {damagePhotos.map((url, i) => (
                        <div
                          key={url}
                          className={styles.photoThumb}
                          draggable
                          onDragStart={() => { dragIndex.current = i }}
                          onDragOver={e => e.preventDefault()}
                          onDrop={() => {
                            if (dragIndex.current === null || dragIndex.current === i) return
                            setDamagePhotos(p => {
                              const arr = [...p]
                              const [moved] = arr.splice(dragIndex.current, 1)
                              arr.splice(i, 0, moved)
                              dragIndex.current = null
                              return arr
                            })
                          }}
                          style={{ cursor: 'grab' }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" />
                          <button
                            type="button"
                            className={styles.removePhoto}
                            onClick={() => setDamagePhotos(p => p.filter((_, idx) => idx !== i))}
                          >
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Listing Status */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <i className="fa-solid fa-toggle-on" />
              <h3 className={styles.sectionTitle}>Listing Status</h3>
            </div>
            <div className={styles.grid4}>
              <div className={styles.field}>
                <label>Status</label>
                <select name="status" value={form.status} onChange={set}>
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="sold">Sold</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>New Arrival Badge</label>
                <label className={styles.toggle}>
                  <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={set} />
                  <span>Show &quot;New Arrival&quot; badge</span>
                </label>
              </div>
              <div className={styles.field}>
                <label>Featured on Homepage</label>
                <label className={styles.toggle}>
                  <input type="checkbox" name="featured" checked={form.featured} onChange={set} />
                  <span>Show on homepage featured section</span>
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <i className="fa-solid fa-circle-exclamation" />
              {error}
            </div>
          )}

          <div className={styles.formFooter}>
            <button type="button" onClick={() => router.push('/admin/inventory')} className={styles.cancelBtn}>
              <i className="fa-solid fa-xmark" /> Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.saveBtn}>
              {loading
                ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</>
                : isEdit
                  ? <><i className="fa-solid fa-floppy-disk" /> Save Changes</>
                  : <><i className="fa-solid fa-plus" /> Add Vehicle</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
