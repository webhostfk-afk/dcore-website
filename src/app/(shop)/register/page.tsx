import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Register Account | D CORE Solutions", robots: { index: false } };

export default function Page() {
  return (
    <PageShell crumbs={[{ label: "Account", href: "/account" }, { label: "Register", href: "/register" }]} heading={<h1 className="sr-only">Register Account</h1>}>
      <RegisterForm />
    </PageShell>
  );
}
