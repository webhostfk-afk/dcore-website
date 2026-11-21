import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import CheckoutView from "@/components/shop/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <PageShell
      crumbs={[
        { label: "Shopping Cart", href: "/cart" },
        { label: "Checkout", href: "/checkout" },
      ]}
    >
      <CheckoutView />
    </PageShell>
  );
}
