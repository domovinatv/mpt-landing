# MPT — dokumentirani tok novca / documented money flow

Izvor istine za graf i prijelaze je [`src/lib/mpt-machine.ts`](../src/lib/mpt-machine.ts) —
iz njega se generiraju React Flow vizualizacija, simulacije na landingu i vitest testovi.
Ovaj dokument je Mermaid preslika istog modela.

## Usmjereni graf toka novca

```mermaid
flowchart TD
    hrBank["🏦 Hrvatska banka<br/>PBZ · ZABA · OTP · Erste · HPB<br/>debitna kartica (Mastercard/VISA), HR IBAN"]
    revolut["Revolut<br/>litavski IBAN"]
    moneriumMpt["Monerium (MPT račun)<br/>estonski IBAN · EMI"]
    safeRelayer["Gnosis Safe multisig relayer<br/>mpt-main-rail · Cloudflare Workers"]
    userAddress["Korisnikova Gnosis adresa<br/>EURe (samoskrbništvo)"]
    otherAddress["Druga onchain adresa<br/>P2P na Gnosis Chainu"]
    merchant["Trgovac / primatelj<br/>pay.domovina.ai · donate.domovina.ai"]
    gnosisPay["Gnosis Pay VISA<br/>virtualna besplatna · fizička opcionalno<br/>opcionalni Monerium IBAN"]
    ownMonerium["Vlastiti Monerium račun<br/>KYC/KYB"]
    euBank["🏦 Europska banka<br/>PBZ/ZABA/OTP/Erste/HPB ili bilo koja EU banka"]

    hrBank -->|"Apple Pay / Google Pay · min 10 € · 0 € (plaća Revolut)"| revolut
    revolut -->|"SEPA Instant · EPC QR · referenca = onchain adresa · min 1 € · 0 € (plaća Revolut)"| moneriumMpt
    moneriumMpt -->|"provjera uplate · mint EURe 1:1"| safeRelayer
    safeRelayer -->|"sponzorirana onchain tx · gas plaća MPT"| userAddress
    userAddress -->|"onchain transferi"| otherAddress
    userAddress -->|"checkout intent · MPT relayer"| merchant
    userAddress -->|"KYC/KYB · redeem EURe"| ownMonerium
    ownMonerium -->|"besplatni SEPA Instant off-ramp · 0 € (plaća Monerium)"| euBank
    revolut -->|"alternativna grana: top-up Gnosis Pay kartice · 0 €"| gnosisPay
    gnosisPay -->|"plaćanje VISA karticom"| merchant
```

## State machine (prijelazi procesa)

```mermaid
stateDiagram-v2
    [*] --> FUNDS_AT_HR_BANK
    FUNDS_AT_HR_BANK --> FUNDS_AT_REVOLUT : cardTopup (min 10 €, plaća Revolut)
    FUNDS_AT_REVOLUT --> FUNDS_AT_REVOLUT : scanEpcQr
    FUNDS_AT_REVOLUT --> FUNDS_AT_REVOLUT : confirmAllowlist
    FUNDS_AT_REVOLUT --> FUNDS_AT_REVOLUT : revolutInternalCheck
    FUNDS_AT_REVOLUT --> FUNDS_AT_MONERIUM_MPT : sepaToMonerium (min 1 €, plaća Revolut, referenca = adresa)
    FUNDS_AT_MONERIUM_MPT --> FUNDS_AT_MONERIUM_MPT : moneriumVerify
    FUNDS_AT_MONERIUM_MPT --> EURE_AT_SAFE_RELAYER : mintEure (1:1)
    EURE_AT_SAFE_RELAYER --> EURE_AT_USER_ADDRESS : relaySponsoredTx (gas plaća MPT)
    EURE_AT_USER_ADDRESS --> EURE_AT_OTHER_ADDRESS : onchainTransfer
    EURE_AT_USER_ADDRESS --> PAID_MERCHANT : payCheckoutIntent
    EURE_AT_USER_ADDRESS --> FUNDS_AT_OWN_MONERIUM : openMoneriumKyc + redeemEure
    FUNDS_AT_OWN_MONERIUM --> FUNDS_AT_EU_BANK : sepaInstantOfframp (besplatan, plaća Monerium)
    FUNDS_AT_EU_BANK --> [*] : krug zatvoren

    FUNDS_AT_REVOLUT --> FUNDS_AT_GNOSISPAY : issueGnosisPayVisa + topupGnosisPayFromRevolut (0 €)
    FUNDS_AT_GNOSISPAY --> PAID_MERCHANT : gnosisPayCardSpend
```

## Guardovi (zaštitni limiti)

| Prijelaz | Limit | Tko plaća naknadu |
|---|---|---|
| `cardTopup` | min 10 € | Revolut (kartična transakcija, marketing) |
| `sepaToMonerium` | min 1 € | Revolut (SEPA Instant) |
| `mintEure` / `redeemEure` | — | Monerium (besplatno, 1:1) |
| `relaySponsoredTx` | — | MPT (sponzorirani gas) |
| `sepaInstantOfframp` | — | Monerium (besplatan SEPA Instant) |
| `issueGnosisPayVisa` | virtualna besplatna | Gnosis Pay |
| `topupGnosisPayFromRevolut` | — | 0 € za korisnika |

**Invarijante** (dokazane u `src/lib/mpt-machine.test.ts`, `npm test`):

1. Korisnik na svakom koraku svakog scenarija plaća **0 €**.
2. Iznosi se čuvaju **1:1** — zbroj svih salda konstantan je kroz cijeli tok (nema curenja).
3. Nijedno saldo nikad ne ide u minus; guardovi odbijaju iznose ispod limita bez pomicanja novca.

## Simulacijski scenariji (N = 6)

1. **On-ramp** — banka → EURe na Gnosis adresi (10 €)
2. **Puni krug** — banka → … → besplatni off-ramp natrag u banku (50 € ode, 50 € se vrati)
3. **Onchain P2P** — višestruki transferi nakon on-rampa
4. **MPT checkout intent** — plaćanje trgovcu (produkcija: pay.domovina.ai, donate.domovina.ai)
5. **Gnosis Pay VISA grana** — besplatna virtualna kartica, top-up iz Revoluta, plaćanje karticom
6. **Guardovi** — odbijanje 9,99 € kartičnog top-upa i 0,50 € SEPA-e, zatim ispravni iznosi prolaze
