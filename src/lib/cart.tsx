import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartLine = { bundleId: string; quantity: number } | null;

type CartCtx = {
  line: CartLine;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (bundleId: string, quantity?: number) => void;
  /** Set the bag to one of this bundle WITHOUT opening the drawer (Buy Now). */
  buy: (bundleId: string) => void;
  setQuantity: (q: number) => void;
  setBundle: (bundleId: string) => void;
  clear: () => void;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sukoon-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [line, setLine] = useState<CartLine>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLine(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((l: CartLine) => {
    setLine(l);
    try {
      if (l) localStorage.setItem(KEY, JSON.stringify(l));
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<CartCtx>(
    () => ({
      line,
      open,
      setOpen,
      add: (bundleId, quantity = 1) => {
        persist({ bundleId, quantity: Math.min(10, Math.max(1, quantity)) });
        setOpen(true);
      },
      buy: (bundleId) => {
        persist({ bundleId, quantity: 1 });
      },
      setQuantity: (q) => line && persist({ ...line, quantity: Math.min(10, Math.max(1, q)) }),
      setBundle: (bundleId) => persist({ bundleId, quantity: line?.quantity ?? 1 }),
      clear: () => persist(null),
      count: line?.quantity ?? 0,
    }),
    [line, open, persist],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
