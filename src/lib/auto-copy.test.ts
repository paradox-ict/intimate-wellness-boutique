import { describe, expect, it, vi } from "vitest";
import { autoCopyWithGestureRetry } from "./auto-copy";

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("autoCopyWithGestureRetry", () => {
  it("copies immediately when the browser allows it, and never arms a listener", async () => {
    const copy = vi.fn().mockResolvedValue(true);
    const onCopied = vi.fn();
    autoCopyWithGestureRetry("SK-329257", { copy, onCopied });
    await flush();
    await flush();
    expect(copy).toHaveBeenCalledTimes(1);
    expect(copy).toHaveBeenCalledWith("SK-329257");
    expect(onCopied).toHaveBeenCalledTimes(1);
    // No listener armed: a later tap must not copy again.
    window.dispatchEvent(new Event("pointerdown"));
    await flush();
    expect(copy).toHaveBeenCalledTimes(1);
  });

  it("retries on the first user gesture when the immediate copy is blocked, then disarms", async () => {
    const copy = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    const onCopied = vi.fn();
    autoCopyWithGestureRetry("SK-329257", { copy, onCopied });
    await flush();
    await flush();
    expect(copy).toHaveBeenCalledTimes(1);
    expect(onCopied).not.toHaveBeenCalled();

    // First tap on the page retries the copy and shows the toast.
    window.dispatchEvent(new Event("pointerdown"));
    await flush();
    await flush();
    expect(copy).toHaveBeenCalledTimes(2);
    expect(onCopied).toHaveBeenCalledTimes(1);

    // One shot: a second tap does nothing.
    window.dispatchEvent(new Event("keydown"));
    await flush();
    expect(copy).toHaveBeenCalledTimes(2);
    expect(onCopied).toHaveBeenCalledTimes(1);
  });

  it("a keydown also triggers the one-time retry", async () => {
    const copy = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const onCopied = vi.fn();
    autoCopyWithGestureRetry("SK-329257", { copy, onCopied });
    await flush();
    await flush();
    window.dispatchEvent(new Event("keydown"));
    await flush();
    await flush();
    expect(copy).toHaveBeenCalledTimes(2);
    expect(onCopied).toHaveBeenCalledTimes(1);
  });

  it("a failed retry shows nothing and the listener is still gone", async () => {
    const copy = vi.fn().mockResolvedValue(false);
    const onCopied = vi.fn();
    autoCopyWithGestureRetry("SK-329257", { copy, onCopied });
    await flush();
    await flush();
    window.dispatchEvent(new Event("pointerdown"));
    await flush();
    await flush();
    expect(copy).toHaveBeenCalledTimes(2);
    expect(onCopied).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("pointerdown"));
    await flush();
    expect(copy).toHaveBeenCalledTimes(2);
  });

  it("cleanup disarms the listener before any gesture", async () => {
    const copy = vi.fn().mockResolvedValue(false);
    const onCopied = vi.fn();
    const cleanup = autoCopyWithGestureRetry("SK-329257", { copy, onCopied });
    await flush();
    await flush();
    expect(copy).toHaveBeenCalledTimes(1);
    cleanup();
    window.dispatchEvent(new Event("pointerdown"));
    await flush();
    expect(copy).toHaveBeenCalledTimes(1);
    expect(onCopied).not.toHaveBeenCalled();
  });
});
