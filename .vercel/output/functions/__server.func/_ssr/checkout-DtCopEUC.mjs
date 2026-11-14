import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as cn, t as Button } from "./button-Ch79ysix.mjs";
import { G as ChevronDown, J as Banknote, K as Check, O as Lock, a as Truck, j as ImageUp, k as LoaderCircle, l as Smartphone, p as ShieldCheck, t as X, z as Copy } from "../_libs/lucide-react.mjs";
import { a as normalizePkPhone, i as formatPKR, r as computeTotals } from "./format-Cytqc9Qw.mjs";
import { n as Label, t as Input } from "./label-BB4ZlleZ.mjs";
import { t as Textarea } from "./textarea-ChBRLk8q.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as useCart, n as placeOrder, r as storefrontQuery } from "./storefront-query-Ccmd-5MA.mjs";
import { n as StoreShell, r as product_pack_default, t as QuantityStepper } from "./StoreShell-CI5L34ZR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-DtCopEUC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Downscales an image file in the browser and returns base64 JPEG (no data: prefix). */
async function compressImage(file, maxSide = 1600, quality = .82) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
	const w = Math.round(bitmap.width * scale);
	const h = Math.round(bitmap.height * scale);
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	ctx.drawImage(bitmap, 0, 0, w, h);
	const dataUrl = canvas.toDataURL("image/jpeg", quality);
	return {
		base64: dataUrl.split(",")[1] ?? "",
		contentType: "image/jpeg",
		previewUrl: dataUrl
	};
}
var CITIES = [
	"Karachi",
	"Lahore",
	"Islamabad",
	"Rawalpindi",
	"Faisalabad",
	"Multan",
	"Peshawar",
	"Quetta",
	"Hyderabad",
	"Sialkot",
	"Gujranwala",
	"Bahawalpur",
	"Sargodha",
	"Abbottabad"
];
function CheckoutPage() {
	const { data } = useSuspenseQuery(storefrontQuery);
	const { line, setQuantity, setBundle, clear } = useCart();
	const navigate = useNavigate();
	const submit = useServerFn(placeOrder);
	const [form, setForm] = (0, import_react.useState)({
		customerName: "",
		phone: "",
		email: "",
		city: "",
		address: "",
		notes: ""
	});
	const [method, setMethod] = (0, import_react.useState)("cod");
	const [txnId, setTxnId] = (0, import_react.useState)("");
	const [sender, setSender] = (0, import_react.useState)("");
	const [proof, setProof] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [summaryOpen, setSummaryOpen] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const bundle = data.bundles.find((b) => b.id === line?.bundleId) ?? null;
	const qty = line?.quantity ?? 1;
	const totals = bundle ? computeTotals(bundle, qty, data.settings.delivery_fee) : null;
	const set = (k) => (e) => {
		setForm((f) => ({
			...f,
			[k]: e.target.value
		}));
		setErrors((er) => ({
			...er,
			[k]: void 0
		}));
	};
	const onFile = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please choose an image of your receipt");
			return;
		}
		if (file.size > 15728640) {
			toast.error("That image is too large");
			return;
		}
		try {
			const c = await compressImage(file);
			setProof({
				...c,
				name: file.name
			});
			setErrors((er) => ({
				...er,
				payment: void 0
			}));
		} catch {
			toast.error("Couldn't read that image. Try a screenshot instead.");
		}
	};
	const validate = () => {
		const e = {};
		if (form.customerName.trim().length < 2) e.customerName = "Please enter your name";
		if (!normalizePkPhone(form.phone)) e.phone = "Enter a valid mobile number (03XX XXXXXXX)";
		if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email or leave it empty";
		if (form.city.trim().length < 2) e.city = "Please enter your city";
		if (form.address.trim().length < 8) e.address = "Please enter your full address";
		if (method === "easypaisa" && !txnId.trim() && !proof) e.payment = "Add your transaction ID or upload the receipt screenshot";
		return e;
	};
	const onSubmit = async (ev) => {
		ev.preventDefault();
		if (!bundle) return;
		const e = validate();
		setErrors(e);
		if (Object.keys(e).length) {
			toast.error("Please check the highlighted fields");
			document.querySelector("[aria-invalid='true']")?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
			return;
		}
		setSubmitting(true);
		try {
			const res = await submit({ data: {
				bundleId: bundle.id,
				quantity: qty,
				...form,
				paymentMethod: method,
				txnId: method === "easypaisa" ? txnId : "",
				senderNumber: method === "easypaisa" ? sender : "",
				proof: method === "easypaisa" && proof ? {
					base64: proof.base64,
					contentType: proof.contentType
				} : void 0
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			sessionStorage.setItem("sukoon-last-order", JSON.stringify(res));
			clear();
			navigate({ to: "/order-success" });
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong. Please check your details and try again.");
		} finally {
			setSubmitting(false);
		}
	};
	const copy = (v) => {
		navigator.clipboard?.writeText(v.replace(/\s/g, ""));
		toast.success("Copied");
	};
	if (!bundle || !totals) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-md flex-col items-center px-5 py-28 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-light",
				children: "Your bag is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: "Choose a pack to continue to checkout."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid w-full gap-3",
				children: data.bundles.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "line",
					size: "xl",
					className: "justify-between",
					onClick: () => setBundle(b.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						b.name,
						" · ",
						b.pieces,
						" pc"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: formatPKR(b.price)
					})]
				}, b.id))
			})
		]
	}) });
	const summary = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product_pack_default,
					alt: "",
					className: "h-20 w-20 shrink-0 rounded-2xl object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg leading-tight",
							children: "Herbal Tightening Gel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								bundle.name,
								" · ",
								bundle.pieces,
								" applicator",
								bundle.pieces > 1 ? "s" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantityStepper, {
								value: qty,
								onChange: setQuantity
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: data.bundles.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setBundle(b.id),
					className: cn("rounded-xl border px-2 py-2 text-center text-xs transition-all", b.id === bundle.id ? "border-primary bg-secondary/60 font-semibold" : "border-border hover:border-primary/40"),
					children: [b.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-muted-foreground",
						children: formatPKR(b.price)
					})]
				}, b.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "space-y-2 border-t border-border pt-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Subtotal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "tabular-nums",
							children: formatPKR(totals.subtotal)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Delivery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "tabular-nums",
							children: totals.delivery === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-sage",
								children: "Free"
							}) : formatPKR(totals.delivery)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-t border-border pt-3 text-lg font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-display tabular-nums",
							children: formatPKR(totals.total)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded-2xl bg-muted p-4 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-primary" }), "Plain, unbranded packaging"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5 text-primary" }), "2–4 working days nationwide"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), "CE & ISO 9001 certified"]
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-blush",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			noValidate: true,
			className: "mx-auto grid max-w-6xl gap-8 px-5 pb-32 pt-8 md:grid-cols-[1.3fr_1fr] md:px-8 md:pb-20 md:pt-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-fade-up",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "text-sm text-muted-foreground hover:text-foreground",
									children: "← Continue shopping"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 text-4xl font-light sm:text-5xl",
									children: "Checkout"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 flex items-center gap-1.5 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), "Your details are private and used only for delivery."]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-border/70 bg-card shadow-card md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSummaryOpen((v) => !v),
								className: "flex w-full items-center justify-between px-5 py-4",
								"aria-expanded": summaryOpen,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-sm font-medium",
									children: [
										"Order summary",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-4 w-4 transition-transform", summaryOpen && "rotate-180") })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg",
									children: formatPKR(totals.total)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("grid transition-all duration-500", summaryOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-h-0 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-5 pb-5",
										children: summary
									})
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "animate-fade-up rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7 [animation-delay:100ms]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "sr-only",
									children: "Delivery details"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepTitle, {
									n: 1,
									title: "Delivery details"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Full name",
											error: errors.customerName,
											className: "sm:col-span-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												autoComplete: "name",
												value: form.customerName,
												onChange: set("customerName"),
												"aria-invalid": !!errors.customerName,
												placeholder: "e.g. Ayesha Khan",
												className: "h-12 rounded-xl"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Mobile number",
											error: errors.phone,
											hint: "Rider will call this number",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "tel",
												inputMode: "tel",
												autoComplete: "tel",
												value: form.phone,
												onChange: set("phone"),
												"aria-invalid": !!errors.phone,
												placeholder: "03XX XXXXXXX",
												className: "h-12 rounded-xl"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Email (optional)",
											error: errors.email,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "email",
												autoComplete: "email",
												value: form.email,
												onChange: set("email"),
												"aria-invalid": !!errors.email,
												placeholder: "you@example.com",
												className: "h-12 rounded-xl"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
											label: "City",
											error: errors.city,
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												list: "pk-cities",
												autoComplete: "address-level2",
												value: form.city,
												onChange: set("city"),
												"aria-invalid": !!errors.city,
												placeholder: "Start typing your city",
												className: "h-12 rounded-xl"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
												id: "pk-cities",
												children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Full address",
											error: errors.address,
											className: "sm:col-span-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												autoComplete: "street-address",
												value: form.address,
												onChange: set("address"),
												"aria-invalid": !!errors.address,
												placeholder: "House #, street, area, nearby landmark",
												className: "min-h-24 rounded-xl"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Delivery note (optional)",
											className: "sm:col-span-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.notes,
												onChange: set("notes"),
												placeholder: "e.g. Call before delivery",
												className: "h-12 rounded-xl"
											})
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "animate-fade-up rounded-3xl border border-border/70 bg-card p-5 shadow-card sm:p-7 [animation-delay:200ms]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "sr-only",
									children: "Payment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepTitle, {
									n: 2,
									title: "Payment method"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									role: "radiogroup",
									className: "mt-6 grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayOption, {
										active: method === "cod",
										onClick: () => setMethod("cod"),
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-5 w-5" }),
										title: "Cash on Delivery",
										text: "Pay the rider when it arrives"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayOption, {
										active: method === "easypaisa",
										onClick: () => setMethod("easypaisa"),
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5" }),
										title: "Easypaisa",
										text: "Send now, we verify & ship"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("grid transition-all duration-500", method === "easypaisa" ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "min-h-0 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-5 rounded-2xl border border-dashed border-primary/30 bg-secondary/40 p-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
													className: "space-y-2 text-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold",
															children: "1."
														}),
														" Open Easypaisa and send",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-primary",
															children: formatPKR(totals.total)
														}),
														" ",
														"to:"
													] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-2 rounded-2xl bg-card p-4 sm:grid-cols-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground",
														children: "Account number"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => copy(data.settings.easypaisa_number),
														className: "mt-0.5 flex items-center gap-2 font-display text-xl tabular-nums hover:text-primary",
														children: [
															data.settings.easypaisa_number,
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
														]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground",
														children: "Account title"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-0.5 font-medium",
														children: data.settings.easypaisa_account_name
													})] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: "2."
													}), " Enter the transaction ID and/or upload your receipt screenshot:"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-4 sm:grid-cols-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
														label: "Transaction ID (TID)",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: txnId,
															onChange: (e) => {
																setTxnId(e.target.value);
																setErrors((er) => ({
																	...er,
																	payment: void 0
																}));
															},
															"aria-invalid": !!errors.payment,
															placeholder: "e.g. 3456789012",
															className: "h-12 rounded-xl"
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
														label: "Sent from number (optional)",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "tel",
															value: sender,
															onChange: (e) => setSender(e.target.value),
															placeholder: "03XX XXXXXXX",
															className: "h-12 rounded-xl"
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													ref: fileRef,
													type: "file",
													accept: "image/*",
													className: "hidden",
													onChange: (e) => onFile(e.target.files?.[0])
												}),
												proof ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-3 animate-pop",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: proof.previewUrl,
															alt: "Receipt preview",
															className: "h-16 w-16 shrink-0 rounded-xl object-cover"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "min-w-0 flex-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "flex items-center gap-1.5 text-sm font-medium",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-sage" }), "Receipt attached"]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "truncate text-xs text-muted-foreground",
																children: proof.name
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => setProof(null),
															className: "grid h-9 w-9 place-items-center rounded-full hover:bg-secondary",
															"aria-label": "Remove receipt",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
														})
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => fileRef.current?.click(),
													className: "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card px-4 py-6 text-sm transition-all hover:border-primary/50 hover:bg-secondary/40",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUp, { className: "h-6 w-6 text-primary" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium",
															children: "Upload receipt screenshot"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-muted-foreground",
															children: "JPG or PNG · we'll verify it within a few hours"
														})
													]
												}),
												errors.payment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium text-destructive",
													"aria-invalid": "true",
													children: errors.payment
												})
											]
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "hero",
								size: "xl",
								className: "w-full",
								disabled: submitting || !data.settings.in_stock,
								children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Placing order…"] }) : `Place order · ${formatPKR(totals.total)}`
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-28 rounded-3xl border border-border/70 bg-card p-7 shadow-card animate-fade-up [animation-delay:150ms]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-5 text-2xl font-light",
							children: "Order summary"
						}), summary]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur-xl md:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "hero",
						size: "xl",
						className: "w-full",
						disabled: submitting || !data.settings.in_stock,
						children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }), "Placing order…"] }) : `Place order · ${formatPKR(totals.total)}`
					})
				})
			]
		})
	}) });
}
function StepTitle({ n, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl font-light",
			children: title
		})]
	});
}
function Field({ label, error, hint, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-1.5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-sm font-medium",
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium text-destructive",
				children: error
			}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
function PayOption({ active, onClick, icon, title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "radio",
		"aria-checked": active,
		onClick,
		className: cn("flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300", active ? "border-primary bg-secondary/50 shadow-soft" : "border-border hover:border-primary/40"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors", active ? "bg-brand text-primary-foreground" : "bg-muted text-foreground"),
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted-foreground",
					children: text
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border-2", active ? "border-primary bg-primary text-primary-foreground" : "border-border"),
				children: active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
			})
		]
	});
}
//#endregion
export { CheckoutPage as component };
