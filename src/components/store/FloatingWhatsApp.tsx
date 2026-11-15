import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { useStickyBarVisible } from "@/lib/useStickyBarVisible";
import { WhatsAppIcon } from "./WhatsAppIcon";

// Floating WhatsApp buttons (z-30: below the header, the cart drawer and
// all modals, so they never block taps on other controls).
//
// - Mobile: a 56px button that shows as soon as the page loads and
//   disappears at exactly the moment the scroll-triggered sticky bar
//   slides in — both read the same useStickyBarVisible() state.
// - Desktop: a permanent 60px button, always there.
// Hidden on checkout (which has its own fixed Place Order button), admin
// and auth. Admin/auth pages don't use StoreShell at all, so the path
// check is belt-and-braces.
const HIDDEN_PATHS = ["/checkout", "/admin", "/auth"];

export function FloatingWhatsApp() {
  const { pathname } = useLocation();
  const barVisible = useStickyBarVisible();

  if (HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  return (
    <>
      {/* Mobile: visible on load, gone the moment the sticky bar appears. */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener"
        aria-label="Chat with RoseCare on WhatsApp"
        className={cn(
          "fixed bottom-4 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-500 hover:bg-[#1eb856] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] md:hidden",
          barVisible
            ? "pointer-events-none translate-y-4 opacity-0"
            : "translate-y-0 opacity-100",
        )}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      {/* Desktop: permanent, always visible. */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener"
        aria-label="Chat with RoseCare on WhatsApp"
        className="fixed bottom-6 right-6 z-30 hidden h-[60px] w-[60px] place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#1eb856] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] md:grid"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </a>
    </>
  );
}
