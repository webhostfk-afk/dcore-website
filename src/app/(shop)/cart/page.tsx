import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import CartView from "@/components/shop/CartView";

export const metadata: Metadata = { title: "Shopping Cart" };

export default function CartPage() {
  return (
    <PageShell crumbs={[{ label: "Shopping Cart", href: "/cart" }]}>
      <CartView />
    </PageShell>
  );
}
