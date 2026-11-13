# Ideja: UBIK božićna kampanja preko MPT-a (13. 11. 2026.)

Status: **ideja, ništa nije dogovoreno ni napravljeno.** Zapisano da se ne izgubi.

## Što je danas na crypsmas.ubik.hr

Stanje provjereno 13. 11. 2026. Stranica je **prošlogodišnja** humanitarna akcija UBIK-a
(udruga za blockchain i kriptovalute) i piše „do 31.12.2025.”.

- Korisnik: SOS Dječje selo Hrvatska (sanacija klizišta u SOS Zajednici mladih Zagreb).
- Uplata: gumb „DONIRAJ KRIPTO” (u tekstu stranice nema adrese) i UBIK-ov IBAN s opisom
  „Donacija za humanitarnu akciju”.
- Brojke: „cilj: 10000 EUR!” i „cilj: 20000 EUR!” (oba se pojavljuju), prikazano je
  „900 EUR”. Te brojke ručno upisuje netko iz UBIK-a. Ne računaju se iz uplata.

## Ideja

Božićna kampanja u kojoj UBIK prikuplja donacije koje onda daruje drugim inicijativama.
Gradi se po istom obrascu kao energy.domovina.ai `/sandbox/` + `/beta/` i mpt.hr
`/support` + `/support/sandbox`. Dobila bi:

- iznos → QR panel uživo, SEPA uplata s referencom, „zaprimljeno” → „paid” za ~10–20 s;
- prikupljeno i popis uplata koji se računaju iz uplata, a ne upisuju ručno;
- potvrdu o uplati (PDF) i javnu provjeru;
- sandbox par (Monerium sandbox, Chiado) za probu prije pravog novca.

## Gdje bi to živjelo

- **Kod:** kopija `/support` iz ovog repoa, koji je i sam kopija energy `/beta/`
  (commit `d91489c`). Općenita jezgra je `domovinatv/campaign-core`, ali ona još nema
  frontend. `zajedno.domovina.ai` ima samo `docs/` i nije deployan (DNS ne postoji).
- **Rail:** novi tenant ili projekt u `pay.domovina.ai` (admin → „Dodaj projekt”,
  ADR 0027) sa Safeom kampanje. Treba odlučiti je li to UBIK-ov vlastiti Monerium račun
  (UBIK kao tenant, njihov KYB) ili projekt pod postojećim tenantom.
- **Domena:** `crypsmas.ubik.hr` je UBIK-ova. Moguće je da oni preusmjere subdomenu na
  Worker ili da mi hostamo na `*.mpt.hr` i oni linkaju.

## Otvorena pitanja (za UBIK / Filipa)

1. Hoće li UBIK ovo uopće za Božić 2026. i do kada traje akcija?
2. Kojim inicijativama ide novac i tko odlučuje o raspodjeli (Safe 2/3: tko su potpisnici)?
3. Čiji je Monerium račun: UBIK-ov (udruga → KYB, traje) ili privremeno preko ITalk-a
   (onda ITalk prima novac za tuđu humanitarnu akciju, što pravno ne valja bez dogovora)?
4. Copy: kod udruge je ovo prava donacija (ne „podrška razvoju” kao kod ITalk d.o.o.).
5. Ostaje li i kripto uplata izravno na Safe uz SEPA put?

Kontekst UBIK-a: meetup „Petak 13” (13. 11. 2026.), priprema u
`~/git/stepanic/realtime-presentation/docs/2026-11-05-ubik-meetup-najava.md`.
