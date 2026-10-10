# Brief: stranice uvjeta korištenja i privatnosti za mpt.hr

> **Status: plan, za zasebnu Claude Code sesiju.** Zapisano 10. 10. 2026. nakon
> restrukturiranja mpt.hr na B2B site s cijenama (commit `e74fe79`). Ovaj dokument je
> ulaz za tu sesiju — pročitaj ga cijelog, pa CLAUDE.md, pa kreni.

## Cilj

Dodati na mpt.hr dvije stranice, na oba jezika, prije nego što se uključi prvi vanjski
tenant (`MULTI_TENANT_RAIL=1`):

| Ruta | Sadržaj |
|---|---|
| `/{hr,en}/privacy` | Izjava o privatnosti (GDPR čl. 13) za posjetitelje mpt.hr i za osobe koje se jave za integraciju |
| `/{hr,en}/terms` | Uvjeti korištenja web stranice + okvir uvjeta za tenante hostanog MPT-a |

Linkovi idu u footer (nova kolona „Pravno" ili ispod impresuma) i u `sitemap.ts`.

## Pravila

- **Ne izmišljati pravni tekst ni činjenice.** Svaka tvrdnja mora imati izvor: ovaj
  dokument, kod sitea, pay.domovina.ai repo ili Matijin odgovor. Što nije poznato, ide
  na popis pitanja za Matiju, ne u tekst.
- Tekst je **nacrt za pravni pregled** — to mora pisati u commitu i u dokumentu, a dok
  ga pravnik ne pregleda, stranice nose napomenu „nacrt" ili se ne linkaju iz footera
  (odluka za Matiju).
- Ton je isti kao ostatak sitea: kratko, iskreno, bez sitnih slova. `#status` i footer
  napomena već kažu da MPT **nije licencirana platna usluga** — pravne stranice to ne
  smiju proturječiti.

## Poznate činjenice (provjereno 10. 10. 2026.)

**Voditelj obrade / pružatelj:** ITalk d.o.o. za informacijske tehnologije, IX. Južna
obala 20, 10000 Zagreb · OIB 54872935051 · MBS 081042440 · EUID HRSR.081042440 ·
Trgovački sud u Zagrebu · direktor Matija Stepanić. Kontakt: ms@mpt.hr. Podaci su
doslovno iz footera (`dictionaries.ts` → `footer.imprint`), ne mijenjati.

**Što mpt.hr skuplja (stanje koda):**
- nema kolačića, nema analitike, nema `localStorage` (provjereno: `grep` po `src/` i
  zaglavlja odgovora live sitea — nema `set-cookie` ni Cloudflare Web Analytics beacona)
- nema forme — kontakt je `mailto:ms@mpt.hr` s predloškom (organizacija, platforma,
  mjesečni promet, ima li Monerium račun) → podaci stižu e-poštom u Google Workspace
  (mpt.hr MX = Google)
- hosting: Cloudflare Workers (račun D.O.M.) — Cloudflare kao izvršitelj obrade vidi
  IP adrese i zaglavlja zahtjeva; provjeriti postavke logiranja prije pisanja retencije
- Google Fonts se učitavaju preko `next/font` → **self-hostani** u buildu, ne zove se
  Google pri posjeti (provjeriti u buildu prije nego se to napiše)
- Telegram grupa `t.me/mpt_hr` je vanjska usluga — njezina pravila privatnosti su
  Telegramova

**Što radi hostani MPT (za uvjete za tenante):**
- MPT je non-custodial softver: ne prima ni ne drži novac; novac ide na Monerium IBAN i
  Safe trgovca; forward samo na adrese koje je trgovac odobrio (Zodiac Roles)
- regulirane funkcije (izdavanje e-novca EURe, IBAN, KYC/KYB) obavlja Monerium (EMI /
  MiCA EMT) na vlastitom ugovoru s trgovcem
- cijena: 0 € do 2.500 € mjesečnog prometa, zatim 1%; Enterprise po dogovoru; self-host
  (MIT) 0 € (`src/lib/mpt-pricing.ts`). Naplata u backendu još ne postoji
- izmjerene performanse i ograničenja su javno na `#status` — uvjeti ne smiju obećati
  više od toga (nema SLA-a osim u Enterprise ugovoru)
- podaci koje backend obrađuje o kupcima: ime i IBAN platitelja iz Monerium narudžbe
  (šalju se trgovcu u webhooku — vidi `pay.domovina.ai/backend/src/intents/outbound.ts`,
  `sender`), iznos, referenca. To je obrada **za trgovca** → ITalk je vjerojatno
  izvršitelj obrade (DPA s tenantom) — potvrditi s pravnikom

## Pitanja za Matiju (prije pisanja)

1. Pravnik: tko pregledava i do kada? Objavljujemo li nacrt prije pregleda?
2. Uvjeti za tenante: samo okvir na webu + pojedinačni ugovor, ili puni ToS na webu?
3. Retencija e-pošte s upitima i Cloudflare logova — koliko?
4. Mjerodavno pravo i sud — Zagreb / RH (pretpostavka, potvrditi)?
5. Treba li DPA predložak za tenante već sada ili s prvim tenantom?

## Tehnički koraci

1. `pagePaths` u `src/components/site.tsx` + `dict.pages.privacy|terms` (hr + en)
2. `src/app/[locale]/privacy/page.tsx` i `terms/page.tsx` po uzoru na `why/page.tsx`
   (`PageShell`, `pageMetadata`, `SectionHeading as="h1"`)
3. middleware matcher: dodati `/privacy` i `/terms`
4. footer link; `sitemap.ts` ih pokupi sam iz `pagePaths`
5. `npm test`, `npx tsc --noEmit`, `npm run preview` → provjera na `http://127.0.0.1:8787`
   (desktop 1440 i mobitel 390, bez horizontalnog scrolla), pa `CI=true npm run deploy`
