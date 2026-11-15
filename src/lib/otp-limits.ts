// Browser-side caps for the admin OTP flow (/auth).
//
// Supabase Auth enforces its own server-side limits on the OTP endpoints
// (see the report: /auth/v1/otp defaults to 360 sends/hour project-wide with
// a 60s per-user cooldown, /auth/v1/verify to 360/hour per IP) — but GoTrue
// has NO per-code attempt counter, so a wrong code can be guessed until the
// per-IP verify bucket runs out. These browser-side caps close that gap for
// a single browser: they stop one browser hammering "resend" or guessing
// codes, and they work even before any network call is made.
//
// They are NOT a substitute for the server-side limits — clearing storage
// resets them. They are a second layer with clearer messages, on top of
// Supabase's limits and the existing 15-minute lockout in auth.tsx.
const SENDS_KEY = "sukoon-otp-sends";
const VERIFY_FAILS_KEY = "sukoon-otp-verify-fails";
const HOUR_MS = 60 * 60 * 1000;

export const MAX_OTP_SENDS_PER_EMAIL_PER_HOUR = 5;
export const MAX_OTP_SENDS_PER_BROWSER_PER_HOUR = 10;
export const MAX_OTP_VERIFY_TRIES_PER_CODE = 5;

// Supabase sends an 8-digit OTP code for this project (verified 2026-11-15:
// the code in the email subject and body is 8 digits long). Accept 6 too,
// defensively, in case Supabase ever sends the shorter form again — the
// field must never silently truncate a real code again.
export function isValidOtpCode(code: string): boolean {
  return /^\d{6}$/.test(code) || /^\d{8}$/.test(code);
}

type SendRecord = { e: string; t: number };

function readSends(): SendRecord[] {
  try {
    const raw = localStorage.getItem(SENDS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as SendRecord[];
    if (!Array.isArray(list)) return [];
    const cutoff = Date.now() - HOUR_MS;
    return list.filter((r) => typeof r.t === "number" && r.t > cutoff);
  } catch {
    return [];
  }
}

/** May this browser ask for another code for this email right now? */
export function otpSendAllowed(email: string): {
  allowed: boolean;
  reason?: "email" | "browser";
} {
  const list = readSends();
  const lower = email.trim().toLowerCase();
  const perEmail = list.filter((r) => r.e === lower).length;
  if (perEmail >= MAX_OTP_SENDS_PER_EMAIL_PER_HOUR) return { allowed: false, reason: "email" };
  if (list.length >= MAX_OTP_SENDS_PER_BROWSER_PER_HOUR) return { allowed: false, reason: "browser" };
  return { allowed: true };
}

/** Record that a code was requested (counts the attempt even if the network
 *  call failed — the attempt is what we're capping). A new code also resets
 *  the wrong-tries counter: fresh code, fresh 5 tries. */
export function recordOtpSend(email: string): void {
  try {
    const list = readSends();
    list.push({ e: email.trim().toLowerCase(), t: Date.now() });
    localStorage.setItem(SENDS_KEY, JSON.stringify(list));
    localStorage.removeItem(VERIFY_FAILS_KEY);
  } catch {
    /* storage unavailable — server-side limits still apply */
  }
}

function readVerifyFails(): number {
  try {
    return Number(localStorage.getItem(VERIFY_FAILS_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

/** May this browser try another code for the CURRENT code? */
export function otpVerifyAllowed(): boolean {
  return readVerifyFails() < MAX_OTP_VERIFY_TRIES_PER_CODE;
}

/** Record a wrong code. After MAX_OTP_VERIFY_TRIES_PER_CODE the current
 *  code is dead in this browser — the user must request a new one. */
export function recordOtpVerifyFailure(): void {
  try {
    localStorage.setItem(VERIFY_FAILS_KEY, String(readVerifyFails() + 1));
  } catch {
    /* ignore */
  }
}

export function resetOtpVerifyFailures(): void {
  try {
    localStorage.removeItem(VERIFY_FAILS_KEY);
  } catch {
    /* ignore */
  }
}
