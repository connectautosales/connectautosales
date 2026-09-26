// GA4 event helpers. Mirrors the conversion points the Meta Pixel already
// tracked, which GA4 had no visibility into.
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  )
  window.gtag('event', name, {
    page_path: window.location.pathname,
    ...clean,
  })
}

// Vehicle context for events fired from a vehicle detail page.
export function vehicleParams(car) {
  if (!car) return {}
  return {
    vehicle_id: car.stock || car.slug || car.id,
    vehicle_vin: car.vin,
    vehicle_make: car.make,
    vehicle_model: car.model,
    vehicle_year: car.year,
    vehicle_price: car.price,
  }
}
