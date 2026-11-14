import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
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
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        clearFailures();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        if (!data.session) toast.success("Check your email to confirm your account, then sign in.");
      }
    } catch (err) {
      if (mode === "signin") recordFailure();
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-5 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-7 shadow-card">
          <h1 className="text-3xl font-light">
            {mode === "signin" ? "Admin sign in" : "Create admin account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Manage orders, stock and payments."
              : "The first account created becomes the store admin."}
          </p>
          <button
            type="button"
            onClick={google}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-input bg-card text-sm font-medium transition-colors hover:bg-muted"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            Continue with Google
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          {lockedFor > 0 && (
            <p className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">
              Too many failed sign-in attempts. Try again in {Math.ceil(lockedFor / 60_000)} minute
              {Math.ceil(lockedFor / 60_000) === 1 ? "" : "s"}.
            </p>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
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
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
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
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === "signin"
              ? "First time? Create the admin account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
