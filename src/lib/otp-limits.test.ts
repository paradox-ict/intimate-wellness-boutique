import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_OTP_SENDS_PER_BROWSER_PER_HOUR,
  MAX_OTP_SENDS_PER_EMAIL_PER_HOUR,
  MAX_OTP_VERIFY_TRIES_PER_CODE,
  otpSendAllowed,
  otpVerifyAllowed,
  recordOtpSend,
  recordOtpVerifyFailure,
} from "./otp-limits";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-15T12:00:00Z"));
});
afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe("otpSendAllowed / recordOtpSend", () => {
  it("allows the first sends, then refuses the 6th to the same email", () => {
    for (let i = 0; i < MAX_OTP_SENDS_PER_EMAIL_PER_HOUR; i++) {
      expect(otpSendAllowed("admin@example.com").allowed).toBe(true);
      recordOtpSend("admin@example.com");
    }
    const r = otpSendAllowed("admin@example.com");
    expect(r).toEqual({ allowed: false, reason: "email" });
    // A different email is still fine.
    expect(otpSendAllowed("other@example.com").allowed).toBe(true);
  });

  it("caps total sends from the browser at 10/hour across emails", () => {
    for (let i = 0; i < MAX_OTP_SENDS_PER_BROWSER_PER_HOUR; i++) {
      expect(otpSendAllowed(`user${i}@example.com`).allowed).toBe(true);
      recordOtpSend(`user${i}@example.com`);
    }
    expect(otpSendAllowed("fresh@example.com")).toEqual({
      allowed: false,
      reason: "browser",
    });
  });

  it("is case-insensitive on the email", () => {
    recordOtpSend("Admin@Example.com");
    recordOtpSend("ADMIN@example.com");
    recordOtpSend("admin@EXAMPLE.COM");
    recordOtpSend("admin@example.com");
    recordOtpSend("admin@example.com");
    expect(otpSendAllowed("AdMiN@example.com").allowed).toBe(false);
  });

  it("old sends fall out of the window after an hour", () => {
    for (let i = 0; i < MAX_OTP_SENDS_PER_EMAIL_PER_HOUR; i++) recordOtpSend("a@example.com");
    expect(otpSendAllowed("a@example.com").allowed).toBe(false);
    vi.advanceTimersByTime(60 * 60 * 1000 + 1);
    expect(otpSendAllowed("a@example.com").allowed).toBe(true);
  });
});

describe("otpVerifyAllowed / recordOtpVerifyFailure", () => {
  it("allows 5 wrong tries, then refuses the code", () => {
    for (let i = 0; i < MAX_OTP_VERIFY_TRIES_PER_CODE; i++) {
      expect(otpVerifyAllowed()).toBe(true);
      recordOtpVerifyFailure();
    }
    expect(otpVerifyAllowed()).toBe(false);
  });

  it("a new code resets the wrong-tries counter", () => {
    for (let i = 0; i < MAX_OTP_VERIFY_TRIES_PER_CODE; i++) recordOtpVerifyFailure();
    expect(otpVerifyAllowed()).toBe(false);
    recordOtpSend("admin@example.com");
    expect(otpVerifyAllowed()).toBe(true);
  });
});
