# TODO — GREEN WORLD

> **Rule: when a task is finished, DELETE its entry from this file.**
> Do not tick it off, do not move it to a "Done" section. This file only ever shows
> what is left.

> **Cross-page rule:** header, footer, mobile sheet and bottom bar are duplicated
> byte-identically across all six HTML files (no build step). Any change to them must be
> applied to `index.html`, `vare-liste.html`, `bestil.html`, `om-os.html`, `kontakt.html`
> and `kontrol-rapport.html` — all six, identically.

---

## 1. Blockers — fix before replacing the Weebly site

- [ ] **Hook up the order/contact form endpoint.** Both forms still carry the literal
      `data-access-key="INDSÆT_WEB3FORMS_ACCESS_KEY"`, so `assets/site.js` silently falls
      back to a prefilled `mailto:`. Get a free key at web3forms.com and paste it in.
      → `bestil.html:93`, `kontakt.html:157`

- [ ] **Replace the 11 placeholder product cards.** They carry an `Eksempel` badge and the
      copy "Beskrivelse mangler — udfyldes med butikkens rigtige vare": Færdig injera,
      Bygmel, Hele krydderier, Løg, Grøn chili, Kylling, Røde linser, Kikærter, Basmati
      ris, Kaffebønner, Te. Only 6 of 18 products are real today.
      → `vare-liste.html`, grep `<!-- PLACEHOLDER -->`

- [ ] **Decide the price policy.** Exactly one product has a price (Tomat, 15,00 kr/kg).
      Either price everything, or drop `.gw-prod__price` entirely and say "ring for pris".
      A single priced item among seventeen unpriced ones looks broken.
      → `vare-liste.html:189`

- [ ] **Photograph the meat counter.** Two pages show a `placehold.co` box where the meat
      section image belongs. `assets/img/habesha-koed.jpg` was downloaded from the old site
      but is deliberately unused — it shows bacon/salami-like product, which contradicts the
      whole religious-handling message. Replace it, then delete the old file.
      → `index.html:110`, `om-os.html:100`

- [ ] **Photograph the shop interior.** Same problem, second placeholder.
      → `index.html:120`, `om-os.html:89`

- [ ] **Product photo for Habesha kød.** The copy is real, the image is a placeholder.
      → `vare-liste.html:228`

---

## 2. Missing business data (owner must supply)

- [ ] **Confirm the postcode.** `1656 København V` was *inferred* from the street name, never
      confirmed. It appears in the hero, both map cards, both address blocks and 6 footers.

- [ ] **Confirm opening hours per day.** The old site only ever said "10–20". The site now
      asserts 10–20 for all seven days, including Sunday. Confirm weekends and public
      holidays before launch — wrong hours on a grocery store is a real-world cost.
      → `kontakt.html:113-119`, footer hours block in all 6 files

- [ ] **Social media: create or drop.** None found anywhere. Currently the site simply has
      no social links, which is fine — but decide deliberately.

---

## 3. SEO & discoverability

- [ ] **Add JSON-LD `GroceryStore` schema.** Highest-value item on this list for the stated
      goal of ranking on "afrikansk butik København", "teff mel", "injera". Include address,
      geo, telephone, `openingHoursSpecification`, and `sameAs` → the Findsmiley page.
      Nothing structured exists on any page today.

- [ ] **Add `<link rel="canonical">`** to all 6 pages. None present.

- [ ] **Add `og:image` and `og:url`.** Shared links currently render as a blank card.
      Also add `twitter:card`. The `og:title` / `og:description` / `og:type` / `og:locale`
      tags are already in place — only the image and URL are missing.

- [ ] **Create `robots.txt` and `sitemap.xml`.** Neither exists.

- [ ] **Proper favicon set.** Currently `<link rel="icon" href="assets/img/logo.jpg">` — a
      38 KB JPEG with a baked-in white background. Needs a real ICO/PNG set plus
      `apple-touch-icon`.

---

## 4. Deployment (Vercel)

- [ ] **Create `vercel.json`:** clean URLs (`/bestil` instead of `/bestil.html`), long-lived
      cache headers for `assets/`, and 301 redirects from the old Weebly paths so existing
      links and any accumulated search ranking survive the cutover.

- [ ] **Decide the domain and plan the DNS cutover** from `gwservice.weebly.com`.
      `deployment.txt` currently holds two URLs and no decision.

---

## 5. Legal / GDPR

- [ ] **Write a privacy policy page (persondatapolitik).** Two forms collect name, phone
      and e-mail. A Danish business site collecting personal data needs this; right now the
      only statement is one line of small print under each submit button.

---

## 6. Performance

- [ ] **Compress and convert the images.** `traditionelle-varer.png` is 490 KB,
      `p-chilli-pulver.png` 212 KB, `hero-shop.jpg` 397 KB, `p-teff-mel.png` 154 KB. No
      WebP/AVIF anywhere. Oversized images were a named problem with the old Weebly site —
      don't reintroduce them.

- [ ] **Add `srcset` to the product images.** Only the hero has one (`index.html:56`); every
      `p-*.png` is served at full size to a 390px phone.

---

## 7. Accessibility & polish

- [ ] **Keyboard pass over all 6 pages.** Verify every clickable element has hover,
      `focus-visible` and active states, and that the bottom-sheet focus trap releases
      correctly. The CSS looks right; it has not been driven from a keyboard.

- [ ] **Run the screenshot loop at 390×844 and 1440×900 for all 6 pages,** per CLAUDE.md.
      There is no evidence in the repo that mobile has been visually verified — check for
      horizontal scroll, wrapped headings, and tap targets under 44×44px.
