// In-memory fixed-window rate limits for the public server functions.
//
// Serverless instances are ephemeral, so this is defense-in-depth, not a
// hard guarantee — a Vercel WAF rate-limit rule is the durable layer. Limits
// are generous so real customers never hit them; an empty key (IP unknown)
// never throttles. Every limiter in the store funnels through hitRateLimit
// so the behaviour — and the tests — live in one place.
const buckets = new Map<string, { count: number; resetAt: number }>();

/** Returns true when the caller has exceeded `limit` calls in `windowMs`. */
export function hitRateLimit(key: string, limit: number, windowMs: number): boolean {
  if (!key) return false;
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  b.count += 1;
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
  }
  return b.count > limit;
}

/** Test-only: clear every bucket. */
export function resetRateLimits(): void {
  buckets.clear();
}
