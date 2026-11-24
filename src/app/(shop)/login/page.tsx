import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import { LoginForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Account Login | D CORE Solutions", robots: { index: false } };

export default function Page() {
  return (
    <PageShell crumbs={[{ label: "Account", href: "/account" }, { label: "Login", href: "/login" }]} heading={<h1 className="sr-only">Account Login</h1>}>
      <LoginForm />
    </PageShell>
  );
}
