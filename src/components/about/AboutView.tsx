import Link from "next/link";
import { allBrands } from "@/lib/brands";

const WHAT = [
  { name: "Networking", href: "/networking", text: "Switches, routers, access points, Ethernet adapters and IP phones for offices, homes and ISPs." },
  { name: "FTTx Solution", href: "/fttx-solution", text: "OLT, ONU, SFP modules and splicing machines for fiber-to-the-home and ISP networks." },
  { name: "Fiber Optic Accessories", href: "/fiber-optic-accessories", text: "Patch cords, media converters, attenuators and the tools to build a clean fiber link." },
  { name: "Server & Storage", href: "/server-and-storage", text: "Servers, processors, RAM and storage for racks, server rooms and small data centers." },
  { name: "UPS & IPS", href: "/ups-and-ips", text: "Offline and online UPS, batteries and power equipment to keep your network running." },
  { name: "Components & Accessories", href: "/component", text: "Motherboards, SSDs, casings, coolers, adapters and everyday IT accessories." },
];

const WHY = [
  { title: "Genuine products", text: "Original products that come with the manufacturer or supplier warranty, so you can buy with confidence." },
  { title: "Clear prices", text: "Fair and transparent prices, with regular offers on switches, routers, fiber items and power equipment." },
  { title: "Expert advice", text: "Engineers who understand the products and can suggest the right model for your link, rack or office." },
  { title: "After-sales support", text: "Quick delivery inside Dhaka and to the rest of the country, and real support after the sale when you need it." },
];

const card = "rounded-[12px] border border-[#01aef133] bg-[#f0fafe] p-[22px] max-[561px]:p-[16px]";
const h2 = "mb-[14px] text-[26px] leading-[32px] font-extrabold text-black max-[561px]:text-[22px]";
const p = "mb-[12px] text-[15px] leading-[26px] font-normal text-[#000000b3]";

export default function AboutView() {
  const brands = [...allBrands().values()]
    .filter((b) => b.slug !== "dcore" && b.slug !== "china")
    .sort((a, b) => b.products.length - a.products.length)
    .slice(0, 18);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-[15px] pt-[40px] pb-[60px] text-left">
      <div className="mb-[34px] flex items-end justify-between gap-[30px] max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-[10px]">
        <h2 className="text-[56px] leading-[1] font-extrabold tracking-[-0.01em] text-black uppercase max-[561px]:text-[38px]">About Us</h2>
        <p className="max-w-[380px] text-[14px] leading-[22px] font-normal text-[#000000a6]">Bangladesh&apos;s trusted source for networking, server, fiber optic and power equipment.</p>
      </div>

      <section className={`${card} mb-[18px]`}>
        <h3 className={h2}>D CORE Solutions</h3>
        <p className={p}>
          D CORE Solutions is an IT and networking company in Bangladesh. We supply networking, FTTx, fiber optic, server, storage and power equipment, and we help businesses, ISPs and
          individuals pick the right product for the job.
        </p>
        <p className={p}>
          Every product in our catalogue is original, comes with the manufacturer or supplier warranty and is sold at a clear price. If a model you need is not listed, send us a message
          and we will check the availability for you.
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[10px]">
          <Link href="/contact" className="flex h-[42px] items-center rounded-[6px] bg-[#01aef1] px-[26px] text-[13px] font-bold tracking-[0.04em] text-white uppercase transition-colors hover:bg-[#0189bc]">
            Contact Us
          </Link>
          <Link href="/brands" className="flex h-[42px] items-center rounded-[6px] border border-[#01aef1] bg-white px-[26px] text-[13px] font-bold tracking-[0.04em] text-[#01aef1] uppercase transition-colors hover:bg-[#01aef1] hover:text-white">
            Browse Brands
          </Link>
        </div>
      </section>

      <h3 className={`${h2} mt-[34px]`}>What We Offer</h3>
      <div className="grid grid-cols-3 gap-[16px] max-[900px]:grid-cols-2 max-[561px]:grid-cols-1">
        {WHAT.map((w) => (
          <Link key={w.name} href={w.href} className="group rounded-[12px] border border-[#0000001a] bg-white p-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all hover:border-[#01aef1] hover:shadow-[0_6px_18px_rgba(1,174,241,0.18)]">
            <span className="block text-[17px] leading-[24px] font-bold text-black group-hover:text-[#01aef1]">{w.name}</span>
            <span className="mt-[6px] block text-[14px] leading-[22px] font-normal text-[#000000a6]">{w.text}</span>
          </Link>
        ))}
      </div>

      <h3 className={`${h2} mt-[40px]`}>Brands We Work With</h3>
      <p className={p}>Our catalogue includes products from well-known names in networking and computing. Choose a brand to see everything we have from it.</p>
      <div className="flex flex-wrap gap-[10px]">
        {brands.map((b) => (
          <Link key={b.slug} href={`/${b.slug}`} className="rounded-[999px] border border-[#01aef155] bg-white px-[16px] py-[6px] text-[14px] leading-[22px] font-semibold text-[#000000cc] transition-colors hover:border-[#01aef1] hover:bg-[#01aef1] hover:text-white">
            {b.name}
          </Link>
        ))}
      </div>

      <h3 className={`${h2} mt-[40px]`}>Why Customers Choose Us</h3>
      <div className="grid grid-cols-4 gap-[16px] max-[1024px]:grid-cols-2 max-[561px]:grid-cols-1">
        {WHY.map((w, i) => (
          <div key={w.title} className={card}>
            <span className="mb-[10px] flex size-[38px] items-center justify-center rounded-full bg-[#01aef1] text-[16px] font-extrabold text-white">{i + 1}</span>
            <span className="block text-[16px] leading-[22px] font-bold text-black">{w.title}</span>
            <span className="mt-[6px] block text-[14px] leading-[22px] font-normal text-[#000000a6]">{w.text}</span>
          </div>
        ))}
      </div>

      <section className={`${card} mt-[40px]`}>
        <h3 className={h2}>Best Price &amp; Best After-Sales Service</h3>
        <p className={p}>
          We focus on three things: the right technology, the people who use it, and after-sales service that actually helps. If you are planning an office network, a fiber link, a new ISP node
          or a server room, tell us what you need and our team will recommend a working set of products within your budget.
        </p>
        <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px] text-[14px] leading-[22px] text-[#000000b3] max-[561px]:grid-cols-1">
          <div>
            <b className="block text-[12px] tracking-[0.04em] text-black uppercase">Corporate Office</b>
            House# 11, Road# 3, Gulshan 1, Gudaraghat, Lake Par, Dhaka
          </div>
          <div>
            <b className="block text-[12px] tracking-[0.04em] text-black uppercase">Registered Office</b>
            GA-185/1, Mohakhali Wireless Gate, Banani, Dhaka-1213
          </div>
          <div>
            <b className="block text-[12px] tracking-[0.04em] text-black uppercase">Phone</b>
            <a href="tel:+8801844600030" className="hover:text-[#01aef1]">+8801844600030</a>, <a href="tel:+8809678800672" className="hover:text-[#01aef1]">+8809678800672</a>
          </div>
          <div>
            <b className="block text-[12px] tracking-[0.04em] text-black uppercase">Email</b>
            <a href="mailto:info@dcores.net" className="hover:text-[#01aef1]">info@dcores.net</a>
          </div>
        </div>
      </section>
    </div>
  );
}
