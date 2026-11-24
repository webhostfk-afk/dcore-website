import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import PolicyView from "@/components/policy/PolicyView";
import { POLICIES } from "@/data/policies";

const policy = POLICIES["refund-and-return-policy"];
export const metadata: Metadata = { title: `${policy.title} | D CORE Solutions`, description: policy.intro };

export default function Page() {
  return (
    <PageShell crumbs={[{ label: policy.title, href: "/refund-and-return-policy" }]} heading={<h1 className="sr-only">{policy.title}</h1>}>
      <PolicyView policy={policy} />
    </PageShell>
  );
}
