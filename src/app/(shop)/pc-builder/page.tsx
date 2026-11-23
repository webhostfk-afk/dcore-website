import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import PcBuilder from "@/components/pcbuilder/PcBuilder";
import { SLOTS, builderProducts } from "@/lib/pcbuilder";

export const metadata: Metadata = { title: "PC Builder - Build Your Own Computer", description: "Choose the parts of your computer and add the whole build to the cart." };

export default function PcBuilderPage() {
  return (
    <PageShell crumbs={[{ label: "PC Builder", href: "/pc-builder" }]}>
      <PcBuilder slots={SLOTS} products={builderProducts()} />
    </PageShell>
  );
}
