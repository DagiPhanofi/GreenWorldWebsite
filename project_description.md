# Projekt 1 — GREEN WORLD (greenworld-grocery)

## Formål

Erstat den nuværende Weebly-side (`gwservice.weebly.com`) med et hurtigt, troværdigt og
fuldt dansksproget statisk website.

Den nuværende side har reelle problemer: butikken er i stykker (det eneste produkt,
"tomat kg", linker til en 404), bestilling foregår udelukkende via tre eksterne
Google Forms, tre baggrundsbilleder vejer over 1 MB stykket, og logoet i headeren er
et WhatsApp-screenshot på 3 KB. Der findes kun to sider i alt.

Strukturen — ikke designet — er lånt fra `gonzales-pizzeria.dk`: sticky overlay-header,
kort navigation, hero → om → find os → kontakt → footer, og et udgående
"se kontrolrapport"-link. Gonzales er bevidst minimalt og lægger al handel ud til
tredjepart. Vi låner skelettet, men ikke udførelsen (Gonzales kører Tahoma på flade grå
overlays og har en `box-shadow: 51px 20px 20px #ff0000` stående i produktion).

**Vigtig forskel:** Gonzales viser slet ingen varer. Det gør vi. En dagligvarebutiks
sortiment er hele grunden til, at folk besøger siden.

## Forretningen

GREEN WORLD er en habesha-dagligvarebutik (etiopisk/eritreansk) på Vesterbro i København.
Sortimentet dækker traditionelle varer — teff-mel, krydret smør, berbere, kardemomme —
kød håndteret efter kristent-ortodokse traditioner, samt økologiske, veganske og
glutenfri varer.

### Målgruppe

1. **Habesha-diasporaen i Storkøbenhavn** — søger autentiske råvarer og korrekt
   håndteret kød til faste og højtider. Handler ofte på tigrinya eller amharisk.
2. **Danske kunder** — søger økologi, veganske specialiteter og glutenfri varer.
3. **Lokale på Vesterbro** — almindelige dagligvarer.

Sproget på sitet er **dansk hele vejen igennem**. Bestilling tilbydes derudover på
tigrinya og amharisk via de eksisterende Google Forms.

## Faktaark

Disse værdier er bekræftet fra den nuværende side. **Opfind aldrig nye.**

| Felt | Værdi |
|---|---|
| Navn | GREEN WORLD |
| Adresse | Gasværksvej 15, 1656 København V *(postnummer udledt — skal bekræftes)* |
| Telefon | 51 91 60 89 |
| E-mail | gwservice@gmail.com |
| Åbningstider | Alle dage kl. 10–20 *(kun angivet som løbende tekst på den gamle side)* |
| Findsmiley virksomhedsnr. | 7028996 → `https://www.findsmiley.dk/7028996` |
| CVR | **UKENDT — mangler** |
| Sociale medier | **Findes ikke — mangler** |

Findsmiley-nummeret stod ikke på siden. Det blev fundet i en efterladt `Disallow`-linje
i `gwservice.weebly.com/robots.txt`.

### Bestillingsformularer der skal bevares

| Sprog | URL |
|---|---|
| Dansk | `https://docs.google.com/forms/d/e/1FAIpQLSfeOlv94gr59_X8dyeFQxWyKC5kfL7dRZz5DBiheVJzKas16A/viewform` |
| ትግርኛ (tigrinya) | `https://forms.gle/9KGA1Tb3vA9y4CMs7` |
| አማርኛ (amharisk) | `https://forms.gle/twf8PuJVjAWPFnM29` |

## Sider

Separate HTML-filer med rigtige URL'er — bedre for lokal SEO ("afrikansk butik
København", "teff mel", "injera").

| Fil | Titel | Opgave |
|---|---|---|
| `index.html` | Forside | Sælg butikken på 10 sekunder. Hero, hvem vi er, traditionelle varer, hvor vi ligger. |
| `vare-liste.html` | Vare liste | Vis sortimentet grupperet i kategorier. Den vigtigste side. |
| `bestil.html` | Bestil | Dansk bestillingsformular → e-mail, plus de tre sprogformularer. |
| `om-os.html` | Om os | Historien, kødets religiøse renhed, værdier. |
| `kontakt.html` | Kontakt os | Adresse, telefon, mail, kort, åbningstider, kort besked-formular. |
| `kontrol-rapport.html` | Se kontrolrapport | Forklar smiley-ordningen, link til Findsmiley. |

## Genbrugt indhold

Ejerens egen danske tekst fra den gamle side er god og genbruges tæt på ordret:
afsnittet om **habesha-kød**, **"GRØNT OG NATURLIGT"**-teksten, introen til
**AUTENTISKE TRADITIONELLE VARER**, de fire varebeskrivelser (teff mel, krydret smør,
chilli pulver, flere krydderier) og **"HVOR BEFINDER VI OS"**-afsnittet.

### Billeder

Hentet lokalt til `assets/img/` — der hotlinkes ikke til Weebly, da den side kan blive
lukket ned.

| Fil | Kilde | Brug |
|---|---|---|
| `logo.jpg` | `Brand_assets/logo.jpeg` | Header og footer |
| `hero-shop.jpg` | Weebly, 2000×1334 | Hero-baggrund |
| `traditionelle-varer.png` | Weebly, 1102×413 | Dekorativt bånd |
| `p-teff-mel.png` m.fl. | Beskåret ud af båndet ovenfor | Varekort |
| `tomat.jpg` | Weebly, 225×225 | Varekort |

De fem varefotos (`p-*.png`) er beskåret ud af `traditionelle-varer.png`, så de fire
navngivne produkter har rigtige billeder i stedet for placeholders.

De tre sektionsbaggrunde fra Weebly på over 1 MB er **ikke** hentet — de er erstattet
af CSS-gradienter.

`habesha-koed.jpg` fra den gamle side er hentet, men **bruges ikke**: den viser noget,
der ligner bacon og salami, hvilket modsiger butikkens budskab om religiøst korrekt
håndteret kød. Skal erstattes af et rigtigt foto.

## Designretning

### Farver — udtrukket fra logoet

Samplet direkte fra `Brand_assets/logo.jpeg`. Den gamle sides `#28657c` var en
Weebly-temafarve, ikke en brandfarve, og bruges ikke.

| Token | Hex | Brug |
|---|---|---|
| `forest` | `#066923` | Primær. Knapper, links, overskrifter. Logoets dominerende grøn. |
| `leaf` | `#89C14A` | Accent. Duen og kloden i logoet. Kun dekorativt eller på mørk bund — for lav kontrast til tekst på hvid. |
| `deep` | `#03260F` | Footer og mørke flader. |
| `cream` | `#F9F5EE` | Basisflade. |
| `sand` | `#EFE7D8` | Sekundær flade, kanter. |
| `ink` | `#1E2A1B` | Brødtekst. |

**Logoet er en JPEG med indbagt hvid baggrund.** Det må kun placeres på lyse flader.
I footeren står det på en cremefarvet "chip", så den hvide kant aldrig ses.

### Typografi

**Fraunces** (display-serif) til overskrifter, `letter-spacing: -0.03em`.
**Inter** til brødtekst, `line-height: 1.7`, minimum 16px på mobil.
Aldrig samme font til begge.

### Øvrigt

Lagdelte, grøntonede skygger — aldrig flad `shadow-md`. Lagdelte radiale gradienter med
SVG-noise for kornstruktur. Flader i tre dybdeniveauer (cream base → hvid → svævende
kort). Kun `transform` og `opacity` animeres, aldrig `transition-all`. Alt klikbart har
hover, `focus-visible` og active. Afstandsskala 4/8/12/16/24/32/48/64/96; sektioner
`py-12 md:py-24`. Overskrifter skaleres flydende med `clamp()`.

### Mobil

Designet mobile-first fra 375px. Sticky header med hamburger → bottom-sheet.
Fast bundbjælke i tommelzonen med "Bestil" og tryk-for-at-ringe.
Tap-targets minimum 44×44px. `env(safe-area-inset-*)` på faste elementer.

## Teknik

Statisk site, intet build-step. Tailwind via CDN med inline `tailwind.config`.
Ingen `package.json`, ingen dependencies.

- `node serve.mjs` → `http://localhost:3000`
- `node screenshot.mjs <url> [label] [mobile]` → `temporary screenshots/`

Header og footer er duplikeret i hver fil, da der ikke er noget build-step. Hold markup
byte-identisk, så ændringer forbliver mekaniske.

Deployment: Vercel (se `deployment.txt`).

## Mangler

- [ ] **CVR-nummer** — står ingen steder; skal i footeren.
- [ ] **Endpoint til bestillingsformular** — Web3Forms access key eller Formspree-ID.
      Indtil da falder formularen tilbage til en forudfyldt `mailto:`.
- [ ] **Rigtig vareliste med priser og fotos** — placeholder-kort er markeret med
      HTML-kommentaren `<!-- PLACEHOLDER -->` og kan findes med grep.
- [ ] **Foto af habesha-kød** — det eksisterende viser svinekød og kan ikke bruges.
- [ ] **Postnummer** — 1656 København V er udledt af vejnavnet.
- [ ] **Åbningstider pr. dag** — kun "10–20" findes; weekend og helligdage ukendt.
- [ ] **Sociale medier** — ingen fundet.
