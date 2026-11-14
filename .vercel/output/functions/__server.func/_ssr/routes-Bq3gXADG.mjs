import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trigger2, i as Root2, n as Header, r as Item, t as Content2, v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as cn, t as Button } from "./button-Ch79ysix.mjs";
import { A as Leaf, B as Clock, F as EyeOff, G as ChevronDown, K as Check, L as Droplets, M as HeartHandshake, N as Hand, O as Lock, P as Flower2, R as Droplet, S as Moon, U as CircleAlert, Y as ArrowRight, a as Truck, c as Sparkles, f as ShieldPlus, n as Wind, p as ShieldCheck, r as Waves, s as Syringe, v as PhoneOff, w as MessageCircleHeart, y as Package } from "../_libs/lucide-react.mjs";
import { i as formatPKR } from "./format-Cytqc9Qw.mjs";
import { a as useCart, r as storefrontQuery } from "./storefront-query-Ccmd-5MA.mjs";
import { n as StoreShell, r as product_pack_default } from "./StoreShell-CI5L34ZR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bq3gXADG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Hero() {
	const { data } = useSuspenseQuery(storefrontQuery);
	const videoRef = (0, import_react.useRef)(null);
	const from = Math.min(...data.bundles.map((b) => b.price));
	(0, import_react.useEffect)(() => {
		const v = videoRef.current;
		if (!v) return;
		let tries = 0;
		const nudge = () => {
			if (v.paused && tries < 6) {
				tries += 1;
				v.play().catch(() => void 0);
			}
		};
		const id = window.setInterval(nudge, 1200);
		const onVis = () => {
			if (!document.hidden) nudge();
		};
		document.addEventListener("visibilitychange", onVis);
		nudge();
		return () => {
			window.clearInterval(id);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative overflow-hidden bg-hero grain",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-8 md:grid-cols-[1.05fr_1fr] md:px-8 md:pb-28 md:pt-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 order-2 md:order-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3.5 w-3.5" }), " Herbal intimate care"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "animate-fade-up mt-6 text-[2.75rem] font-light leading-[1.02] sm:text-6xl lg:text-7xl [animation-delay:120ms]",
						children: [
							"Calm care for",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								className: "text-brand font-normal",
								children: "everyday confidence"
							}),
							" —",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"quietly."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "animate-fade-up mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:240ms]",
						children: "A gentle, herbal tightening gel in a single-use applicator. Cleanses, moisturises and restores comfort — delivered in a plain box no one will question."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:360ms]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "xl",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/product",
								hash: "buy",
								children: ["Shop now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "transition-transform group-hover:translate-x-1" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "line",
							size: "xl",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#how-to-use",
								children: "How it works"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "animate-fade-up mt-10 grid max-w-lg grid-cols-3 gap-3 [animation-delay:480ms]",
						children: [
							{
								icon: Lock,
								label: "Discreet packaging"
							},
							{
								icon: Truck,
								label: "Cash on Delivery"
							},
							{
								icon: ShieldCheck,
								label: "CE · ISO 9001"
							}
						].map(({ icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-start gap-2 rounded-2xl border border-border/70 bg-card/60 p-3 backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium leading-tight",
								children: label
							})]
						}, label))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative order-1 md:order-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-fade-up relative mx-auto aspect-[9/14] w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-soft [animation-delay:200ms] sm:aspect-[9/13] md:aspect-[4/5] md:max-w-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
							ref: videoRef,
							className: "absolute inset-0 h-full w-full object-cover",
							autoPlay: true,
							muted: true,
							loop: true,
							playsInline: true,
							preload: "auto",
							poster: "/videos/hero-video-poster.jpg",
							"aria-label": "Sukoon herbal tightening gel — product film",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
									src: "/videos/hero-video-m.webm",
									type: "video/webm",
									media: "(max-width: 860px)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
									src: "/videos/hero-video-m.mp4",
									type: "video/mp4",
									media: "(max-width: 860px)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
									src: "/videos/hero-video.webm",
									type: "video/webm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
									src: "/videos/hero-video.mp4",
									type: "video/mp4"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(46,20,40,0.08)_76%,rgba(46,20,40,0.40)_100%)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-4 pt-10 text-center md:pb-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold uppercase tracking-[0.24em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65)]",
									children: "Sukoon · Intimate care"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-display text-2xl leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65),0_0_18px_rgba(0,0,0,0.35)] sm:text-[1.7rem]",
									children: "Feel fresh, confident & cared for"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "hero",
									size: "lg",
									className: "mt-3 shadow-glow",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/product",
										hash: "buy",
										children: ["Shop Now — ", Number.isFinite(from) ? formatPKR(from) : "Rs 4,999"]
									})
								})
							]
						})
					]
				})
			})]
		})
	});
}
var ITEMS = [
	"Antibacterial",
	"Cleansing",
	"Moisturising",
	"Tightening",
	"Anti-itching",
	"Odour removal",
	"Lubricating",
	"Herbal formula",
	"CE certified",
	"ISO 9001"
];
function Marquee() {
	const row = [...ITEMS, ...ITEMS];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden border-y border-border/60 bg-card py-5",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-marquee flex w-max gap-10",
			children: row.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-10 font-display text-2xl italic text-foreground/70",
				children: [t, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary-glow" })]
			}, i))
		})
	});
}
function Reveal({ children, className, delay = 0, as: Tag = "div" }) {
	const ref = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				setVisible(true);
				io.disconnect();
			}
		}, {
			threshold: .12,
			rootMargin: "0px 0px -40px 0px"
		});
		io.observe(el);
		return () => io.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		"data-visible": visible,
		className: cn("reveal", className),
		style: { "--reveal-delay": `${delay}ms` },
		children
	});
}
function SectionHeading({ eyebrow, title, intro, align = "center", invert = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
		className: cn("max-w-2xl", align === "center" && "mx-auto text-center"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-xs font-semibold uppercase tracking-[0.22em]", invert ? "text-gold" : "text-primary"),
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: cn("mt-4 text-4xl font-light leading-[1.08] sm:text-5xl", invert && "text-ink-foreground"),
				children: title
			}),
			intro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-5 text-base leading-relaxed", invert ? "text-ink-foreground/70" : "text-muted-foreground"),
				children: intro
			})
		]
	});
}
var BENEFITS = [
	{
		icon: ShieldPlus,
		title: "Antibacterial",
		text: "Herbal actives help keep unwanted bacteria in check."
	},
	{
		icon: Sparkles,
		title: "Cleansing",
		text: "Gently refreshes without disturbing your natural balance."
	},
	{
		icon: Droplets,
		title: "Moisturising",
		text: "Relieves dryness and leaves skin soft and comfortable."
	},
	{
		icon: Flower2,
		title: "Tightening",
		text: "Supports a firmer, toned feeling with regular use."
	},
	{
		icon: HeartHandshake,
		title: "Anti-itching",
		text: "Soothes irritation and everyday discomfort."
	},
	{
		icon: Wind,
		title: "Odour removal",
		text: "Neutralises odour for lasting freshness."
	},
	{
		icon: Waves,
		title: "Lubricating",
		text: "A silky, natural glide that feels like you."
	}
];
function Benefits() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "benefits",
		className: "scroll-mt-24 px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Seven benefits, one gel",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Care that works ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					className: "text-brand",
					children: "gently"
				})] }),
				intro: "Formulated with plant extracts for women who want comfort, freshness and confidence — without harsh chemicals."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
				children: BENEFITS.map(({ icon: Icon, title, text }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 70,
					className: i === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : "",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `group relative h-full overflow-hidden rounded-3xl border border-border/70 bg-card p-5 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft sm:p-6 ${i === 0 ? "bg-brand text-primary-foreground lg:flex lg:flex-col lg:justify-between" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${i === 0 ? "bg-primary-foreground/15" : "bg-secondary text-primary"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: `mt-5 font-display text-xl sm:text-2xl ${i === 0 ? "lg:text-4xl" : ""}`,
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-2 text-sm leading-relaxed ${i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`,
							children: text
						})] })]
					})
				}, title))
			})]
		})
	});
}
var herbal_flatlay_default = "/assets/herbal-flatlay-OFrOax-y.jpg";
var POINTS$1 = [
	"Herbal & natural plant extracts",
	"100% original, sealed pouches",
	"Gentle, non-sticky gel texture",
	"Single-use, pre-filled applicator"
];
function Formula() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-blush px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-[2.5rem] shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: herbal_flatlay_default,
						alt: "Aloe vera, chamomile, rose and sage around a dish of herbal gel",
						width: 1200,
						height: 1200,
						loading: "lazy",
						className: "aspect-square w-full object-cover transition-transform duration-[2s] hover:scale-105"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -bottom-6 right-4 flex gap-3 sm:right-8",
					children: [{
						k: "CE",
						v: "Certified"
					}, {
						k: "ISO",
						v: "9001"
					}].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-24 w-24 place-items-center rounded-full border-4 border-background bg-ink text-center text-ink-foreground shadow-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl leading-none",
							children: c.k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[10px] uppercase tracking-[0.16em] text-gold",
							children: c.v
						})] })
					}, c.k))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sage",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3.5 w-3.5" }), " The formula"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-4 text-4xl font-light leading-[1.08] sm:text-5xl",
					children: ["Rooted in botanicals, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
						className: "text-brand",
						children: "made with care"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-base leading-relaxed text-muted-foreground",
					children: "Our gel blends traditional herbal ingredients into a soft, fast-absorbing formula. Manufactured under CE and ISO 9001 quality standards, every applicator is sealed for hygiene and freshness."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-3",
				children: POINTS$1.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					as: "li",
					delay: i * 90,
					className: "flex items-center gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3.5 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sage text-sage-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: p
					})]
				}, p))
			})] })]
		})
	});
}
var SHOTS = [
	{
		src: product_pack_default,
		alt: "Three gel pouches with applicator and certification badges",
		label: "The pack"
	},
	{
		src: "/assets/product-applicators-C6sm0SxY.jpg",
		alt: "Two pre-filled applicators",
		label: "Applicators"
	},
	{
		src: "/assets/product-diagram-Dpv_683N.jpg",
		alt: "Pouches and applicator",
		label: "Everyday care"
	},
	{
		src: "/assets/product-benefits-CQAbE3FR.jpg",
		alt: "Pouch and applicator close-up",
		label: "Sealed pouch"
	}
];
function Gallery() {
	const [active, setActive] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-5 py-20 md:px-8 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.2fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "relative overflow-hidden rounded-[2.5rem] bg-secondary shadow-soft",
				children: SHOTS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: s.src,
					alt: s.alt,
					loading: "lazy",
					className: cn("aspect-[4/3.4] w-full object-cover transition-all duration-700", i === active ? "relative opacity-100 scale-100" : "absolute inset-0 opacity-0 scale-105")
				}, s.src))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.22em] text-primary",
					children: "Inside the box"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-4 text-4xl font-light leading-[1.08] sm:text-5xl",
					children: [
						"One pouch. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "text-brand",
							children: "One applicator."
						}),
						" Pure comfort."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-muted-foreground",
					children: "Each pouch holds a single pre-filled applicator, so every use is clean, measured and hygienic."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-4 gap-3",
				children: SHOTS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActive(i),
					"aria-label": `Show ${s.label}`,
					className: cn("overflow-hidden rounded-2xl border-2 transition-all duration-300", i === active ? "border-primary shadow-glow" : "border-transparent opacity-70 hover:opacity-100"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.src,
						alt: "",
						loading: "lazy",
						className: "aspect-square w-full object-cover"
					})
				}, s.src))
			})] })]
		})
	});
}
var STEPS = [
	{
		icon: Hand,
		title: "Prepare",
		text: "Wash your hands and gently cleanse the intimate area with warm water. Pat dry."
	},
	{
		icon: Syringe,
		title: "Open the applicator",
		text: "Tear open the pouch, take out the pre-filled applicator and pull off the protective cap."
	},
	{
		icon: Droplet,
		title: "Apply gently",
		text: "Lie back comfortably, insert the applicator tip gently and press the plunger slowly to release all the gel."
	},
	{
		icon: Moon,
		title: "Rest & discard",
		text: "Remove and discard the applicator. Rest for 10–15 minutes. Best used at night before sleep."
	}
];
function HowToUse() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "how-to-use",
		className: "scroll-mt-24 px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "How to use",
					title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Four calm steps, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
						className: "text-brand",
						children: "under a minute"
					})] }),
					intro: "Each applicator is single-use and pre-measured — no mess, no guesswork."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "relative mt-16 grid gap-6 md:grid-cols-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block",
						"aria-hidden": "true"
					}), STEPS.map(({ icon: Icon, title, text }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						as: "li",
						delay: i * 120,
						className: "relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 md:flex-col md:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-border bg-card shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-brand text-[11px] font-bold text-primary-foreground",
									children: i + 1
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl",
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: text
								})]
							})]
						})
					}, title))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-14 grid gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "rounded-3xl border border-border/70 bg-accent p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-accent-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-sans text-sm font-semibold uppercase tracking-[0.14em]",
								children: "How often"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-accent-foreground/90",
							children: "Use one applicator every 2–3 days, or as directed on the leaflet. Most women use a 3–5 pack as one full care cycle."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: 100,
						className: "rounded-3xl border border-border/70 bg-secondary p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-secondary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-sans text-sm font-semibold uppercase tracking-[0.14em]",
								children: "Please note"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-secondary-foreground/90",
							children: "Do not use during menstruation or pregnancy. Avoid intercourse for a few hours after use. Stop if irritation occurs and consult a doctor."
						})]
					})]
				})
			]
		})
	});
}
function Bundles() {
	const { data } = useSuspenseQuery(storefrontQuery);
	const { add } = useCart();
	const featured = data.bundles.find((b) => b.badge)?.id ?? data.bundles[0]?.id;
	const [selected, setSelected] = (0, import_react.useState)(featured);
	const { settings } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "bundles",
		className: "scroll-mt-24 bg-blush px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "Choose your pack",
					title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Save more with a ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
						className: "text-brand",
						children: "full cycle"
					})] }),
					intro: "Every pack ships in plain, unbranded packaging. Pay on delivery or via Easypaisa."
				}),
				settings.low_stock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mx-auto mt-6 w-fit rounded-full bg-warning px-4 py-1.5 text-xs font-semibold text-warning-foreground",
					children: [
						"Only ",
						settings.stock_count,
						" pieces left in stock"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "radiogroup",
					"aria-label": "Pack size",
					className: "mt-12 grid gap-4 md:grid-cols-3",
					children: data.bundles.map((b, i) => {
						const isSel = b.id === selected;
						const perPiece = Math.round(b.price / b.pieces);
						const save = b.compare_at_price ? b.compare_at_price - b.price : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 100,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "radio",
								"aria-checked": isSel,
								onClick: () => setSelected(b.id),
								className: cn("group relative flex h-full w-full flex-col rounded-[2rem] border-2 bg-card p-6 text-left transition-all duration-500 sm:p-7", isSel ? "border-primary shadow-soft md:-translate-y-2" : "border-transparent shadow-card hover:border-primary/30"),
								children: [
									b.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-glow",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
											" ",
											b.badge
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-3xl",
												children: b.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm text-muted-foreground",
												children: b.tagline
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all", isSel ? "border-primary bg-primary text-primary-foreground" : "border-border"),
											children: isSel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex items-end gap-1.5",
										"aria-hidden": "true",
										children: [Array.from({ length: b.pieces }).map((_, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("w-3 rounded-full transition-all duration-500", isSel ? "bg-brand" : "bg-secondary"),
											style: {
												height: `${28 + k % 2 * 8}px`,
												transitionDelay: `${k * 60}ms`
											}
										}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-2 text-sm font-medium text-muted-foreground",
											children: [
												b.pieces,
												" applicator",
												b.pieces > 1 ? "s" : ""
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex items-baseline gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-4xl tabular-nums",
											children: formatPKR(b.price)
										}), b.compare_at_price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted-foreground line-through",
											children: formatPKR(b.compare_at_price)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [formatPKR(perPiece), " per applicator"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex flex-wrap gap-2 text-xs font-medium",
										children: [save > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground",
											children: ["Save ", formatPKR(save)]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1", b.free_delivery ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3" }),
												" ",
												b.free_delivery ? "Free delivery" : `Delivery ${formatPKR(settings.delivery_fee)}`
											]
										})]
									})
								]
							})
						}, b.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "mt-10 flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "hero",
						size: "xl",
						className: "w-full max-w-sm",
						disabled: !selected || !settings.in_stock,
						onClick: () => selected && add(selected),
						children: settings.in_stock ? "Add to bag" : "Out of stock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Cash on Delivery · Easypaisa · 2–4 working days nationwide"
					})]
				})
			]
		})
	});
}
var POINTS = [
	{
		icon: Package,
		title: "Plain, unbranded box",
		text: "No logos, no product name, no pictures. Just a simple sealed parcel."
	},
	{
		icon: EyeOff,
		title: "Neutral sender name",
		text: "The label shows a general wellness store name — nothing that reveals what's inside."
	},
	{
		icon: PhoneOff,
		title: "Respectful courier calls",
		text: "Riders only confirm your address. They never mention the product."
	},
	{
		icon: Lock,
		title: "Your details stay private",
		text: "We use your information only to deliver your order. Never shared, never sold."
	}
];
function Privacy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "privacy",
		className: "relative scroll-mt-24 overflow-hidden bg-ink px-5 py-20 grain md:px-8 md:py-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				invert: true,
				eyebrow: "Discreet by design",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Your privacy is ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					className: "text-gold",
					children: "part of the product"
				})] }),
				intro: "We know this is personal. From checkout to your doorstep, everything is handled with complete confidentiality."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: POINTS.map(({ icon: Icon, title, text }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 100,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-full rounded-3xl border border-ink-foreground/10 bg-ink-foreground/5 p-6 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-gold/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-gold" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-5 font-display text-xl text-ink-foreground",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-ink-foreground/65",
								children: text
							})
						]
					})
				}, title))
			})]
		})]
	});
}
function Reviews() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "reviews",
		className: "scroll-mt-24 px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "What women say",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Reviews from ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					className: "text-brand",
					children: "real buyers"
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mx-auto mt-12 max-w-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[2.5rem] border border-border/70 bg-card p-8 text-center shadow-card sm:p-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircleHeart, { className: "h-7 w-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 font-display text-2xl sm:text-3xl",
							children: "No reviews yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base",
							children: "Every review here will come from a real, verified order — never written by us. As Sukoon orders are delivered, honest words from buyers will appear in this space."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "xl",
							className: "mt-8",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#bundles",
								children: "Be one of the first to try it"
							})
						})
					]
				})
			})]
		})
	});
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var FAQS = [
	{
		q: "Will anyone know what I ordered?",
		a: "No. Your order ships in a plain, unbranded box with a neutral sender name. The product name never appears on the parcel, the courier slip or any SMS."
	},
	{
		q: "How do I use the applicator?",
		a: "Wash your hands, open the pouch, remove the cap, gently insert the tip while lying down and press the plunger slowly. Discard after use and rest for 10–15 minutes. Each applicator is single-use."
	},
	{
		q: "How often should I use it?",
		a: "One applicator every 2–3 days, or as directed on the leaflet. A Trio or Ritual pack covers a complete care cycle."
	},
	{
		q: "Is it safe? What is it made of?",
		a: "It is a herbal, natural formulation manufactured under CE and ISO 9001 quality standards. Do not use during menstruation or pregnancy, and stop if you notice irritation. If you have a medical condition, please consult your doctor first."
	},
	{
		q: "How does Easypaisa payment work?",
		a: "At checkout choose Easypaisa, send the exact total to our Easypaisa account, then enter your transaction ID and/or upload the receipt screenshot. We verify and confirm your order, usually within a few hours."
	},
	{
		q: "Can I pay on delivery?",
		a: "Yes. Cash on Delivery is available all over Pakistan. You pay the rider when your parcel arrives."
	},
	{
		q: "How long does delivery take?",
		a: "Usually 2–4 working days across Pakistan. You can check progress anytime on the Track order page."
	},
	{
		q: "How do I track my order?",
		a: "Use the Track order page with your order number (e.g. SK-1A2B3C) and the mobile number you used at checkout."
	}
];
function Faq() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "faq",
		className: "scroll-mt-24 bg-blush px-5 py-20 md:px-8 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				align: "left",
				eyebrow: "Questions",
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Asked ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
						className: "text-brand",
						children: "quietly"
					}),
					", answered honestly"
				] }),
				intro: "Anything else on your mind? Message us — a woman from our team will reply."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
				type: "single",
				collapsible: true,
				className: "space-y-3",
				children: FAQS.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
					value: `f${i}`,
					className: "rounded-2xl border border-border/70 bg-card px-5 shadow-card data-[state=open]:shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
						className: "py-5 text-left font-display text-lg font-normal hover:no-underline",
						children: f.q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
						className: "pb-5 text-sm leading-relaxed text-muted-foreground",
						children: f.a
					})]
				}, f.q))
			}) })]
		})
	});
}
function FinalCta() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-5 py-20 md:px-8 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
			className: "relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-brand px-6 py-16 text-center text-primary-foreground shadow-glow sm:px-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 shimmer opacity-40",
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-4xl font-light leading-tight sm:text-5xl",
						children: ["Your comfort, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "your secret." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-lg text-primary-foreground/80",
						children: "Order today with Cash on Delivery. Plain packaging, guaranteed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ink",
						size: "xl",
						className: "mt-8",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#bundles",
							children: ["Choose your pack ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					})
				]
			})]
		})
	});
}
function StickyBuyBar() {
	const { data } = useSuspenseQuery(storefrontQuery);
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			const r = document.getElementById("bundles")?.getBoundingClientRect();
			const inBundles = r ? r.top < window.innerHeight && r.bottom > 0 : false;
			setShow(window.scrollY > 600 && !inBundles);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const from = Math.min(...data.bundles.map((b) => b.price));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-x-3 bottom-3 z-30 transition-all duration-500 md:hidden", show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 rounded-full border border-border/60 bg-card/90 py-2 pl-5 pr-2 shadow-soft backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted-foreground",
					children: "Herbal Tightening Gel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold",
					children: ["from ", Number.isFinite(from) ? formatPKR(from) : "—"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "hero",
				size: "lg",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#bundles",
					children: "Order now"
				})
			})]
		})
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marquee, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Benefits, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowToUse, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bundles, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Privacy, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Faq, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyBuyBar, {})
	] });
}
//#endregion
export { Index as component };
