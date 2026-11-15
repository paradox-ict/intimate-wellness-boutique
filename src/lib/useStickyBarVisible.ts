import { useEffect, useState } from "react";

/**
 * Single source of truth for the scroll-triggered sticky buy bar's
 * visibility: hidden at the top of the page, slides in once the visitor
 * has scrolled past 600px, and hides again over the bundles section (where
 * the pack buttons already do the job). The owner likes this behaviour,
 * so keep it: never make the bar permanently fixed.
 *
 * The floating WhatsApp button uses this same hook, so it disappears at
 * exactly the moment the bar appears — the two can never drift out of
 * sync the way two separate scroll thresholds could.
 */
export function useStickyBarVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const bundles = document.getElementById("bundles");
      const r = bundles?.getBoundingClientRect();
      const inBundles = r ? r.top < window.innerHeight && r.bottom > 0 : false;
      setVisible(window.scrollY > 600 && !inBundles);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
