/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type Img = { src: string; alt?: string; width?: number; height?: number };

// "Shop by category" heading (values read from the original theme).
export function CategoriesTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="block pb-[20px] text-center text-[15px] leading-[28.5px] font-medium text-[#333]">
      <h3 className="my-[15px] inline-block text-[25px] leading-[27.5px] font-medium text-[#1a202c] capitalize">{title}</h3>
      <div className="block w-full" />
      <div className="inline-block text-[14px] leading-[26.6px] font-medium text-[#1a202c]">{subtitle}</div>
    </div>
  );
}

// Round category tiles: 8 per row, 4 per row on phones.
export function CategoryGrid({ items }: { items: { href: string; title: string; image: Img }[] }) {
  return (
    <div className="flex flex-wrap text-[15px] leading-[28.5px] font-medium text-[#333]">
      {items.map((c) => (
        <div key={c.href} className="block w-1/8 p-[7.5px] max-[471px]:w-1/4 max-[471px]:p-[5px]">
          <Link
            href={c.href}
            className="group relative flex flex-col items-center rounded-[15px] border-b border-[#e6e6e6] bg-white p-[15px] text-center max-[471px]:p-[5px]"
          >
            <img src={c.image.src} width={c.image.width} height={c.image.height} alt={`${c.title} image`} className="relative m-[5px] block self-center" />
            <div className="flex flex-col justify-center">
              <div className="block text-[12px] leading-[22.8px] font-medium text-black group-hover:text-[#e4212a] max-[471px]:text-[11px] max-[471px]:leading-none">{c.title}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

// Banner grid: `perRow` banners per row on desktop, one per row on phones when `stack`.
export function BannerGrid({ items, third = false }: { items: { href: string; image: Img | null }[]; third?: boolean }) {
  return (
    <div
      className={`flex flex-wrap text-[15px] leading-[28.5px] font-medium text-[#333] ${third ? "mx-[-5px] mt-[10px] mb-[-5px]" : "m-[-5px]"}`}
    >
      {items.map((b, i) => (
        <div key={i} className={`block p-[5px] ${third ? "w-1/3 max-[471px]:w-full" : "w-1/2"}`}>
          <Link href={b.href} className="block">
            {b.image && <img src={b.image.src} alt={b.image.alt} width={b.image.width} height={b.image.height} className="block h-auto w-full align-middle" />}
          </Link>
        </div>
      ))}
    </div>
  );
}
