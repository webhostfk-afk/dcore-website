import type { Metadata } from "next";
import PageShell from "@/components/shop/PageShell";
import { ArticleGrid, BlogFrame, CatCards, Pager } from "@/components/blog/BlogParts";
import { allPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog | D CORE Solutions", description: "Read the latest tech articles, buying guides and comparisons from D CORE Solutions." };
export const instant = false;
const PER = 18;

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pg } = await searchParams;
  const all = allPosts();
  const pages = Math.max(1, Math.ceil(all.length / PER));
  const page = Math.min(pages, Math.max(1, Number(pg) || 1));
  return (
    <PageShell crumbs={[{ label: "Blog", href: "/blog" }]} heading={<h1 className="sr-only">Blog</h1>}>
      <BlogFrame>
        <h2 className="text-[28px] leading-[34px] font-bold text-black max-[471px]:text-[22px]">Feature Articles</h2>
        <p className="mt-[4px] mb-[20px] text-[15px] leading-[24px] text-[#000000b3]">Read the latest tech articles by the industry experts!</p>
        <CatCards />
        <div className="mt-[28px]">
          <ArticleGrid posts={all.slice((page - 1) * PER, page * PER)} />
        </div>
        <Pager base="/blog" page={page} pages={pages} />
      </BlogFrame>
    </PageShell>
  );
}
