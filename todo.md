# TODO — GREEN WORLD

> **Rule: when a task is finished, DELETE its entry from this file.**
> Do not tick it off, do not move it to a "Done" section. This file only ever shows
> what is left.

> **Cross-page rule:** header, footer, mobile sheet and bottom bar are duplicated
> byte-identically across all seven HTML files (no build step). Any change to them must be
> applied to `index.html`, `vare-liste.html`, `kurv.html`, `bestil.html`, `om-os.html`,
> `kontakt.html` and `kontrol-rapport.html` — all seven, identically. `404.html` carries the
> same block but with root-absolute hrefs (`/kurv.html`), so it is edited alongside, not copied.
>
> `bestil.html` is kept working but is no longer linked from anywhere — ordering runs through
> the cart on `kurv.html`. See `shoppingcart.md`.

---

## 1. Blockers — fix before replacing the Weebly site

- [ ] **Replace the 17 draft prices.** Every product except Tomat carries an invented price
      that real customers can see, marked `<!-- PRISUDKAST -->`. The owner must confirm or
      correct each one, then the marker gets deleted.
      → `grep -n "PRISUDKAST" vare-liste.html`, table in `shoppingcart.md`

- [ ] **Confirm the unit sizes per product.** `data-units` currently guesses what the shop
      sells (teff in 1/2/5 kg, injera in 5/10 pcs, and so on). Wrong sizes produce orders the
      shop cannot pack.
      → `vare-liste.html`, `shoppingcart.md` section 5

- [ ] **Decide whether the 11 `Eksempel` products should be orderable.** They can be added to
      the cart today but have neither a real description nor a photo. Either finish them, or
      strip `data-sku` from the card — that alone removes its add-to-cart control.

- [ ] **Replace the 11 placeholder product cards.** They carry an `Eksempel` badge and the
      copy "Beskrivelse mangler — udfyldes med butikkens rigtige vare": Færdig injera,
      Bygmel, Hele krydderier, Løg, Grøn chili, Kylling, Røde linser, Kikærter, Basmati
      ris, Kaffebønner, Te. Only 6 of 18 products are real today.
      → `vare-liste.html`, grep `<!-- PLACEHOLDER -->`

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

- [x] **Write a privacy policy page (persondatapolitik).** Done — `privatlivspolitik.html`,
      plus `cookies.html` and `handelsbetingelser.html`. Linked from the footer bottom bar on
      all 11 pages, and from the small print under both order forms.
- [x] **Self-host the fonts.** Google Fonts used to load on every page, sending each visitor's
      IP to Google before any interaction. Now `assets/fonts/` (2 variable woff2, 115 KB total).

### Must be settled before the legal pages go live

- [ ] **Fill in the `BEKRÆFT` placeholders on the three legal pages.** They are marked in
      yellow on the rendered pages so they cannot ship unnoticed. Grep: `gw-check`.
      Outstanding: legal name and company form on CVR 45089096 · postcode 1656 (derived, not
      confirmed) · opening hours incl. Sunday and holidays · typical callback window · how long
      a packed order is held · whether the shop delivers at all, and area/minimum/fee · accepted
      payment methods · whether alcohol or tobacco is sold · exchange policy as a gesture ·
      VAT registration · the current Nævnenes Hus monetary threshold.
- [ ] **Retire `bestil.html`.** Not linked from anywhere, and `project_description.md` calls it
      udgået — but it is still deployed, still submits real personal data through the same live
      Web3Forms key, and still links three Google Forms. Google Forms would be a second data
      processor nobody has assessed. The privacy policy is written for the two live forms only,
      so it is inaccurate for as long as this page ships.
- [ ] **17 of 18 prices are still `PRISUDKAST`** in `vare-liste.html` and are visible to
      customers. The reservation model softens it, but advertising prices nobody in the shop has
      approved is a real problem. Blocking.
- [ ] **`gwservice@gmail.com` is a free consumer Gmail account.** No data processing agreement
      covers it, and all customer correspondence lives there. Moving to Workspace or another
      provider with a DPA, on the shop's own domain, fixes both the legal gap and the
      unprofessional address at once.
- [ ] **Get a data processing agreement with Web3Forms**, and find out their retention period,
      sub-processors and server location. The privacy policy currently carries a `BEKRÆFT`
      marker where that belongs.
- [ ] **Confirm the Vercel hosting decision** — it is named in the policy as the host keeping
      server logs.
- [ ] **Keep a simple internal record of processing activities** (fortegnelse, art. 30). The
      small-business exemption does not apply, because order handling is regular. One page is
      enough — this is a shop task, not a website task.

### Smaller, related

- [ ] **Remove the stale `<!-- TODO: CVR-nummer mangler -->` comment** — it still sits directly
      above `CVR:45089096` in all 8 original footers, and the number is in fact there.
- [ ] **Raise the CVR contrast in the footer.** It renders at `rgba(255,255,255,.4)`, which is
      very hard to read on the dark ground.
- [ ] **Resolve the Findsmiley discrepancy.** `kontrol-rapport.html:8` meta says `7028996`;
      every link and on-page mention says `1515947`. A wrong inspection-report link on a food
      shop is worse than no link.
- [ ] **Update `project_description.md:51`**, which still records CVR as "UKENDT — mangler".
- [ ] Add the three legal pages to `sitemap.xml` when it is created.

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

- [ ] **Run the screenshot loop at 390×844 and 1440×900 for all 7 pages,** per CLAUDE.md.
      `vare-liste.html` and `kurv.html` have been checked at both sizes; the other five have not.
      There is no evidence in the repo that mobile has been visually verified — check for
      horizontal scroll, wrapped headings, and tap targets under 44×44px.
