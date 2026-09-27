# FROZEN GEO-GRID BASELINE — DO NOT EDIT

> Point-in-time record of the first Local Falcon geo-grid scans for Connect Auto
> Sales, captured 26 September 2026.
>
> **If a metric here is later found to be wrong, create a new corrected baseline
> document. Do not modify this one.**
>
> Every figure below is read directly from the two exported CSVs. Nothing is
> estimated. Where a value is derived rather than read, it is labelled as derived.

---

## 1. Scan configuration

Two scans were run five minutes apart on the same business and location, using
**different grid sizes**.

| | Scan A | Scan B |
|---|---|---|
| Keyword | `used car dealer` | `car dealer` |
| Scan date/time | 2026-09-26 17:38:53 | 2026-09-26 17:33:51 |
| Timezone | Not stated in CSV | Not stated in CSV |
| Grid size | **5x5** | **7x7** |
| Grid radius | 5.0 mi | 5.0 mi |
| Data points | 25 | 49 |
| Businesses returned | 121 | 171 |
| Business name | Connect Auto Sales | Connect Auto Sales |
| Address | 4413 S Beech Daly St, Dearborn Heights, MI 48125 | same |
| Place ID | `ChIJbTWMJ1FLO4gRomxNnuLtc68` | same |
| Rating in report | 4.500 | 4.500 |
| Reviews in report | 70 | 70 |
| Primary category in report | Used car dealer | Used car dealer |
| Secondary categories in report | *(empty)* | *(empty)* |
| Distance from centre point | 0.00 mi | 0.00 mi |

Source files:
- `connect-auto-sales-used-car-dealer-scan-report-2026-9-26-538pm.csv`
- `connect-auto-sales-car-dealer-scan-report-2026-9-26-533pm.csv`

### These two scans are NOT apples-to-apples

The grids differ — **5x5 / 25 points** versus **7x7 / 49 points** — at the same
5-mile radius. That changes point spacing and therefore what each point measures.

Coverage counts, coverage percentages, ARP, ATRP and SoLV from Scan A must **not**
be compared numerically against Scan B as though the same methodology produced
them. They are different keywords on different grids and are recorded here as two
separate measurements.

### Metric definitions

Per Local Falcon's own documentation, so later readings use the same meanings:

- **ARP** — Average Rank Position, averaged **only across points where the
  business appears**
- **ATRP** — Average Total Rank Position, averaged **across the entire grid**,
  assigning a default value (20+) to points where the business does not appear
- **SoLV** — Share of Local Voice: the **percentage of grid points where the
  business ranks in the top three**

`SAIV` does not appear in either CSV. The available columns are: Rank, Business,
Address, Place ID, Phone, Website URL, Primary Category, Secondary Categories,
Google URL, Rating, Reviews, Latitude, Longitude, Scan Date, Keyword, Grid Size,
Radius, Found In, Found Percentage, ARP, ATRP, SoLV, Distance From Center Point.

---

## 2. Connect Auto Sales results

Read verbatim from the CSV rows for Place ID `ChIJbTWMJ1FLO4gRomxNnuLtc68`.

### Scan A — `used car dealer`, 5x5, 5.0 mi, 25 points

| Metric | Value |
|---|---|
| Report rank | 24 (of 121 businesses returned) |
| Found In | 7 |
| Total points | 25 |
| Found percentage | 28.00% |
| Not-found points | 18 *(derived: 25 − 7)* |
| ARP | 10.00 |
| ATRP | 17.92 |
| SoLV | 4.00 |
| Top-3 coverage | **1 of 25 points** *(derived: 4.00% × 25 = 1.0000 exactly)* |
| Distance from centre | 0.00 mi |

### Scan B — `car dealer`, 7x7, 5.0 mi, 49 points

| Metric | Value |
|---|---|
| Report rank | 24 (of 171 businesses returned) |
| Found In | 12 |
| Total points | 49 |
| Found percentage | 24.49% |
| Not-found points | 37 *(derived: 49 − 12)* |
| ARP | 11.17 |
| ATRP | 18.59 |
| SoLV | 4.08 |
| Top-3 coverage | **2 of 49 points** *(derived: 4.08% × 49 = 1.9992, rounds to 2)* |
| Distance from centre | 0.00 mi |

The "Report rank" column is Local Falcon's own aggregate ordering of the returned
businesses. It is recorded as-is and is **not** the same thing as grid coverage —
see section 3, where Connect places differently once sorted by actual visibility.

---

## 3. Competitor tables

Ordered by **actual geo-grid coverage (Found In)**, not by review count.

### Scan A — `used car dealer` (5x5, 25 points)

| Business | Rating | Reviews | Found | Found % | ARP | ATRP | SoLV | Dist. from centre |
|---|---|---|---|---|---|---|---|---|
| Rite Track Auto Sales | 4.700 | 544 | 14 | 56.00% | 6.43 | 12.84 | 16.00 | 3.15 mi |
| DriveTime Used Cars | 4.800 | 2281 | 13 | 52.00% | 7.31 | 13.88 | 20.00 | 3.49 mi |
| bank auto sales | 4.600 | 342 | 12 | 48.00% | 6.92 | 14.24 | 20.00 | 3.86 mi |
| Road Runner Auto Sales | 4.200 | 886 | 12 | 48.00% | 7.67 | 14.60 | 8.00 | 3.27 mi |
| Drive Wise Auto Sales | 4.600 | 409 | 12 | 48.00% | 9.50 | 15.48 | 4.00 | 4.05 mi |
| Summit Motors LLC | 4.900 | 123 | 11 | 44.00% | 9.91 | 16.12 | 0.00 | 3.20 mi |
| Senator Auto Sales | 4.100 | 267 | 11 | 44.00% | 11.00 | 16.60 | 0.00 | 3.51 mi |
| Law Auto Sales | 4.300 | 486 | 11 | 44.00% | 12.09 | 17.08 | 0.00 | 3.40 mi |
| **Connect Auto Sales** | **4.500** | **70** | **7** | **28.00%** | **10.00** | **17.92** | **4.00** | **0.00 mi** |

Sorted by Found In, Connect Auto Sales places **23rd of 121** returned businesses.

### Scan B — `car dealer` (7x7, 49 points)

| Business | Rating | Reviews | Found | Found % | ARP | ATRP | SoLV | Dist. from centre |
|---|---|---|---|---|---|---|---|---|
| Road Runner Auto Sales | 4.200 | 886 | 22 | 44.90% | 3.59 | 13.18 | 26.53 | 3.27 mi |
| DriveTime Used Cars | 4.800 | 2281 | 22 | 44.90% | 6.55 | 14.51 | 18.37 | 3.49 mi |
| Rite Track Auto Sales | 4.700 | 544 | 21 | 42.86% | 9.76 | 16.18 | 6.12 | 3.15 mi |
| Summit Motors LLC | 4.900 | 123 | 21 | 42.86% | 9.95 | 16.27 | 2.04 | 3.20 mi |
| Senator Auto Sales | 4.100 | 267 | 20 | 40.82% | 8.00 | 15.69 | 8.16 | 3.51 mi |
| RightWay Auto Sales | 4.800 | 2330 | 19 | 38.78% | 6.26 | 15.29 | 14.29 | 2.39 mi |
| bank auto sales | 4.600 | 342 | 19 | 38.78% | 9.32 | 16.47 | 4.08 | 3.86 mi |
| Law Auto Sales | 4.300 | 486 | 19 | 38.78% | 10.84 | 17.06 | 0.00 | 3.40 mi |
| **Connect Auto Sales** | **4.500** | **70** | **12** | **24.49%** | **11.17** | **18.59** | **4.08** | **0.00 mi** |

Sorted by Found In, Connect Auto Sales places **25th of 171** returned businesses.

### Recurring across both scans

107 businesses appear in both CSVs. The eight with the highest combined coverage:

| Business | A: found/25 | A: SoLV | B: found/49 | B: SoLV | Rating | Reviews |
|---|---|---|---|---|---|---|
| Rite Track Auto Sales | 14 | 16.00 | 21 | 6.12 | 4.700 | 544 |
| DriveTime Used Cars | 13 | 20.00 | 22 | 18.37 | 4.800 | 2281 |
| Road Runner Auto Sales | 12 | 8.00 | 22 | 26.53 | 4.200 | 886 |
| Summit Motors LLC | 11 | 0.00 | 21 | 2.04 | 4.900 | 123 |
| bank auto sales | 12 | 20.00 | 19 | 4.08 | 4.600 | 342 |
| Senator Auto Sales | 11 | 0.00 | 20 | 8.16 | 4.100 | 267 |
| Drive Wise Auto Sales | 12 | 4.00 | 18 | 6.12 | 4.600 | 409 |
| Law Auto Sales | 11 | 0.00 | 19 | 0.00 | 4.300 | 486 |

By combined coverage across both scans, Connect Auto Sales places **24th of the
107** businesses present in both.

---

## 4. Observations

### Facts, read from the CSVs

1. Connect Auto Sales sits at the grid centre — distance from centre point is
   0.00 mi in both scans — and appears at 7 of 25 points on `used car dealer` and
   12 of 49 on `car dealer`.
2. Its SoLV is 4.00 and 4.08 respectively, which is **1 point** and **2 points**
   in the top three.
3. Eight businesses in Scan A and eight in Scan B have higher Found In than
   Connect. All of them are located **between 2.39 mi and 4.05 mi from the grid
   centre** — further out than Connect, which is at the centre.
4. Where Connect does appear, its ARP is 10.00 (Scan A) and 11.17 (Scan B).
5. Coverage and top-3 presence are not the same thing in this data. Law Auto Sales
   appears at 11 of 25 points in Scan A with SoLV 0.00 — present across the grid
   but never in the top three. Conversely bank auto sales appears at 12 points
   with SoLV 20.00.
6. Review counts among the higher-coverage businesses span a wide range: Summit
   Motors LLC has 123 reviews and out-covers Connect in both scans, while
   DriveTime has 2,281 and RightWay 2,330.
7. Ratings among higher-coverage businesses also vary: Road Runner leads Scan B on
   coverage and SoLV with a 4.200 rating, below Connect's 4.500.
8. Connect's Secondary Categories field is empty in both CSVs.

### Interpretation

These follow from the facts above but are readings, not measurements.

- Connect's map visibility is **narrow rather than absent**. It is found, and when
  found it sits around rank 10–11, but it drops out of most of the grid.
- Being the centre point did not translate into broad coverage. Businesses two to
  four miles away are returned at more points across the same grid, so **proximity
  alone does not explain the ranking pattern here**.
- Breadth and quality of placement are separate problems. Connect's 1–2 top-three
  points is low in absolute terms and low relative to Rite Track (16.00 SoLV),
  DriveTime (20.00) and bank auto sales (20.00) in Scan A.
- Review count does not line up cleanly with coverage in this dataset. A business
  with 123 reviews out-covers Connect's 70, but so do businesses with 2,281 and
  2,330. **The scans show review differences exist; they do not show reviews are
  the cause.**

### Hypotheses — not established by this data

Each would need separate testing. None is supported by the CSVs alone.

- Whether the single top-three point in Scan A is the centre point itself. The
  export does not include per-point rank data, so this cannot be checked here.
- Whether GBP configuration — the empty Secondary Categories field, services,
  attributes, posting activity — relates to the coverage gap.
- Whether site authority, prominence or link profile relate to it.
- Whether review **velocity** (rate of new reviews) rather than total count is the
  relevant factor.

**Explicitly not claimed:** that reviews cause this, that backlinks cause this,
that category setup causes this, or that Google is penalising the business. None
of those is demonstrated by these two scans.

---

## 5. Standard for future scans — frozen

**Primary recurring geo-grid benchmark:**

| | |
|---|---|
| Keyword | `used car dealer` |
| Grid | 5x5 |
| Radius | 5 miles |
| Business / location | Connect Auto Sales, `ChIJbTWMJ1FLO4gRomxNnuLtc68` |
| Time of day | Approximately 17:38 local, matching the baseline scan |
| Frequency | Every 2 weeks |

Scan A already provides a valid 5x5 baseline, so this becomes the recurring
comparison series.

**Do not compare future 5x5 scans numerically against the 7x7 `car dealer` scan**
as though the same methodology produced them. Scan B is retained as supplementary
baseline evidence only. If a 7x7 `car dealer` series is ever wanted, start its own
series rather than folding it into this one.

---

## 6. Baseline metrics — copy forward

```
USED CAR DEALER                        [PRIMARY RECURRING BENCHMARK]
Date:                    2026-09-26 17:38:53
Grid:                    5x5 (25 points)
Radius:                  5.0 mi
ARP:                     10.00
ATRP:                    17.92
SoLV:                    4.00
Found:                   7 / 25  (28.00%)
Not found:               18 / 25
Top-3 coverage:          1 / 25  (derived from SoLV)
Report rank:             24 of 121 returned
Rank by grid coverage:   23 of 121
Top recurring competitors (by Found In):
   Rite Track Auto Sales      14/25  SoLV 16.00  4.7  544 reviews
   DriveTime Used Cars        13/25  SoLV 20.00  4.8  2281 reviews
   bank auto sales            12/25  SoLV 20.00  4.6  342 reviews
   Road Runner Auto Sales     12/25  SoLV  8.00  4.2  886 reviews
   Drive Wise Auto Sales      12/25  SoLV  4.00  4.6  409 reviews


CAR DEALER                             [SUPPLEMENTARY — DIFFERENT GRID]
Date:                    2026-09-26 17:33:51
Grid:                    7x7 (49 points)
Radius:                  5.0 mi
ARP:                     11.17
ATRP:                    18.59
SoLV:                    4.08
Found:                   12 / 49  (24.49%)
Not found:               37 / 49
Top-3 coverage:          2 / 49  (derived from SoLV)
Report rank:             24 of 171 returned
Rank by grid coverage:   25 of 171
Top recurring competitors (by Found In):
   Road Runner Auto Sales     22/49  SoLV 26.53  4.2  886 reviews
   DriveTime Used Cars        22/49  SoLV 18.37  4.8  2281 reviews
   Rite Track Auto Sales      21/49  SoLV  6.12  4.7  544 reviews
   Summit Motors LLC          21/49  SoLV  2.04  4.9  123 reviews
   Senator Auto Sales         20/49  SoLV  8.16  4.1  267 reviews
```

---

## 7. Data-quality caveats

1. **The two scans use different grids.** 5x5 versus 7x7 at the same radius. Not
   comparable to each other. Stated throughout.
2. **No timezone in the export.** Scan Date is a bare local timestamp
   (`2026-09-26 17:38:53`). Future scans should be run at approximately the same
   local time so the series stays consistent.
3. **Top-3 coverage is derived, not a CSV column.** It is calculated from SoLV ×
   point count. Both conversions land on whole numbers exactly (1.0000 and
   1.9992), which supports the derivation, but it is a calculation and is labelled
   as one wherever it appears.
4. **No per-point data in the export.** The CSVs are one row per business with
   aggregate metrics. Which specific grid points a business was found at is not
   available, so the heatmap cannot be reconstructed from these files — see
   caveat 8.
5. **Secondary Categories is blank for most rows** — 82 of 121 in Scan A, 98 of
   171 in Scan B. Connect's is blank too. This is consistent with the earlier
   Places API finding that no secondary categories appear to be set, but because
   the field is empty for the majority of businesses listed, these CSVs are not
   independent confirmation of it.
6. **One blank rating** in Scan B (1 row of 171). Not Connect's row.
7. **No duplicate Place IDs** in either file. 121 and 171 unique businesses
   respectively. Grid size, radius, keyword and scan date are internally
   consistent across every row of each file.
8. **Heatmap image not included in this record.** The requested deliverable
   included a heatmap; the CSV exports do not contain point-level coordinates and
   ranks, so one cannot be generated from them. The heatmap exists in the Local
   Falcon interface for both scans and should be screenshotted and filed alongside
   this document if a visual record is wanted.
9. **`SAIV` is not present** in either export. Only ARP, ATRP and SoLV are
   provided.

---

*Captured 26 September 2026. Source: two Local Falcon scan report CSVs, read
directly. Recorded 28 September 2026.*
