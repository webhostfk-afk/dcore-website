import Link from "next/link";
import { POLICIES, type Policy } from "@/data/policies";

const NAV = [
  ["terms-and-conditions", "Terms & Conditions"],
  ["privacy-policy", "Privacy Policy"],
  ["refund-and-return-policy", "Refund & Return Policy"],
  ["delivery", "Online Delivery"],
  ["emi", "EMI"],
] as const;

// A policy page: title, short intro and the sections; the other policies are linked at the side.
export default function PolicyView({ policy }: { policy: Policy }) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-[15px] pt-[40px] pb-[60px] text-left">
      <div className="mb-[30px] flex items-end justify-between gap-[30px] max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-[10px]">
        <h2 className="text-[48px] leading-[1.05] font-extrabold tracking-[-0.01em] text-black uppercase max-[561px]:text-[32px]">{policy.title}</h2>
        <p className="max-w-[420px] text-[14px] leading-[22px] font-normal text-[#000000a6]">{policy.intro}</p>
      </div>
      <div className="grid grid-cols-[1fr_260px] items-start gap-[18px] max-[900px]:grid-cols-1">
        <article className="rounded-[12px] border border-[#01aef133] bg-[#f0fafe] p-[26px] max-[561px]:p-[16px]">
          {policy.sections.map((s, i) => (
            <section key={i} className="mb-[22px] last:mb-0">
              {s.h && <h3 className="mb-[10px] border-b border-[#01aef133] pb-[8px] text-[20px] leading-[26px] font-extrabold text-black">{s.h}</h3>}
              {s.p?.map((t, k) => (
                <p key={k} className="mb-[10px] text-[15px] leading-[26px] font-normal text-[#000000b3]">
                  {t}
                </p>
              ))}
              {s.ul && (
                <ul className="m-0 list-none p-0">
                  {s.ul.map((t, k) => (
                    <li key={k} className="relative mb-[8px] pl-[22px] text-[15px] leading-[25px] font-normal text-[#000000b3] before:absolute before:top-[10px] before:left-[4px] before:size-[7px] before:rounded-full before:bg-[#01aef1]">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
        <aside className="rounded-[12px] border border-[#0000001a] bg-white p-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="mb-[8px] text-[12px] font-bold tracking-[0.04em] text-black uppercase">Policies</div>
          {NAV.map(([slug, label]) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className={`block rounded-[6px] px-[10px] py-[7px] text-[14px] leading-[20px] ${slug === policy.slug ? "bg-[#01aef1] font-semibold text-white" : "text-[#000000b3] hover:bg-[#f0fafe] hover:text-[#01aef1]"}`}
            >
              {label}
            </Link>
          ))}
          <div className="mt-[12px] border-t border-[#0000001a] pt-[12px] text-[13px] leading-[20px] text-[#000000a6]">
            Questions? Write to <a href="mailto:info@dcores.net" className="text-[#01aef1] hover:underline">info@dcores.net</a> or call{" "}
            <a href="tel:+8801844600030" className="text-[#01aef1] hover:underline">+8801844600030</a>.
          </div>
        </aside>
      </div>
    </div>
  );
}

