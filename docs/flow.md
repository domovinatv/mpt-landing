# MPT — dokumentirani tok novca / documented money flow

Izvor istine za graf i prijelaze je [`src/lib/mpt-machine.ts`](../src/lib/mpt-machine.ts) —
iz njega se generiraju React Flow vizualizacija, simulacije na landingu i vitest testovi.
Model je verificiran protiv referentne implementacije i njezine dokumentacije:

- `pay.domovina.ai/docs/monerium-private.md` — Monerium Private API single source of truth
- `pay.domovina.ai/docs/plans/gnosis-pay-cards/` — Gnosis Pay plan integracije (pre-pilot)
- `pay.domovina.ai/backend/` — worker `pay-domovina-backend`: Monerium webhook receiver,
  parser reference (`monerium/sid.ts`), Zodiac forward (`router/safe.ts`), checkout intenti (`intents/`)

Ovaj dokument je Mermaid preslika istog modela.

## Usmjereni graf toka novca

```mermaid
flowchart TD
    bank["🏦 Banka u eurozoni — POČETAK I KRAJ KRUGA<br/>PBZ · ZABA · OTP · Erste · HPB<br/>ili bilo koja banka s IBAN-om u eurozoni · debitna kartica"]
    revolut["Revolut<br/>litavski IBAN"]
    moneriumMpt["Monerium (MPT IBAN)<br/>estonski IBAN · EMI<br/>issue order: placed → pending → processed"]
    safeRelayer["MPT main-rail Safe<br/>2/3 multisig · Moneriumov default wallet<br/>forward: backend worker + Zodiac Roles (EUReForwarder)"]
    userAddress["Korisnikova Gnosis adresa<br/>EURe (samoskrbništvo)"]
    otherAddress["Druga onchain adresa<br/>P2P na Gnosis Chainu"]
    merchant["Trgovac / primatelj<br/>checkout intenti: pending → paid → expired<br/>produkcija: pay.domovina.ai"]
    gnosisPay["Gnosis Pay VISA (GP Safe)<br/>vlastiti GP Safe · Delay + Roles moduli<br/>Sumsub KYC · u pripremi (pre-pilot)"]
    ownMonerium["Vlastiti Monerium račun<br/>KYC/KYB · potpisani redeem"]

    bank -->|"Apple Pay / Google Pay · min 10 € (Revolutov limit) · 0 € (plaća Revolut)"| revolut
    revolut -->|"SEPA Instant · EPC QR · referenca mpt:0x…?sid=… · min 1 € (Revolutov limit) · 0 € (plaća Revolut)"| moneriumMpt
    moneriumMpt -->|"issue order processed · mint EURe 1:1 (~5–15 s)"| safeRelayer
    safeRelayer -->|"Zodiac Roles forward · gas plaća MPT router EOA"| userAddress
    userAddress -->|"onchain transferi (gas sponzoriran)"| otherAddress
    userAddress -->|"checkout intent · paid na onchain potvrdi · max 10.000 €"| merchant
    userAddress -->|"KYC/KYB · potpisani redeem EURe"| ownMonerium
    ownMonerium -->|"besplatni SEPA Instant off-ramp natrag u ISTU banku · 0 € (plaća Monerium)"| bank
    userAddress -->|"punjenje kartice = EURe transfer na GP Safe · 0 €"| gnosisPay
    gnosisPay -->|"VISA autorizacija kroz Roles modul (< 2 s) · clearing 24–48 h"| merchant
    gnosisPay -->|"top-up Revoluta GP VISA karticom · 0 € (plaća Revolut)"| revolut
```

## State machine (prijelazi procesa)

```mermaid
stateDiagram-v2
    [*] --> FUNDS_AT_BANK
    FUNDS_AT_BANK --> FUNDS_AT_REVOLUT : cardTopup (min 10 € Revolut, plaća Revolut)
    FUNDS_AT_REVOLUT --> FUNDS_AT_REVOLUT : scanEpcQr
    FUNDS_AT_REVOLUT --> FUNDS_AT_REVOLUT : confirmAllowlist
    FUNDS_AT_REVOLUT --> FUNDS_AT_REVOLUT : revolutInternalCheck
    FUNDS_AT_REVOLUT --> FUNDS_AT_MONERIUM_MPT : sepaToMonerium (min 1 € Revolut, referenca mpt#colon;0x…?sid=…)
    FUNDS_AT_MONERIUM_MPT --> FUNDS_AT_MONERIUM_MPT : moneriumVerify (issue order placed → pending → processed)
    FUNDS_AT_MONERIUM_MPT --> EURE_AT_MAIN_RAIL_SAFE : mintEure (1:1, na default wallet)
    EURE_AT_MAIN_RAIL_SAFE --> EURE_AT_USER_ADDRESS : relaySponsoredTx (Zodiac Roles, router EOA plaća gas)
    EURE_AT_MAIN_RAIL_SAFE --> EURE_AT_MAIN_RAIL_SAFE : bez adrese u referenci → parkirano
    EURE_AT_USER_ADDRESS --> EURE_AT_OTHER_ADDRESS : onchainTransfer (gas sponzoriran)
    EURE_AT_USER_ADDRESS --> PAID_MERCHANT : payCheckoutIntent (max 10.000 €, paid na onchain potvrdi)
    EURE_AT_USER_ADDRESS --> FUNDS_AT_OWN_MONERIUM : openMoneriumKyc + redeemEure (potpisani nalog)
    FUNDS_AT_OWN_MONERIUM --> FUNDS_AT_BANK : sepaInstantOfframp (besplatan, plaća Monerium — ista banka s koje je krug krenuo)
    FUNDS_AT_BANK --> [*] : krug zatvoren u početnoj točki

    EURE_AT_USER_ADDRESS --> FUNDS_AT_GNOSISPAY : issueGnosisPayVisa + fundGnosisPay (EURe transfer, u pripremi)
    FUNDS_AT_GNOSISPAY --> PAID_MERCHANT : gnosisPayCardSpend (Roles spender, < 2 s)
    FUNDS_AT_GNOSISPAY --> FUNDS_AT_REVOLUT : topupRevolutFromGnosisPay (GP VISA = obična debitna kartica, 0 €)
```

## Guardovi (zaštitni limiti)

| Prijelaz | Limit | Porijeklo | Tko plaća naknadu |
|---|---|---|---|
| `cardTopup` | min 10 € | Revolutovo produktno pravilo | Revolut (kartična transakcija, marketing) |
| `sepaToMonerium` | min 1 € | Revolutovo produktno pravilo | Revolut (SEPA Instant) |
| `payCheckoutIntent` | > 0 € i ≤ 10.000 €, TTL default 15 min | MPT kod (`intents/api.ts`) | — |
| `mintEure` / `redeemEure` | redeem ≥ 15.000 € traži dokument | Monerium | Monerium (besplatno, 1:1) |
| `relaySponsoredTx` | rola smije samo `EURe.transfer`; bez adrese → parkirano na Safeu | MPT kod (Zodiac rola) | MPT (router EOA plaća gas) |
| `onchainTransfer` | 5 besplatnih dnevno po potpisniku | MPT wallet relayer | MPT (sponzorirani gas) |
| `sepaInstantOfframp` | — | — | Monerium (besplatan SEPA Instant) |
| `issueGnosisPayVisa` | virtualna besplatna, max 5; Sumsub KYC obavezan | Gnosis Pay | Gnosis Pay |
| `topupRevolutFromGnosisPay` | min 10 € (kartični top-up) | Revolutovo produktno pravilo | Revolut |
| `gnosisPayCardSpend` | dnevni limit default 350 EURe (1–8000) | Gnosis Pay Roles modul | Gnosis Pay |

**Invarijante** (dokazane u `src/lib/mpt-machine.test.ts`, `npm test`):

1. Korisnik na svakom koraku svakog scenarija plaća **0 €**.
2. Iznosi se čuvaju **1:1** — zbroj svih salda konstantan je kroz cijeli tok (nema curenja).
3. Nijedno saldo nikad ne ide u minus; guardovi (min/max) odbijaju iznose izvan limita bez pomicanja novca.

## Simulacijski scenariji (N = 6)

1. **On-ramp** — banka → EURe na Gnosis adresi (10 €)
2. **Puni krug** — banka → … → potpisani redeem → besplatni off-ramp natrag u banku (50 € ode, 50 € se vrati)
3. **Onchain P2P** — višestruki transferi nakon on-rampa (sponzorirani gas)
4. **MPT checkout intent** — plaćanje trgovcu, `paid` na onchain potvrdi (produkcija: pay.domovina.ai)
5. **Gnosis Pay VISA grana** — virtualna kartica na vlastitom GP Safeu, punjenje EURe transferom, POS plaćanje i besplatni top-up Revoluta karticom — krug se vrti dalje (u pripremi)
6. **Guardovi** — odbijanje 9,99 € top-upa i 0,50 € SEPA-e (Revolutovi limiti); u testovima i odbijanje intenta > 10.000 € (MPT guard)
