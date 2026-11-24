import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import AboutView from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About Us | D CORE Solutions",
  description: "D CORE Solutions supplies genuine networking, FTTx, fiber optic, server and power equipment in Bangladesh, with clear prices and real after-sales support.",
};

export default function AboutPage() {
  return (
    <PageShell crumbs={[{ label: "About Us", href: "/about-us" }]} heading={<h1 className="sr-only">About Us</h1>}>
      <AboutView />
    </PageShell>
  );
}
