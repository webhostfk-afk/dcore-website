import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import SearchForm from "@/components/shop/SearchForm";
import CategoryBrowser from "@/components/category/CategoryBrowser";
import { searchCategory } from "@/lib/catalog";

export const instant = false;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ search?: string }> }): Promise<Metadata> {
  const { search } = await searchParams;
  return { title: search ? `Search - ${search}` : "Search" };
}

// Product search: the results are shown with the same list / filter / sort / pagination as a category.
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search = "" } = await searchParams;
  const data = searchCategory(search.trim());
  return (
    <PageShell
      crumbs={[{ label: "Search", href: "/search" }]}
      heading={<h1 className="sr-only">{search ? `Search - ${search}` : "Search"}</h1>}
    >
      <CategoryBrowser data={data} top={<SearchForm search={search} />} />
    </PageShell>
  );
}
