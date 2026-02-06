type Bucket = { count: number; resetAtMs: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true; remaining: number; resetAtMs: number }
  | { ok: false; retryAfterSec: number; resetAtMs: number };

/**
 * Best-effort in-memory rate limiter.
 *
 * Note: on Vercel serverless/edge, memory may not be shared between instances.
 * Still useful to reduce bursts.
 */
export function rateLimit(params: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(params.key);

  if (!b || now >= b.resetAtMs) {
    const resetAtMs = now + params.windowMs;
    buckets.set(params.key, { count: 1, resetAtMs });
    return { ok: true, remaining: params.limit - 1, resetAtMs };
  }

  if (b.count >= params.limit) {
    const retryAfterSec = Math.max(1, Math.ceil((b.resetAtMs - now) / 1000));
    return { ok: false, retryAfterSec, resetAtMs: b.resetAtMs };
  }

  b.count += 1;
  return { ok: true, remaining: params.limit - b.count, resetAtMs: b.resetAtMs };
}

export function getClientIp(req: Request): string {
  // Vercel provides x-forwarded-for.
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}
