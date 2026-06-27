import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync } from "node:crypto";

const SECRET = process.env.API_KEY_SECRET ?? "dev-unifyapi-secret-change-me";
export const KEY_PREFIX = "uak_live";

export type GeneratedKey = {
  plaintext: string;
  prefix: string;
  last4: string;
  hashedKey: string;
};

/** Deterministic HMAC so we can look a key up by its hash. */
export function hashKey(plaintext: string): string {
  return createHmac("sha256", SECRET).update(plaintext).digest("hex");
}

const encKey = scryptSync(SECRET, "unifyapi-enc-salt", 32);

export function encryptKey(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encKey, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptKey(encoded: string): string {
  const buf = Buffer.from(encoded, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", encKey, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final("utf8");
}

export function generateApiKey(): GeneratedKey {
  const random = randomBytes(24).toString("base64url");
  const plaintext = `${KEY_PREFIX}_${random}`;
  return {
    plaintext,
    prefix: KEY_PREFIX,
    last4: plaintext.slice(-4),
    hashedKey: hashKey(plaintext),
  };
}

/** Extract a bearer/x-api-key token from a request, if present. */
export function extractToken(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) return apiKey.trim();
  return null;
}
