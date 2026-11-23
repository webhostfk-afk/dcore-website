"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import AskPriceModal, { type PriceRequest } from "./AskPriceModal";
import ModulePopup from "./ModulePopup";
import Toasts, { type ToastItem } from "./Toasts";
import { cartStore, compareStore, type CartItem, type CompareItem } from "@/lib/shop-store";

type Toast = ToastItem;
export type { PriceRequest };

type Shop = {
  cart: CartItem[];
  compare: CompareItem[];
  addToCart: (p: Omit<CartItem, "qty">, qty?: number, quickBuy?: boolean) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  addToCompare: (p: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  wishlist: (p: { name: string; href: string; image: string }) => void;
  askPrice: (p: PriceRequest) => void;
  openPopup: (moduleId: number) => void;
  clearCart: () => void;
};

const Ctx = createContext<Shop | null>(null);
export const useShop = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be used inside <ShopProvider>");
  return c;
};

const HIDE_AFTER = 2000; // the original theme hides its notifications after 2 seconds

export default function ShopProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const compare = useSyncExternalStore(compareStore.subscribe, compareStore.getSnapshot, compareStore.getServerSnapshot);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [price, setPrice] = useState<PriceRequest | null>(null);
  const [popup, setPopup] = useState<number | null>(null);
  const seq = useRef(0);

  const closeToast = useCallback((key: number) => setToasts((t) => t.filter((x) => x.key !== key)), []);
  const notify = useCallback(
    (t: Omit<Toast, "key">) => {
      const key = ++seq.current;
      setToasts((list) => [...list, { ...t, key }]);
      setTimeout(() => closeToast(key), HIDE_AFTER);
    },
    [closeToast],
  );

  const addToCart: Shop["addToCart"] = useCallback(
    (p, qty = 1, quickBuy = false) => {
      // nothing is sold without a price: ask for the price instead
      if (!(p.price > 0)) {
        setPrice({ id: p.id, name: p.name });
        return;
      }
      const items = cartStore.getSnapshot();
      const found = items.find((i) => i.id === p.id);
      cartStore.set(found ? items.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i)) : [...items, { ...p, qty }]);
      if (quickBuy) {
        router.push("/checkout");
        return;
      }
      notify({
        className: "notification-cart",
        image: p.image,
        title: p.name,
        buttons: true,
        message: (
          <>
            Success: You have added <Link href={p.href}>{p.name}</Link> to your <Link href="/cart">shopping cart</Link>!
          </>
        ),
      });
    },
    [notify, router],
  );

  const removeFromCart = useCallback((id: string) => cartStore.set(cartStore.getSnapshot().filter((i) => i.id !== id)), []);
  const setQty = useCallback((id: string, qty: number) => {
    const q = Math.max(1, Math.floor(qty) || 1);
    cartStore.set(cartStore.getSnapshot().map((i) => (i.id === id ? { ...i, qty: q } : i)));
  }, []);
  const clearCart = useCallback(() => cartStore.set([]), []);

  const addToCompare: Shop["addToCompare"] = useCallback(
    (p) => {
      const items = compareStore.getSnapshot();
      if (!items.some((i) => i.id === p.id)) compareStore.set([...items, p].slice(-4)); // the shop compares at most 4 products
      notify({
        className: "notification-compare",
        image: p.image,
        title: p.name,
        message: (
          <>
            Success: You have added <Link href={p.href}>{p.name}</Link> to your <Link href="/compare">product comparison</Link>!
          </>
        ),
      });
    },
    [notify],
  );
  const removeFromCompare = useCallback((id: string) => compareStore.set(compareStore.getSnapshot().filter((i) => i.id !== id)), []);

  const wishlist: Shop["wishlist"] = useCallback(
    (p) =>
      notify({
        className: "notification-wishlist",
        image: p.image,
        title: p.name,
        message: (
          <>
            You must <Link href="/login">login</Link> or <Link href="/register">create an account</Link> to save <Link href={p.href}>{p.name}</Link> to your <Link href="/wishlist">wish list</Link>!
          </>
        ),
      }),
    [notify],
  );

  const value = useMemo<Shop>(
    () => ({ cart, compare, addToCart, removeFromCart, setQty, addToCompare, removeFromCompare, wishlist, askPrice: setPrice, openPopup: setPopup, clearCart }),
    [cart, compare, addToCart, removeFromCart, setQty, addToCompare, removeFromCompare, wishlist, clearCart],
  );

  // links like <a data-popup="379"> open the module popups (Corporate Deal, Become A dealer, Online Pay Numbers ...)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-popup]");
      if (!a) return;
      e.preventDefault();
      setPopup(Number(a.dataset.popup));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);


  return (
    <Ctx.Provider value={value}>
      {children}
      {toasts.length > 0 && <Toasts list={toasts} onClose={closeToast} />}
      {price && <AskPriceModal request={price} onClose={() => setPrice(null)} />}
      {popup !== null && <ModulePopup id={popup} onClose={() => setPopup(null)} />}
    </Ctx.Provider>
  );
}
