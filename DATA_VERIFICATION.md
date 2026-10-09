# Data verification checklist

Source: "Bio-Data K. Palanikumar" (64 pages). Run `npm run verify-data` for an automatic cross-check of the stated figures.

## Figures reproduced exactly as stated
- [x] Scopus/WoS-indexed articles **310**, Scopus citations **10,310**, h-index **53**
- [x] Scopus/WoS/Google Scholar articles **353**, citations **15,688**, h-index **65**
- [x] Patents stated: **21** (granted, incl. 2 designs) — 21 Granted records listed + 22 Published
- [x] Funding: "~ 2 Crores" (stated) — shown separately from the sum of listed project amounts (204.60 lakhs)
- [x] Peer reviews 572; Ph.D. scholars, awards, projects, editorial roles are counted live from records

## Please confirm (human review needed)
1. **310 vs 353 vs 395.** The site lists 395 unique publication records, merged from the profile's separate lists by DOI/title. The two stated totals are different indexes and are displayed side by side, not reconciled. Confirm whether the Publications page should be limited to a specific list.
2. **15 publications have no year** (source text corrupted/ambiguous) and **113 have no DOI**. Some issue/page numbers were corrupted in the source (spreadsheet date-serials) and were left blank rather than guessed.
3. **12 of 21 Ph.D. scholars (nos. 9–21) have no university** stated in the source.
4. One ambiguous date ("2/5/2023") was kept as written; one patent title appears truncated in the source.
5. Scholar "research area" tags and award categories are grouping conveniences assigned from titles; confirm or edit in the admin.
6. Typos silently fixed in the source are limited to obvious casing/spacing; raw citation text is kept in each publication record (`raw_citation`).
7. "Patent → industry" links on the Research page are derived only where a patent title matches a consultancy title (≥ 80% word overlap); review them.
8. Social links: only the three verified URLs (LinkedIn, Facebook, Google Scholar). **Photos were not fetched from either profile** — only images found in the Bio-Data are used; the official portrait should be replaced via Admin → Profile if a better one exists.
9. Default CV (`/files/Bio-Data-K-Palanikumar.pdf`) is an automatic PDF conversion of the .doc; check its layout and replace via Admin → Settings & CV.
10. Set the real public URL in `NEXT_PUBLIC_SITE_URL` / Admin → Settings (currently `https://example.com` in seed).
11. Name/title shown as **Prof. Dr. K. Palanikumar, Professor and Principal** (as in your brief). Citation text inside publication records keeps the author spellings printed in the Bio-Data.
12. Not built (stated honestly): a draft *preview* mode (use the Published toggle — unpublished records are hidden publicly), publication *category/type* filter (the Bio-Data lists are all journal-type; add a column later if you want conference/chapter splits), React Hook Form/Lucide (forms use built-in validation; icons are an inline SVG set).
