# TODO — GREEN WORLD

> **Rule: when a task is finished, DELETE its entry from this file.**
> Do not tick it off, do not move it to a "Done" section. This file only ever shows
> what is left.

> **Cross-page rule:** header, footer, mobile sheet and bottom bar are duplicated
> byte-identically across the nine content pages (no build step). Any change to them must be
> applied to `index.html`, `vare-liste.html`, `kurv.html`, `om-os.html`, `kontakt.html`,
> `kontrol-rapport.html`, `privatlivspolitik.html`, `cookies.html` and
> `handelsbetingelser.html` — all nine, identically. `404.html` carries the same block but
> with root-absolute hrefs (`/kurv.html`), so it is edited alongside, not copied.
>
> `bestil.html` is **deleted**, together with the three Google Forms it linked. Ordering runs
> through the cart on `kurv.html`. Do not resurrect the page without re-doing the GDPR
> assessment — see `shoppingcart.md`.

---

## 1. Blockers — fix before replacing the Weebly site

- [ ] **Replace the 17 draft prices.** Every product except Tomat carries an invented price
      that real customers can see, marked `<!-- PRISUDKAST -->`. The owner must confirm or
      correct each one, then the marker gets deleted. This is also the legal blocker:
      advertising prices nobody in the shop has approved is a real problem, and
      `handelsbetingelser.html:137` carries a `BLOKERENDE` marker saying so.
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
      ris, Kaffebønner, Te. Only 7 of 18 products are real today.
      → `vare-liste.html`, grep `>Eksempel<`

- [ ] **Photograph the meat counter.** Two pages show a `placehold.co` box where the meat
      section image belongs. `assets/img/habesha-koed.jpg` was downloaded from the old site
      but is deliberately unused — it shows bacon/salami-like product, which contradicts the
      whole religious-handling message. Replace it, then delete the old file.
      → `index.html:109`, `om-os.html:98`

- [ ] **Photograph the shop interior.** Same problem, second placeholder.
      → `index.html:119`, `om-os.html:87`

- [ ] **Product photo for Habesha kød.** The copy is real, the image is a placeholder.
      → `vare-liste.html:279`

---

## 2. Missing business data (owner must supply)

- [ ] **Social media: create or drop.** None found anywhere. Currently the site simply has
      no social links, which is fine — but decide deliberately.

---

## 3. SEO & discoverability

- [ ] **Add JSON-LD `GroceryStore` schema.** Highest-value item on this list for the stated
      goal of ranking on "afrikansk butik København", "teff mel", "injera". Include address,
      geo, telephone, `openingHoursSpecification`, and `sameAs` → the Findsmiley page.
      Nothing structured exists on any page today.

- [ ] **Add `<link rel="canonical">`** to all 9 content pages. None present.

- [ ] **Add `og:image` and `og:url`.** Shared links currently render as a blank card.
      Also add `twitter:card`. The `og:title` / `og:description` / `og:type` / `og:locale`
      tags are already in place — only the image and URL are missing.

- [ ] **Create `robots.txt` and `sitemap.xml`.** Neither exists.

- [ ] **Proper favicon set.** Currently `<link rel="icon" href="assets/img/logo.jpg">` — a
      38 KB JPEG with a baked-in white background. Needs a real ICO/PNG set plus
      `apple-touch-icon`.

---

## 4. Deployment (Vercel)

- [ ] **Create `vercel.json`:** clean URLs (`/kurv` instead of `/kurv.html`), long-lived
      cache headers for `assets/`, and 301 redirects from the old Weebly paths so existing
      links and any accumulated search ranking survive the cutover. Include
      `/bestil` → `/kurv`, since `bestil.html` was deployed before it was deleted.

- [ ] **Decide the domain and plan the DNS cutover** from `gwservice.weebly.com`.
      `deployment.txt` currently holds two URLs and no decision.

---

## 5. Legal / GDPR

### Must be settled before the legal pages go live

- [ ] **Verify the Web3Forms access key actually belongs to the shop.** `kurv.html:108` and
      `kontakt.html:178` both carry `894dbba5-03bb-4553-a7de-235e951fb583`, and the comment
      right above it at `kontakt.html:173` says it "skal udskiftes med en rigtig Web3Forms
      access key". If that is still a demo key, every order submitted so far went to somebody
      else's inbox — and the DPA does not help, because it binds the account holder, so the shop
      would have no agreement with Web3Forms at all. Send one test order and confirm it lands in
      `gwservice@gmail.com`. Everything else in this section depends on the answer.

- [ ] **Fill in the 6 remaining `BEKRÆFT` placeholders on the legal pages.** They render in
      yellow so they cannot ship unnoticed. Grep: `gw-check`. Outstanding:
      - **whether the shop delivers at all**, and area / minimum / fee / payment at the door
        → `handelsbetingelser.html:182`. This is the last one on that page with real teeth: the
        `Levering` option is live in the cart form, so a customer can pick it today without the
        terms saying whether it exists.
      - the current Nævnenes Hus monetary threshold → `handelsbetingelser.html:295`
      - the 17 unapproved prices → `handelsbetingelser.html:138` (same item as section 1)
      - data processing agreement with the **mail provider** → `privatlivspolitik.html:209`
        (the Web3Forms half of this marker is settled — their DPA binds on continued use)
      - which **AWS region** holds the submissions → `privatlivspolitik.html:223`
        (the rest is answered on the page now: Hetzner in Germany / Finland, SCCs, India)
      - the concrete transfer basis for **Vercel and Google**, checked against the Data Privacy
        Framework list rather than claimed generically → `privatlivspolitik.html:226`
        (Web3Forms is settled: SCCs, importer in India, *not* DPF)

- [ ] **`gwservice@gmail.com` is a free consumer Gmail account.** No data processing agreement
      covers it, and all customer correspondence lives there. Moving to Workspace or another
      provider with a DPA, on the shop's own domain, fixes both the legal gap and the
      unprofessional address at once.

- [ ] **Ask Web3Forms which AWS region holds the submissions.** The DPA (v1.0, 13 Jul 2026) is
      in place and answers most of what we needed — see the notes below — but Annex 3 says only
      "AWS regions as configured for the Services". Hetzner is EU (Germany / Finland), but that
      is the application layer, not the DynamoDB table and S3 bucket the submissions land in.
      Without the region, the transfer paragraph cannot be written concretely.
      → mail address at the bottom of `https://web3forms.com/dpa`

- [ ] **Check the no-returns rule against delivered orders.** The shop confirmed that goods sold
      are not taken back, and `handelsbetingelser.html` now says so — but only under "Når du
      henter og betaler i butikken", which is correct. If the shop ever delivers, a delivered
      order can be distance selling, and then the 14-day fortrydelsesret applies to anything not
      perishable or hygiene-sealed — an unopened bag of rice or coffee beans. That exception
      cannot be written away, and it is already stated further down the page. Make sure the shop
      knows the rule is "no returns in the shop", not "no returns ever".

- [ ] **Have the owner read the rewritten Web3Forms passages in `privatlivspolitik.html`.**
      Three factual corrections are drafted and live on the page: the order is no longer claimed
      to exist "intet andet sted" (Web3Forms keeps its own copy for three years), CleanTalk and
      Akismet are named as recipients of IP address and e-mail, and the sub-processors AWS,
      Cloudflare and Hetzner are listed. It is the owner's text — it needs their sign-off, not
      just ours.

- [ ] **Write the transfer impact assessment for Web3Forms.** The transfer basis is now known
      and concrete: Web3Creative operates from **India**, and the SCCs (Commission Implementing
      Decision (EU) 2021/914) are incorporated into the DPA by reference, with Web3Creative as
      importer. India has no adequacy decision and the EU-US Data Privacy Framework does not
      apply to an Indian company, so SCCs alone are not the whole answer — a short written
      assessment of Indian government access has to sit behind them. One page is enough.

- [ ] **Confirm the Vercel hosting decision** — it is named in the policy as the host keeping
      server logs.

- [ ] **Keep a simple internal record of processing activities** (fortegnelse, art. 30). The
      small-business exemption does not apply, because order handling is regular. One page is
      enough — this is a shop task, not a website task.

### Smaller, related

- [ ] Add the three legal pages to `sitemap.xml` when it is created.

---

## 6. Performance

- [ ] **Compress and convert the images.** `traditionelle-varer.png` is 490 KB,
      `p-chilli-pulver.png` 212 KB, `hero-shop.jpg` 397 KB, `p-teff-mel.png` 154 KB. No
      WebP/AVIF anywhere. Oversized images were a named problem with the old Weebly site —
      don't reintroduce them.

- [ ] **Add `srcset` to the product images.** Only the hero has one (`index.html:54`, with a
      1000px variant on disk); every `p-*.png` is served at full size to a 390px phone.

---

## 7. Accessibility & polish

- [ ] **Keyboard pass over all 10 pages.** Verify every clickable element has hover,
      `focus-visible` and active states, and that the bottom-sheet focus trap releases
      correctly. The CSS looks right; it has not been driven from a keyboard.

- [ ] **Run the screenshot loop at 390×844 and 1440×900 for all 10 pages,** per CLAUDE.md.
      `vare-liste.html` and `kurv.html` have been checked at both sizes; the other eight have
      not. There is no evidence in the repo that mobile has been visually verified — check for
      horizontal scroll, wrapped headings, and tap targets under 44×44px.
