// URL slug -> vehicle types in the DB, plus the copy each landing page uses.
// Slugs mirror the paths the previous site ranked for, so those URLs keep their history.
export const BODY_TYPES = {
  suv: {
    types: ['SUV'],
    label: 'SUVs',
    heading: 'SUVS FOR SALE',
    sub: 'Browse our selection of pre-owned SUVs and crossovers in Dearborn Heights.',
    title: 'Used SUVs for Sale in Dearborn Heights, MI',
    description:
      'Browse used SUVs and crossovers for sale at Connect Auto Sales in Dearborn Heights, Michigan. Financing available for all credit types, warranty options, clean and rebuilt titles.',
  },
  sedan: {
    types: ['Sedan'],
    label: 'Sedans',
    heading: 'SEDANS FOR SALE',
    sub: 'Fuel-efficient pre-owned sedans with financing and warranty options.',
    title: 'Used Sedans for Sale in Dearborn Heights, MI',
    description:
      'Browse used sedans for sale at Connect Auto Sales in Dearborn Heights, Michigan. Affordable pre-owned cars with financing for all credit types and warranty options.',
  },
  truck: {
    types: ['Truck'],
    label: 'Trucks',
    heading: 'TRUCKS FOR SALE',
    sub: 'Pre-owned pickup trucks built for work and towing.',
    title: 'Used Pickup Trucks for Sale in Dearborn Heights, MI',
    description:
      'Browse used pickup trucks for sale at Connect Auto Sales in Dearborn Heights, Michigan. Work-ready trucks with financing available and warranty options.',
  },
  van: {
    types: ['Van'],
    label: 'Vans & Minivans',
    heading: 'VANS & MINIVANS FOR SALE',
    sub: 'Family-ready minivans and cargo vans with room for everyone.',
    title: 'Used Minivans & Vans for Sale in Dearborn Heights, MI',
    description:
      'Browse used minivans and cargo vans for sale at Connect Auto Sales in Dearborn Heights, Michigan. Family vehicles with financing and warranty options available.',
  },
  hatchback: {
    types: ['Hatchback'],
    label: 'Hatchbacks',
    heading: 'HATCHBACKS FOR SALE',
    sub: 'Compact, economical hatchbacks that are easy on gas.',
    title: 'Used Hatchbacks for Sale in Dearborn Heights, MI',
    description:
      'Browse used hatchbacks for sale at Connect Auto Sales in Dearborn Heights, Michigan. Compact, fuel-efficient cars with financing and warranty options.',
  },
}

// Paths the old site used that map onto a slug above.
export const BODY_TYPE_ALIASES = {
  suvs: 'suv',
  crossover: 'suv',
  sedans: 'sedan',
  'pickup-truck': 'truck',
  'pickup-trucks': 'truck',
  trucks: 'truck',
  minivan: 'van',
  minivans: 'van',
  vans: 'van',
  hatchbacks: 'hatchback',
}

export function resolveBodyType(slug) {
  const key = String(slug || '').toLowerCase()
  return BODY_TYPES[key] ? key : BODY_TYPE_ALIASES[key] || null
}
