# Indkøbskurv — GREEN WORLD

Referencedokument for kurv- og bestillingsflowet. Antagelser og opgaver står her, ikke i
koden. Når en opgave er løst, slettes den — samme regel som `todo.md`.

---

## 1. Hvad det er

Kunden vælger varer direkte på `vare-liste.html` med **størrelse** og **antal**
(fx `2 stk. à 1 kg teff mel`), gennemgår kurven på `kurv.html`, tilføjer eventuelle varer
der ikke står på listen i et fritekstfelt, og sender hele bestillingen gennem det Web3Forms-
endpoint der allerede kører.

## 2. Hvad det IKKE er

- **Ingen betaling.** Der er ingen betalingsgateway, intet kortflow, ingen ordrebekræftelse
  med bindende pris.
- **Ingen lagerstyring.** Siden ved ikke, om varen er på hylden.
- **Ingen brugerkonti.** Ingen login, ingen ordrehistorik.
- **Ingen backend.** Sitet er statisk. Kurven lever i browseren; bestillingen bliver til en
  e-mail.

Kurven er en **struktureret bestillingsanmodning**, som et menneske bekræfter over telefon —
præcis den proces, den gamle `bestil.html` allerede lovede med "Vi ringer og bekræfter pris,
mængde og tidspunkt".

## 3. Beslutninger

| Spørgsmål | Beslutning |
|---|---|
| Hvor ligger kassen? | Ny `kurv.html`. Menupunktet "Bestil" peger derhen. |
| Hvad sker der med `bestil.html`? | **Slettet.** Den lå deployet med en aktiv Web3Forms-nøgle og tre Google Forms, som ingen databehandleraftale dækkede. Findes i git-historikken. `/bestil` 301-redirectes til `/kurv` i `vercel.json`. |
| Hvor ligger varedata? | `data-*`-attributter på hvert `.gw-prod`-kort. Ingen renderingslag, intet build-step. |
| Priser | Alle varer får en pris nu, og den vises — inkl. sum i kurven. Priserne er udkast og kan rettes når som helst. |
| De tre Google Forms | Udgået sammen med `bestil.html`. Web3Forms opsamler alt fremover. URL'erne er gemt i `project_description.md`, hvis de skal genoplives. |

## 4. Antagelser

Skrevet ned, så de kan modbevises:

1. **Kurven ligger kun i kundens egen browser** (`localStorage`, nøgle `gw-kurv-v1`). Intet
   gemmes på en server, intet deles mellem enheder, og ryddes browserdata, er kurven væk.
   Der er ikke brug for et cookiebanner: det er førsteparts funktionel lagring uden sporing.
2. **Butikken ringer og bekræfter hver bestilling, før den pakkes.** Derfor er priser i
   kurven vejledende, og summen er ikke et bindende tilbud.
3. **Alle 18 varer kan bestilles** — også de 11, der stadig bærer `Eksempel`-badge og mangler
   rigtig beskrivelse og foto. Skal de tages ud af kurven indtil de er færdige, er det en
   beslutning butikken skal tage (se punkt 7).
4. **Ingen momslinje og intet leveringsgebyr.** Levering "aftales individuelt", som teksten
   allerede siger.
5. **Enhedsstørrelserne nedenfor er gættet** ud fra hvad en habesha-dagligvarebutik typisk
   sælger. De skal bekræftes mod det, butikken faktisk har på hylden.

## 5. Varedata

Hvert kort i `vare-liste.html` bærer:

```html
<article class="gw-prod"
         data-sku="teff-brun"
         data-name="Teff mel, brun"
         data-units="1 kg:45|2 kg:85|5 kg:200">
```

Formatet er `etiket:pris`-par adskilt af `|`. Prisen er hele kroner. `data-units` er eneste
sandhed: både prislinjen på kortet og størrelsesvælgeren udledes derfra, så de to ikke kan
komme ud af trit. Det er samme fremgangsmåde som `.gw-cat__count` i `assets/site.js`.

**Alle priser undtagen Tomat er udkast.** Hvert udkastkort har HTML-kommentaren
`<!-- PRISUDKAST -->` over sig, så de kan findes med ét grep:

```
grep -n "PRISUDKAST" vare-liste.html
```

| # | sku | Vare | data-units |
|---|---|---|---|
| 1 | `teff-brun` | Teff mel, brun | `1 kg:45\|2 kg:85\|5 kg:200` |
| 2 | `teff-hvid` | Teff mel, hvid | `1 kg:50\|2 kg:95\|5 kg:220` |
| 3 | `injera` | Færdig injera | `5 stk:40\|10 stk:75` |
| 4 | `bygmel` | Bygmel | `1 kg:30\|2 kg:55` |
| 5 | `chilli-pulver` | Chilli pulver | `250 g:45\|500 g:80\|1 kg:150` |
| 6 | `krydret-smoer` | Krydret smør | `250 g:55\|500 g:100` |
| 7 | `krydderier` | Flere krydderier | `100 g:25\|250 g:55` |
| 8 | `hele-krydderier` | Hele krydderier | `100 g:25\|250 g:55` |
| 9 | `tomat` | Tomat — **eneste bekræftede pris** | `1 kg:15\|2 kg:30\|5 kg:70` |
| 10 | `loeg` | Løg | `1 kg:15\|5 kg:60` |
| 11 | `groen-chili` | Grøn chili | `250 g:20\|500 g:35` |
| 12 | `habesha-koed` | Habesha kød | `1 kg:120\|2 kg:230\|5 kg:550` |
| 13 | `kylling` | Kylling | `1 stk:75\|2 stk:145` |
| 14 | `roede-linser` | Røde linser | `1 kg:30\|2 kg:55\|5 kg:125` |
| 15 | `kikaerter` | Kikærter | `1 kg:30\|2 kg:55\|5 kg:125` |
| 16 | `basmati-ris` | Basmati ris | `1 kg:30\|5 kg:130\|10 kg:240` |
| 17 | `kaffeboenner` | Kaffebønner | `500 g:70\|1 kg:130` |
| 18 | `te` | Te | `100 g:30\|250 g:65` |

### Sådan retter man en pris

Find varen i `vare-liste.html`, ret tallet i `data-units`, og slet `<!-- PRISUDKAST -->`-
kommentaren over kortet. Ingen andre steder skal røres.

## 6. Datamodel

`localStorage`-nøgle `gw-kurv-v1`:

```json
{
  "v": 1,
  "updated": 1757030400000,
  "lines": [
    { "sku": "teff-brun", "name": "Teff mel, brun", "unit": "1 kg", "price": 45, "qty": 2 }
  ]
}
```

- En linje identificeres på `sku + "|" + unit`. Lægger man samme vare i samme størrelse i
  kurven igen, tælles `qty` op — der kommer ikke en linje mere.
- `qty` holdes mellem 1 og 99, og der er højst 40 linjer. En løbsk løkke eller en kunde med
  for meget tid kan altså ikke producere en ulæselig bestillingsmail.
- En kurv, hvis `updated` er mere end 30 dage gammel, kasseres ved indlæsning.
- `name` og `price` gemmes **på linjen**, ikke slås op ved visning. Så overlever en kurv, at
  varen bliver omdøbt eller fjernet fra listen imens.
- Al læsning er pakket i `try/catch`: Safari i privat tilstand kaster på `localStorage`, og
  varelisten skal stadig virke.

## 7. Bestillingsmailen

Kurven serialiseres til det skjulte felt `Varer`, før formularen sendes. Butikken modtager:

```
Navn: Selam Tesfaye
Telefon: 12 34 56 78
Leveringsform: Afhentning i butikken
Varer:
- Teff mel, brun · 1 kg × 2 = 90,00 kr
- Krydret smør · 250 g × 1 = 55,00 kr
Anslået i alt: 145,00 kr  (priser er vejledende — bekræftes ved kontakt)
Andre varer: 1 pose berbere hvis I har
Kontaktform: Telefon
```

Samme tekst havner i `mailto:`-udkastet, hvis Web3Forms er nede eller nøglen mangler.

## 8. Udestående — butikken skal svare

- [ ] **Bekræft eller ret de 17 udkastpriser.** `grep -n "PRISUDKAST" vare-liste.html`.
      Indtil da ser kunder tal, ingen i butikken har godkendt.
- [ ] **Bekræft enhedsstørrelserne.** Sælges teff-mel i 1/2/5 kg? Sælges injera i 5- og
      10-styks? Listen i afsnit 5 er kvalificeret gætteri.
- [ ] **Skal de 11 `Eksempel`-varer kunne bestilles?** De har hverken rigtig beskrivelse
      eller foto. Enten færdiggør dem, eller tag `data-sku` af kortet — så mister det
      automatisk sin bestillingsknap, uden anden ændring.
- [ ] **Sæt en nedre grænse for levering?** Der står i dag kun "aftales individuelt".
