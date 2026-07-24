'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Hero.module.css'

const slides = [
  {
    image: '/images/banner-1.webp',
    label: 'Quality Pre-Owned Vehicles',
    title: ['QUALITY', 'PRE-OWNED', 'VEHICLES'],
    titleColors: ['white', 'red', 'white'],
    btn: { text: 'BROWSE INVENTORY', href: '/inventory' },
  },
  {
    image: '/images/banner-2.webp',
    label: 'Financing Made Easy',
    title: ['FINANCING', 'MADE EASY'],
    titleColors: ['white', 'red'],
    btn: { text: 'APPLY FOR FINANCING', href: '/financing' },
  },
  {
    image: '/images/banner-3.webp',
    label: 'Dealer Auctions',
    title: ['DEALER', 'AUCTIONS'],
    titleColors: ['white', 'red'],
    btn: { text: 'START AUCTION PURCHASE', href: '/auction-services' },
  },
  {
    image: '/images/banner-4.webp',
    label: 'Michigan Salvage Inspections',
    title: ['MICHIGAN', 'SALVAGE', 'INSPECTIONS'],
    titleColors: ['white', 'red', 'white'],
    btn: { text: 'SCHEDULE INSPECTION', href: '/salvage-inspections' },
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  const slide = slides[current]

  return (
    <section className={styles.hero}>
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
          aria-hidden={i !== current}
        >
          <Image
            src={s.image}
            alt={s.label}
            fill
            priority={i === 0}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className={styles.overlay} />
        </div>
      ))}

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.redLine} />
        <h1 className={styles.title}>
          {slide.title.map((word, i) => (
            <span
              key={i}
              className={slide.titleColors[i] === 'red' ? styles.red : styles.white}
            >
              {word}
            </span>
          ))}
        </h1>
        <Link href={slide.btn.href} className={styles.btn}>
          {slide.btn.text}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      {/* Arrows */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous slide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next slide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
