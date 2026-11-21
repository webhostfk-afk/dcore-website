import { Fragment, type CSSProperties } from "react";
import Link from "next/link";

const home = { "--i": '""' } as CSSProperties;
const arrow = { "--i": '"→"' } as CSSProperties;

// The trail under the header ("home -> Networking -> Network Switch"); the first item is the home icon.
export default function Breadcrumb({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <div className="relative w-full bg-[#f2f3f7] shadow-[2px_2px_5px_1px_rgba(26,32,44,0.1)]">
      <ul className="relative mx-auto block w-full max-w-[1280px] py-[10px] pr-[10px] pl-0 text-left text-[15px] leading-[28.5px] font-medium whitespace-nowrap text-[#333] max-[1301px]:pl-[15px]">
        {items.map((b, i) => (
          <Fragment key={b.href + i}>
            {i > 0 && " "}
            <li className="relative inline-flex items-center">
              {i === 0 ? (
                <Link
                  href={b.href}
                  aria-label="Home"
                  style={home}
                  className="text-[13px] leading-[24.7px] text-[#696973] hover:text-[#e4212a]"
                >
                  <span className="relative top-[1px] inline-block h-[15px] w-[13px] leading-[13px] before:inline before:font-[icomoon] before:text-[13px] before:content-(--i)" />
                </Link>
              ) : (
                <>
                  <span
                    style={arrow}
                    className="relative top-[1px] block h-[28.5px] w-[25px] max-[471px]:w-[24.5px] text-center text-[15px] leading-[28.5px] text-[#696973] before:content-(--i)"
                  />
                  <Link
                    href={b.href}
                    className="text-[13px] leading-[24.7px] text-[#696973] hover:text-[#e4212a] max-[471px]:text-[12px]"
                  >
                    {b.label}
                  </Link>
                </>
              )}
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
