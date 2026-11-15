import { formatPkPhoneDisplay, normalizePkPhone } from "./format";

export type TrackSearchParams = {
  order?: string | undefined;
  id?: string | undefined;
  phone?: string | undefined;
};

export type StoredLastOrder = {
  orderNumber?: string | undefined;
  phone?: string | undefined;
} | null;

/**
 * Decide what the Track page starts with, from the URL params and the last
 * order stored in this tab.
 *
 * - URL wins: ?order= (or ?id=) pre-fills the order number; when ?phone=
 *   is also present and valid, the lookup auto-runs so the customer lands
 *   on their order with no typing and no extra tap.
 * - URL order without a phone: just pre-fill the order, no auto-run.
 * - No URL params at all: fall back to the last order placed in this tab.
 */
export function resolveTrackStart(
  search: TrackSearchParams,
  last: StoredLastOrder,
): { orderNumber: string; phone: string; autoRun: boolean } {
  const searched = search.order ?? search.id;
  if (searched) {
    const normalized = search.phone ? normalizePkPhone(search.phone) : null;
    const phone = normalized
      ? formatPkPhoneDisplay(normalized)
      : search.phone
        ? formatPkPhoneDisplay(search.phone)
        : "";
    return { orderNumber: searched, phone, autoRun: !!normalized };
  }
  if (last?.orderNumber && last.phone) {
    return { orderNumber: last.orderNumber, phone: last.phone, autoRun: true };
  }
  return { orderNumber: "", phone: "", autoRun: false };
}
