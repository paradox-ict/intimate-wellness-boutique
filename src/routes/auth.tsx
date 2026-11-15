import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  isValidOtpCode,
  MAX_OTP_VERIFY_TRIES_PER_CODE,
  otpSendAllowed,
  otpVerifyAllowed,
  recordOtpSend,
  recordOtpVerifyFailure,
} from "@/lib/otp-limits";
import { Logo } from "@/components/store/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — RoseCare" },
      { name: "description", content: "Sign in to manage RoseCare orders, stock and payments." },
      { property: "og:title", content: "Admin Sign In — RoseCare" },
      { property: "og:description", content: "Store admin access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

// Sign-in in TWO steps: email + password FIRST, then an emailed
// one-time code as a second check. There is no self-signup here: the admin
// account already exists, and the database makes the FIRST account ever
// created the store admin, so an open signup could hand that role away if
// the admin user or role row is ever deleted. New admin accounts (if ever
// needed) must be created from the Supabase dashboard, and "Allow new users
// to sign up" should stay disabled there too.
//
// Why the code is 8 digits: Supabase sends an 8-digit OTP code for this
// project (verified 2026-11-15 — the code in the email subject and body is
// 8 digits long). The old 6-box field silently truncated it, so EVERY code
// was rejected as invalid — including codes the owner typed by hand. The
// field now takes 8 digits (6 still accepted, defensively).
//
// How the two steps fit together: the password sign-in proves the email
// belongs to the admin, so a code is ONLY ever sent after a correct
// password for an existing account — no code ever goes to an address that
// doesn't exist. The password session is signed out immediately (it must
// never be the session that reaches /admin); the durable session is the
// one created by verifying the emailed code. A short-lived marker in
// sessionStorage records that the password step passed; without it the
// code step won't verify. The code email itself is sent by Supabase Auth
// (custom SMTP from security@rosecare.store is configured in the Supabase
// dashboard); this page only calls the Auth API, so it also works with
// Supabase's default mail.
//
// Privacy: neither step reveals whether an email has an account — a wrong
// email or password shows the same generic error, and a code is only sent
// after the password checks out.

// Client-side sign-in throttle (defense-in-depth: Supabase Auth also
// rate-limits server-side — /auth/v1/otp defaults to 360 sends/hour
// project-wide with a 60s per-user cooldown, /auth/v1/verify to 360/hour per
// IP — but GoTrue has NO per-code attempt counter, so the per-code cap
// below is the only thing stopping one browser guessing a code). 5 failed
// sign-in attempts (wrong password or wrong code) lock this browser for
// 15 minutes. The per-email and per-browser send caps and the per-code
// verify cap live in src/lib/otp-limits.ts. No server table exists for an
// email-wide lockout — that needs a schema change in the Lovable editor.
const FAIL_KEY = "sukoon-admin-fails";
const LOCK_KEY = "sukoon-admin-lock";
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_S = 60;

function lockRemainingMs(): number {
  try {
    const until = Number(localStorage.getItem(LOCK_KEY) ?? 0);
    return Math.max(0, until - Date.now());
  } catch {
    return 0;
  }
}

// Short-lived proof that the password step passed, in sessionStorage (dies
// with the tab). The code step only verifies while this marker is fresh —
// a code alone, without the password first, never signs anyone in.
const PW_MARKER_KEY = "sukoon-pw-ok";
const PW_MARKER_TTL_MS = 10 * 60 * 1000;

function setPasswordMarker(email: string): void {
  try {
    sessionStorage.setItem(
      PW_MARKER_KEY,
      JSON.stringify({ e: email.trim().toLowerCase(), t: Date.now() }),
    );
  } catch {
    /* storage unavailable — the code step will ask for the password again */
  }
}

function passwordMarkerValid(email: string): boolean {
  try {
    const raw = sessionStorage.getItem(PW_MARKER_KEY);
    if (!raw) return false;
    const m = JSON.parse(raw) as { e: string; t: number };
    return m.e === email.trim().toLowerCase() && Date.now() - m.t < PW_MARKER_TTL_MS;
  } catch {
    return false;
  }
}

function clearPasswordMarker(): void {
  try {
    sessionStorage.removeItem(PW_MARKER_KEY);
  } catch {
    /* ignore */
  }
}

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<"password" | "code">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [lockedFor, setLockedFor] = useState(() => lockRemainingMs());
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    // Only a session created by verifying the emailed code may enter the
    // admin. While the password step is done and the code is still pending
    // (awaitingOtp), never redirect — the password session is signed out
    // immediately and must not reach /admin on its own.
    if (user && !awaitingOtp) navigate({ to: "/admin" });
  }, [user, awaitingOtp, navigate]);

  // Count the lock down so the message clears when it expires.
  useEffect(() => {
    if (!lockedFor) return;
    const t = setTimeout(() => setLockedFor(lockRemainingMs()), Math.min(lockedFor, 30_000));
    return () => clearTimeout(t);
  }, [lockedFor]);

  // Count the resend cooldown down.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const recordFailure = () => {
    try {
      const fails = Number(localStorage.getItem(FAIL_KEY) ?? 0) + 1;
      if (fails >= MAX_FAILS) {
        localStorage.setItem(LOCK_KEY, String(Date.now() + LOCK_MS));
        localStorage.removeItem(FAIL_KEY);
        setLockedFor(LOCK_MS);
      } else {
        localStorage.setItem(FAIL_KEY, String(fails));
      }
    } catch {
      /* storage unavailable — server-side protection still applies */
    }
  };

  const clearFailures = () => {
    try {
      localStorage.removeItem(FAIL_KEY);
      localStorage.removeItem(LOCK_KEY);
    } catch {
      /* ignore */
    }
  };

  const sendCode = async (addr: string): Promise<boolean> => {
    // shouldCreateUser: false — never create an account from this page.
    // The result is intentionally ignored: whether the email exists or not,
    // the UI shows the same "code sent" message (see the header comment).
    const { error } = await supabase.auth.signInWithOtp({
      email: addr,
      options: { shouldCreateUser: false },
    });
    if (error) console.error("[auth] OTP send failed", error.message);
    return !error;
  };

  // Step 1 — email + password. Only after the password checks out is a
  // code sent, so a code never goes to an address that doesn't exist or
  // isn't the admin's. The password session is signed out immediately:
  // the session that eventually reaches /admin is the one created by
  // verifying the emailed code, never the password-only session.
  const onPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockRemainingMs() > 0) {
      setLockedFor(lockRemainingMs());
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }
    // Browser-side send caps (5/hour per email, 10/hour per browser) — the
    // server-side Supabase limits apply on top of these. Checked here, so
    // a capped-out browser never burns a password attempt on a code that
    // can't be sent.
    const allowed = otpSendAllowed(email.trim());
    if (!allowed.allowed) {
      setError(
        allowed.reason === "email"
          ? "Too many codes sent to this email — try again in an hour."
          : "Too many codes sent from this browser — try again in an hour.",
      );
      return;
    }
    setError(null);
    setBusy(true);
    setAwaitingOtp(true);
    try {
      const { error: pwError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (pwError) {
        recordFailure();
        setLockedFor(lockRemainingMs());
        setAwaitingOtp(false);
        setError("Email or password didn't match — check both and try again.");
        setPassword("");
        return;
      }
      // Password is right. Destroy the password-only session at once, mark
      // the step as passed, then send the code.
      await supabase.auth.signOut();
      setPasswordMarker(email.trim());
      setPassword("");
      const sent = await sendCode(email.trim());
      if (!sent) {
        clearPasswordMarker();
        setAwaitingOtp(false);
        setError("Couldn't send the code — check your connection and try again.");
        return;
      }
      recordOtpSend(email.trim());
      setCooldown(RESEND_COOLDOWN_S);
      setCode("");
      setStep("code");
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockRemainingMs() > 0) {
      setLockedFor(lockRemainingMs());
      return;
    }
    // The code step is only reachable after the password step, in this tab,
    // within the last 10 minutes. If the marker is gone, start over.
    if (!passwordMarkerValid(email)) {
      clearPasswordMarker();
      setAwaitingOtp(false);
      setStep("password");
      setCode("");
      setError("That step expired — please sign in with your password again.");
      return;
    }
    // A code dies after 5 wrong tries in this browser — request a new one.
    // (Supabase itself doesn't count wrong tries per code, so this is the
    // only per-code protection; its per-IP verify bucket applies on top.)
    if (!otpVerifyAllowed()) {
      setError(
        `This code has had too many wrong tries — request a new code (max ${MAX_OTP_VERIFY_TRIES_PER_CODE} tries per code).`,
      );
      return;
    }
    if (!isValidOtpCode(code.trim())) {
      setError("Enter the 8-digit code from the email");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email",
      });
      if (error) throw error;
      clearFailures();
      clearPasswordMarker();
      setAwaitingOtp(false);
      // useAuth picks up the new session and redirects to /admin.
      toast.success("Signed in");
    } catch (err) {
      recordFailure();
      recordOtpVerifyFailure();
      setLockedFor(lockRemainingMs());
      console.error("[auth] OTP verify failed", err);
      setError("That code didn't work — check the email and try again.");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0 || busy || lockRemainingMs() > 0) return;
    if (!passwordMarkerValid(email)) {
      clearPasswordMarker();
      setAwaitingOtp(false);
      setStep("password");
      setCode("");
      setError("That step expired — please sign in with your password again.");
      return;
    }
    const allowed = otpSendAllowed(email.trim());
    if (!allowed.allowed) {
      toast.error("Too many codes sent — try again in an hour.");
      return;
    }
    setBusy(true);
    try {
      await sendCode(email.trim());
      recordOtpSend(email.trim());
      setCooldown(RESEND_COOLDOWN_S);
      toast.success("A new code was sent — check your email");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-5 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-7 shadow-card">
          <h1 className="text-3xl font-light">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage orders, stock and payments.
          </p>
          {lockedFor > 0 && (
            <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">
              Too many failed sign-in attempts. Try again in {Math.ceil(lockedFor / 60_000)} minute
              {Math.ceil(lockedFor / 60_000) === 1 ? "" : "s"}.
            </p>
          )}

          {step === "password" ? (
            <form onSubmit={onPassword} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Admin email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Your admin password"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  First your password, then we&apos;ll email you an 8-digit sign-in code.
                </p>
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={busy || lockedFor > 0}
              >
                {busy && <Loader2 className="animate-spin" />}
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={onVerify} className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
                <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  We sent an 8-digit code to <span className="font-medium text-foreground">{email}</span>.
                  It expires in a few minutes — check your inbox (and spam folder).
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="code">8-digit code</Label>
                <div className="flex justify-center pt-1">
                  <InputOTP
                    id="code"
                    maxLength={8}
                    value={code}
                    onChange={(v) => {
                      setCode(v);
                      setError(null);
                    }}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  >
                    <InputOTPGroup className="gap-1">
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-10 w-7 text-sm sm:h-12 sm:w-9 sm:text-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={busy || lockedFor > 0 || !isValidOtpCode(code)}
              >
                {busy && <Loader2 className="animate-spin" />}
                Verify &amp; sign in
              </Button>
              <div className="flex items-center justify-between pt-1 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    clearPasswordMarker();
                    setAwaitingOtp(false);
                    setStep("password");
                    setCode("");
                    setPassword("");
                    setError(null);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Use a different email
                </button>
                <button
                  type="button"
                  onClick={onResend}
                  disabled={cooldown > 0 || busy || lockedFor > 0}
                  className="font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                >
                  {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
