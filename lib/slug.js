export function generateSlug(year, make, model, trim, id) {
  const base = `${year} ${make} ${model} ${trim || ''}`.trim()
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug}-${id}`
}
