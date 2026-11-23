/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type Img = { src: string; alt?: string; width?: number; height?: number };

// "Shop by category" heading (values read from the original theme).
export function CategoriesTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="block pb-[20px] text-center text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <h3 className="my-[15px] inline-block text-[25px] leading-[27.5px] font-medium text-[#000000] capitalize">{title}</h3>
      <div className="block w-full" />
      <div className="inline-block text-[14px] leading-[26.6px] font-medium text-[#000000]">{subtitle}</div>
    </div>
  );
}

// Category tiles: 8 per row, 4 per row on phones. The line icon sits on a soft rounded plate; on hover the plate turns blue, tilts a little
// and the icon turns white.
export function CategoryGrid({ items }: { items: { href: string; title: string; image: Img }[] }) {
  return (
    <div className="flex flex-wrap text-[15px] leading-[28.5px] font-medium text-[#000000]">
      {items.map((c) => {
        return (
          <div key={c.href} className="block w-1/8 p-[7.5px] max-[471px]:w-1/4 max-[471px]:p-[5px]">
            <Link
              href={c.href}
              className="group relative flex flex-col items-center rounded-[15px] bg-white p-[15px] text-center shadow-[0_1px_0_#e3f5fd] transition-all duration-300 ease-out hover:-translate-y-[4px] hover:shadow-[0_14px_28px_-14px_rgba(1,174,241,0.65)] max-[471px]:p-[5px]"
            >
              <span className="relative my-[3px] flex size-[84px] items-center justify-center rounded-[26px] bg-[#f0fafe] transition-all duration-300 group-hover:rotate-[-4deg] group-hover:bg-[#01aef1] max-[471px]:size-[58px] max-[471px]:rounded-[18px]">
                <img
                  src={c.image.src}
                  width={c.image.width}
                  height={c.image.height}
                  alt={`${c.title} image`}
                  className="block size-[56px] object-contain transition-[filter] duration-300 group-hover:invert max-[471px]:size-[38px]"
                />
              </span>
              <div className="mt-[6px] flex flex-col justify-center">
                <div className="block text-[12px] leading-[22.8px] font-medium text-black transition-colors group-hover:text-[#01aef1] max-[471px]:text-[11px] max-[471px]:leading-none">{c.title}</div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

// Banner grid: `perRow` banners per row on desktop, one per row on phones when `stack`.
export function BannerGrid({ items, third = false, second = false }: { items: { href: string; image: Img | null }[]; third?: boolean; second?: boolean }) {
  return (
    <div
      className={`flex flex-wrap text-[15px] leading-[28.5px] font-medium text-[#000000] ${second ? "mx-[-5px] mt-[10px] mb-[-5px]" : "m-[-5px]"}`}
    >
      {items.map((b, i) => (
        <div key={i} className={`block p-[5px] ${third ? "w-1/3 max-[471px]:w-full" : "w-1/2"}`}>
          <Link href={b.href} className="block overflow-hidden rounded-[6px]">
            {b.image && <img src={b.image.src} alt={b.image.alt} width={b.image.width} height={b.image.height} className="block h-auto w-full align-middle" />}
          </Link>
        </div>
      ))}
    </div>
  );
}
