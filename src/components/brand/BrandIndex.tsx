import Link from "next/link";
import { brandIndex } from "@/lib/brands";

// "Find Your Favorite Brand": every brand of the shop, grouped by its first letter.
export default function BrandIndex() {
  const groups = brandIndex();
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[15px] pt-[25px] pb-[40px] text-left max-[1301px]:px-[15px]">
      <h2 className="mb-[15px] text-[28px] leading-[34px] font-bold text-black max-[471px]:text-[22px]">Find Your Favorite Brand</h2>
      <p className="mb-[25px] flex flex-wrap items-center gap-[6px] text-[15px] leading-[24px] text-[#000000b3]">
        <strong className="mr-[6px] text-black">Brand Index:</strong>
        {groups.map((g) => (
          <a key={g.letter} href={`#b-${g.letter.replace(/\W/g, "")}`} className="flex h-[30px] min-w-[30px] items-center justify-center rounded-[4px] bg-white px-[6px] font-semibold text-[#01aef1] shadow-[0_0_0_1px_#0000001a] transition-colors hover:bg-[#01aef1] hover:text-white">
            {g.letter}
          </a>
        ))}
      </p>
      {groups.map((g) => (
        <section key={g.letter} id={`b-${g.letter.replace(/\W/g, "")}`} className="mb-[22px] scroll-mt-[90px]">
          <h2 className="mb-[10px] border-b border-[#0000001a] pb-[6px] text-[22px] leading-[28px] font-bold text-[#01aef1]">{g.letter}</h2>
          <div className="grid grid-cols-4 gap-x-[20px] gap-y-[8px] max-[1024px]:grid-cols-3 max-[640px]:grid-cols-2">
            {g.brands.map((b) => (
              <Link key={b.slug} href={`/${b.slug}`} className="text-[15px] leading-[26px] text-[#000000cc] hover:text-[#01aef1]">
                {b.name} <span className="text-[12px] text-[#00000066]">({b.products.length})</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
