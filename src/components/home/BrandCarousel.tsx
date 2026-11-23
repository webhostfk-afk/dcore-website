/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type Brand = { name: string; href: string; image: { src: string; width?: number; height?: number } };

// Brand logos: one endless row that slides from right to left without a stop between the end and the start (the list is shown twice
// and the row moves by exactly one list). It pauses while the mouse is over it.
export default function BrandCarousel({ brands }: { brands: Brand[] }) {
  const list = (key: string, hidden?: boolean) => (
    <ul key={key} aria-hidden={hidden} className="flex flex-none">
      {brands.map((b) => (
        <li key={b.href} className="mr-[10px] block w-[150px] flex-none max-[471px]:w-[96px]">
          <Link href={b.href} tabIndex={hidden ? -1 : undefined} className="flex h-[82px] items-center justify-center rounded-[5px] bg-white p-[11px] transition-shadow duration-200 hover:shadow-[0_6px_16px_-8px_rgba(1,174,241,0.6)] max-[471px]:h-[64px] max-[471px]:p-[8px]">
            <img src={b.image.src} width={b.image.width} height={b.image.height} alt={b.name} title={b.name} loading="lazy" className="block max-h-full max-w-full object-contain" />
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="dcore-brands relative block overflow-hidden pt-[5px] pb-[10px]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[30px] bg-[linear-gradient(90deg,#f0fafe,transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[30px] bg-[linear-gradient(270deg,#f0fafe,transparent)]" />
      <div className="dcore-brands-track flex w-max">
        {list("a")}
        {list("b", true)}
      </div>
    </div>
  );
}
