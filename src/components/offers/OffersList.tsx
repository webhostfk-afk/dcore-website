/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { OFFERS, dateText } from "@/lib/offers";

const Calendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
const Store = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6" />
  </svg>
);

// The offer page ("Offer"): one card for every running offer (picture, validity, where it is valid, short text, button).
export default function OffersList() {
  return (
    <div className="w-full bg-[#f0fafe] pt-0 pb-[20px] text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <div className="mx-auto max-w-[1280px] px-[15px] max-[1301px]:px-[20px] max-[471px]:px-[10px]">
        <div className="-mx-[10px] flex flex-wrap">
          {OFFERS.map((o) => (
            <div key={o.slug} className="flex w-1/3 p-[10px] max-[981px]:w-1/2 max-[640px]:w-full">
              <div className="flex w-full flex-col rounded-[8px] bg-white p-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-shadow duration-200 hover:shadow-[0_10px_28px_-8px_rgba(1,174,241,0.45)]">
                <Link href={`/offers/${o.slug}`} className="block overflow-hidden rounded-[6px]">
                  <img src={o.image} alt={o.title} width={400} height={400} loading="lazy" className="block h-auto w-full transition-transform duration-300 hover:scale-[1.03]" />
                </Link>
                <div className="flex flex-1 flex-col text-center">
                  <p className="mt-[12px] flex items-center justify-between border-b border-[#0000001a] pb-[10px] text-[13px] leading-[20px] font-normal text-[#000000b3]">
                    <span className="flex items-center gap-[6px]">
                      <Calendar />
                      {dateText(o.from)} - {dateText(o.to)}
                    </span>
                    <span className="flex items-center gap-[6px]">
                      <Store />
                      {o.where}
                    </span>
                  </p>
                  <Link href={`/offers/${o.slug}`}>
                    <h4 className="mt-[12px] text-[19px] leading-[26px] font-medium text-[#000000] hover:text-[#01aef1]">{o.title}</h4>
                  </Link>
                  <p className="mt-[6px] flex-1 text-[15px] leading-[26px] font-normal text-[#00000099]">{o.short}</p>
                  <div>
                    <Link
                      href={`/offers/${o.slug}`}
                      className="mt-[14px] inline-block rounded-[4px] bg-[#01aef1] px-[22px] py-[10px] text-[14px] leading-[18px] font-bold text-white transition-colors duration-200 hover:bg-[#0189bc]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
