# Prva uplata kampanje „Podrži MPT" (10. 11. 2026.)

Prva uplata pravog novca na `mpt.hr/hr/support`: **1,00 €**, tenant `italk`, Gnosis Chain.
Uplata je stigla **bez reference** (Revolut je ispustio opis), pa je prošla cijeli put
„uplata bez reference": mint na glavni Safe → stray resolver → ProjectRouter → Safe kampanje.
To je ujedno prvo produkcijsko prosljeđivanje role ProjectRouter na projekt koji nije energy.

## Ishod

| | |
|---|---|
| Iznos | 1,00 € → 1,00 EURe na Safe kampanje |
| Safe kampanje | `0x022aA53B825054e47e99aa104FbA1E0ce293a47F` (2/3, Safe 1.5.0) |
| Kampanja (D1) | `mpt-crowdfunding-prod`, tenant `italk` |
| Intent | `r1pxxy4jwkt7a3ahcwy9fj9shc` (s potvrdom), kratka referenca `9472`, stanje `paid` |
| Monerium order | `d8ccf027-dce0-11f1-bb58-869760fb87bd`, `issue`, `processed`, opis prazan |
| Mint | [`0x2da976a9…6579`](https://gnosisscan.io/tx/0x2da976a9f16e1466fcb1a85218670b32f3ab88e5334e08ddde641bd6f9916579) blok 49204446, Monerium → glavni Safe `0x449a…` |
| Prosljeđivanje | [`0x69bb1e2c…1efa`](https://gnosisscan.io/tx/0x69bb1e2c33c360cf9bfbce7c1fcb837561af037679b0c10d76fd62de55c31efa) blok 49204448, router `0x79de…` kroz Roles `0x3303…` → Safe kampanje |
| Forward u D1 | `monerium_forwards.id = 230`, `memo_prefix = auto` (resolver), 1 pokušaj, `confirmed` |
| Javni popis | „10. 11. 2026. · M. S. ··5625 · 1,00 €", ukupno 1,00 € |

## Vremenska crta (UTC)

| Vrijeme | Događaj | Od intenta |
|---|---|---|
| 08:28:17 | intent stvoren na mpt.hr (QR prikazan) | 0 s |
| 08:29:29 | Monerium `placedAt` — „zaprimljeno" | 72 s (vrijeme plaćanja u aplikaciji) |
| 08:29:35 | mint 1 EURe na glavni Safe (blok 49204446) | +6 s od placed |
| 08:29:41 | Monerium `processed` | +12 s |
| 08:29:42 | resolver veže order uz intent, forward kreiran | +13 s |
| 08:29:45 | forward potvrđen na lancu (blok 49204448) | +16 s |
| 08:29:46 | intent `paid` | **+17 s od placed** |

Od „zaprimljeno" do EURe na Safeu kampanje: 16 s, iako je uplata izgubila referencu.

## Potvrda o uplati

Za ovu uplatu potvrda **nije izdana**, i to je ispravno ponašanje (kopija energy /beta/,
docs/16 u energy repou): uplata bez reference povezana je samo po iznosu i vremenu, što ne
dokazuje da je platio vlasnik ključa. Stranica `/support/potvrda?sid=…` to piše i kaže da će
se uplata pridružiti potvrdi kad s istog IBAN-a stigne uplata s cijelom referencom u opisu
(naknadno potvrđena). `receipt_leaves` za taj sid je prazan. Provjera PDF-a na
`/support/provjera` zato ostaje za prvu uplatu kojoj referenca stigne (HR banka ili ručni
upis cijelog opisa).

## Što je trebalo da bi prošlo (isti dan)

1. **Gnosis deployer.** „Dodaj projekt" na produkciji je pao na MetaMask s 0 xDAI, jer worker
   nije imao `GNOSIS_DEPLOYER_PRIVATE_KEY`. Postavljen je ključ umirovljenog routera
   `0xd612…54CB` (rola opozvana 15. 10., ADR 0025; ~0,49 xDAI). Ključ je predan kroz
   clipboard skriptom koja ga nije ispisala: provjera adrese, `tools/funding/.env.gnosis`
   (gitignored, 600), `wrangler secret put`, brisanje clipboarda.
2. **`campaign_id` je jedinstven preko tenanata.** `mpt-crowdfunding` je već na
   `italk-sandbox` (`campaign_owned_by_other_tenant`), pa je produkcija
   `mpt-crowdfunding-prod`. Adresa Safea ovisi o saltu `project:<campaign_id>`, zato se
   promijenila (ranije najavljeni `0xd914…8467` nikad nije deployan).
3. **Plan role ProjectRouter** (4 projekta) potpisan 2/3 i izvršen.
4. **Provjera role na setup stranici** je pokazivala „Execution reverted" za sve projekte:
   slala je 1 wei s praznog glavnog Safea, pa je padala u EURe zbog salda. Popravljeno na
   transfer od 0 EURe (pay.domovina.ai #146, ADR 0027 §5); sad 4 projekta prolaze, `dEaD`
   pada u modifieru.

## Otvoreno

- `GET /api/activity/0x022a…` je u trenutku pisanja vraćao `upstream_unavailable`; stranica
  je prikazala uplatu preko rezervnog puta (`/api/payers` + lanac). Pratiti u pay.domovina.ai.
- Prva uplata s referencom → provjera PDF potvrde (`pdftoppm -png`) i `/support/provjera`.
- Stari relayer walleta (`RELAYER_PRIVATE_KEY` u Pages projektu `wallet-domovina`) i dalje
  postoji; odlučiti gasi li se i kamo ide njegov xDAI.
