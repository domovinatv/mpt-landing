# RevenueDog — MPT razmišljan globalno

> **Status: razmišljanje, ne odluka.** Ništa se ne preimenuje. MPT ostaje MPT (ime, domena
> mpt.hr, prefiks reference `mpt:` u produkcijskom kodu). Ovaj dokument trajno bilježi ideju
> da je MPT, gledan globalno, ono što je u lipanjskom planu nazvano **RevenueDog**, i sve što
> treba odvagnuti prije bilo kakve odluke o imenu ili brendu.
>
> Zapisano 10. 10. 2026. (Matija + Claude), nakon repozicioniranja landinga na
> „orkestrator, ne posrednik".

## 1. Teza u jednoj rečenici

**MPT je onchain ono što je RevenueCat za in-app purchase:** pomoćnik koji vodi poslovnu
logiku naplate (intenti, reference, routing, webhookovi, status uživo), a novac nikad ne
prolazi kroz njega — ide izravno trgovcu, preko trgovčevog vlastitog reguliranog računa.

RevenueCat ne drži novac developera (Apple/Google isplaćuju developeru), nego drži *stanje*
i *DX*. MPT ne drži novac trgovca (Monerium mintira na Safe tenanta, forward ide na
trgovčevu odobrenu adresu), nego drži *stanje* i *DX*. Ista poslovna logika — zato ime
„RevenueDog" (Cat → Dog) ima smisla.

## 2. Odakle ideja (povijest)

| Datum | Što | Gdje |
|---|---|---|
| 11. 5. 2026. | Zauzete GitHub organizacije **`RevenueDog`** i **`RevenueDOGE`** (0 repoa i danas) | github.com/RevenueDog, github.com/RevenueDOGE |
| 26.–27. 6. 2026. | Prva razrada u Claude Code sessionu `novcanik-template`: „RevenueCat je najjači svjetski igrač za IAP… RevenueDog isključivo web3 revenue… ista aplikacija može imati i RevenueCat i RevenueDog SDK… možda forkam RevenueCat repoe" | session u `~/.claude/projects/…novcanik-template` |
| lipanj 2026. | Brief za VC raise, 170 redaka | `/Volumes/DOMOVINA2TB/git/RevenueDog/brief/HANDOFF.md` (lokalni repo, 1 commit `3918dcf`, bez remotea) |
| lipanj 2026. | RevenueDog kao sloj 2 u master strategiji ekosustava | `~/git/domovinatv/ecosystem-brain/_global/STRATEGIJA-WALLET-EKOSUSTAVA.md` §3, §8, §9, §10 |
| listopad 2026. | U pay.domovina.ai nastaje multi-tenant rail (ADR 0017), stray resolver (ADR 0018), detektor krađe (ADR 0019); landing repozicioniran na „RevenueCat za SEPA → EURe" | pay.domovina.ai, ovaj repo |
| 10. 10. 2026. | Matija: „ako smo mi onchain rješenje što je za IAP RevenueCat, ima smisla proizvod globalno nazvati RevenueDog" | ovaj dokument |

Napomena: strategija navodi brief na `~/git/RevenueDog/brief/` — ta putanja više ne postoji,
brief je na vanjskom disku `DOMOVINA2TB`.

## 3. Lipanjski plan ukratko (brief + strategija)

**One-liner:** RevenueDog = RevenueCat za web3. Isti drop-in DX za pretplate, entitlemente i
paywallove, ali namiren na stablecoin/onchain railu umjesto App Store / Google Play / Stripe.

**Tvrde odluke vlasnika (iz briefa):**
1. **Isključivo web3 revenue.** Ne ulazi u web2 IAP; RevenueCat drži Apple/Google/Stripe.
   Nismo konkurent nego dopuna.
2. **Koegzistencija u istoj aplikaciji:** `RevenueCat.configure()` + `RevenueDog.configure()`.
   Zato API zrcali RevenueCat (Offerings / Packages / Entitlements / Paywalls).
3. **Fork-and-extend:** RevenueCat SDK-ovi su MIT (`purchases-ios`, `-android`, `-kmp`,
   `-js`, `react-native-purchases`, `purchases-flutter`, `RevenueCatUI`). Forkamo i mijenjamo
   store/billing sloj onchain slojem. Ime i backend RevenueCata **nisu** forkabilni —
   **backend gradimo sami**.

**Što je stvarno teško onchain (tehnički moat, §4 briefa):**
1. recurring pretplate (session keys / spend permissions, ERC-4337, Safe moduli) — **core IP**
2. entitlement stanje iz onchain eventa + webhookova
3. gas abstrakcija (paymaster)
4. multi-chain / multi-token normalizacija na obračunsku jedinicu (EURe)
5. dunning / churn kad u walletu nema dovoljno
6. refundi, proracija, upgrade/downgrade
7. fiat on/off-ramp most (airKUNA / Monerium)
8. porez / VAT / MiCA
9. self-custody UX (passkey + smart account)

**Četveroslojni ekosustav (strategija §1):**

| Sloj | Brend | Publika | Ton |
|---|---|---|---|
| 1 rail | airKUNA | regulirano, EMI/Monerium | čista regulatorna priča |
| 2 revenue infra | **RevenueDog** | developeri, globalno, dev-led | ozbiljna infra |
| 3 wallet app | novčanik (+ loza klonova) | krajnji korisnici, zajednice | consumer |
| 4 builder | wpb.domovina.ai | ne-developeri | zaseban neutralan brend |

**Brand-zidovi (strategija §8):** RevenueDog i airKUNA su „regulirana/ozbiljna" strana;
**RevenueDOGE** (Cat → Dog → DOGE → doge.gov, viralni launch na X-u) je meme/distribucija i
mora biti odvojen zidom — politički je nabijen i ne smije zamutiti regulatorni narativ.
„Elon primijeti tweet" je upside, ne plan.

**Roadmap (strategija §10):** Q3-2026 recurring-onchain spike · Q4-2026 SDK skeleton (fork
`purchases-js`) + 2–3 design partnera · 2027 VC runda na fundamentalima + RevenueDOGE launch.

**Comps (brief §3):** RevenueCat — $50M Series C (svibanj 2025, Bain Capital Ventures),
ukupno ~$100M, ~$500M post-money, odbijena akvizicija ~$500M. Kategorija dokazana, web3 bok
otvoren.

## 4. Što se promijenilo od lipnja: backend postoji

Brief kaže „backend gradimo sami" i kao postojeći rail navodi samo `pay.domovina.ai/wallet`
(passkey + Safe + Monerium EURe). Od tada je u pay.domovina.ai izgrađeno upravo ono što
RevenueCatov backend radi za IAP — samo za SEPA → EURe:

| RevenueCat (IAP) | MPT danas (pay.domovina.ai) |
|---|---|
| Developer spaja **vlastiti** App Store / Play račun (ključevi po aplikaciji) | Trgovac (tenant) ima **vlastiti** Monerium KYB, IBAN, Safe i payout whitelist (ADR 0017) |
| Apple/Google isplaćuju developeru; RevenueCat ne drži novac | Monerium mintira EURe na Safe tenanta, forward ide na trgovčevu odobrenu adresu; MPT ne drži novac |
| Receipt validacija | Monerium issue order (placed → pending → processed) + onchain potvrda forwarda |
| Purchase / transaction | Checkout intent (pending → paid → expired), > 0 € i ≤ 10.000 €, TTL 15 min |
| Webhookovi developeru | Merchant webhookovi `received` / `paid` / `rejected` / `late`, outbox s 9 pokušaja kroz ~47 h |
| Real-time status u SDK-u | SSE `/api/intents/:sid/stream` — „zaprimljeno" 0 s od placedAt, ~12 s do `paid` |
| Rješavanje „izgubljenih" kupnji (restore) | Stray resolver (ADR 0018): uplata bez reference povezana s intentom po iznosu i vremenu |
| Fraud/abuse zaštita | Fail-closed payout whitelist (ADR 0016), detektor krađe (ADR 0019) |
| Dashboard (MRR, churn) | **nema** |
| Entitlements / Offerings / Paywalls | **nema** |
| Pretplate (auto-renew) | **nema** — samo jednokratni intenti |
| Klijentski SDK-ovi (iOS/Android/web/RN/Flutter) | **nema** — REST API + EPC QR + Shopify (netestiran) |

Zaključak: **MPT je prvi radni komad RevenueDog backenda** — „receipt", transakcijsko stanje,
webhookovi i multi-tenant model. Nedostaju upravo dijelovi koje brief zove core IP i DX.

## 5. Mapiranje na briefov popis „teških problema"

| # (brief §4) | Stanje u MPT-u |
|---|---|
| 1 recurring onchain | ✗ nije započeto (bilo je planirano kao Q3 spike) |
| 2 entitlement stanje | ◐ postoji stanje intenta + webhookovi; entitlement model ne |
| 3 gas abstrakcija | ✓ router EOA plaća gas forwarda; wallet relayer sponzorira P2P |
| 4 multi-chain / multi-token | ✗ samo Gnosis Chain + EURe (namjerno) |
| 5 dunning / churn | ✗ (smisleno tek uz pretplate) |
| 6 refundi / proracija | ✗ SEPA recall nije automatiziran |
| 7 fiat on/off-ramp | ✓ SEPA → EURe (on-ramp) i potpisani redeem (off-ramp), oboje preko Moneriuma |
| 8 porez / VAT / MiCA | ◐ regulirani EURe (Monerium EMI / MiCA EMT); ITalk non-custodial software provider; VAT nije riješen |
| 9 self-custody UX | ◐ passkey + Safe wallet postoji u pay.domovina.ai/wallet |

Važan obrat u odnosu na lipanj: brief je zamišljao **wallet-first** naplatu (korisnik s
walletom, session key, paymaster). MPT je dokazao **bank-first** naplatu — kupac nema
wallet, plaća SEPA-om iz banke, a onchain je samo settlement kod trgovca. To je širi ulaz
(svaki europski kupac s IBAN-om) i jača priča za trgovce, ali je drugačiji proizvod od
„crypto subscriptions SDK-a". RevenueDog bi globalno trebao pokrivati oba ulaza.

## 6. Moguće arhitekture brenda (ništa nije odlučeno)

**A. MPT ostaje kako jest, RevenueDog ostaje zaseban plan** (današnje stanje).
MPT = hrvatski proizvod ITalka za SEPA → EURe naplatu; RevenueDog = budući globalni
developerski brend. Najmanje rizika, ali MPT-ov rad ne gradi RevenueDog priču.

**B. MPT kao modul/protokol unutar RevenueDoga.**
RevenueDog je globalni proizvod („RevenueCat za onchain"); MPT je ime protokola reference
(`mpt:0x…?sid=…`) i prvog modula — bank-to-merchant checkout preko Moneriuma. mpt.hr ostaje
hrvatski ulaz. Slično kao „Stripe" vs „Stripe Checkout" / „ACH". Prefiks `mpt:` ostaje
zauvijek kompatibilan.

**C. Puni rebrand MPT → RevenueDog.**
Najjasnije globalno, ali gubi mpt.hr, postojeću LinkedIn objavu i Telegram `mpt_hr`, i
odmah obećava stvari koje ne postoje (pretplate, SDK-ovi). Ne preporučuje se dok nema barem
recurring spikea.

Ako se ikad ide prema B ili C, landing se mijenja tek uz eksplicitnu odluku — i tada se
ovdje bilježi što je odlučeno.

## 7. Rizici i napetosti

1. **Ime obećava pretplate.** „Revenue…Cat/Dog" developeri čitaju kao subscriptions +
   entitlements + paywall. MPT danas radi jednokratna plaćanja. Globalni brend prije
   recurring spikea = obećanje bez proizvoda.
2. **Trademark.** „RevenueDog" je vrlo blizu „RevenueCat" u istom razredu usluga (softver za
   naplatu). Prije ulaganja u brend: provjera žiga u EUIPO i USPTO (razredi 9, 36, 42) i,
   idealno, mišljenje odvjetnika. Brief to već navodi: nikad ne koristiti ime „RevenueCat"
   u proizvodu, forkati samo MIT kod, pozicionirati komplementarno (RevenueCat = mogući
   partner/akvizitor).
3. **Brand-zidovi.** Landing je danas „ITalk proizvod u airKUNA stilu". Strategija drži
   airKUNA (regulirano), RevenueDog (dev-infra) i RevenueDOGE (meme) odvojeno. Spajanje MPT-a
   s RevenueDogom mora poštovati te zidove — RevenueDOGE nikad ne smije dotaknuti MPT/airKUNA
   regulatornu priču.
4. **Kolizija kratice „mpt".** U strategiji i briefu „mpt" je **creator pilot „mpt (glazba)"**
   (design partner uz Božanstvenu Komediju i Ivu Kraljević), ne Mint Pay Transfer. Pri
   svakoj daljnjoj razradi pisati puno ime.
5. **Monerium-ovisnost.** Danas je jedini rail Monerium (jedan EMI). Globalni RevenueDog po
   briefu je multi-rail / multi-chain; MPT to namjerno nije.
6. **Regulatorna linija.** MPT nije licencirana platna usluga; ITalk je non-custodial
   software provider. Globalni brend s VC rundom ne smije zamutiti tu liniju (npr. ne
   obećavati „mi isplaćujemo trgovcima").

## 8. Otvorena pitanja (za Matiju)

- Je li MPT „prvi modul RevenueDoga" (opcija B), ili RevenueDog ostaje čisto wallet/
  subscriptions SDK priča (opcija A)?
- Koja organizacija vodi launch — `RevenueDog` ili `RevenueDOGE`? (otvoreno i u strategiji §9)
- Je li recurring spike i dalje prvi korak, ili je bank-first checkout dovoljno jak wedge za
  narativ i raise?
- Tko je vlasnik brenda / pravne osobe za globalni proizvod (ITalk d.o.o. ili nova)?
- Trademark provjera — kada i tko?
- Treba li ažurirati brief i strategiju ovim stanjem (MPT kao postojeći backend, tenant
  model, bank-first ulaz)?

## 9. Mogući sljedeći koraci (kad se odluči)

1. Ažurirati `RevenueDog/brief/HANDOFF.md` §5 i §6 — dodati MPT orkestrator kao postojeći
   backend i bank-first ulaz; ispraviti putanju u strategiji.
2. Trademark pretraga (EUIPO / USPTO) za „RevenueDog" i „RevenueDOGE".
3. Recurring spike na Safe modulima (Gnosis + EURe) — jedini način da ime „Revenue…" bude
   pošteno.
4. Tanki web SDK iznad postojećeg intent API-ja (`createIntent` / SSE status / webhook
   verifikacija) u obliku koji zrcali `purchases-js` — prvi opipljivi „RevenueDog" artefakt
   bez ikakvog rebranda MPT-a.

## 10. Izvori

- `~/git/domovinatv/ecosystem-brain/_global/STRATEGIJA-WALLET-EKOSUSTAVA.md` — master
  strategija (slojevi, brand-zidovi, roadmap, otvorena pitanja)
- `/Volumes/DOMOVINA2TB/git/RevenueDog/brief/HANDOFF.md` — RevenueDog brief za VC raise
- `~/git/domovinatv/pay.domovina.ai` — ADR 0016 (payout whitelist), 0017 (multi-tenant
  rail), 0018 (uplate bez reference, rano „zaprimljeno"), 0019 (detektor krađe),
  `docs/monerium-private.md`
- [`docs/flow.md`](flow.md) i [`src/lib/mpt-machine.ts`](../src/lib/mpt-machine.ts) — model
  toka novca na landingu
