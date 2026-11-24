import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import { ForgotForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Forgot Your Password | D CORE Solutions", robots: { index: false } };

export default function Page() {
  return (
    <PageShell crumbs={[{ label: "Account", href: "/account" }, { label: "Forgotten Password", href: "/forgotten" }]} heading={<h1 className="sr-only">Forgot Your Password</h1>}>
      <ForgotForm />
    </PageShell>
  );
}
