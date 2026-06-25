// Tiny JSON-Schema-ish validator covering what the tool input schemas use.

type Schema = {
  type?: string;
  required?: string[];
  properties?: Record<string, { type?: string; default?: unknown }>;
};

export function validateInput(
  schema: unknown,
  input: Record<string, unknown>,
): { ok: boolean; errors: string[]; value: Record<string, unknown> } {
  const s = (schema ?? {}) as Schema;
  const errors: string[] = [];
  const value: Record<string, unknown> = { ...input };

  // Apply defaults
  for (const [key, def] of Object.entries(s.properties ?? {})) {
    if (value[key] === undefined && def.default !== undefined) {
      value[key] = def.default;
    }
  }

  // Required
  for (const key of s.required ?? []) {
    if (value[key] === undefined || value[key] === null || value[key] === "") {
      errors.push(`Missing required field: ${key}`);
    }
  }

  // Type checks (loose)
  for (const [key, def] of Object.entries(s.properties ?? {})) {
    if (value[key] === undefined) continue;
    const t = def.type;
    const v = value[key];
    if (t === "number" || t === "integer") {
      const n = typeof v === "string" ? Number(v) : v;
      if (typeof n !== "number" || Number.isNaN(n)) {
        errors.push(`Field ${key} must be a number`);
      } else {
        value[key] = n;
      }
    } else if (t === "string" && typeof v !== "string") {
      errors.push(`Field ${key} must be a string`);
    }
  }

  return { ok: errors.length === 0, errors, value };
}
