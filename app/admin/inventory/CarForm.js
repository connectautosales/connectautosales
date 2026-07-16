'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './CarForm.module.css'

const MAKES = ['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Land Rover','Lexus','Lincoln','Mazda','Mercedes-Benz','Mitsubishi','Nissan','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo','Other']

export default function CarForm({ car }) {
  const router = useRouter()
  const isEdit = !!car
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [deleting, setDeleting] = useState(false)

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
    status:       car?.status || 'active',
    isNewArrival: car?.isNewArrival || false,
  })

  // Images state: array of URLs
  const [mainPhotos,    setMainPhotos]    = useState(car?.images ? JSON.parse(car.images) : [])
  const [damagePhotos,  setDamagePhotos]  = useState(car?.damageImages ? JSON.parse(car.damageImages) : [])
  const [uploading,     setUploading]     = useState({ main: false, damage: false })
  const [uploadError,   setUploadError]   = useState({ main: '', damage: '' })

  const mainInputRef   = useRef()
  const damageInputRef = useRef()

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
                <select name="make" value={form.make} onChange={set} required>
                  <option value="">Select Make</option>
                  {MAKES.map(m => <option key={m}>{m}</option>)}
                </select>
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

                  {/* Preview Grid */}
                  {mainPhotos.length > 0 && (
                    <div className={styles.photoGrid}>
                      {mainPhotos.map((url, i) => (
                        <div key={i} className={styles.photoThumb}>
                          {i === 0 && <span className={styles.mainBadge}>Main</span>}
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
                  )}
                </div>

                {/* Damage History Photos — only for rebuilt */}
                {form.titleType === 'rebuilt' && (
                  <div className={styles.photoBlock}>
                    <div className={styles.photoBlockHeader}>
                      <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f59e0b' }} />
                      <span>Damage History Photos</span>
                      <span className={styles.photoCount}>{damagePhotos.length} photos</span>
                    </div>
                    <p className={styles.photoNote}>Photos showing the vehicle before repair (required for rebuilt title vehicles).</p>

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
                      <div className={styles.photoGrid}>
                        {damagePhotos.map((url, i) => (
                          <div key={i} className={styles.photoThumb}>
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
                    )}
                  </div>
                )}

              </div>
            )}
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
                  <option value="active">Active</option>
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
