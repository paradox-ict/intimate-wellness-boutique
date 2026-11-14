//#region node_modules/.nitro/vite/services/ssr/assets/format-Cytqc9Qw.js
function formatPKR(amount) {
	return `Rs ${Math.round(amount).toLocaleString("en-PK")}`;
}
/** Normalises Pakistani mobile numbers to 03XXXXXXXXX. Returns null when invalid. */
function normalizePkPhone(input) {
	let d = input.replace(/\D/g, "");
	if (d.startsWith("0092")) d = d.slice(4);
	if (d.startsWith("92") && d.length === 12) d = d.slice(2);
	if (d.length === 10 && d.startsWith("3")) d = "0" + d;
	return /^03\d{9}$/.test(d) ? d : null;
}
/** Mirrors the server-side pricing in the place_order database function. */
function computeTotals(bundle, quantity, deliveryFee) {
	const subtotal = bundle.price * quantity;
	const delivery = bundle.free_delivery ? 0 : deliveryFee;
	return {
		subtotal,
		delivery,
		total: subtotal + delivery,
		pieces: bundle.pieces * quantity
	};
}
var ORDER_STATUS_LABEL = {
	pending: "Order received",
	confirmed: "Confirmed",
	processing: "Packing discreetly",
	shipped: "On the way",
	delivered: "Delivered",
	cancelled: "Cancelled"
};
var PAYMENT_STATUS_LABEL = {
	not_required: "Pay on delivery",
	pending_verification: "Verifying payment",
	verified: "Payment verified",
	rejected: "Payment rejected"
};
//#endregion
export { normalizePkPhone as a, formatPKR as i, PAYMENT_STATUS_LABEL as n, computeTotals as r, ORDER_STATUS_LABEL as t };
