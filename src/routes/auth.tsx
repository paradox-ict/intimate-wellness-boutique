import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/store/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Sukoon" },
      { name: "description", content: "Sign in to manage Sukoon orders, stock and payments." },
      { property: "og:title", content: "Admin Sign In — Sukoon" },
      { property: "og:description", content: "Store admin access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

// Sign-in ONLY. The admin account already exists, so this page deliberately
// offers no self-signup and no Google sign-in: the database makes the FIRST
// account ever created the store admin, and an open signup form could hand
// that role away if the admin user or role row is ever deleted. New admin
// accounts (if ever needed) must be created from the Supabase dashboard, and
// "Allow new users to sign up" should stay disabled there too.

// Client-side sign-in throttle (defense-in-depth: Supabase Auth also
// rate-limits server-side). 5 failed sign-ins lock this browser for 15
// minutes. No server table exists for an email-wide lockout — that needs a
// schema change in the Lovable editor.
const FAIL_KEY = "sukoon-admin-fails";
const LOCK_KEY = "sukoon-admin-lock";
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

function lockRemainingMs(): number {
  try {
    const until = Number(localStorage.getItem(LOCK_KEY) ?? 0);
    return Math.max(0, until - Date.now());
  } catch {
    return 0;
  }
}

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [lockedFor, setLockedFor] = useState(() => lockRemainingMs());

  useEffect(() => {
    if (user) navigate({ to: "/admin" });
  }, [user, navigate]);

  // Count the lock down so the message clears when it expires.
  useEffect(() => {
    if (!lockedFor) return;
    const t = setTimeout(() => setLockedFor(lockRemainingMs()), Math.min(lockedFor, 30_000));
    return () => clearTimeout(t);
  }, [lockedFor]);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockRemainingMs() > 0) {
      setLockedFor(lockRemainingMs());
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      clearFailures();
    } catch (err) {
      recordFailure();
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
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
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Password</Label>
              <Input
                id="pw"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={busy || lockedFor > 0}
            >
              {busy && <Loader2 className="animate-spin" />}
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
