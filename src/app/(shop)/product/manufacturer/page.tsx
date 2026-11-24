import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import BrandIndex from "@/components/brand/BrandIndex";

export const metadata: Metadata = { title: "Brand | D CORE Solutions", description: "Find your favorite brand at D CORE Solutions." };

export default function BrandsPage() {
  return (
    <PageShell crumbs={[{ label: "Brand", href: "/brands" }]} heading={<h1 className="sr-only">Find Your Favorite Brand</h1>}>
      <BrandIndex />
    </PageShell>
  );
}
