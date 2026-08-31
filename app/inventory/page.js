'use client'

import { useState, useMemo, useEffect } from 'react'
import CarCard from '@/components/CarCard/CarCard'
import styles from './page.module.css'
import Link from 'next/link'

export default function InventoryPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [titleFilter, setTitleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    if (typeof fbq !== 'undefined') fbq('track', 'ViewContent', { content_name: 'Inventory Page' })
    fetch('/api/cars')
      .then(r => r.json())
      .then(data => { setCars(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = [...cars]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        `${c.year} ${c.make} ${c.model} ${c.trim || ''}`.toLowerCase().includes(q)
      )
    }

    if (titleFilter !== 'all') {
      list = list.filter(c => c.titleType === titleFilter)
    }

    switch (sortBy) {
      case 'default':     list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'price-asc':   list.sort((a, b) => a.price - b.price); break
      case 'price-desc':  list.sort((a, b) => b.price - a.price); break
      case 'year-desc':   list.sort((a, b) => b.year - a.year);   break
      case 'mileage-asc': list.sort((a, b) => a.mileage - b.mileage); break
    }

    return list
  }, [cars, search, titleFilter, sortBy])

  const cleanCount   = cars.filter(c => c.titleType === 'clean').length
  const rebuiltCount = cars.filter(c => c.titleType === 'rebuilt').length

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>BROWSE OUR INVENTORY</h1>
          <p className={styles.heroSub}>Quality pre-owned vehicles with financing &amp; warranty options available.</p>
        </div>
      </section>

      <section className={styles.searchBar}>
        <div className="container">
          <div className={styles.searchWrap}>
            <div className={styles.searchInputWrap}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search inventory by vehicle, year, VIN or stock #"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.searchClear} onClick={() => setSearch('')} aria-label="Clear search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            <div className={styles.filterGroup}>
              <select className={styles.filterSelect} value={titleFilter} onChange={e => setTitleFilter(e.target.value)}>
                <option value="all">All Titles ({cars.length})</option>
                <option value="clean">Clean Title ({cleanCount})</option>
                <option value="rebuilt">Rebuilt Title ({rebuiltCount})</option>
              </select>

              <select className={styles.filterSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="mileage-asc">Mileage: Lowest First</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsInner}>
            <div className={styles.statItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v4h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span><strong>{loading ? '...' : filtered.length}</strong> Vehicles {titleFilter !== 'all' || search ? 'Found' : 'Available'}</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <span>Financing Available</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Warranty Options Available</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.inventorySection}>
        <div className="container">
          {loading ? (
            <div className={styles.noResults}>
              <p>Loading inventory...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className={styles.carsGrid}>
              {filtered.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No vehicles found matching your search.</p>
              <button className={styles.clearBtn} onClick={() => { setSearch(''); setTitleFilter('all') }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.rebuiltBanner}>
        <div className="container">
          <div className={styles.rebuiltInner}>
            <div className={styles.rebuiltLeft}>
              <div className={styles.rebuiltIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.rebuiltTitle}>What is a Rebuilt Title?</h3>
                <p className={styles.rebuiltText}>
                  A rebuilt title vehicle has been repaired and inspected after being declared a total loss.
                  All our rebuilt title vehicles undergo a thorough inspection and are Michigan state certified.
                </p>
              </div>
            </div>
            <Link href="/rebuilt-title" className={styles.rebuiltBtn}>
              LEARN ABOUT REBUILT TITLES
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
