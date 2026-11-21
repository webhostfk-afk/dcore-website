import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import CompareView from "@/components/shop/CompareView";

export const metadata: Metadata = { title: "Product Comparison" };

export default function ComparePage() {
  return (
    <PageShell crumbs={[{ label: "Product Comparison", href: "/compare" }]}>
      <CompareView />
    </PageShell>
  );
}
