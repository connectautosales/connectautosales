// Pure helpers shared by server pages and client components (no database).

// A make page is indexed only when at least this many of that make are live.
// With one car the page would just repeat that car's own page.
export const MIN_INDEXED = 2

export const makeSlug = (make) =>
  String(make || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Collapse stray spaces and turn shouted words ("COROLLA") into "Corolla",
// leaving short codes such as SXT, LS, GT as they are.
export const tidy = (s) =>
  String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b([A-Z])([A-Z]{3,})\b/g, (_, first, rest) => first + rest.toLowerCase())
