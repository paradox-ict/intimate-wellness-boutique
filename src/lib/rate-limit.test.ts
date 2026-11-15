import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hitRateLimit, resetRateLimits } from "./rate-limit";

beforeEach(() => {
  resetRateLimits();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  resetRateLimits();
});

describe("hitRateLimit", () => {
  it("allows up to the limit, then refuses", () => {
    expect(hitRateLimit("k", 3, 60_000)).toBe(false);
    expect(hitRateLimit("k", 3, 60_000)).toBe(false);
    expect(hitRateLimit("k", 3, 60_000)).toBe(false);
    expect(hitRateLimit("k", 3, 60_000)).toBe(true);
    expect(hitRateLimit("k", 3, 60_000)).toBe(true);
  });

  it("keys are independent", () => {
    expect(hitRateLimit("a", 1, 60_000)).toBe(false);
    expect(hitRateLimit("a", 1, 60_000)).toBe(true);
    expect(hitRateLimit("b", 1, 60_000)).toBe(false);
  });

  it("resets after the window passes", () => {
    expect(hitRateLimit("k", 1, 60_000)).toBe(false);
    expect(hitRateLimit("k", 1, 60_000)).toBe(true);
    vi.advanceTimersByTime(60_001);
    expect(hitRateLimit("k", 1, 60_000)).toBe(false);
  });

  it("never throttles an empty key", () => {
    for (let i = 0; i < 10; i++) expect(hitRateLimit("", 1, 60_000)).toBe(false);
  });
});
