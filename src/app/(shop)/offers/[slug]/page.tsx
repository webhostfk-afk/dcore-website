import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/shop/PageShell";
import OfferDetail from "@/components/offers/OfferDetail";
import { OFFERS, getOffer, offerProducts } from "@/lib/offers";

export function generateStaticParams() {
  return OFFERS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const o = getOffer((await params).slug);
  return o ? { title: o.title, description: o.short } : { title: "Offer" };
}

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const o = getOffer((await params).slug);
  if (!o) notFound();
  const sets = o.sets.map((s) => ({ id: s.id, title: s.title, blurb: s.blurb, products: offerProducts(s.category) }));
  return (
    <PageShell
      crumbs={[
        { label: "Offer", href: "/offers" },
        { label: o.title, href: `/offers/${o.slug}` },
      ]}
    >
      <OfferDetail heading={o.heading} text={o.text} to={o.to} sets={sets} />
    </PageShell>
  );
}
