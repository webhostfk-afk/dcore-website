"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/components/shop/ShopProvider";
import { cartCount } from "@/lib/shop-store";

const ICONS: Record<string, string> = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  offers: "M4 9h16v4H4zM6 13v7h12v-7M12 9v11M12 9c-2 0-4-1-4-3s3-2 4 3c1-5 4-5 4-3s-2 3-4 3",
  pc: "M3 4h18v12H3zM9 20h6M12 16v4M8 8h8M8 11h5",
  compare: "M5 3h14v14H5zM12 7v6M9 10h6M3 8v13h13",
  cart: "M3 4h2l2.4 11h10.2L20 7H6M9 20h.01M17 20h.01",
};

// The bar fixed to the bottom of the screen on phones and small tablets (like the shop apps): the main places one tap away.
export default function MobileBottomBar() {
  const path = usePathname();
  const { cart, compare } = useShop();
  const items = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Offers", href: "/offers", icon: "offers" },
    { label: "PC Builder", href: "/pc-builder", icon: "pc" },
    { label: `Compare (${compare.length})`, href: "/compare", icon: "compare" },
    { label: "Cart", href: "/cart", icon: "cart", badge: cartCount(cart) },
  ];
  return (
    <nav aria-label="Quick links" className="fixed inset-x-0 bottom-0 z-[9000] flex h-[58px] bg-[#000000] shadow-[0_-4px_14px_rgba(0,0,0,0.25)] min-[762px]:hidden">
      {items.map((it) => {
        const on = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} className={`relative flex flex-1 flex-col items-center justify-center gap-[3px] text-[11px] leading-[13px] font-bold transition-colors ${on ? "text-[#01aef1]" : "text-white"}`}>
            <span className="relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICONS[it.icon]} />
              </svg>
              {it.badge ? <span className="absolute -top-[5px] -right-[9px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#01aef1] px-[3px] text-[9px] leading-none text-white">{it.badge}</span> : null}
            </span>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
