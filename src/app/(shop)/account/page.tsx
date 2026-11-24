import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import AccountView from "@/components/account/AccountView";

export const metadata: Metadata = { title: "My Account | D CORE Solutions", robots: { index: false } };

export default function AccountPage() {
  return (
    <PageShell crumbs={[{ label: "Account", href: "/account" }]} heading={<h1 className="sr-only">My Account</h1>}>
      <AccountView />
    </PageShell>
  );
}
