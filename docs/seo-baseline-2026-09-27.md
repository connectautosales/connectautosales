# SEO Baseline — 27 September 2026

> **FROZEN BASELINE. DO NOT EDIT.**
>
> This document is a point-in-time record, captured to measure later work against.
> Every figure was read from the Google Search Console API, the Google Places API
> or the live site on 27 September 2026. If a number here looks wrong later, it is
> still what was true on this date — record a new baseline rather than amending
> this one.

---

## 1. Search Console reporting window

**28 August – 24 September 2026** (28 days).

24 September is the last settled day. Search Console data lags roughly three days,
so anything nearer the capture date is incomplete and was excluded.

Implementation work ran 16–27 September, so this window is **mostly pre-change**.
That is deliberate: it is the "before" side of the comparison.

## 2. Organic totals

| Metric | Value |
|---|---|
| Clicks | 320 |
| Impressions | 3,998 |
| CTR | 8.00% |
| Average position | 12.5 |

## 3. Query buckets — directional only

Derived from the top 453 queries in the window.

| Bucket | Queries | Clicks | Impressions | CTR |
|---|---|---|---|---|
| Brand | 77 | 160 | 767 | 20.86% |
| Non-brand | 376 | 58 | 2,054 | 2.82% |
| Local intent | 213 | 44 | 1,146 | 3.84% |
| Price intent | 50 | 10 | 70 | 14.29% |

**These are directional subsets, not a decomposition of all organic traffic.**
Search Console omits anonymised and rare queries from query-level data, and query
filtering shifts totals. Brand + non-brand will not reconcile against the totals in
section 2, and should never be presented as if they do. Compare each bucket against
its own earlier value over time.

Bucketing rules used, for reproducibility:

- **Brand** — query contains `connect`, `konnect`, `autoconnect`, `connectauto` or
  `conect` once spaces are stripped
- **Local intent** — matches `near me|dearborn|detroit|michigan|\bmi\b|taylor|westland|inkster|allen park|redford`
- **Price intent** — matches `under|\$|cheap|affordable|budget|\b\d{4}\b`

Local and price buckets are drawn from non-brand queries and overlap each other.

## 4. Indexing

Captured 27 September by running the URL Inspection API against all 49 URLs in
`sitemap.xml`.

| Coverage state | Count |
|---|---|
| Submitted and indexed | **13** |
| Discovered — currently not indexed | 12 |
| Crawled — currently not indexed | 7 |
| URL is unknown to Google | 17 |
| **Total** | **49** |

Most vehicle detail pages are not indexed.

**Conclusion, stated no stronger than the evidence supports:** many URLs are not
indexed yet. Technical blockers checked so far appear normal — canonical tags,
robots directives, status codes and rendered HTML all check out. Possible causes
include recent discovery, perceived content value/uniqueness, internal prominence,
demand, and broader site authority/trust, but the current data does not prove one
specific cause.

This is **not** characterised as a crawl-budget problem. Google's crawl-budget
guidance applies mainly to far larger sites, and there is no evidence here of
crawl-capacity exhaustion.

## 5. Page performance

Within the reporting window:

| Page | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| `/` | 318 | 4,352 | 7.31% | 10.2 |
| `/inventory` | 3 | 1,130 | 0.27% | 4.2 |
| `/financing` | 0 | 286 | 0% | 4.5 |
| `/warranty` | 0 | 286 | 0% | 4.5 |
| `/contact` | 0 | 239 | 0% | 4.3 |
| Vehicle detail (all) | 0 | 26 | — | — |

### New landing pages

Built 16–27 September. All show **no data** in the reporting window because they
were indexed on 26 September, after the window closed. Zero is the correct
baseline for them, not a gap.

| Page | Index status, 27 Sep |
|---|---|
| `/body-type` | Submitted and indexed |
| `/body-type/suv` | Submitted and indexed |
| `/body-type/sedan` | Submitted and indexed |
| `/body-type/truck` | Submitted and indexed |
| `/body-type/van` | Submitted and indexed |
| `/body-type/hatchback` | Submitted and indexed |
| `/used-cars-under-10000` | Submitted and indexed |
| `/buy-here-pay-here` | URL unknown to Google (published 26 Sep) |

## 6. Google Business Profile

| Field | Value |
|---|---|
| Rating | 4.5 |
| Review count | 70 |
| Primary category | Used car dealer |
| Secondary categories | None observed via Places API — unconfirmed, needs dashboard check |
| Status | OPERATIONAL |
| Website | `https://www.connectautosales.com/` |
| Address | 4413 S Beech Daly St, Dearborn Heights, MI 48125 |
| Phone | (313) 413-3400 |

Two 1-star reviews were unanswered at capture: *VAV BRAVE WAY LLC* (27 Apr 2026,
a transport-logistics complaint) and *Kateryna Pashynska* (13 Apr 2026, a customer
service complaint).

## 7. Inventory

| Field | Value |
|---|---|
| Live vehicles | 28 |
| Price range | $3,999 – $16,999 |
| Under $10,000 | 12 |

By body type: SUV 16 · Sedan 6 · Truck 2 · Van 2 · Hatchback 1 · Camper 1

## 8. GA4 events implemented

Shipped 27 September. Property `G-4BGMGDC39K`. Helper: `lib/analytics.js`.

Before this date GA4 ran `gtag('config')` only — no conversion visibility at all.

| Event | Fires on |
|---|---|
| `phone_click` | Header (2), footer, contact card, vehicle CTA, vehicle sticky bar |
| `sms_click` | Header (2), contact card, vehicle CTA, vehicle sticky bar |
| `email_click` | Footer email link |
| `finance_start` | Financing form clearing step 1 — once per session |
| `finance_submit` | Financing form, success only |
| `contact_submit` | Contact form, success only |
| `test_drive_click` | Test drive button on a vehicle page |
| `test_drive_submit` | Test drive form, success only |
| `auction_request` | Auction form, success only |
| `inspection_request` | Salvage inspection form, success only |
| `generate_lead` | Alongside each of the five lead submissions |

`generate_lead` carries `lead_type`: `financing`, `contact`, `auction`,
`inspection` or `test_drive`. **No `value` parameter is sent** — there is no honest
figure for what a lead is worth here, and an invented one would corrupt the reports
it feeds.

Event parameters: `page_path`, `location`, `lead_type`, `vehicle_id`,
`vehicle_vin`, `vehicle_make`, `vehicle_model`, `vehicle_year`, `vehicle_price`,
`vehicle_name`.

**Custom definitions still to register in the GA4 UI** (parameters are sent but not
reportable until registered): `lead_type`, `location`, `vehicle_make`, `vehicle_id`
as dimensions; `vehicle_price` as a metric. Deliberately not registered:
`page_path` (native), `vehicle_vin` (high cardinality, adds nothing over
`vehicle_id`), `vehicle_model`, `vehicle_year`, `vehicle_name`.

**Enhanced Measurement:** "Form interactions" to be disabled so GA4's generic
`form_start`/`form_submit` do not double-count against the named events above. All
other Enhanced Measurement features stay enabled.

## 9. Work completed, 16–27 September 2026

### Technical foundation
- Unique title and meta description per page; the whole site previously shared one
  generic title
- Created `sitemap.xml` (49 URLs) and `robots.txt` — neither existed
- Sitemap moved from build-time generation to hourly revalidation, so vehicles
  added through the admin panel appear without a redeploy
- Schema: `AutoDealer` site-wide, `Car` per vehicle, `FAQPage` on three pages
- 301-redirected legacy WordPress paths (`/body-type`, `/vehicle`, `/detail`,
  `/contact-us`) that were returning 404
- Canonicalised vehicle URLs on the stock number; sitemap URLs had been 307ing

### Performance
- Inventory listing server-rendered instead of fetching after hydration; the
  `/api/cars` call alone took ~1.1s
- Mobile LCP on `/inventory`: 3,228 ms → 1,684 ms
- Enabled Next.js image optimisation: ~1,794 KB → ~45 KB per vehicle photo
- Homepage featured vehicles server-rendered; server HTML had contained zero
  vehicle links

### Content and on-page
- Homepage 173 → 687 words; financing 340 → 474
- H1s rewritten on nine pages to carry topic and city
- Homepage H1 had rendered as `QUALITYPRE-OWNEDVEHICLES` — block spans with no
  whitespace between them — and changed every five seconds with the hero slider.
  Now one stable heading
- Financing FAQ answers were never in the HTML, rendering only on click. Now
  rendered collapsed via CSS
- Eight new landing pages (see section 5)
- Closed keyword gaps: `bad credit`, `no credit`, `affordable`, `trade-in` and
  `test drive` appeared zero times across the entire site beforehand

### Correctness fixes found along the way
- Site displayed a hardcoded 4.9 rating and "200+ reviews" plus three invented
  testimonials, while Google showed 4.5 from 69. Removed; live sync repaired
- Contact form caught submission failures, discarded them, then showed the success
  panel, cleared the form and fired lead events. A failed enquiry was lost
  silently while analytics counted a lead
- Financing error handler read `err?.message` with no `catch` binding, so a failed
  application threw a ReferenceError inside its own error handler and the applicant
  saw neither success nor error
- `authOptions` imported from the route file rather than `lib/auth`

### Infrastructure
- Search Console API access via the `claude-seo` service account
- Excluded the project from Vercel Observability Plus (~$23/month)
- Vercel function invocations fell from 278,443/day (15 Sep) to 7,088/day (18 Sep)
  after the legacy redirects landed
- GBP website URL corrected to the `www` host

## 10. Measurement caveats

1. **Query buckets do not reconcile with totals.** See section 3.
2. **Search Console lags ~3 days.** Any window ending nearer than that is
   incomplete.
3. **New pages have no baseline data.** They were indexed after the window closed.
   Their first real figures arrive in the next capture.
4. **GA4 baseline is zero by definition.** Events shipped 27 September. There is
   also no GA4 Data API access from the environment that produced this document —
   future GA4 figures must be exported manually.
5. **Custom dimensions are unregistered** at capture, so vehicle and lead
   parameters are being collected but are not yet reportable.
6. **GBP secondary categories are unconfirmed.** The Places API does not reliably
   expose them; only the dashboard can settle it.
7. **Indexing has no proven root cause.** See section 4.
8. **The retired `sitemap_index.xml` is still registered** in Search Console and
   still reports 1 error. Not yet removed.
9. **Geo-grid data is absent.** No local map-pack baseline exists yet. Agreed plan:
   5-mile radius, 5×5 grid, every two weeks, six non-location-modified local-intent
   keywords, starting from a free trial or lowest-cost one-time scan.

---

*Captured 27 September 2026. Sources: Google Search Console API (Search Analytics
and URL Inspection), Google Places API, live site responses, and the project git
history.*
