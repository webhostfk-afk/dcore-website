import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/shop/PageShell";
import ArticleView from "@/components/blog/ArticleView";
import { ArticleGrid, BlogFrame, CatCards, Pager } from "@/components/blog/BlogParts";
import { BLOG_CATS, allPosts, catName, getPost, postsOf } from "@/lib/blog";

export const instant = false;
const PER = 12;

export function generateStaticParams() {
  return [...Object.keys(BLOG_CATS), ...allPosts().map((p) => p.slug)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (BLOG_CATS[slug]) return { title: `${catName(slug)} | D CORE Blog`, description: `${catName(slug)} articles from D CORE Solutions.` };
  const p = getPost(slug);
  if (!p) return { title: "Blog | D CORE Solutions" };
  return { title: `${p.title} | D CORE Blog`, description: p.summary || p.intro, openGraph: { title: p.title, description: p.summary || p.intro, images: p.hero ? [p.hero] : [] } };
}

// /blog/<category> lists a category, /blog/<article> shows one article.
export default async function BlogSlugPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params;
  const { page: pg } = await searchParams;
  if (BLOG_CATS[slug]) {
    const list = postsOf(slug);
    const pages = Math.max(1, Math.ceil(list.length / PER));
    const page = Math.min(pages, Math.max(1, Number(pg) || 1));
    return (
      <PageShell crumbs={[{ label: "Blog", href: "/blog" }, { label: catName(slug), href: `/blog/${slug}` }]} heading={<h1 className="sr-only">{catName(slug)}</h1>}>
        <BlogFrame>
          <h2 className="mb-[16px] text-[28px] leading-[34px] font-bold text-black max-[471px]:text-[22px]">{catName(slug)}</h2>
          <CatCards active={slug} />
          <div className="mt-[28px]">
            <ArticleGrid posts={list.slice((page - 1) * PER, page * PER)} />
          </div>
          <Pager base={`/blog/${slug}`} page={page} pages={pages} />
        </BlogFrame>
      </PageShell>
    );
  }
  const post = getPost(slug);
  if (!post) notFound();
  const related = postsOf(post.cats[0] ?? "").filter((p) => p.slug !== slug).slice(0, 3);
  return (
    <PageShell crumbs={[{ label: "Blog", href: "/blog" }, ...(post.cats[0] ? [{ label: catName(post.cats[0]), href: `/blog/${post.cats[0]}` }] : []), { label: post.title.length > 48 ? post.title.slice(0, 46) + "…" : post.title, href: `/blog/${slug}` }]} heading={null}>
      <ArticleView post={post} related={related} />
    </PageShell>
  );
}
