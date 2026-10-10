# RevenueCat kao uzor za mpt.hr — analiza i odluke (10. 10. 2026.)

Zašto je mpt.hr presložen iz jednostranog landinga u B2B site s podstranicama, što je od
RevenueCata preuzeto, a što **svjesno nije**. Kod je u commitima `e74fe79` i `f45ad01`;
ovdje je ono što se iz koda ne vidi.

Vezani dokumenti: `docs/revenuedog.md` (MPT globalno = RevenueDog), `docs/legal-pages-brief.md`
(sljedeći korak), `CLAUDE.md` (struktura sitea, cijene, CTA).

## Nalazi na starom mpt.hr (stanje `d12b095`)

Provjereno protiv koda pay.domovina.ai, ne iz sjećanja.

| # | Nekonzistentnost | Kako je riješeno |
|---|---|---|
| 1 | Hero „kupac plaća iz banke s 0 €", a `#why` tablica kaže da SEPA nalog HR banke košta do 0,45 € (plaća pošiljatelj) | 0 € samo na Revolut putu; korak 01 kaže da iz klasične banke kupac plaća nalog |
| 2 | Tablica naknada miješa platitelje: kartica = trgovac, SEPA = kupac, „MPT 0 €" = kupac; što plaća trgovac, nigdje | stupac „tko plaća koliko"; MPT red po cjeniku |
| 3 | Dvije publike: B2B orkestrator (hero) vs. suverenost / P2P / wallet (`#why`, simulacije) | naslovnica je B2B; ostalo na `/flow` i `/why` |
| 4 | „Svaki trgovac ima IBAN i Safe" u sadašnjem vremenu, a ITalk je jedini tenant | fusnota u hero kartici |
| 5 | TTL „15 min do 24 h" (kod: min 60 s, zadano 15 min, max 24 h); webhookovi bez `underpaid` | ispravljeno prema `backend/src/intents/api.ts` i `outbound.ts` |
| 6 | Revolut iOS i GP opisani po tri puta | podstranice razdvajaju sadržaj |
| 7 | „svih 17 kritičnih i visokih nalaza" — broj otkriva da ih je bilo 17 | „code reviewi s riješenim nalazima" |
| 8 | Nema konverzije: primarni gumb samo skrola, jedini CTA je Telegram | jedan sales CTA svuda |
| 9 | Nema `sitemap.xml`, OG slike, `x-default` | dodano |

## Što RevenueCat radi (pregled 10. 10. 2026.)

- Nav: Why RevenueCat? · Solutions · Developers · Resources · Pricing; CTA Log in /
  Contact sales / **Sign up** (primarni).
- Naslovnica: hero s metrikama (152K+ aplikacija, $18B+ obrađeno) → ulazi po ulozi →
  „backend-in-a-box" → „Get started in minutes" (free do $2.5K MTR, „See the docs") →
  case studyji → ocjene (G2, Capterra), SOC2/GDPR → „Ready to grow?".
- Cijene: **besplatno do $2.500 mjesečno praćenog prometa, zatim 1 %**; Enterprise po
  dogovoru; FAQ (što je MTR, treba li kartica, što se dogodi na pragu…).
- Developer dio: docs po ciljevima, quickstart, API reference, webhook eventi, llms.txt,
  status stranica po komponentama, changelog. Stranica „build vs buy".

## Preuzeto vs. odbačeno

| Preuzeto | Zašto ide bez tracka |
|---|---|
| cjenik u jednoj rečenici + FAQ (iste brojke kao RC) | Matijina odluka; tehnički je naplata još 0 %, landing piše 1 % |
| primjer koda na naslovnici (intent + `intent.paid` webhook) | polja stvarna iz backenda; adrese ilustrativne |
| ulazi po segmentu (trgovine · udruge/župe · developeri) | ne traži dokaze |
| „Što MPT jest, a što nije" umjesto SOC2 bedževa | iskreni ekvivalent compliance trake |
| kalkulator kao lead magnet (`/pricing`) | već je postojao; sad uključuje MPT stupac |
| izmjerene brojke (~12 s, ~5 s) umjesto „$18B processed" | jedini stvarni dokaz koji imamo |

**Svjesno odbačeno** (izgledalo bi lažno s 0 vanjskih tenanata): metrike volumena u
heru, zid logotipa, case studyji s postocima, G2/Capterra ocjene, „trusted by…",
„State of…" izvještaj. Vratiti kad postoje stvarni tenanti.

**Odgođeno:** javna API dokumentacija (dotad integracija = consulting, CTA „javi se"),
statusna stranica po komponentama, changelog, stranica „hostano vs. vlastiti MPT"
(sadržaj je zasad u trećem planu na `/pricing` i FAQ-u).

## Odluka o CTA-u

Matija je prepustio odluku („ti odluči što je best practice"). Za B2B infrastrukturu bez
self-serve registracije standard je **jedan dosljedan sales CTA** na svim mjestima. Bez
booking alata ili forme najmanje trenja ima `mailto:` s predloškom (organizacija,
platforma, promet, Monerium račun) — upit stiže kvalificiran. Telegram ostaje sekundaran
(zajednica). Sljedeći korak, kad bude potrebe: forma ili Cal.com; kad bude javnih docsa,
drugi CTA postaje „Pogledaj docs" kao kod RevenueCata.

```mermaid
flowchart LR
  V[Posjetitelj] --> H[Naslovnica B2B]
  H -->|primarni| M[Zatraži integraciju<br/>mailto s predloškom]
  H --> P[/pricing/]
  H --> F[/flow/ simulacije]
  P --> M
  F --> M
  H -.->|sekundarni| T[t.me/mpt_hr]
```
