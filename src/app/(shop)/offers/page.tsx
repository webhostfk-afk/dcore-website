import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import OffersList from "@/components/offers/OffersList";

export const metadata: Metadata = { title: "Offer", description: "Latest offers and discounts on networking, fiber optic, storage and power products." };

export default function OffersPage() {
  return (
    <PageShell crumbs={[{ label: "Offer", href: "/offers" }]}>
      <OffersList />
    </PageShell>
  );
}
