# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/DagmawiAlemayehuBeke/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/DagmawiAlemayehuBeke/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Optimize for mobile viewing
- **Design mobile-first, then scale up.** Start layouts at 375px width; add `md:` / `lg:` breakpoints for larger screens. Never design desktop-first and shrink.
- **Viewport meta:** Always include `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. The `viewport-fit=cover` is required for edge-to-edge iOS with notch/dynamic island.
- **Screenshot at mobile too.** Every screenshot pass must include a 390×844 (iPhone 14/15) capture, not just the 1440×900 desktop shot. Compare mobile against reference separately — desktop-only checks miss cramped tap targets, wrapped headings, and horizontal scroll.
- **Tap targets:** Minimum 44×44px hit area for anything clickable, with 8px spacing between adjacent targets. Icon buttons need explicit padding — don't rely on the icon's intrinsic size.
- **Font sizes:** Body text ≥ 16px on mobile (prevents iOS zoom-on-focus). Use fluid type with `clamp()` for headings: `clamp(2rem, 5vw + 1rem, 4rem)` — avoid step-changes at breakpoints.
- **No horizontal scroll, ever.** Set `overflow-x: hidden` on `body` as a safety net, but fix the actual cause. Wide elements (tables, code blocks, image rows) must scroll inside their own `overflow-x: auto` container.
- **Safe-area insets:** For fixed headers/footers and full-bleed surfaces, pad with `env(safe-area-inset-top)` / `-bottom` so content clears the notch and home indicator.
- **Touch, not hover.** Hover states are decorative on touch — never put critical info or actions behind hover. Pair every hover with an equivalent focus-visible and active state.
- **Thumb zone:** Primary CTAs live in the bottom third of the viewport on mobile, not the top. Nav is easier reachable as a bottom bar or a hamburger with a bottom-sheet drawer.
- **Images:** Serve responsive images via `srcset` + `sizes`, or use `<picture>` for art direction. Never load a 2000px hero on a 390px screen — it burns data and layout-shifts on slow networks.
- **Spacing scales down.** Section padding at desktop (`py-24`) is too much on mobile — halve it (`py-12 md:py-24`). Same for gaps and margins.
- **Test scroll performance.** Long pages with heavy shadows, blurs, or `backdrop-filter` chug on mid-tier phones. If it stutters, drop the effect on mobile with `@media (max-width: 768px)`.

## Project description
- ** look at project_description.md for identifiying project specific need and scope.