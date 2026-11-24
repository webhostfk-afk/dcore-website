import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import ContactView from "@/components/contact/ContactView";

export const metadata: Metadata = { title: "Contact Us | D CORE Solutions", description: "Get in touch with D CORE Solutions by phone, email or the contact form." };

export default function ContactPage() {
  return (
    <PageShell crumbs={[{ label: "Contact Us", href: "/contact" }]} heading={<h1 className="sr-only">Contact Us</h1>}>
      <ContactView />
    </PageShell>
  );
}
