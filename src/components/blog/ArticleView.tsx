import Link from "next/link";
import { catName, type BlogPost, type BlogCard } from "@/lib/blog";
import { ArticleGrid, BlogFrame } from "@/components/blog/BlogParts";

// The body is imported article HTML; `.blog-body` (globals.css) gives its headings, lists, tables and images their shapes back.
export default function ArticleView({ post, related }: { post: BlogPost; related: BlogCard[] }) {
  return (
    <BlogFrame>
      <div className="mx-auto max-w-[900px]">
        {post.hero && <img src={post.hero} alt={post.title} width={870} height={457} className="block h-auto w-full rounded-[8px]" />}
        <h1 className="mt-[20px] text-[32px] leading-[40px] font-bold text-black max-[640px]:text-[24px] max-[640px]:leading-[32px]">{post.title}</h1>
        <div className="mt-[10px] flex flex-wrap items-center gap-x-[18px] gap-y-[4px] text-[14px] leading-[22px] text-[#00000099]">
          {post.cats.map((c) => (
            <Link key={c} href={`/blog/${c}`} className="rounded-[4px] bg-[#e3f5fd] px-[8px] py-[1px] font-semibold text-[#01aef1] hover:bg-[#01aef1] hover:text-white">
              {catName(c)}
            </Link>
          ))}
          <span>Updated: {post.updated || post.published}</span>
          <span>{post.read}</span>
        </div>
        {post.summary && (
          <div className="mt-[18px] rounded-[8px] border-l-[4px] border-[#01aef1] bg-[#f0fafe] px-[16px] py-[12px] text-[15px] leading-[24px] text-[#000000cc]">
            <strong>Summary: </strong>
            {post.summary}
          </div>
        )}
        <div className="blog-body mt-[22px]" dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.tags.length > 0 && (
          <div className="mt-[28px] flex flex-wrap items-center gap-[8px] border-t border-[#0000001a] pt-[16px] text-[14px]">
            <span className="font-semibold text-black">Topic:</span>
            {post.tags.map((t) => (
              <span key={t} className="rounded-[4px] bg-[#f0f3f6] px-[10px] py-[3px] text-[#000000b3]">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      {related.length > 0 && (
        <div className="mt-[40px]">
          <h2 className="mb-[16px] text-[24px] leading-[30px] font-bold text-black">Related Articles</h2>
          <ArticleGrid posts={related} />
        </div>
      )}
    </BlogFrame>
  );
}
