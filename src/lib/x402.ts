// Minimal, real-ready x402 (HTTP 402) payment integration.
//
// When X402_PAY_TO is configured the server issues real payment requirements and
// verifies/settles the submitted payment through an x402 facilitator. When it is
// empty the server runs in SIMULATION mode: it accepts a stubbed payment so the
// whole flow can be exercised end-to-end without on-chain settlement.

const PAY_TO = process.env.X402_PAY_TO ?? "";
const NETWORK = process.env.X402_NETWORK ?? "base-sepolia";
const FACILITATOR_URL = (
  process.env.X402_FACILITATOR_URL ?? "https://x402.org/facilitator"
).replace(/\/$/, "");

// USDC contract per network (6 decimals).
const USDC: Record<string, string> = {
  "base-sepolia": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};

export function x402Enabled(): boolean {
  return PAY_TO.length > 0;
}

export type PaymentRequirements = {
  scheme: "exact";
  network: string;
  maxAmountRequired: string; // atomic units (USDC has 6 decimals)
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra: { name: string; version: string };
};

export function usdToAtomic(amountUsd: number): string {
  return BigInt(Math.round(amountUsd * 1_000_000)).toString();
}

export function buildPaymentRequirements(opts: {
  amountUsd: number;
  resource: string;
  description: string;
}): PaymentRequirements {
  return {
    scheme: "exact",
    network: NETWORK,
    maxAmountRequired: usdToAtomic(opts.amountUsd),
    resource: opts.resource,
    description: opts.description,
    mimeType: "application/json",
    payTo: PAY_TO,
    maxTimeoutSeconds: 120,
    asset: USDC[NETWORK] ?? USDC["base-sepolia"],
    extra: { name: "USD Coin", version: "2" },
  };
}

export type SettlementResult = {
  ok: boolean;
  txHash?: string;
  payer?: string;
  network: string;
  scheme: string;
  error?: string;
};

/** Verify and settle a submitted X-PAYMENT header through the facilitator. */
export async function verifyAndSettle(
  xPaymentHeader: string,
  requirements: PaymentRequirements,
): Promise<SettlementResult> {
  // ── Simulation mode ──────────────────────────────────────────────
  if (!x402Enabled()) {
    return {
      ok: true,
      txHash: `sim_${Date.now().toString(16)}`,
      payer: "0xSIMULATED",
      network: NETWORK,
      scheme: "mock",
    };
  }

  let paymentPayload: unknown;
  try {
    paymentPayload = JSON.parse(
      Buffer.from(xPaymentHeader, "base64").toString("utf8"),
    );
  } catch {
    return { ok: false, network: NETWORK, scheme: "x402", error: "Malformed X-PAYMENT header" };
  }

  try {
    const verifyRes = await fetch(`${FACILITATOR_URL}/verify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paymentPayload, paymentRequirements: requirements }),
    });
    const verify = await verifyRes.json();
    if (!verifyRes.ok || verify?.isValid === false) {
      return {
        ok: false,
        network: NETWORK,
        scheme: "x402",
        error: verify?.invalidReason ?? "Payment verification failed",
      };
    }

    const settleRes = await fetch(`${FACILITATOR_URL}/settle`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paymentPayload, paymentRequirements: requirements }),
    });
    const settle = await settleRes.json();
    if (!settleRes.ok || settle?.success === false) {
      return {
        ok: false,
        network: NETWORK,
        scheme: "x402",
        error: settle?.errorReason ?? "Payment settlement failed",
      };
    }

    return {
      ok: true,
      txHash: settle?.transaction ?? settle?.txHash,
      payer: settle?.payer,
      network: settle?.network ?? NETWORK,
      scheme: "x402",
    };
  } catch (e) {
    return {
      ok: false,
      network: NETWORK,
      scheme: "x402",
      error: e instanceof Error ? e.message : "Facilitator unreachable",
    };
  }
}
