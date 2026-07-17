# mpt-landing — CLAUDE.md

Landing za **MPT (Mint Pay Transfer)**, live na **https://mpt.hr**. Javni demonstracijski
projekt: dokazuje da su end-to-end transferi s 0% naknada tehnički mogući. Stranica je
isključivo dokumentacija toka novca — tekstualno + interaktivni usmjereni dijagram +
simulacije korak po korak. Nije licencirana platna usluga (disclaimer u footeru).

## Arhitektura — jedan izvor istine

**`src/lib/mpt-machine.ts` je centralni artefakt.** Svi čvorovi, veze, prijelazi, guardovi
i scenariji žive tamo (s hr/en labelima kao `L10n`). Iz njega se izvode:

- React Flow vizualizacija: `src/components/FlowDiagram.tsx`
- interaktivne simulacije: `src/components/SimulationPlayer.tsx`
- invarijantni testovi: `src/lib/mpt-machine.test.ts` (`npm test`, vitest)
- Mermaid dokumentacija: `docs/flow.md` — **ručna preslika, ažuriraj je pri svakoj
  promjeni machinea**

Invarijante koje testovi dokazuju: korisnik plaća 0 € u svakom koraku; iznosi se čuvaju
1:1 (zbroj salda konstantan); salda nikad negativna; guardovi (min/max) odbijaju bez
pomicanja novca; scenariji su subsetovi punog grafa (`scenarioSubset()`).

Graf je **zatvoreni krug**: jedan čvor `bank` je i početak i kraj (bilo koja banka s
IBAN-om u eurozoni; prikazujemo hrvatske). Povratne veze: off-ramp preko vlastitog
Monerium računa natrag u banku, i Gnosis Pay VISA → Revolut (besplatni kartični top-up).

## Istina o mehanizmu — gdje se provjerava

**Nikad ne modeliraj flow iz sjećanja ili opisa.** Single source of truth je repo
`~/git/domovinatv/pay.domovina.ai`:

- `docs/monerium-private.md` — potpuni Monerium Private API ugovor (webhookovi, order
  lifecycle placed→pending→processed, memo routing, redeem pravila, ≥15.000 € dokument)
- `docs/plans/gnosis-pay-cards/` — Gnosis Pay integracija (Two-Safe model, Delay+Roles,
  Sumsub KYC, statusi). **GP grana je pre-pilot PLAN, ne produkcija** — landing to mora
  jasno reći dok se ne promijeni.
- `backend/` — worker `pay-domovina-backend`: `monerium/sid.ts` (parser reference
  `mpt:0x<addr>?sid=<id>`, i `gnosis:`/`cmp:`/goli `0x`; SEPA mapira `=`→`.`),
  `router/safe.ts` (Zodiac Roles forward, rola EUReForwarder, router EOA plaća gas),
  `intents/` (pending→paid na onchain potvrdi→expired; >0 € i ≤10.000 €, TTL 15 min)

Ključne činjenice koje su ranije bile krivo modelirane (ne ponavljati):
- "mpt-main-rail" = **Safe multisig 2/3** (`0x449a…`, Moneriumov default wallet), ne Worker
- minimumi 10 € (kartični top-up) i 1 € (SEPA) su **Revolutova produktna pravila**, ne MPT kod
- bez adrese u referenci sredstva ostaju **parkirana na Safeu**
- punjenje GP kartice = **EURe transfer s korisnikove adrese** (ne top-up iz Revoluta);
  obrnuti smjer GP VISA → Revolut jest besplatni kartični top-up
- `donate.domovina.ai` je **statični QR ulaz** (bez backenda/intenta)

## Stack i deploy

Next.js 16 (App Router, Tailwind 4) + `@opennextjs/cloudflare` na **Cloudflare Workers**.
Cloudflare račun: **D.O.M.** (`account_id` u `wrangler.jsonc`) — tamo je zona mpt.hr;
Matija ima 9 CF računa, ne pogađati druge.

```bash
npm test              # vitest — invarijante state machinea
npm run build         # next build
npm run preview       # OpenNext build + lokalni wrangler (localhost:8787)
CI=true npm run deploy  # build + deploy na mpt.hr
```

### OpenNext gotchas (potvrđeno bolno)
- Next 16 `proxy.ts` (Node middleware) **ne radi** na OpenNextu — koristi
  `src/middleware.ts` (edge). Radi jezični redirect `/` → `/hr|/en` po Accept-Language.
- `export const dynamicParams = false` **ruši** prerenderirane rute na OpenNextu
  (opennextjs-cloudflare issue #611) — ne dodavati.

## i18n

`/hr` (default) i `/en`, statički prerenderirani preko `[locale]` segmenta.
Copy stranice: `src/i18n/dictionaries.ts` (uvijek mijenjaj oba jezika).
Copy dijagrama/simulacija: `L10n` polja u `mpt-machine.ts`.

## Responsive dijagram

- **≥1024px**: horizontalni kružni layout (gornji red slijeva nadesno, donji red grane,
  povratne veze penju se natrag) — pozicije u `H_POS`, rute po `H_KIND` (rail/drop/up)
- **<1024px**: jedan vertikalni stupac (`V_ORDER`), skip-veze kao desni lukovi (`V_ARC`,
  bez labela — informacija je u dnevniku simulacije)
- custom edge s labelOffsetY (rail labeli u pojas između redova) i labelT (fan-out labeli
  povučeni prema cilju da se ne sudaraju)
- odabrani scenarij dima ne-sudjelujuće čvorove/veze na opacity 0.5 (`scenarioSubset`)

## Otvoreno / TODO

- `kontakt@mpt.hr` (CTA na stranici) **još ne postoji** kao mailbox — postaviti
  Cloudflare Email Routing na zoni mpt.hr (forward na stepanic.matija@gmail.com)
- kad GP integracija izađe iz pre-pilota, ažurirati status u machineu i dictionaries
- kad Matija preda još implementacija, sekcija "Kako je 0% moguće" se širi iz machinea
