import { describe, expect, it } from "vitest";
import {
  BETA_PROJECTS,
  CAMPAIGN_PROD,
  CAMPAIGN_SANDBOX,
  RAIL_SAFE_ADDRESS,
  isPayable,
  isValidSafe,
  weiToCents,
  parseAmountEur,
  PRESET_AMOUNTS_EUR,
  DEFAULT_AMOUNT_EUR,
  type BetaProject,
} from "@/lib/beta-projects";
import { RAIL_ITALK, RAIL_ITALK_SANDBOX } from "@/lib/rail-profile";
import { balanceOfCalldata, decodeAddressArray, decodeUint } from "@/lib/safe-rpc";

const SAFE = "0x6693a7D19486Dc45e9F90Fd2D515d972bBA2d65e" as const;

function project(overrides: Partial<BetaProject>): BetaProject {
  return {
    slug: "test",
    place: "Test",
    campaignId: "test",
    safe: null,
    signers: null,
    goalCents: null,
    payment: null,
    rail: RAIL_ITALK,
    ...overrides,
  };
}

const SIGNERS = {
  owners: [
    "0x1111111111111111111111111111111111111111",
    "0x2222222222222222222222222222222222222222",
    "0x3333333333333333333333333333333333333333",
  ],
  threshold: 2,
} as const satisfies { owners: `0x${string}`[]; threshold: number };

const INTENT = { kind: "mpt-intent" } as const;

describe("beta: tko smije primati uplate (docs/04 §3.3)", () => {
  it("projekt bez Safea nije naplativ", () => {
    expect(isPayable(project({ payment: INTENT }))).toBe(false);
  });
  it("nulta adresa nije Safe — uplata bi bila spaljena", () => {
    expect(isValidSafe("0x0000000000000000000000000000000000000000")).toBe(false);
    expect(isPayable(project({ safe: "0x0000000000000000000000000000000000000000", payment: INTENT }))).toBe(false);
  });
  it("Safe bez načina uplate nije naplativ", () => {
    expect(isPayable(project({ safe: SAFE }))).toBe(false);
  });
  it("Safe bez upisanih potpisnika nije naplativ — nitko ga nije provjerio", () => {
    expect(isPayable(project({ safe: SAFE, payment: INTENT }))).toBe(false);
  });
  it("prag veći od broja potpisnika nije naplativ", () => {
    expect(isPayable(project({ safe: SAFE, payment: INTENT, signers: { owners: [SAFE], threshold: 2 } }))).toBe(false);
  });
  it("Safe + potpisnici + način uplate jest naplativ", () => {
    expect(isPayable(project({ safe: SAFE, signers: SIGNERS, payment: INTENT }))).toBe(true);
  });
});

describe("beta: čitanje Safea s lanca", () => {
  it("dekodira address[] iz getOwners()", () => {
    const hex =
      "0x" +
      "0000000000000000000000000000000000000000000000000000000000000020" +
      "0000000000000000000000000000000000000000000000000000000000000002" +
      "000000000000000000000000AbCdEf0000000000000000000000000000000001" +
      "0000000000000000000000002222222222222222222222222222222222222222";
    expect(decodeAddressArray(hex)).toEqual([
      "0xabcdef0000000000000000000000000000000001",
      "0x2222222222222222222222222222222222222222",
    ]);
  });
  it("dekodira uint iz getThreshold()", () => {
    expect(decodeUint("0x0000000000000000000000000000000000000000000000000000000000000002")).toBe(2);
  });
});

describe("beta: iznos intenta (obavezan u EPC QR-u)", () => {
  it("prihvaća zarez i točku, do dvije decimale", () => {
    expect(parseAmountEur("12,50")).toBe(12.5);
    expect(parseAmountEur("12.5")).toBe(12.5);
    expect(parseAmountEur(" 100 ")).toBe(100);
  });
  it("odbija prazno, nulu, tri decimale, slova i iznos preko maksimuma", () => {
    for (const bad of ["", "0", "0,00", "1,005", "abc", "-5", "10000,01"]) expect(parseAmountEur(bad)).toBeNull();
  });
  it("zadani i ponuđeni iznosi su valjani", () => {
    expect(PRESET_AMOUNTS_EUR).toContain(DEFAULT_AMOUNT_EUR);
    for (const a of PRESET_AMOUNTS_EUR) expect(parseAmountEur(String(a))).toBe(a);
  });
  it("zadani iznos je 1 € — vizija su mikrouplate (8.10.2026.)", () => {
    expect(DEFAULT_AMOUNT_EUR).toBe(1);
  });
});

describe("beta: iznosi s lanca", () => {
  it("1 EURe (18 decimala) je 100 centi", () => {
    expect(weiToCents("1000000000000000000")).toBe(100);
  });
  it("ostatak ispod centa se odbacuje, ne zaokružuje nagore", () => {
    expect(weiToCents("1239999999999999999")).toBe(123);
  });
});

describe("support: kampanja razvoja MPT-a", () => {
  it("jedna kampanja na dva raila: italk (Gnosis) i italk-sandbox (Chiado)", () => {
    expect(BETA_PROJECTS).toEqual([CAMPAIGN_PROD]);
    expect(CAMPAIGN_PROD.campaignId).toBe("mpt-crowdfunding");
    expect(CAMPAIGN_SANDBOX.campaignId).toBe("mpt-crowdfunding");
    expect(CAMPAIGN_PROD.rail).toBe(RAIL_ITALK);
    expect(CAMPAIGN_SANDBOX.rail).toBe(RAIL_ITALK_SANDBOX);
  });
  it("Safe kampanje nikad nije glavni Safe tenanta (tamo stižu uplate bez reference)", () => {
    for (const p of [CAMPAIGN_PROD, CAMPAIGN_SANDBOX]) {
      expect(p.safe?.toLowerCase()).not.toBe(RAIL_SAFE_ADDRESS.toLowerCase());
    }
  });
  it("sandbox Safe je registriran i naplativ; potpisnici 2 od 3", () => {
    expect(isPayable(CAMPAIGN_SANDBOX)).toBe(true);
    expect(CAMPAIGN_SANDBOX.signers?.threshold).toBe(2);
    expect(CAMPAIGN_SANDBOX.signers?.owners).toHaveLength(3);
  });
});

describe("beta: saldo s lanca", () => {
  it("balanceOf calldata: selektor + adresa na 32 bajta, mala slova", () => {
    expect(balanceOfCalldata("0x4f7f1950B2CB6713CcB47b869F30C0ebc01d0173")).toBe(
      "0x70a08231" + "000000000000000000000000" + "4f7f1950b2cb6713ccb47b869f30c0ebc01d0173",
    );
  });
});
