import Link from 'next/link'
import Image from 'next/image'
import styles from './CarCard.module.css'

export default function CarCard({ car }) {
  return (
    <div className={styles.card}>
      <Link href={`/inventory/${car.id}`} className={styles.imageWrap}>
        {car.newArrival && (
          <span className={styles.newArrivalBadge}>NEW ARRIVAL</span>
        )}
        {car.image ? (
          <Image
            src={car.image}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 20vw"
            style={{ objectFit: 'cover' }}
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
        <div className={styles.model}>{car.model}</div>
        <div className={styles.mileage}>{car.mileage.toLocaleString()} miles</div>

        <div className={styles.price}>
          {car.price ? `$${car.price.toLocaleString()} *` : 'Call for Price'}
        </div>

        <Link href={`/inventory/${car.id}`} className={styles.viewBtn}>
          VIEW DETAILS
        </Link>
      </div>
    </div>
  )
}
