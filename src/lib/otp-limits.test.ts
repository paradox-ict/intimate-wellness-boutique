import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isValidOtpCode,
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

describe("isValidOtpCode", () => {
  it("accepts the 8-digit code Supabase actually sends", () => {
    expect(isValidOtpCode("01445824")).toBe(true);
    expect(isValidOtpCode("95970085")).toBe(true);
  });

  it("still accepts a shorter legacy code, defensively", () => {
    expect(isValidOtpCode("123456")).toBe(true);
  });

  it("rejects anything that is not 6 or 8 digits", () => {
    expect(isValidOtpCode("")).toBe(false);
    expect(isValidOtpCode("12345")).toBe(false);
    expect(isValidOtpCode("1234567")).toBe(false);
    expect(isValidOtpCode("123456789")).toBe(false);
    expect(isValidOtpCode("12345a")).toBe(false);
    expect(isValidOtpCode("12345678 ")).toBe(false);
    expect(isValidOtpCode(" 12345678")).toBe(false);
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
