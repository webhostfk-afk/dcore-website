/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

// Site footer. Icons come from the "icomoon" font: every icon is a CSS variable holding the glyph, painted by `before:content-(--i)`.
const glyph = (code: string) => ({ "--i": `"${code}"` }) as CSSProperties;

const ICON = { phone: "\ueaad", arrow: "\ue995", pin: "", fax: "", call: "", mail: "" };

const contacts = [
  { title: "Sales & Marketing", phone: "01844678806", href: "tel:+8801844678806" },
  { title: "Technical & Pre-Sales", phone: "01844678803", href: "tel:+8801844678803" },
  { title: "Technical Support", phone: "01844678801", href: "tel:+8801844678801" },
  { title: "Warranty & Service", phone: "01844678809", href: "tel:+8801844678809" },
  { title: "E-Commerce Delivery", phone: "01844678807", href: "tel:+8801844678807" },
];

const offices = [
  { title: "Bangladesh Office", text: "House# 308, Flat# F2 (6th Floor), Samir Tower, Elephant Road, Dhaka-1205, Bangladesh.", href: "https://maps.app.goo.gl/CHVeGcxaWYPQ2rvC6", icon: ICON.pin },
  { title: "China Office", text: "Room 102, No. 3, Lane 1, Anhuai Road, Niudipu, Longhua District, Shenzhen, Guangdong, China. 深圳市龙华区牛地铺安怀路一巷三号102", href: "https://maps.app.goo.gl/CHVeGcxaWYPQ2rvC6", icon: ICON.pin },
  { title: "Phone", text: "+8809638448800", href: "tel:8809638448800", icon: ICON.fax },
  { title: "Call Us", text: "+8801844678800", href: "tel:+8801844678800", icon: ICON.call },
  { title: "Email", text: "info@otech.com.bd", href: "mailto:info@otech.com.bd", icon: ICON.mail },
];

const links: { label: string; href: string; popup?: number }[] = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund & Return Policy", href: "/refund-and-return-policy" },
  { label: "Online Delivery", href: "/delivery" },
  { label: "EMI", href: "/emi" },
  { label: "Blog", href: "/blog" },
  { label: "Corporate Deal", href: "#", popup: 379 },
  { label: "Become A dealer", href: "#", popup: 378 },
  { label: "Sitemap", href: "/sitemap" },
  { label: "Brands", href: "/brands" },
];

const socials = [
  { name: "Facebook", href: "https://www.facebook.com/otech.technologies", icon: "", hover: "hover:bg-[#1778f2]" },
  { name: "Messenger", href: "https://www.m.me/otech.technologies", icon: "", hover: "hover:bg-[#0084ff]" },
  { name: "Instagram", href: "https://www.instagram.com/otech.technologies/", icon: "", hover: "hover:bg-[#d6249f]" },
  { name: "WhatsApp", href: "https://api.whatsapp.com/send?phone=8801844678800", icon: "", hover: "hover:bg-[#25d366]" },
  { name: "YouTube", href: "#", icon: "", hover: "hover:bg-[#ff0000]" },
];

const Heading = ({ children }: { children: ReactNode }) => (
  <h3 className="relative mb-[22px] pb-[12px] text-[15px] leading-[1.2] font-semibold tracking-[1.5px] text-white uppercase after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-[36px] after:rounded-full after:bg-[linear-gradient(90deg,#e4212a,#ff7a3d)] after:content-['']">
    {children}
  </h3>
);

export default function Footer() {
  return (
    <footer className="relative mt-[40px] overflow-hidden bg-[#070f19] text-[15px] leading-[1.7] font-medium text-[#aab4c0]">
      <div className="h-[4px] bg-[linear-gradient(90deg,#e4212a,#ff7a3d,#e4212a)]" />
      <div className="pointer-events-none absolute -top-[160px] left-1/2 h-[360px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-[#e4212a]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[120px] bottom-[120px] size-[320px] rounded-full bg-[#2563eb]/10 blur-[110px]" />

      <div className="relative mx-auto w-full max-w-[1280px] px-[20px] max-[471px]:px-[15px]">
        {/* call to action */}
        <div className="relative mt-[40px] flex flex-wrap items-center justify-between gap-[20px] overflow-hidden rounded-[22px] bg-[linear-gradient(120deg,#e4212a_0%,#c4161f_55%,#8f0f17_100%)] px-[34px] py-[30px] shadow-[0_25px_60px_-20px_rgba(228,33,42,0.55)] max-[761px]:px-[22px] max-[471px]:rounded-[18px]">
          <div className="pointer-events-none absolute -top-[60px] -right-[40px] size-[220px] rounded-full border-[28px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-[90px] left-[38%] size-[200px] rounded-full bg-white/10" />
          <div className="relative max-w-[640px]">
            <div className="text-[26px] leading-[1.25] font-bold text-white max-[471px]:text-[21px]">Need a quote or technical advice?</div>
            <div className="mt-[6px] text-[15px] text-white/85">Talk to our network engineers about switches, servers, fiber and power — genuine products, honest prices.</div>
          </div>
          <div className="relative flex flex-wrap gap-[12px]">
            <a
              href="tel:+8801844678800"
              style={glyph(ICON.call)}
              className="flex items-center gap-[8px] rounded-full bg-white px-[24px] py-[12px] text-[14px] leading-none font-bold text-[#c4161f] shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)] transition-transform duration-200 before:font-[icomoon] before:text-[16px] before:content-(--i) hover:-translate-y-[2px]"
            >
              +880 1844-678800
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=8801844678800"
              target="_blank"
              rel="noopener noreferrer"
              style={glyph("")}
              className="flex items-center gap-[8px] rounded-full border-2 border-white/80 px-[24px] py-[10px] text-[14px] leading-none font-bold text-white transition-colors duration-200 before:font-[icomoon] before:text-[18px] before:content-(--i) hover:bg-white hover:text-[#c4161f]"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        {/* support lines */}
        <div className="mt-[30px] grid grid-cols-5 gap-[14px] max-[1100px]:grid-cols-3 max-[761px]:grid-cols-2 max-[471px]:grid-cols-1">
          {contacts.map((c) => (
            <a
              key={c.phone}
              href={c.href}
              style={glyph(ICON.phone)}
              className="group relative flex items-center gap-[12px] rounded-[16px] border border-white/10 bg-white/[0.04] p-[14px] transition-all duration-200 before:flex before:size-[42px] before:flex-none before:items-center before:justify-center before:rounded-[12px] before:bg-[#e4212a]/15 before:font-[icomoon] before:text-[20px] before:text-[#ff6b4a] before:transition-colors before:content-(--i) hover:-translate-y-[3px] hover:border-[#e4212a]/60 hover:bg-white/[0.07] hover:before:bg-[#e4212a] hover:before:text-white"
            >
              <span className="min-w-0">
                <span className="block text-[11px] leading-[1.3] font-semibold tracking-[1px] text-[#8b97a5] uppercase">{c.title}</span>
                <span className="block text-[16px] leading-[1.4] font-bold text-white">{c.phone}</span>
              </span>
            </a>
          ))}
        </div>

        {/* main columns */}
        <div className="mt-[50px] grid grid-cols-[1.25fr_1.1fr_1.25fr_1.2fr] gap-[44px] max-[1100px]:grid-cols-2 max-[1100px]:gap-[36px] max-[561px]:grid-cols-1">
          <div>
            <Link href="/" className="inline-flex items-center gap-[10px]">
              <span className="relative size-[38px] rounded-full border-[7px] border-[#e4212a] after:absolute after:inset-[5px] after:rounded-full after:bg-white after:content-['']" />
              <span className="text-[30px] leading-none font-extrabold tracking-[3px] text-white">OTECH</span>
            </Link>
            <p className="mt-[16px] max-w-[320px] text-[14px] leading-[1.8] text-[#8b97a5]">
              Bangladesh&apos;s trusted source for networking, server, fiber optic and power equipment — original products with real after-sales support.
            </p>
            <div className="mt-[20px] flex flex-wrap gap-[10px]">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  title={s.name}
                  aria-label={s.name}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={glyph(s.icon)}
                  className={`flex size-[42px] items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white transition-all duration-200 before:font-[icomoon] before:text-[18px] before:content-(--i) hover:-translate-y-[3px] hover:border-transparent ${s.hover}`}
                />
              ))}
            </div>
          </div>

          <div>
            <Heading>Quick Links</Heading>
            <ul className="grid grid-cols-1 gap-y-[2px] max-[561px]:grid-cols-2 max-[561px]:gap-x-[10px]">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    {...(l.popup ? { "data-popup": l.popup } : {})}
                    style={glyph(ICON.arrow)}
                    className="flex items-center gap-[8px] py-[5px] text-[14px] text-[#aab4c0] transition-all duration-200 before:font-[icomoon] before:text-[12px] before:text-[#e4212a] before:content-(--i) hover:translate-x-[4px] hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Heading>Visit &amp; Contact</Heading>
            <ul className="flex flex-col gap-[14px]">
              {offices.map((o) => (
                <li key={o.title}>
                  <a
                    href={o.href}
                    target={o.href.startsWith("http") ? "_blank" : undefined}
                    rel={o.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={glyph(o.icon)}
                    className="group flex items-start gap-[12px] before:mt-[2px] before:flex before:size-[34px] before:flex-none before:items-center before:justify-center before:rounded-full before:bg-white/[0.07] before:font-[icomoon] before:text-[15px] before:text-[#ff6b4a] before:transition-colors before:content-(--i) hover:before:bg-[#e4212a] hover:before:text-white"
                  >
                    <span className="min-w-0">
                      <span className="block text-[14px] leading-[1.4] font-semibold text-white">{o.title}</span>
                      <span className="block text-[13px] leading-[1.6] text-[#8b97a5] transition-colors group-hover:text-[#ff9a6b]">{o.text}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Heading>Newsletter</Heading>
            <p className="mb-[16px] text-[14px] leading-[1.7] text-[#8b97a5]">Get new arrivals, offers and price drops straight to your inbox.</p>
            <NewsletterForm />
            <div className="mt-[26px]">
              <div className="mb-[10px] text-[11px] font-semibold tracking-[1.5px] text-[#8b97a5] uppercase">Secure payments</div>
              <div className="rounded-[14px] bg-white p-[10px]">
                <img src="/image/cache/catalog/website/sslcommerz/ssl-payments-620x79.png.webp" alt="Pay with SSLCommerz" width={620} height={79} className="block h-auto w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-[50px] flex flex-wrap items-center justify-between gap-[12px] border-t border-white/10 py-[22px] max-[761px]:justify-center max-[761px]:text-center">
          <div className="text-[13px] text-[#8b97a5]">© 2026 OTECH Technologies. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[6px] text-[13px] max-[761px]:justify-center">
            <Link href="/privacy-policy" className="text-[#8b97a5] transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-[#8b97a5] transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/sitemap" className="text-[#8b97a5] transition-colors hover:text-white">
              Sitemap
            </Link>
            <a
              href="#top"
              aria-label="Back to top"
              className="flex size-[38px] items-center justify-center rounded-full bg-[#e4212a] text-[18px] leading-none text-white transition-transform duration-200 hover:-translate-y-[3px]"
            >
              ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
