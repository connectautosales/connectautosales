'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero/Hero'
import CarCard from '@/components/CarCard/CarCard'
import styles from './page.module.css'

const whyItems = [
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 85.78 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#e50202" d="M85.76,31.24c0-.89,0-1.77,0-2.66-.08-3.65-.15-7.3-.25-10.95-.08-2.87-1.63-4.41-4.48-4.53-1.47-.07-3-.13-4.42-.29a62.38,62.38,0,0,1-31.3-12,4,4,0,0,0-4.91,0,62,62,0,0,1-18.91,9.58,70.69,70.69,0,0,1-17,2.82C1.78,13.4.35,15,.27,17.7.09,24-.06,30.19,0,36.44A113,113,0,0,0,2.19,58.68C4.46,69.21,9.09,78.44,17,85.85A67.19,67.19,0,0,0,40.15,99.5a8.86,8.86,0,0,0,6.25-.16,73.9,73.9,0,0,0,10.41-4.93,56.17,56.17,0,0,0,15.2-12c6.78-7.63,10.4-16.71,12.17-26.64A132.07,132.07,0,0,0,85.76,31.24ZM75.15,60.61c-4.71,13-15.37,23-27.3,29.47a11.12,11.12,0,0,1-4.58,1.63,11.08,11.08,0,0,1-5.82-1.89c-12.2-6.91-22.8-17.39-27.08-31-2.07-6.59-2.13-13.14-2-20l.17-12.6,0-2.27a3.65,3.65,0,0,1,.54-2.26,3.77,3.77,0,0,1,2.49-1,95,95,0,0,0,28.88-9.22,6.8,6.8,0,0,1,2.29-.84,6.93,6.93,0,0,1,3.69,1.1,91.65,91.65,0,0,0,28,9.08A3.81,3.81,0,0,1,77.1,22a3.81,3.81,0,0,1,.47,2.12c.16,8,.93,16,.28,23.92A48.57,48.57,0,0,1,75.15,60.61Z"/>
        <path fill="#e50202" d="M63.66,39.25a4.06,4.06,0,0,1-1.4,3q-7.74,7.82-15.45,15.65c-2.33,2.36-4.66,4.73-7,7.08-1.29,1.31-2.35,1.4-3.83.34a54.27,54.27,0,0,1-11.77-12.1c-.81-1.09-.13-3.7,1.16-4.84A3.48,3.48,0,0,1,30,48.34c1.87,1.7,3.64,3.51,5.44,5.29s2.76,1.67,4.47-.07q8.74-8.89,17.52-17.76a2.79,2.79,0,0,1,4.27,0C62.7,36.77,63.75,37.75,63.66,39.25Z"/>
      </svg>
    ),
    label: 'INSPECTED',
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#e50202" d="M50,0a50,50,0,1,0,50,49.92A50,50,0,0,0,50,0Zm-1.2,90.36A40.31,40.31,0,1,1,90.32,50.14,40.33,40.33,0,0,1,48.77,90.36Z"/>
        <path fill="#e50202" d="M60.29,48.54A17.86,17.86,0,0,0,55,46.77l-1.19-.21V38.09a34.31,34.31,0,0,1,4.65,2.25,3.48,3.48,0,0,0,4.27-.47,4.28,4.28,0,0,0-1.27-7.13c-1.93-.83-3.87-1.61-5.84-2.35a2.8,2.8,0,0,1-1.81-1.63V23.38H46.3v6.43a2.74,2.74,0,0,1-1.33.8,31.21,31.21,0,0,0-3.69,1.21c-3.87,1.66-6.15,4.38-6.13,8.79a10.91,10.91,0,0,0,4.67,9.46A20.75,20.75,0,0,0,45,52.63c.42.15.84.28,1.26.41V63.51a6.83,6.83,0,0,1-1.91-1,53.56,53.56,0,0,0-4.84-2.92,2.73,2.73,0,0,0-3.27.24A2.77,2.77,0,0,0,35.61,63a13.1,13.1,0,0,0,1.13,2.32,10.26,10.26,0,0,0,6.87,4.47,4.56,4.56,0,0,1,2.69,1.6v5.87h7.46V72a3.46,3.46,0,0,1,2-1.39c.44-.13.89-.23,1.34-.35,4.95-1.29,7.76-4.52,8.24-9.51A18.26,18.26,0,0,0,64.72,54,8.61,8.61,0,0,0,60.29,48.54ZM43.12,41.66a4,4,0,0,1,3.18-4.18v7.83A3.94,3.94,0,0,1,43.12,41.66ZM55.45,61.74a5.72,5.72,0,0,1-1.69,1.08v-8a4.13,4.13,0,0,1,3,4.3A3.93,3.93,0,0,1,55.45,61.74Z"/>
      </svg>
    ),
    label: 'FINANCING',
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#e50202" d="M98.07,88.29,73.63,66.49c-1.5-1.35-1.51-1.37-.52-3.13a60.58,60.58,0,0,0,6.63-16.75,36.92,36.92,0,0,0-.26-17.91,37.2,37.2,0,0,0-7.44-14c-3.22-3.89-6.75-7.46-11.3-9.83C51-.23,40.78-1,30.2,1.05A35.42,35.42,0,0,0,13,10.25C8.48,14.43,3.83,20.07,2.08,26A50.67,50.67,0,0,0,0,40.26,45.52,45.52,0,0,0,3.09,57.13c2.52,6.41,7,11.26,12.28,15.44a35.65,35.65,0,0,0,30.1,7.35,60.85,60.85,0,0,0,18-6.85c1.52-.85,1.62-.81,2.79.51l22.14,25a4.11,4.11,0,0,0,4.54,1.11,11.44,11.44,0,0,0,6.31-5.88A4.25,4.25,0,0,0,98.07,88.29ZM40,70.39A30.65,30.65,0,1,1,70.61,39.75,30.66,30.66,0,0,1,40,70.39Z"/>
        <path fill="#e50202" d="M35.27,18.17a1,1,0,0,1,1,.54,1.13,1.13,0,0,1-.4,1.29,42.83,42.83,0,0,1-6.08,5,23.88,23.88,0,0,0-9.78,13.61c-.49,1.77-1.45,2.1-3.17,1.31A1.29,1.29,0,0,1,16,38.46c.94-5.79,2.75-11.17,7.23-15.27A20.58,20.58,0,0,1,35.27,18.17Z"/>
      </svg>
    ),
    label: 'VEHICLE HISTORY',
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 96.28 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#e50202" d="M57.58,100c6.91,0,13.82,0,20.73,0,3.25,0,5.33-1.25,6.5-4.35a29.8,29.8,0,0,1,9.26-13.15A5.13,5.13,0,0,0,96.13,77c-1.1-5.31-1.89-10.69-3-16-1-4.72-4.94-5.91-8.59-2.73-1.85,1.62-3.51,3.46-5.37,5.09a2.55,2.55,0,0,1-3.68-.22c-1.31-1.21-.82-2.43.21-3.55A17.89,17.89,0,0,1,77.21,58c8.51-7.14,7.69-16,4.73-25.32a4,4,0,0,0-2.52-2.52C74.27,28.07,69.11,26,64,24c-2.33-.94-4.06-.3-5.31,1.85-1.86,3.2-3.74,6.39-5.6,9.59-.83,1.43-1.74,2.82-3.67,2.59-4.24-.53-6.37,2.16-8,5.34-3.54,6.92-4.94,14.43-5.63,22.09a7.74,7.74,0,0,0,1,4.64c5.22,9,3.93,17.46-1.71,25.69-.67,1-1.73,2-.89,3.32s2.21.89,3.4.89C44.25,100,50.91,100,57.58,100ZM61.16,17.2c3.52.2,6,.38,8.45.47,1.18,0,2.65.48,3.27-1s-.59-2.29-1.31-3.24A13.37,13.37,0,0,0,65.2,9.19c-2.77-1-5.66-1.85-7.85-4-1.85-1.82-4-2.09-6.49-1.77A93.67,93.67,0,0,0,36.42,6.58C31.37,8.09,26.19,8,23.24,1.88,22.09-.5,20.32-.45,18.39,1.07a69.14,69.14,0,0,1-13,7.77c-2.06,1-5.63.82-5.39,4.1S3.7,16.05,6.1,16.66c8.48,2.13,12.6,6.85,13.06,15.19.1,1.77,0,3.8,2.31,4,2.48.17,2.33-2.08,2.67-3.7.84-4,2.78-6.88,7.1-8A111.57,111.57,0,0,0,44.17,19.6C50,17.23,55.93,15.93,61.16,17.2Z"/>
      </svg>
    ),
    label: 'LICENSED INSPECTIONS',
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 84.4 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#e50202" d="M84.39,36.84c-.68,9.2.15,17.33-1.52,25.3C80.49,73.53,73.72,82,64.7,88.94a71.1,71.1,0,0,1-18,9.93c-2.64,1-5.35,1.54-8,.56C22.27,93.31,8.85,83.84,2.35,66.71A35.64,35.64,0,0,1,.11,54.16Q0,36.72,0,19.26c0-5.58,2.56-8.67,8.09-9.49C19.31,8.11,30.26,5.65,40.43.45a4.44,4.44,0,0,1,4.39.32c9.6,5,19.9,7.6,30.52,9.25,6.65,1,9,3.85,9,10.53C84.41,26.36,84.39,32.18,84.39,36.84ZM21.51,51.15a3.83,3.83,0,0,0,.81,2.67A59.91,59.91,0,0,0,33.64,65.55c1.91,1.48,3.42,1.07,5-.49,7.7-7.73,15.45-15.41,23.12-23.17,2.27-2.29,2.11-4.74-.15-6.81s-4-.91-5.77.88q-8.23,8.37-16.6,16.61c-2.95,2.93-3.65,2.9-6.68-.08-1.44-1.42-2.83-2.88-4.31-4.24A3.62,3.62,0,0,0,24,47.48,4.48,4.48,0,0,0,21.51,51.15Z"/>
      </svg>
    ),
    label: 'WARRANTY',
  },
  {
    icon: (
      <svg width="44" height="44" viewBox="0 0 126.46 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#e50202" d="M41.29,99.85V99q18.35,0,36.71,0c3.31,0,4.76-1.47,4.8-4.75,0-1.6,0-3.21,0-4.82-.44-17.91-14-31.72-31.92-32.27a183.79,183.79,0,0,0-19.64.24c-13.37,1-23.1,7.67-28.72,20C0,82.82-.11,88.7.06,94.6c.11,3.9,1.38,5.24,5.26,5.25Zm23-76.09c0-13.68-10.8-24.39-24-23.73C29.23.59,20.09,9.43,18.51,21.15c-2,14.51,9.54,27.4,23.83,26.71C54.52,47.27,64.31,36.54,64.33,23.76Zm43.89,76.18c4.51,0,9,0,13.54,0,3,0,4.14-1,4.41-4A52.32,52.32,0,0,0,126,83.15c-1.73-11.14-8-18.32-18.74-21.63-8.42-2.61-17.15-2.81-25.86-2.94-1.28,0-3-.61-3.71.88s1.11,2.28,2,3.17a33.81,33.81,0,0,1,8.74,14.83,43.22,43.22,0,0,1,1.39,15.6c-.45,5.38.94,6.88,6.4,6.88ZM86.91,50.12c12.42.37,21.72-8.53,22.28-20.29.52-10.77-6.42-20-16.61-21.83a84.75,84.75,0,0,0-10-.92c-5.7-.33-9.41,2.7-10,8.38C71.9,23.7,71.27,32,70.73,40.21a8.59,8.59,0,0,0,7.83,9.19C81.68,49.78,84.83,50,86.91,50.12Z"/>
      </svg>
    ),
    label: 'FAMILY OWNED',
  },
]

const fallbackReviews = [
  { id: 'f1', authorName: 'Mike R.', text: 'Great experience! The staff was very helpful and made the whole process easy. Highly recommend Connect Auto Sales!', rating: 5 },
  { id: 'f2', authorName: 'Sarah M.', text: 'Honest dealership with quality vehicles. They provided all the information needed. Will buy from them again!', rating: 5 },
  { id: 'f3', authorName: 'Jessica T.', text: 'Financing was quick and easy. The team was professional and answered all my questions.', rating: 5 },
]

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState([])
  const [reviews, setReviews]           = useState(fallbackReviews)
  const [rating, setRating]             = useState(4.9)
  const [reviewCount, setReviewCount]   = useState(null)
  const [reviewPage, setReviewPage]     = useState(0)
  const REVIEWS_PER_PAGE = 3

  useEffect(() => {
    fetch('/api/cars')
      .then(r => r.json())
      .then(data => setFeaturedCars((data || []).filter(c => c.isNewArrival || c.newArrival).slice(0, 6)))
      .catch(() => {})

    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        if (data?.reviews?.length) {
          setReviews(data.reviews)
        }
        if (data?.rating)  setRating(data.rating)
        if (data?.count)   setReviewCount(data.count)
      })
      .catch(() => {})
  }, [])

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <>
      <Hero />

      {/* ── Featured Vehicles ─────────────────── */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.featuredHead}>
            <div className={styles.featuredHeadLeft}>
              <h2 className={styles.featuredTitle}>
                FEATURED VEHICLES
                <span className={styles.titleLine} />
              </h2>
              <span className={styles.vehicleCount}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v4h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                {featuredCars.length > 0 ? `${featuredCars.length} Vehicles Available` : 'View our inventory'}
              </span>
            </div>
            <Link href="/inventory" className={styles.viewAllLink}>
              VIEW ALL INVENTORY
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

          <div className={styles.carsGrid}>
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────── */}
      <section className={styles.whySection}>
        <div className="container">
          <h2 className={styles.whyTitle}>
            WHY CHOOSE <span>CONNECT</span> AUTO SALES?
          </h2>
          <div className={styles.whyGrid}>
            {whyItems.map((item, i) => (
              <div key={i} className={styles.whyItem}>
                <div className={styles.whyIcon}>{item.icon}</div>
                <div className={styles.whyDivider} />
                <span className={styles.whyLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ───────────────────────────── */}
      <section className={styles.reviewsSection}>
        <div className="container">
          <div className={styles.reviewsGrid}>
            {/* Left — rating + cards */}
            <div className={styles.reviewsLeft}>
              <h2 className={styles.reviewsTitle}>
                REVIEWS <span className={styles.reviewsDash}>—</span>
              </h2>
              <div className={styles.ratingRow}>
                <span className={styles.ratingNumber}>{rating}</span>
                <div className={styles.ratingStars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#F59E0B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className={styles.ratingCount}>Based on {reviewCount ? `${reviewCount}+` : '200+'} reviews</span>
                <div className={styles.googleBadge}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
              <Link href="https://g.page/r/CaJsTZ7i7XOvEAE/review" target="_blank" rel="noreferrer" className={styles.googleReviewsBtn}>
                VIEW GOOGLE REVIEWS
              </Link>

              <div className={styles.reviewCards}>
                {reviews.slice(reviewPage * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE).map((r, i) => (
                  <div key={r.id || i} className={styles.reviewCard}>
                    <div className={styles.reviewStars}>
                      {[...Array(r.rating || r.stars || 5)].map((_, j) => (
                        <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <p className={styles.reviewText}>&ldquo;{r.text}&rdquo;</p>
                    <div className={styles.reviewFooter}>
                      <span className={styles.reviewName}>– {r.authorName || r.name}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider controls */}
              {reviews.length > REVIEWS_PER_PAGE && (
                <div className={styles.sliderControls}>
                  <button
                    className={styles.sliderBtn}
                    onClick={() => setReviewPage(p => Math.max(0, p - 1))}
                    disabled={reviewPage === 0}
                    aria-label="Previous reviews"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <div className={styles.sliderDots}>
                    {Array.from({ length: Math.ceil(reviews.length / REVIEWS_PER_PAGE) }).map((_, i) => (
                      <button
                        key={i}
                        className={`${styles.sliderDot} ${i === reviewPage ? styles.sliderDotActive : ''}`}
                        onClick={() => setReviewPage(i)}
                        aria-label={`Page ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    className={styles.sliderBtn}
                    onClick={() => setReviewPage(p => Math.min(Math.ceil(reviews.length / REVIEWS_PER_PAGE) - 1, p + 1))}
                    disabled={reviewPage >= Math.ceil(reviews.length / REVIEWS_PER_PAGE) - 1}
                    aria-label="Next reviews"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Right — Leave a review */}
            <div className={styles.reviewsRight}>
              <div className={styles.leaveReviewBox}>
                <p className={styles.leaveReviewTitle}>LEAVE US A REVIEW<br/>ON GOOGLE!</p>
                <div className={styles.qrPlaceholder}>
                  <Image
                    src="/images/google-review-qr.png"
                    alt="Google Review QR Code"
                    width={110}
                    height={110}
                    unoptimized
                  />
                </div>
                <p className={styles.qrSub}>Scan the QR code or click below<br/>to leave us a review!</p>
                <Link
                  href="https://g.page/r/CaJsTZ7i7XOvEAE/review"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.leaveReviewBtn}
                >
                  LEAVE A REVIEW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
