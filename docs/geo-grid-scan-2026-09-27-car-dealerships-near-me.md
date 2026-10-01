# GEO-GRID SCAN — `car dealerships near me` — 27 September 2026

> Supplementary scan, additive to the frozen baseline in
> `docs/geo-grid-baseline-2026-09-26.md`. That document stays untouched.
> This is a new dated record, not a correction.
>
> Read directly from one exported CSV. Nothing is estimated. Derived values are
> labelled as derived.

---

## 1. Scan configuration

| | Value |
|---|---|
| Keyword | `car dealerships near me` |
| Scan date/time | 2026-09-27 11:50:14 |
| Timezone | Not stated in CSV |
| Grid size | **5x5** (same methodology as the primary `used car dealer` benchmark) |
| Grid radius | 5.0 mi |
| Data points | 25 |
| Businesses returned | 147 |
| Business name | Connect Auto Sales |
| Address | 4413 S Beech Daly St, Dearborn Heights, MI 48125 |
| Place ID | `ChIJbTWMJ1FLO4gRomxNnuLtc68` |
| Rating in report | 4.500 |
| Reviews in report | 70 |
| Primary category in report | Used car dealer |
| Secondary categories in report | *(empty)* |

Source file: `connect-auto-sales-car-dealerships-near-me-scan-report-2026-9-27-1150am.csv`

Because this scan uses the same 5x5 / 5-mile grid as the `used car dealer`
baseline, it **can** be compared to that one directly — unlike the 7x7
`car dealer` scan, which cannot.

---

## 2. Connect Auto Sales results

| Metric | Value |
|---|---|
| Report rank | 60 (of 147 businesses returned) |
| Found In | 3 |
| Total points | 25 |
| Found percentage | 12.00% |
| Not-found points | 22 *(derived: 25 − 3)* |
| ARP | 10.33 |
| ATRP | 19.72 |
| SoLV | 0.00 |
| Top-3 coverage | **0 of 25 points** *(derived: 0.00% × 25 = 0)* |
| Distance from centre | 0.00 mi |

This is **lower coverage and zero top-3 presence**, compared to the `used car
dealer` baseline (7/25 found, 1/25 top-3). On this keyword Connect appears at
only 3 of 25 points and never in the top three.

---

## 3. Competitor table — top 10 by grid coverage

| Business | Rating | Reviews | Found | Found % | ARP | ATRP | SoLV | Dist. from centre |
|---|---|---|---|---|---|---|---|---|
| DriveTime Used Cars | 4.800 | 2281 | 14 | 56.00% | 3.71 | 11.32 | 44.00 | 3.49 mi |
| RightWay Auto Sales | 4.800 | 2331 | 13 | 52.00% | 8.31 | 14.40 | 16.00 | 2.39 mi |
| Road Runner Auto Sales | 4.200 | 886 | 11 | 44.00% | 4.36 | 13.68 | 20.00 | 3.27 mi |
| Law Auto Sales | 4.300 | 486 | 11 | 44.00% | 8.45 | 15.48 | 4.00 | 3.40 mi |
| bank auto sales | 4.600 | 342 | 10 | 40.00% | 6.70 | 15.28 | 16.00 | 3.86 mi |
| Senator Auto Sales | 4.100 | 267 | 10 | 40.00% | 12.10 | 17.44 | 0.00 | 3.51 mi |
| Jeff Benson Car Company | 4.600 | 122 | 9 | 36.00% | 9.44 | 16.84 | 8.00 | 4.38 mi |
| Summit Motors LLC | 4.900 | 123 | 9 | 36.00% | 10.44 | 17.20 | 0.00 | 3.20 mi |
| Rite Track Auto Sales | 4.700 | 544 | 9 | 36.00% | 11.33 | 17.52 | 0.00 | 3.15 mi |
| George's Used Cars | 4.500 | 1253 | 8 | 32.00% | 6.75 | 16.44 | 12.00 | 7.18 mi |
| **Connect Auto Sales** | **4.500** | **70** | **3** | **12.00%** | **10.33** | **19.72** | **0.00** | **0.00 mi** |

Sorted by Found In, Connect Auto Sales places **61st of 147** returned businesses.

### Recurring across the two comparable 5x5 scans (`used car dealer` + this one)

96 businesses appear in both. Strongest by combined coverage:

| Business | `used car dealer` found/25 | `car dealerships near me` found/25 | Rating | Reviews |
|---|---|---|---|---|
| DriveTime Used Cars | 13 | 14 | 4.800 | 2281 |
| Rite Track Auto Sales | 14 | 9 | 4.700 | 544 |
| RightWay Auto Sales | 10 | 13 | 4.800 | 2330 |
| Road Runner Auto Sales | 12 | 11 | 4.200 | 886 |
| bank auto sales | 12 | 10 | 4.600 | 342 |
| Law Auto Sales | 11 | 11 | 4.300 | 486 |
| Senator Auto Sales | 11 | 10 | 4.100 | 267 |
| Drive Wise Auto Sales | 12 | 8 | 4.600 | 409 |

**Connect Auto Sales places 33rd of the 96** businesses present in both scans.
Notably **worse** than its 24th-of-107 combined ranking against the `used car
dealer` + `car dealer` pair in the original baseline.

---

## 4. Observations

### Facts, read from the CSV

1. Connect Auto Sales is found at only 3 of 25 points for this keyword (12.00%),
   versus 7 of 25 (28.00%) for `used car dealer` on the identical grid.
2. SoLV is 0.00 — Connect does not reach the top three at any grid point for this
   keyword.
3. DriveTime Used Cars tops this scan with SoLV 44.00 — the highest top-3
   presence recorded across all scans in this series so far.
4. The top 9 competitors by coverage are again all located 2.39–4.38 mi from the
   grid centre, further out than Connect, which remains at 0.00 mi.
5. Latitude/longitude for Connect Auto Sales is identical across all three scans
   collected to date (42.2774187, -83.289526) — consistent, not a data anomaly.

### Interpretation

- This keyword is **weaker** for Connect than the primary benchmark keyword. The
  generic "near me" phrasing appears to favour businesses with substantially
  higher review counts and broader map presence (DriveTime at 2,281 reviews,
  RightWay at 2,331) more than the more specific `used car dealer` phrasing does.
- The pattern from the original baseline repeats: being at the grid centre does
  not translate into broad coverage on this keyword either.

### Hypotheses — not established by this data

- Whether "near me" queries weight review count or review velocity more heavily
  than more specific category terms. Two data points is not enough to conclude
  this; it would need more keywords at the same grid to test.
- Whether this is why GSC query data (frozen baseline, `docs/seo-baseline-2026-09-27.md`)
  shows "car dealerships near me" at position 14.1 with 0 clicks over 327
  impressions — consistent in direction with this scan, but GSC organic position
  and Local Falcon map-pack coverage are different systems and not treated as the
  same measurement here.

**Explicitly not claimed:** that review count causes this, that any specific GBP
setting causes this, or that this keyword is unwinnable. None of that follows from
one scan.

---

## 5. Data-quality caveats

1. No timezone in the export, consistent with the other scans in this series.
2. Top-3 coverage is derived (SoLV × 25), not a CSV column — lands exactly on 0,
   so no rounding ambiguity here.
3. No per-point data in the export — a heatmap cannot be reconstructed from this
   CSV; it exists in the Local Falcon interface and should be screenshotted
   separately if a visual record is wanted.
4. Secondary Categories blank for 76 of 147 rows, Connect's included — consistent
   with prior scans, still not independent confirmation given the field is blank
   for roughly half of all listed businesses.
5. No duplicate Place IDs; 147 unique businesses. Grid, radius, keyword and scan
   date internally consistent across every row.

---

## 6. Baseline metrics — copy forward

```
CAR DEALERSHIPS NEAR ME                [5x5 — comparable to the primary benchmark]
Date:                    2026-09-27 11:50:14
Grid:                    5x5 (25 points)
Radius:                  5.0 mi
ARP:                     10.33
ATRP:                    19.72
SoLV:                    0.00
Found:                   3 / 25  (12.00%)
Not found:               22 / 25
Top-3 coverage:          0 / 25  (derived from SoLV)
Report rank:             60 of 147 returned
Rank by grid coverage:   61 of 147
Top recurring competitors (by Found In):
   DriveTime Used Cars        14/25  SoLV 44.00  4.8  2281 reviews
   RightWay Auto Sales        13/25  SoLV 16.00  4.8  2331 reviews
   Road Runner Auto Sales     11/25  SoLV 20.00  4.2  886 reviews
   Law Auto Sales             11/25  SoLV  4.00  4.3  486 reviews
   bank auto sales            10/25  SoLV 16.00  4.6  342 reviews
```

---

*Captured 27 September 2026. Source: one Local Falcon scan report CSV, read
directly. Recorded 2 October 2026. Companion to the frozen baseline dated
26 September 2026 — that document was not modified.*
