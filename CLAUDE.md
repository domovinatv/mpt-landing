# mpt-landing — CLAUDE.md

Landing za **MPT (Mint Pay Transfer)**, live na **https://mpt.hr**. Pozicioniran kao
**proizvod tvrtke ITalk d.o.o.** (isti nastup kao airkuna.com).

**Pozicioniranje (Matija, 2026-10-10):** MPT je **orkestrator za više Monerium računa
(tenanata) — „RevenueCat za SEPA → EURe"**, poslovna logika ista kao RevenueCat za IAP.
Glavna stvar je **plaćanje izravno trgovcu**: kupac plaća iz banke (SEPA s referencom
`mpt:0x<trgovac>?sid=<intent>`), novac stiže na Monerium IBAN/Safe trgovca, forward ide
na njegovu odobrenu adresu; MPT ne prima i ne drži novac. Kod je otvoren (MIT,
github.com/domovinatv/pay.domovina.ai) — tko želi, pokrene vlastiti MPT. Kupac plaća 0 €.
Iskreno o stanju: multi-tenant rail (ADR 0017) je u produkcijskom kodu ali isključen
(`MULTI_TENANT_RAIL=0`) dok prvi vanjski tenant ne završi KYB — ITalk je jedini aktivni
tenant. Sekcija `#status` (u produkciji / u pripremi / poznata ograničenja) mora se
ažurirati kad se to promijeni.
Footer nosi airkuna-stil impresum (ITalk d.o.o., OIB 54872935051, adresa, direktor —
podaci preuzeti doslovno s airkuna.com footera, ne izmišljati) i poštenu napomenu:
MPT **nije licencirana platna usluga** — ITalk je non-custodial software provider,
regulirane funkcije obavlja Monerium (EMI / MiCA EMT); GP grana označena "u pripremi".

**RevenueDog (razmišljanje, ne odluka):** globalno gledano MPT je backend iz lipanjskog
RevenueDog plana („RevenueCat za web3"). **Ne preimenovati ništa** — sve detalje, opcije
brenda, rizike i otvorena pitanja drži `docs/revenuedog.md`.

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

Scenarij 1 (zadani) je `sepa-checkout` (kupac → trgovac iz banke), 2 je `stray` (uplata
bez reference, ADR 0018). Test provjerava da je merchant tok prvi.

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
- uplata bez reference **nije automatski parkirana**: od 8. 10. 2026. stray resolver
  (ADR 0018) je poveže s intentom istog tenanta po točnom iznosu i vremenu; parkira se
  tek kad kandidata nema ili su nejednoznačni
- izmjerene produkcijske brojke (izvor ADR 0017/0018, `docs/research/2026-09-monerium-
  first-iban-screening.md`): „zaprimljeno" 0 s od placedAt (~5 s od „Pošalji"), ~12 s do
  `paid`, Monerium placed→processed medijan 9 s / p95 26 s; prva uplata s novog IBAN-a
  ručni pregled minute–sati
- ne objavljivati javno sigurnosne rupe iz reviewa (npr. Roles scoping, WAF) — `#status`
  navodi samo ono što je riješeno, plan i ograničenja za korisnika
- punjenje GP kartice = **EURe transfer s korisnikove adrese** (ne top-up iz Revoluta);
  obrnuti smjer GP VISA → Revolut jest besplatni kartični top-up
- `donate.domovina.ai` je **statični QR ulaz** (bez backenda/intenta)

## Usporedba naknada ("Zašto danas" + kalkulator uštede)

Sekcija `#why` na landingu, usporedba "ista uplata danas" u sidebaru simulacija i
`SavingsCalculator` (input broja transakcija → ušteda maloprodaje dnevno/mjesečno/
godišnje) koriste tržišne konstante iz `src/lib/market-fees.ts`. **SSOT za te stope**
je analiza isplativosti: lom.ff.hr/dokumenti/isplativost (vendorirana u
`~/git/ss/ss-novcanik-prototip/docs/compliance/isplativost-wallet.md`): kartica =
Stripe EEA 1,5% + 0,25 € (srpanj 2026.), SEPA = fiksni nalog HR banaka 0,25–0,40 €
(plaća pošiljatelj). Ne izmišljati druge stope; kalkulator je uvijek označen kao
ilustrativan.

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

- **≥1024px**: React Flow horizontalni kružni layout (gornji red slijeva nadesno, donji
  red grane, povratne veze penju se natrag) — pozicije u `H_POS`, rute po `H_KIND`
  (rail/drop/up); attribution watermark skriven (`proOptions.hideAttribution`)
- **<1024px**: **MermaidJS** (`MermaidFlow.tsx`, dinamički import — desktop ne skida
  mermaid bundle): `flowchart TB` generiran iz istih machine nodes/edges, naslov + živi
  saldo u čvoru, bez edge labela (priča je u dnevniku); klase act/sub/dim prate ista
  tri stanja. Vertikalni ReactFlow put (`V_ORDER`/`V_ARC`) postoji u kodu ali se više
  ne koristi.
- custom edge s labelOffsetY (rail labeli u pojas između redova) i labelT (fan-out labeli
  povučeni prema cilju da se ne sudaraju)
- tri vizualna stanja iz `scenarioSubset`: ne-sudjelujući čvorovi/veze dimmed (opacity
  0.5) < subset lanca scenarija highlightan gold rubom/linijama/strelicama < aktivni korak
  simulacije navy + glow + animirana linija; prije prvog koraka (cursor = -1) čvor `bank`
  je aktivan s prikazanim `initialAmount`

## Dizajn / brand

airKUNA brand (izvor: `~/git/airkuna/airkuna-web`, `com/index.html` `:root` tokeni —
tamo je SSOT dizajna): paper `#FCFBF8` pozadina, navy `#002F6C` primarna, gold
`#C8912A`/`#E3AF35` akcent, Fraunces (serif, naslovi) + Inter (body) preko next/font,
radius 18px kartice / 999px pillovi, meke plavkaste sjene, navy+gold radijalni gradijent
za tamne trake (hero kartica, CTA). **Samo light tema** — airkuna-web nema dark mode.
Tokeni u `globals.css` (`@theme inline` → Tailwind klase `bg-paper`, `text-navy`,
`border-line`, `bg-gold-soft`…). Dnevnik simulacija nema unutarnji scroll (raste u
dokumentu) i obrnuto je kronološki — najnoviji korak na vrhu, na fiksnoj poziciji odmah
ispod dijagrama, pa auto-scroll nije potreban (posjetitelj gleda graf dok simulacija ide).

## Kontakt

Primarni kontakt je **javna Telegram grupa `t.me/mpt_hr`** (community-first narativ);
e-mail `ms@mpt.hr` je sekundarni. Grupa se provisionira iz
`~/git/domovinatv/novcanik-comms/provision` (`create-group.ts --public mpt_hr --no-bot
--skip-d1` — MTProto, traži jednokratni `npm run login`). airkuna.com ima isti obrazac
s `t.me/airkuna_com`.

## Lokalna provjera u pregledniku

`npm run preview` služi na 8787 — u pregledniku otvaraj **`http://127.0.0.1:8787`**, ne
`localhost:8787` (na localhost originu visi service worker drugog projekta, Crošulja, i
prikazuje njegovu stranicu). Nakon novog builda dodaj `?v=N` jer preglednik kešira.

## Otvoreno / TODO

- Telegram grupa `t.me/mpt_hr` postoji (10. 10. 2026.: 2 člana); mpt.hr ima Google MX
  — provjeriti da `ms@mpt.hr` stvarno prima poštu
- kad se uključi prvi vanjski tenant (`MULTI_TENANT_RAIL=1`), Shopify prođe prvi test
  ili GP izađe iz pre-pilota → ažurirati `status` u dictionaries + machine
- poslovna odluka: ako trgovci budu plaćali MPT naknadu (competitor-analysis spominje
  „ITalk routing fee TBD"), uskladiti red „MPT rail 0 €" u `#why` tablici
