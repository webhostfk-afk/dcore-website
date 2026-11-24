import Link from "next/link";
import { BLOG_CATS, CAT_ICONS, catName, type BlogCard } from "@/lib/blog";

const meta = "flex items-center gap-[4px] text-[13px] leading-[20px] text-[#00000099]";

export function CatCards({ active }: { active?: string }) {
  return (
    <div className="grid grid-cols-4 gap-[16px] max-[1024px]:grid-cols-2 max-[471px]:gap-[10px]">
      {Object.entries(BLOG_CATS).map(([slug, c]) => (
        <Link
          key={slug}
          href={`/blog/${slug}`}
          className={`flex items-center gap-[12px] rounded-[8px] border bg-white p-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-colors hover:border-[#01aef1] ${active === slug ? "border-[#01aef1]" : "border-[#0000001a]"}`}
        >
          <span className="flex size-[44px] flex-none items-center justify-center rounded-full bg-[#e3f5fd]">
            <img src={CAT_ICONS[slug]} alt="" width={24} height={24} />
          </span>
          <span className="min-w-0">
            <span className="block text-[16px] leading-[22px] font-bold text-black">{c.name}</span>
            <span className="block text-[13px] leading-[18px] text-[#00000099]">{c.count} Articles</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function ArticleCard({ p }: { p: BlogCard }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[8px] border border-[#0000001a] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
      <div className="relative">
        <Link href={`/blog/${p.slug}`}>
          <img src={p.thumb} alt={p.title} width={420} height={221} loading="lazy" className="block aspect-[420/221] h-auto w-full object-cover" />
        </Link>
        {p.cats[0] && <span className="absolute top-[10px] left-[10px] rounded-[4px] bg-[#01aef1] px-[8px] py-[2px] text-[12px] leading-[18px] font-semibold text-white">{catName(p.cats[0])}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-[8px] p-[14px]">
        <div className="flex flex-wrap gap-x-[14px]">
          <span className={meta}>{p.date}</span>
          <span className={meta}>{p.read}</span>
        </div>
        <Link href={`/blog/${p.slug}`} className="line-clamp-2 text-[17px] leading-[24px] font-bold text-black hover:text-[#01aef1]">
          {p.title}
        </Link>
        <p className="line-clamp-3 text-[14px] leading-[21px] font-normal text-[#000000b3]">{p.intro}</p>
        <Link href={`/blog/${p.slug}`} className="mt-auto pt-[4px] text-[14px] font-semibold text-[#01aef1] hover:underline">
          Read More →
        </Link>
      </div>
    </article>
  );
}

export function ArticleGrid({ posts }: { posts: BlogCard[] }) {
  return (
    <div className="grid grid-cols-3 gap-[20px] max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
      {posts.map((p) => (
        <ArticleCard key={p.slug} p={p} />
      ))}
    </div>
  );
}

export function Pager({ base, page, pages }: { base: string; page: number; pages: number }) {
  if (pages <= 1) return null;
  const href = (n: number) => (n === 1 ? base : `${base}?page=${n}`);
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 2);
  const cell = "flex h-[38px] min-w-[38px] items-center justify-center rounded-[4px] border px-[10px] text-[14px] font-semibold";
  const idle = "border-[#0000001f] bg-white text-black hover:border-[#01aef1] hover:text-[#01aef1]";
  return (
    <nav className="mt-[30px] flex flex-wrap items-center justify-center gap-[6px]" aria-label="Pages">
      {page > 1 && (
        <Link href={href(page - 1)} className={`${cell} ${idle}`}>
          PREV
        </Link>
      )}
      {nums.map((n, i) => (
        <span key={n} className="contents">
          {i > 0 && n - nums[i - 1] > 1 && <span className="px-[4px] text-[#00000099]">…</span>}
          <Link href={href(n)} className={`${cell} ${n === page ? "border-[#01aef1] bg-[#01aef1] text-white" : idle}`}>
            {n}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link href={href(page + 1)} className={`${cell} ${idle}`}>
          NEXT
        </Link>
      )}
    </nav>
  );
}

export function BlogFrame({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[1280px] px-[15px] pt-[25px] pb-[45px] text-left">{children}</div>;
}
