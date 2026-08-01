import Link from 'next/link'
import Image from 'next/image'
import styles from './CarCard.module.css'

function getFirstImage(car) {
  if (car.images) {
    try {
      const arr = JSON.parse(car.images)
      if (Array.isArray(arr) && arr.length > 0) return arr[0]
    } catch {}
  }
  if (car.image) return car.image
  return null
}

export default function CarCard({ car }) {
  const imgSrc = getFirstImage(car)

  return (
    <div className={styles.card}>
      <Link href={`/inventory/${car.stock || car.slug || car.id}`} className={styles.imageWrap}>
        {(car.isNewArrival || car.newArrival) && (
          <span className={styles.newArrivalBadge}>NEW ARRIVAL</span>
        )}
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        ) : (
          <div className={styles.placeholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
        )}
      </Link>

      <div className={styles.body}>
        <div className={styles.yearMake}>{car.year} {car.make}</div>
        <div className={styles.model}>{car.model}{car.trim ? ` ${car.trim}` : ''}</div>
        <div className={styles.mileage}>{(car.mileage || 0).toLocaleString()} miles</div>

        <div className={styles.price}>
          {car.price ? `$${car.price.toLocaleString()}` : 'Call for Price'}
        </div>

        <Link href={`/inventory/${car.stock || car.slug || car.id}`} className={styles.viewBtn}>
          VIEW DETAILS
        </Link>
      </div>
    </div>
  )
}
