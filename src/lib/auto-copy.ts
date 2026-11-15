import { copyText } from "./utils";

/**
 * Copy a value with no tap and no long-press, for the email-link flow
 * (the customer tapped "Track your order" in their email).
 *
 * Tries immediately; if the browser blocks it — a page load from an email
 * link has no user gesture and no focus, and the write happens after an
 * async server round-trip, so there is no transient activation — arms a
 * ONE-TIME listener for the first pointerdown/keydown and retries then.
 * The customer taps the page once anyway to scroll or read, so the value
 * still lands with no long-press and no manual copy tap. The listener
 * removes itself after it fires; the returned cleanup also disarms it
 * (e.g. on unmount or when a new lookup supersedes this one).
 *
 * `onCopied` fires only when the text actually landed in the clipboard.
 * When even the retry is blocked, nothing is shown — the prominent
 * on-page copy button is the fallback.
 */
export function autoCopyWithGestureRetry(
  value: string,
  opts?: {
    copy?: (v: string) => Promise<boolean>;
    onCopied?: () => void;
  },
): () => void {
  const copy = opts?.copy ?? copyText;
  const onCopied = opts?.onCopied;
  let done = false;
  let armed = false;
  let disposed = false;

  const disarm = () => {
    if (!armed) return;
    armed = false;
    window.removeEventListener("pointerdown", onGesture);
    window.removeEventListener("keydown", onGesture);
  };

  const onGesture = async () => {
    // One shot: the listener is gone before the retry runs.
    disarm();
    if (done || disposed) return;
    try {
      if (await copy(value)) {
        done = true;
        onCopied?.();
      }
    } catch {
      /* blocked — the on-page copy button is the fallback */
    }
  };

  const attempt = async () => {
    try {
      if (await copy(value)) {
        done = true;
        onCopied?.();
        return;
      }
    } catch {
      /* fall through to the gesture retry */
    }
    if (done || disposed || armed) return;
    armed = true;
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
  };

  void attempt();

  return () => {
    disposed = true;
    disarm();
  };
}
