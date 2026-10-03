// Shared helpers so every route handler fails the same way the spec describes.
export function jsonError(status: number, code: string, message: string, details?: unknown) {
  return Response.json({ code, message, details: details ?? null }, { status });
}

export function boolParam(value: string | null) {
  return value === "true" || value === "1";
}

export function intParam(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// These endpoints read SQLite on every request, so nothing here is cacheable.
export const dynamic = "force-dynamic";
