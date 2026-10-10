# mpt.hr — objektivna analiza pokrivenosti (10. 10. 2026.)

Stanje landinga: commit `d17c12f`. Stanje backenda: pay.domovina.ai HEAD `5ad31cb`
(10. 10. 2026.), provjereno u kodu i `docs/decisions/`, ne iz sjećanja. Testovi landinga
49/49, `tsc` čist.

> **Ishod (isti dan):** Matijine odluke — (1) Moneriumova suglasnost nije potrebna; (2) danas
> nijedan forward ne ide trećoj strani, ITalk routa samo na vlastite Safeove; multi-tenant radi,
> sandbox tenant `crosulja-staging` spojen 9. 10.; (3) gas za routere tenanata puni MPT;
> (4) A-ispravke provedene; (5) B → nova stranica `/merchants`; (6) scenariji `parked` i
> `underpaid` dodani (machine, testovi, `docs/flow.md`). Iz E: `robots.ts` sa sitemapom, e-mail
> vidljiv uz CTA. Otvoreno: D (backend), `not-found` stranica, mjerenje konverzije.

Tri razine nalaza: **A** tvrdnje koje danas nisu točne ili su rizične, **B** slučajevi koje
trgovac pita, a landing ne odgovara, **C** produktne rupe koje landing mora iskreno
odraziti (ili ih treba riješiti u backendu). Na kraju tehnički dio i odluke.

## A. Netočno ili rizično — popraviti prije bilo čega drugog

| # | Tvrdnja na landingu | Stvarnost (izvor) | Prijedlog |
|---|---|---|---|
| A1 | „Novac nikad ne drži", hero kartica „Tko drži novac: trgovac", „IBAN i Safe pripadaju trgovcu" | `MULTI_TENANT_RAIL=0`: **svaka** živa uplata danas sleti na ITalkov IBAN (LHV EE70…) i ITalkov Safe `0x449a…`, pa se forwarda. Za ITalkove vlastite uplate to je točno, ali ako se forwarda na adrese trećih, ITalk privremeno drži tuđi novac. Interna ToS analiza (`docs/compliance/INTERNO-monerium-tos-analiza.md`) to veže uz Monerium Business ToS §16 | Ciljni model opisati kao ciljni („svaki tenant ima…"), a za danas reći: „u produkciji samo za ITalkove vlastite uplate". Provjeriti postoji li danas ijedan forward na adresu treće strane |
| A2 | „Novac … može završiti samo na adresama trgovca X — provodi se u kodu **i onchain** (Zodiac Roles)" (how.cards, trust) | Tvrdnja je jača od onoga što je za ITalkov Safe danas potvrđeno (status u ADR 0016, pay.domovina.ai) | Opisati samo ono što sigurno vrijedi: fail-closed provjera + rola koja smije samo EURe.transfer |
| A3 | „Isti intent ne može se platiti dvaput" | Druga uplata s istom referencom **forwarda se ponovno**, intent ostaje `paid`, trgovac dobije samo `payment.received` bez settled eventa | Preformulirati: „intent se označi plaćenim samo jednom; svaka dodatna uplata stiže trgovcu i javlja se webhookom" |
| A4 | Hero: „Novac stiže trgovcu za ~12 s" bez ograde | Vrijedi za ponovljene platitelje (medijan 9 s mint). **Prva uplata s novog IBAN-a: 1 min 23 s – 8 h 11 min** (5/5 slučajeva, `docs/research/2026-09-monerium-first-iban-screening.md`). Za trgovca je prvi kupac = svaki novi kupac | U hero kartici dodati „ponovljeni platitelji"; prvu uplatu spomenuti uz hero, ne samo u `#status` |
| A5 | Javni opis Monerium integracije | Monerium API ToS §4 traži **pisanu suglasnost Moneriuma** prije javnog opisivanja integracije (ista interna analiza, bez pravnog mišljenja) | Odluka za Matiju: postoji li suglasnost? Ako ne — rizik je cijeli site, ne pojedina rečenica |
| A6 | `mintEure` u machineu: „MPT main-rail Safe" | Čvor se zove „Safe tenanta" — opis mintanja zaostao iz starog modela | Uskladiti opis (+ `docs/flow.md`) |
| A7 | Webhook lista „received · paid · underpaid · rejected · late" | Postoje i `forward.blocked` i `contribution.sepa` (`intents/outbound.ts`) | Dodati oba; `forward.blocked` je upravo signal za parkirane uplate |
| A8 | „Valjanost zadano 15 min" | Istek je labav: cron označava `expired` tek svakih 6 h; uplata nakon `expires_at` a prije sweepa postaje normalni `paid` (P0-7 čeka odluku) | Na landingu ne mijenjati broj, ali ne obećavati strogi istek; riješiti P0-7 u backendu |
| A9 | Shopify „kod spojen, test predstoji" | Shopify worker **nikad nije deployan** (`database_id` placeholder) | „Shopify aplikacija napisana, još nije puštena" |

## B. Slučajevi koje trgovac pita, a landing ne odgovara

Poredano po tome koliko često ih B2B kupac pita u prvom razgovoru.

1. **Kako dobijem eure na svoj poslovni račun?** Trgovac dobiva EURe na Gnosis adresi.
   Rail ne radi off-ramp; trgovac redeemа sam preko svog Monerium računa. Landing to
   nigdje ne kaže na B2B stranicama (off-ramp postoji samo kao potrošačka priča na
   `/flow`). Za većinu trgovaca to je **prvo** pitanje.
2. **Povrat novca kupcu (refund, reklamacija, otkaz narudžbe).** Nema refund API-ja ni
   stanja. Odgovor je: trgovac ručno vrati s vlastitog računa (SEPA na `sender_iban` iz
   webhooka). Landing šuti. Treba FAQ.
3. **Chargebacki.** SEPA kreditni transfer nema chargeback — to je *prednost* za trgovca
   nasuprot kartici, a landing je ne koristi. Iskreno uz to: SEPA recall nakon forwarda nije
   riješen (već u limitima).
4. **Preplata / manja uplata / dvostruka uplata / zakašnjela uplata.** Backend ih razlikuje
   (`overpaid_cents`, `payment.underpaid`, `payment.late`), ali landing ih spominje samo
   usput. Trgovac treba tablicu „što se dogodi kad…". Posebno: kod manje uplate **novac
   svejedno stigne trgovcu**, ali intent ne postane `paid` — trgovac mora sam odlučiti što
   s narudžbom; uplate se ne zbrajaju.
5. **Što ako MPT padne?** Snažan argument koji fali: novac je na IBAN-u/Safeu trgovca
   (ciljni model), MPT ne može „zaključati" sredstva; webhookovi se repliciraju ~47 h,
   Monerium ponavlja svoje 12 h, cron povlači propuštene narudžbe. Bez SLA-a osim Enterprise.
6. **Onboarding: koliko traje i što mi treba.** Monerium KYB, Safe 2/3, potpis jedne batch
   transakcije (`safe-tx/007`), whitelist, webhook URL, gas za router (≥ 0,05 xDAI). Landing
   kaže samo „nakon KYB-a". Treba korak-po-korak s realnim trajanjem (ne znamo ga — pitanje).
7. **Tko plaća gas za tenanta?** Landing: „gas plaća MPT". Backend: svaki tenant ima
   **vlastiti router EOA koji treba napuniti**. Tko ga puni za hostane tenante?
8. **Računovodstvo, PDV, fiskalizacija.** EURe je e-novac; uplata ide na estonski IBAN.
   Hrvatski trgovac pitat će kako to knjiži i podliježe li fiskalizaciji. Landing ne smije
   davati savjet, ali mora reći „pitajte svog računovođu" i što MPT daje za knjiženje
   (webhook s iznosom, IBAN-om i imenom platitelja; onchain trag). Nema izvoza/izvještaja.
9. **Kupac izvan Hrvatske / izvan eurozone.** Radi iz bilo koje SEPA banke; samo EUR (druga
   valuta → parkirano `unsupported_currency`). Nije rečeno.
10. **Checkout stranica je samo na hrvatskom** (`lang="hr"`), a EN landing to ne kaže.
11. **Merchant dashboard ne postoji** — trgovac vidi samo webhookove i onchain. RC usporedba
    implicira dashboard.
12. **Privatnost podataka kupaca.** Webhook nosi `sender_iban` i `sender_name`; nema
    retencije ni brisanja. ITalk je vjerojatno izvršitelj obrade → DPA. Veže se na
    `legal-pages-brief.md`.
13. **Limiti:** max 10.000 € po intentu (rečeno), max 20 otvorenih intenata po odredištu bez
    `sk_` ključa (nije rečeno), volumni limiti Moneriuma nepoznati (pitanje poslano 28. 9.).

## C. Simulacije i machine — scenariji koji fale

Machine pokriva sretne putove + jedan stray koji uspije. Ne pokriva ništa od onoga što
trgovca zanima kad krene po zlu:

| Scenarij | Ishod u backendu | Novi čvor/prijelaz? |
|---|---|---|
| Stray bez kandidata / s konfliktom → parkirano, operater preusmjeri | `forward.blocked`, Telegram alarm, `/admin/forwards` | samo prijelaz (Safe → Safe, „parkirano") + ručni forward |
| Manja uplata | forward ide, intent ostaje `pending` → `expired`, `payment.underpaid` | samo webhook korak |
| Zakašnjela uplata | forward ide, `payment.late` | — |
| Monerium odbije uplatu | `payment.rejected`, novac vraćen platitelju | povratna veza Monerium → banka |
| Prva uplata s novog IBAN-a | ručni pregled minute–sati | „čekanje" korak s trajanjem |
| Trajni QR za kampanju (`cmp:`) | `contribution.sepa` | — |

Invarijanta „korisnik plaća 0 €" vrijedi i u ovima; dobili bi se testovi za „novac se nikad ne
gubi ni kad nema reference". Testovi danas ne dokazuju ništa o webhookovima/stanjima intenta
— machine modelira samo kretanje novca.

## D. Produktne rupe (backend) — za odluku, ne za landing

Otkriveno čitanjem koda, nigdje dokumentirano:
- dvostruka uplata i dopuna manje uplate ne okidaju settled event → trgovac ne može
  automatski uskladiti narudžbu
- labav istek (A8, P0-7)
- nema refunda, nema reversal webhooka kad forward revertira
- dvije postavke API-ja treba pooštriti prije prvog vanjskog tenanta (detalji u reviewima
  pay.domovina.ai, ne ovdje — repo je javan)
- MPT naknada nije implementirana (poznato)

## E. Tehnički / SEO / konverzija

- `robots.txt` je Cloudflareov managed (samo content-signal komentari) — nema `Sitemap:`
  linije; dodati `app/robots.ts` ili isključiti managed robots u CF
- nema `not-found.tsx` — 404 je generička Nextova stranica na engleskom, bez navigacije
- nema mjerenja konverzije (nula analitike, svjesno) — ne zna se koliko ljudi klikne CTA.
  Opcija bez kolačića: Cloudflare Web Analytics ili brojač klikova na mailto
- mailto bez klijenta e-pošte ne radi ništa — adresa je vidljiva u footeru, ali ne uz gumb
- nema strukturiranih podataka (Organization / Product) — nisko
- EN copy: tip `typeof hr` drži strukturu, ali samo cjenik ima test usklađenosti brojki

## F. Odluke za Matiju

1. **Monerium suglasnost (A5)** — imamo li pisanu suglasnost za javni opis integracije?
2. **A1** — ide li danas ijedan forward na adresu treće strane? Ako da, copy „novac nikad ne
   držimo" treba ograditi odmah.
3. **Gas za hostane tenante (B7)** — puni li ITalk router svakog tenanta (pa „gas plaća MPT"
   ostaje) ili tenant?
4. **Što od B na landing:** prijedlog — nova sekcija/FAQ „Što se dogodi kad…" (refund,
   preplata, manja, dvostruka, zakašnjela, bez reference, MPT padne, eure na račun) na
   `/pricing` FAQ ili nova stranica `/merchants`.
5. **Scenariji C** — dodati barem „parkirano" i „manja uplata" u simulacije?
6. **Backend D** — otvoriti issue za dvostruku/dopunsku uplatu i P0-7?
