/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Product, ProductSection as Section } from "@/types/home";
import HomeCardButtons from "./HomeCardButtons";
import ProductCarousel from "./ProductCarousel";

// `related` is the card as shown under a product: 5 per row (2 on phones) instead of 6 / 3 / 2
export function HomeCard({ p, related = false }: { p: Product; related?: boolean }) {
  const out = p.label === "Out Of Stock";
  return (
    <div
      className={`relative mr-[10px] flex flex-none text-[15px] leading-[28.5px] font-medium text-[#333] ${
        related
          ? "w-[calc((100%-40px)/5-0.01px)] max-[761px]:mr-[5px] max-[761px]:w-[calc((100%-5px)/2-0.01px)]"
          : "w-[calc((100%-50px)/6-0.01px)] max-[1025px]:mr-[20px] max-[1025px]:w-[calc((100%-40px)/3-0.01px)] max-[981px]:w-[calc((100%-20px)/2-0.01px)] max-[471px]:mr-[10px] max-[471px]:w-[calc((100%-10px)/2-0.01px)]"
      }`}
    >
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[3px] bg-white shadow-[2px_2px_5px_1px_rgba(26,32,44,0.1)]">
        <div className="relative block overflow-hidden p-[10px]">
          {p.label && (
            <div className="absolute inset-0 z-[3] flex flex-col overflow-hidden">
              <span className="absolute top-[5px] left-0 flex">
                <b
                  className={`relative flex min-w-[45px] items-center justify-center text-[11px] leading-[11px] text-white ${
                    out ? "bg-[#e4212a] px-[5px] pt-[5px] pb-[6px] font-bold uppercase" : "rounded-r-[10px] bg-[#6e2594] px-[10px] pt-[5px] pb-[6px] font-normal capitalize"
                  }`}
                >
                  {p.label}
                </b>
              </span>
            </div>
          )}
          <Link href={p.href} className="block">
            {p.image && <img src={p.image.src} width={p.image.width} height={p.image.height} alt={p.name} title={p.name} className="block h-auto w-full bg-[#eee] align-middle" />}
          </Link>
        </div>
        <div className="relative flex flex-1 flex-col pt-[2px]">
          <div className="absolute top-[2px] left-0 z-[1] flex w-full items-center justify-center">
            <div className="absolute -top-[28px] flex items-center justify-center p-[5px] opacity-[0.25]">
              {[0, 1, 2, 3, 4].map((n) => (
                <span key={n} className="relative block h-[13px] w-[15.6px] text-[13px] leading-[13px] text-[#333]">
                  <i className="fa fa-star-o absolute top-0 left-0 block h-[13px] w-[15.6px] text-center" />
                </span>
              ))}
            </div>
          </div>
          <div className="mx-auto flex h-[50px] w-fit max-w-full items-center justify-center px-[10px] pt-[10px] text-[14px] leading-[18.2px] font-normal">
            <Link href={p.href} className="line-clamp-2 h-[40px] text-center text-[15px] leading-[20px] font-normal text-[#333] max-[471px]:text-[14px]">
              {p.name}
            </Link>
          </div>
          {!p.requestPrice && p.price && (
            <div className="mt-[8px] mb-[5px] block pl-[10px] text-center text-[17px] leading-[32.3px] font-bold text-[#db2427]">
              <div className="inline-flex flex-wrap items-center justify-center">
                {p.oldPrice ? (
                  <>
                    <span className="mr-[7px] block text-[17px] leading-[17px] font-bold">{p.price}</span>
                    <span className="block text-[12px] leading-[12px] font-normal text-[#1a202c] line-through">{p.oldPrice}</span>
                  </>
                ) : (
                  <span className="block text-[17px] leading-[17px] font-bold">{p.price}</span>
                )}
              </div>
            </div>
          )}
          <HomeCardButtons p={{ id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", price: p.price, requestPrice: p.requestPrice }} />
        </div>
      </div>
    </div>
  );
}

// A home page product block: tab strip with the title and "See All", then a sliding row of cards.
export default function HomeProducts({ section }: { section: Section }) {
  return (
    <div className="relative block text-[15px] leading-[28.5px] font-medium text-[#333]">
      <div className="block px-[10px] pb-[10px]">
        <div className="relative block">
          <ul className="-mb-[30px] flex justify-start overflow-x-auto overflow-y-hidden">
            <li className="relative z-[2] mr-[20px] flex shrink-0 rounded-r-[5px] whitespace-nowrap">
              <span className="relative flex items-center justify-center rounded-r-[5px] px-[10px] pt-[10px] pb-[8px] text-[16px] leading-[20px] font-medium text-[#1a202c] uppercase">{section.title}</span>
            </li>
            <li className="ml-auto flex shrink-0 whitespace-nowrap">
              <Link href={section.seeAll} className="relative flex items-center justify-center rounded-l-[5px] px-[10px] pt-[10px] pb-[8px] text-[13px] leading-[16.25px] font-normal text-[#3c5fa5] uppercase">
                See All
              </Link>
            </li>
          </ul>
          <div className="relative block pt-[20px]">
            <ProductCarousel>
              {section.products.map((p) => (
                <HomeCard key={p.id} p={p} />
              ))}
            </ProductCarousel>
          </div>
        </div>
      </div>
    </div>
  );
}
