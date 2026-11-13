# mpt-landing — CLAUDE.md

Landing za **MPT (Mint Pay Transfer)**, live na **https://mpt.hr**. Pozicioniran kao
**proizvod tvrtke ITalk d.o.o.** (isti nastup kao airkuna.com).

**Pozicioniranje (Matija, 2026-10-10; model od 15. 10. 2026., ADR 0025/0026):** MPT je
**orkestrator i notification servis za više Monerium računa (tenanata) — „RevenueCat za
SEPA → EURe"**, poslovna logika ista kao RevenueCat za IAP. Glavna stvar je **plaćanje
izravno trgovcu**: kupac plaća iz banke (SEPA s referencom `gnosis:0x<Safe> sid:<intent>`)
na Monerium IBAN trgovca, a **Monerium minta EURe izravno u Safe trgovca/projekta** iz
reference (način `direct`). MPT uparuje uplatu s intentom i javlja je (zaprimljeno → paid,
potpisani webhook s outboxom, SSE, potvrda o uplati) — UX kao kartica na POS-u, a iz obične
SEPA uplate. **Nikad ne pisati da MPT minta, dovodi ili prosljeđuje novac kao svoju
funkciju**; MPT ne prima i ne drži novac i nema ključ koji ga može pomaknuti izvan skupa
Safe-ova koje su vlasnici odobrili. Uplata bez reference (Revolut nakon QR-a briše opis)
minta se na glavni Safe tenanta; stray resolver (ADR 0018) ili kratki kod (ADR 0028) je
veže uz intent, a rola **ProjectRouter** (ADR 0026) je prosljeđuje samo na projektni Safe
iz skupa koji su 2/3 vlasnika odobrili (Zodiac Roles na lancu, bez kapice na iznos).
Forwarda na proizvoljnu korisnikovu adresu više nema; vlastiti wallet se puni preko
vlastitog Monerium računa (osobe od 30. 10. 2026. preko partnera, npr. Bleap). Kod je otvoren (MIT,
github.com/domovinatv/pay.domovina.ai) — tko želi, pokrene vlastiti MPT. Kupac MPT-u
plaća 0 € (0 € ukupno samo na Revolut putu — iz klasične HR banke plaća nalog svojoj banci,
landing to mora reći, ne tvrditi „0 € iz bilo koje banke").

**Cijene (Matija, 2026-10-10): kao RevenueCat** — hostani MPT besplatan do 2.500 €
mjesečnog prometa (uplate sa statusom paid u kalendarskom mjesecu), zatim 1%; Enterprise
po dogovoru; vlastiti MPT (self-host, MIT) 0 €. SSOT brojeva: `src/lib/mpt-pricing.ts`
(test `mpt-pricing.test.ts` drži copy u dictionaries usklađenim). Naplata u backendu još
ne postoji; cjenik vrijedi za vanjske tenante.

**Struktura sitea (2026-10-10, po uzoru na RevenueCat):** B2B naslovnica za trgovca/
developera + podstranice. Javne API dokumentacije nema — integracija ide kroz consulting
(„javi se"). Potrošačka/ideološka priča (wallet, P2P, GP, suverenost) **ostaje na mpt.hr**,
ali na `/flow` i `/why`, ne na naslovnici.

| Ruta | Sadržaj |
|---|---|
| `/{hr,en}` | hero · Kako radi (RC tablica) · Integracija u 3 koraka + kod · Za koga · cijene teaser · Što MPT jest/nije · `#status` · CTA |
| `/{hr,en}/merchants` | za trgovce: onboarding (4 koraka) · „što se dogodi kad…“ (10 rubnih slučajeva s webhookom) · novac/povrati/knjiženje · što još nema |
| `/{hr,en}/flow` | tok novca (4 koraka + napomene) + dijagram i simulacije |
| `/{hr,en}/pricing` | 3 plana · kalkulator (`SavingsCalculator`) · FAQ |
| `/{hr,en}/why` | tablica naknada po kanalu · argumenti · izvor |
| `/{hr,en}/support` (+ `/sandbox`, `/potvrda`, `/provjera`) | crowdfunding MPT-a kroz MPT — kopija energy /beta/: iznos → QR panel uživo · prikupljeno · uplate · potvrda o uplati |

Ispod 1024px inline linkovi se skrivaju; nosi ih `<details>` izbornik bez JS-a u navu.
Zajednički dijelovi (nav, footer, CTA traka, `pageMetadata`, `localHref`) su u
`src/components/site.tsx`; interni hrefovi u dictionaries su bez locale prefiksa
(`/pricing`, `/#how`). Nova stranica = `pagePaths` + `dict.pages.<key>` + middleware
matcher (preusmjerenje rute bez jezika). `sitemap.ts` i hreflang (s `x-default`) se
izvode iz `pagePaths`; `robots.ts` upućuje na sitemap. `public/funding.json` je FLOSS/fund manifest (ITalk, Monerium IBAN; plan grantova u privatnom `bizops-automation/funding/`) — ažurirati opis kad se promijeni stanje u `#status`. OG slika je statični `public/og.png`, izvor je `docs/brand/og.svg`
(`rsvg-convert -w 1200 -h 630 docs/brand/og.svg -o public/og.png`). Znak (M pločica) je isti u
`public/favicon.svg`, `Logo()` u `site.tsx` i mediakitu (`mpt_logo_square.svg`); mijenjaj sva tri skupa.
Iskreno o stanju: multi-tenant rail (ADR 0017) je uključen (`MULTI_TENANT_RAIL = "1"`,
tenanti u D1), ali ITalk je jedini tenant s pravim novcem dok prvi vanjski trgovac ne
završi Moneriumov KYB. Sekcija `#status` (u produkciji / u pripremi / poznata ograničenja)
mora se ažurirati kad se to promijeni.
Footer nosi airkuna-stil impresum (ITalk d.o.o., OIB 54872935051, adresa, direktor —
podaci preuzeti doslovno s airkuna.com footera, ne izmišljati) i poštenu napomenu:
MPT **nije licencirana platna usluga** — ITalk je non-custodial software provider,
regulirane funkcije obavlja Monerium (EMI / MiCA EMT); GP grana označena "u pripremi".

**RevenueDog (razmišljanje, ne odluka):** globalno gledano MPT je backend iz lipanjskog
RevenueDog plana („RevenueCat za web3"). **Ne preimenovati ništa** — sve detalje, opcije
brenda, rizike i otvorena pitanja drži `docs/revenuedog.md`. Usporedbu s RevenueCat
siteom i zašto je mpt.hr ovako složen drži `docs/2026-10-10-revenuecat-benchmark.md`.
Od 11. 10. 2026. razrada za globalni opis (teza, pseći rječnik, copy, rizici imena, roadmap,
dnevnik odluka) živi u zasebnom javnom repou **github.com/revenuedog/mpt**
(`~/git/revenuedog/mpt`). Ime „RevenueDog" već koriste tri tuđa projekta; ništa se ne kupuje
(domene, žig) dok ne postoji kombinacija koju netko kupuje (Matija).

## Kampanja „Podrži MPT" — crowdfunding MPT-a kroz MPT (od 9. 11. 2026.)

`/{hr,en}/support` (pravi novac, tenant `italk`, Gnosis), `/support/sandbox` (tenant
`italk-sandbox`, Monerium sandbox, Chiado), `/support/potvrda` i `/support/provjera`
(potvrda o uplati). **Kod koji miče novac je kopija energy.domovina.ai `/beta/`**
(commit `d91489c`): `src/components/beta/*` i `src/lib/{mpt-intent,rail-profile,beta-chain,
safe-rpc,pending-*,payer-tags,receipt-*,verify-*,pdf-*,…}.ts` + testovi u
`src/lib/__tests__/`. Mijenjati ih kao energy, ne prepisivati; kriptografija potvrde je
kopija raila (zlatne vrijednosti u testovima). Razlike: `lib/beta-projects.ts` drži jednu
kampanju na dva raila (`campaign_id` je jedinstven preko tenanata: `mpt-crowdfunding-prod` na `italk`, `mpt-crowdfunding` na `italk-sandbox`) (`CAMPAIGN_PROD`, `CAMPAIGN_SANDBOX`),
`isUsableAddress` je kopiran iz campaign-core (bez ovisnosti), `CampaignSection` u
`beta-page.tsx` zamjenjuje energy `ProjectSection`, `lib/i18n` je tanak `useT` adapter s
jezikom iz rute (katalog `lib/i18n/{hr,en}.ts`, samo ključevi koje komponente koriste),
energy tokeni boja (`forest`, `sand`, `rust`, `solar`…) mapirani su na MPT boje u
`globals.css`. Copy stranice oko komponenti je u `dictionaries.support`.

Safe-ovi kampanje (2/3, ista trojka kao energy projekti), izrađeni u adminu raila
(`/admin/tenants/<tenant>/setup` → „Dodaj projekt", ADR 0027): sandbox
`0x9392491B40232C4C9411449A2f350F1647b72fdA`, produkcija
`0x022aA53B825054e47e99aa104FbA1E0ce293a47F` (Safe 1.5.0, 10. 11. 2026., Monerium linked;
deploy platio Gnosis deployer — umirovljeni router `0xd612…54CB` kao worker secret
`GNOSIS_DEPLOYER_PRIVATE_KEY`). Bez `CAMPAIGN_PROD.safe` `/support` kaže „u pripremi" i ne
pokazuje uputu za uplatu (invarijanta). Nikad glavni Safe
`0x449a…` (tamo stižu uplate bez reference). Uplate bez reference (Revolut) stižu na Safe
kampanje tek kad je projekt u roli ProjectRouter (2/3 potpis plana na setup stranici).
`https://mpt.hr` je u railovom `ALLOWED_ORIGINS` (pay.domovina.ai PR #144); lokalni preview
(127.0.0.1:8787) zato ne može stvoriti intent — tok se provjerava na mpt.hr/support/sandbox.
Prva uplata (1 €, bez reference → ProjectRouter, 17 s do paid) i što je trebalo popraviti:
`docs/2026-11-10-prva-uplata-podrzi-mpt.md`.
Copy: „podrška razvoju", ne donacija (ITalk je d.o.o., nije porezno priznato); nikad
prinos/udio/povrat na ulaganje. Cilj je `null` dok Matija ne odluči.

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

Scenarij 1 (zadani) je `sepa-checkout` (kupac → trgovac iz banke, Monerium minta izravno
u Safe trgovca, `mintEure` `moneriumMpt` → `merchant`), 2 je `stray` (uplata bez reference:
`mintToMainSafe` na glavni Safe `safeRelayer` → resolver → ProjectRouter `forwardToPayee`),
3 `parked` (resolver ne nađe kandidata → parkirano na glavnom Safeu, operater veže uz
narudžbu), 4 `underpaid` (novac stigne, intent ne postaje paid). Scenariji 5–9 (vlastiti
wallet, puni krug, P2P, checkout iz walleta, GP) idu preko vlastitog Monerium računa
(`sepaToOwnMonerium` → `mintToOwnAddress`), ne preko MPT-a. Test provjerava da je merchant
tok prvi i da nijedan prijelaz ne pomiče novac s IBAN-a/Safea trgovca na korisnikovu adresu.
ID čvora `safeRelayer` je povijesni — danas je to glavni Safe tenanta.

Graf je **zatvoreni krug**: jedan čvor `bank` je i početak i kraj (bilo koja banka s
IBAN-om u eurozoni; prikazujemo hrvatske). Povratne veze: off-ramp preko vlastitog
Monerium računa natrag u banku, i Gnosis Pay VISA → Revolut (besplatni kartični top-up).
Desktop raspored (`H_POS`/`H_ROUTE` u `FlowDiagram.tsx`): srednji red je checkout rail s
izravnim mintom, glavni Safe je iznad njega kao zaobilaznica za uplate bez reference,
donji red je vlastiti wallet.

## Istina o mehanizmu — gdje se provjerava

**Nikad ne modeliraj flow iz sjećanja ili opisa.** Single source of truth je repo
`~/git/domovinatv/pay.domovina.ai`:

- `docs/monerium-private.md` — potpuni Monerium Private API ugovor (webhookovi, order
  lifecycle placed→pending→processed, memo routing, redeem pravila, ≥15.000 € dokument)
- `docs/plans/gnosis-pay-cards/` — Gnosis Pay integracija (Two-Safe model, Delay+Roles,
  Sumsub KYC, statusi). **GP grana je pre-pilot PLAN, ne produkcija** — landing to mora
  jasno reći dok se ne promijeni.
- `docs/decisions/` — ADR 0025 (router umirovljen, svi tenanti `direct`), 0026
  (ProjectRouter), 0018 (stray resolver), 0028 (kratka referenca), 0017 (multi-tenant)
- `backend/` — worker `pay-domovina-backend`: `tenants/rail.ts` (referenca
  `gnosis:<Safe> sid:<sid>`), `monerium/sid.ts` (parser; tolerira i `?sid=`, stare `mpt:`
  reference idu kao D4 dug), `tenants/whitelist.ts` (direct gate: `direct_settle` /
  `direct_owed`), `monerium/forward.ts` (ProjectRouter za D4 dugove, reroute),
  `intents/` (pending→paid→expired; >0 € i ≤10.000 €, TTL 15 min; `short_ref`)

Ključne činjenice koje su ranije bile krivo modelirane (ne ponavljati):
- "mpt-main-rail" = **Safe multisig 2/3** (`0x449a…`, Moneriumov default wallet), ne Worker;
  od 15. 10. 2026. tamo stižu samo uplate bez reference (i stare `mpt:` reference)
- minimumi 10 € (kartični top-up) i 1 € (SEPA) su **Revolutova produktna pravila**, ne MPT kod
- uplata bez reference **nije automatski parkirana**: od 8. 10. 2026. stray resolver
  (ADR 0018) je poveže s intentom istog tenanta po točnom iznosu i vremenu; parkira se
  tek kad kandidata nema ili su nejednoznačni
- izmjerene produkcijske brojke (izvor ADR 0017/0018, `docs/research/2026-09-monerium-
  first-iban-screening.md`): „zaprimljeno" 0 s od placedAt (~5 s od „Pošalji"), ~12 s do
  `paid`, Monerium placed→processed medijan 9 s / p95 26 s; prva uplata s novog IBAN-a
  ručni pregled minute–sati
- ograničenje primatelja: rola ProjectRouter je **onchain** ograničena (Zodiac Roles
  `Or(EqualTo…)`) na projektne Safe-ove koje su 2/3 vlasnika odobrili (ADR 0026, produkcija
  19. 10. 2026.), bez kapice na iznos; stara rola `EUReForwarder` i router ključ su
  umirovljeni 15. 10. (ADR 0025) — spominjati ih samo povijesno
- dvostruka uplata s istom referencom ponovno se minta u Safe trgovca (samo
  `payment.received`) — ne pisati „intent se ne može platiti dvaput“
- gas za ProjectRouter puni MPT — „gas plaća MPT“ vrijedi samo za uplate bez reference;
  izravni mint je Moneriumov
- krađa Cloudflare ključeva (postmortem 0002) od ADR 0025 više ne znači krađu novca, nego
  lažne obavijesti ili isplatu u pogrešan od vlastitih projekata (ADR 0026)
- Moneriumova suglasnost za javni opis integracije (API ToS §4) nije potrebna (Matija)
- **oba repoa (mpt-landing i pay.domovina.ai) su javna** — i `docs/` ovdje je javno
- ne objavljivati javno sigurnosne rupe iz reviewa (npr. Roles scoping, WAF) — `#status`
  navodi samo ono što je riješeno, plan i ograničenja za korisnika
- punjenje GP kartice = **EURe transfer s korisnikove adrese** (ne top-up iz Revoluta);
  obrnuti smjer GP VISA → Revolut jest besplatni kartični top-up
- `donate.domovina.ai` je **statični QR ulaz** (bez backenda/intenta)

## Usporedba naknada ("Zašto danas" + kalkulator uštede)

Stranica `/why`, usporedba "ista uplata danas" u sidebaru simulacija i
`SavingsCalculator` na `/pricing` (transakcije dnevno × prosječni iznos → kartica / SEPA
nalog / MPT po cjeniku, dnevno/mjesečno/godišnje) koriste tržišne konstante iz `src/lib/market-fees.ts`. **SSOT za te stope**
je analiza isplativosti: lom.ff.hr/dokumenti/isplativost (vendorirana u
`~/git/ss/ss-novcanik-prototip/docs/compliance/isplativost-wallet.md`): kartica =
Stripe EEA 1,5% + 0,25 € (srpanj 2026.), SEPA = fiksni nalog HR banaka 0,25–0,45 €
(plaća pošiljatelj, tj. kupac). Kartičnu naknadu plaća trgovac — tablica u `/why` zato ima
stupac „tko plaća koliko". Ne izmišljati druge stope; kalkulator je uvijek označen kao
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

**Primarni CTA (od 2026-10-10) je „Zatraži integraciju"** — `mailto:ms@mpt.hr` s
predloškom (organizacija, platforma, mjesečni promet, Monerium račun), isti u navu, heru,
planovima i CTA traci (`requestHref()` u dictionaries). B2B best practice je jedan
dosljedan sales CTA; bez booking alata/forme mailto s predloškom je najmanje trenja.
Telegram grupa `t.me/mpt_hr` je sekundarna (pitanja i zajednica). Grupa se provisionira iz
`~/git/domovinatv/novcanik-comms/provision` (`create-group.ts --public mpt_hr --no-bot
--skip-d1` — MTProto, traži jednokratni `npm run login`). airkuna.com ima isti obrazac
s `t.me/airkuna_com`.

## Lokalna provjera u pregledniku

`npm run preview` služi na 8787 — u pregledniku otvaraj **`http://127.0.0.1:8787`**, ne
`localhost:8787` (na localhost originu visi service worker drugog projekta, Crošulja, i
prikazuje njegovu stranicu). Nakon novog builda dodaj `?v=N` jer preglednik kešira.

## Otvoreno / TODO

- kasnije: forma ili booking (Cal.com) umjesto mailto za „Zatraži integraciju"
- javna API dokumentacija (quickstart, intent API, webhook eventi) → onda CTA „Pogledaj
  docs" kao RevenueCat; dotad integracija = consulting
- stranice uvjeta korištenja i privatnosti (prije prvog vanjskog tenanta) — plan i
  poznate činjenice u `docs/legal-pages-brief.md`, radi se u zasebnoj sesiji
- iz analize `docs/2026-10-10-landing-gap-analysis.md` otvoreno: branded `not-found`
  stranica (danas generička Nextova na engleskom), mjerenje konverzije CTA-a (bez kolačića),
  backend rupe iz sekcije D (dvostruka/dopunska uplata bez settled eventa, labav istek
  P0-7, refund) — rješavaju se u pay.domovina.ai, pa `/merchants` ažurirati
- `/merchants` opisuje ponašanje backenda na dan 10. 10. 2026. — pri svakoj promjeni
  intent/webhook logike u pay.domovina.ai provjeriti tablicu „što se dogodi kad…“
- ESLint konfiguracija je pokvarena (`npx eslint src` puca na circular config) — niski
  prioritet
- kad prvi vanjski tenant krene s pravim novcem, Shopify prođe prvi test ili GP izađe iz
  pre-pilota → ažurirati `status` u dictionaries + machine
- ideja (13. 11. 2026., nedogovoreno): UBIK božićna kampanja (crypsmas.ubik.hr) po obrascu
  `/support` + `/support/sandbox` — `docs/2026-11-13-ideja-ubik-bozicna-kampanja.md`
- naplata MPT naknade (1% iznad 2.500 €/mj.) nije implementirana u backendu — tehnički
  je danas 0 %, svjesno; rješava se kasnije. Landing svejedno piše 1 % (Matija)
