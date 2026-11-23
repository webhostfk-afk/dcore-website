"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import type { CatProduct } from "@/types/category";
import { useShop } from "@/components/shop/ShopProvider";
import HomeCardButtons from "@/components/home/HomeCardButtons";
import { saveLabel } from "@/lib/save-label";
import { toNumber } from "@/lib/shop-store";

const glyph = (code: string) => ({ "--i": `"${code}"` }) as CSSProperties;

// Product card of the category page, written with Tailwind. The same card is drawn as a tile (grid view) or as a wide row (list view).
export default function CatCard({ p, view }: { p: CatProduct; view: "grid" | "list" }) {
  const shop = useShop();
  const qtyRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false); // the second picture is only put in the page when the tile is hovered (list view always has it)
  const list = view === "list";
  // a product with price 0 only asks for the price when the shop's price plugin took over (no price text); otherwise "0৳" is shown
  const req = !p.price; // a product without a price cannot be bought, it is a price request
  const out = p.label === "Out Of Stock";
  const qty = () => Math.max(1, parseInt(qtyRef.current?.value ?? "1", 10) || 1);
  const step = (d: number) => {
    if (qtyRef.current) qtyRef.current.value = String(Math.max(1, qty() + d));
  };
  const item = { id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", model: p.model ?? "", price: toNumber(p.price) };
  const ask = () => shop.askPrice({ id: p.id, name: p.name });
  const txt = list ? "" : "text-[13px] leading-[13px] font-normal max-[471px]:text-[10px] max-[471px]:leading-[10px]";

  const label = p.label && (
    <div className="absolute inset-0 z-[3] flex flex-col overflow-hidden">
      <span className="absolute top-[5px] left-0 flex">
        <b
          className={`relative flex min-w-[45px] items-center justify-center text-[11px] leading-[11px] whitespace-nowrap text-white ${
            out ? "bg-[#01aef1] px-[5px] pt-[5px] pb-[6px] font-bold uppercase" : "rounded-r-[10px] bg-[#01aef1] px-[10px] pt-[5px] pb-[6px] font-normal capitalize"
          }`}
        >
          {saveLabel(p.label, p.price, p.oldPrice)}
        </b>
      </span>
    </div>
  );

  const img = (
    <Link href={p.href} onMouseEnter={() => setHover(true)} className={`group/img block ${list ? "border border-[#0000001f]" : ""}`}>
      <div className="relative flex items-center justify-center">
        {p.image && (
          <img
            src={p.image.src}
            width={p.image.width}
            height={p.image.height}
            alt={p.name}
            title={p.name}
            className={`block h-auto w-full ${list ? "rounded-[5px]" : "bg-[#e3f5fd]"} ${p.imageSecond ? "group-hover/img:opacity-0" : ""}`}
          />
        )}
        {p.imageSecond && hover && (
          <img src={p.imageSecond.src} width={p.imageSecond.width} height={p.imageSecond.height} alt={p.name} title={p.name} className={`absolute top-0 left-0 block h-auto w-full opacity-0 group-hover/img:opacity-100 ${list ? "rounded-[5px]" : "bg-[#e3f5fd]"}`} />
        )}
      </div>
    </Link>
  );

  const price =
    p.price &&
    (list ? (
      <div className="mb-[10px] w-fit text-left text-[25px] leading-[47.5px] font-bold">
        <div className="inline-flex items-center">
          {p.oldPrice ? (
            <>
              <span className="mr-[7px] block text-[25px] leading-[25px] text-[#01aef1]">{p.price}</span>
              <span className="block text-[13px] leading-[13px] font-bold text-[#00000099] line-through">{p.oldPrice}</span>
            </>
          ) : (
            <span className="block text-[25px] leading-[25px] text-[#000000]">{p.price}</span>
          )}
        </div>
        <span className="block text-[12px] leading-[18px] font-bold text-[#00000099]">{`Ex Tax:${p.price}`}</span>
      </div>
    ) : (
      <div className="mt-[8px] mb-[5px] block pl-[10px] text-center text-[17px] leading-[32.3px] font-bold text-[#01aef1]">
        <div className="inline-flex flex-wrap items-center justify-center">
          {p.oldPrice ? (
            <>
              <span className="mr-[7px] block text-[17px] leading-[17px]">{p.price}</span>
              <span className="block text-[12px] leading-[12px] font-normal text-[#000000] line-through">{p.oldPrice}</span>
            </>
          ) : (
            <span className="block text-[17px] leading-[17px]">{p.price}</span>
          )}
        </div>
      </div>
    ));

  const buy = req ? (
    <a
      onClick={ask}
      className={`relative flex cursor-pointer items-center justify-center rounded-[3px] text-center align-middle whitespace-nowrap ${
        list ? "h-[38px] bg-white px-[18px] py-[13px] text-[12px] leading-[12px] font-normal text-[#000000]" : `mt-[10px] mr-[10px] bg-[#01aef1] px-[12px] py-[7.5px] text-white capitalize max-[471px]:mr-[5px] ${txt}`
      }`}
    >
      <i className="fa fa-question-circle" /> <span className={list ? "px-[4.8px]" : "block"}>Request Price</span>
    </a>
  ) : (
    <a
      onClick={() => shop.addToCart(item, qty(), true)}
      className={`relative flex cursor-pointer items-center justify-center rounded-[3px] text-center align-middle whitespace-nowrap ${
        list ? "h-[38px] bg-white px-[18px] py-[13px] text-[12px] leading-[12px] font-normal text-[#000000]" : `mt-[10px] mr-[10px] bg-[#01aef1] px-[12px] py-[7.5px] text-white capitalize max-[471px]:mr-[5px] ${txt}`
      }`}
    >
      <span className={list ? "px-[4.8px]" : "block"}>Buy Now</span>
    </a>
  );

  const cart = req ? (
    <a
      onClick={ask}
      className={`relative flex cursor-pointer items-center justify-center text-center align-middle whitespace-nowrap ${
        list ? "mr-[5px] h-[38px] rounded-[3px] bg-[#000000] px-[18px] py-[13px] text-[13px] leading-[13px] font-normal text-white uppercase" : `mt-[10px] mr-[5px] rounded-[3px] border-2 border-solid border-[#01aef1] p-[5px] text-[#01aef1] capitalize ${txt}`
      }`}
    >
      <i className="fa fa-question-circle" /> <span className={list ? "px-[5.2px]" : "block"}>Request Price</span>
    </a>
  ) : (
    <a
      onClick={() => shop.addToCart(item, qty())}
      style={list ? glyph("") : undefined}
      className={`relative flex cursor-pointer items-center justify-center text-center align-middle whitespace-nowrap ${
        list
          ? "mr-[5px] h-[38px] rounded-[3px] bg-[#000000] px-[18px] py-[13px] text-[13px] leading-[13px] font-normal text-white uppercase before:block before:h-[16px] before:font-[icomoon] before:text-[16px] before:leading-[16px] before:content-(--i)"
          : `mt-[10px] mr-[5px] rounded-[3px] border-2 border-solid border-[#01aef1] p-[5px] text-[#01aef1] capitalize ${txt}`
      }`}
    >
      <span className={list ? "px-[5.2px]" : "block"}>Add to Cart</span>
    </a>
  );

  if (!list) {
    return (
      <div className="relative flex w-1/4 p-[10px] max-[761px]:w-1/2 max-[761px]:p-[5px]">
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-[3px] bg-white shadow-[2px_2px_5px_1px_rgba(0,0,0,0.1)]">
          <div className="relative block overflow-hidden p-[10px]">
            {label}
            {img}
          </div>
          <div className="relative flex flex-1 flex-col pt-[2px]">
            <div className="absolute top-[2px] left-0 z-[1] flex w-full items-center justify-center">
              <div className="absolute -top-[28px] flex items-center justify-center p-[5px] opacity-[0.25]">
                {[0, 1, 2, 3, 4].map((n) => (
                  <span key={n} className="relative block h-[13px] w-[15.6px] text-[13px] leading-[13px] text-[#000000]">
                    <i className="fa fa-star-o absolute top-0 left-0 block h-[13px] w-[15.6px] text-center" />
                  </span>
                ))}
              </div>
            </div>
            <div className="mx-auto flex h-[50px] w-fit max-w-full items-center justify-center px-[10px] pt-[10px] text-[14px] leading-[18.2px] font-normal">
              <Link href={p.href} className="line-clamp-2 h-[40px] text-center text-[15px] leading-[20px] font-normal text-[#000000] hover:text-[#01aef1] max-[471px]:text-[14px]">
                {p.name}
              </Link>
            </div>
            {price}
            <HomeCardButtons p={{ id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", price: p.price, requestPrice: p.requestPrice }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full text-[15px] leading-[28.5px] font-medium text-[#000000] [&:not(:first-child)]:mt-[25px]">
      <div className="relative flex flex-1 overflow-hidden border-b border-[#0000001f] pb-[25px] max-[761px]:flex-col">
        <div className="relative w-[252px] flex-none overflow-hidden max-[761px]:w-full">
          {label}
          {img}
        </div>
        <div className="relative flex flex-1 flex-col pl-[20px] max-[761px]:pt-[20px] max-[761px]:pl-0">
          {(p.brand || p.model) && (
            <div className="mb-[10px] flex items-center">
              {p.brand && (
                <span className="pr-[15px]">
                  <span className="inline-block">Brands:</span>{" "}
                  <span>
                    <Link href={p.brand.href} className="inline-block text-[#01aef1] hover:text-[#0189bc]">
                      {p.brand.name}
                    </Link>
                  </span>
                </span>
              )}
              {p.model && (
                <span className="pr-[15px]">
                  <span className="inline-block">Model:</span> <span>{p.model}</span>
                </span>
              )}
            </div>
          )}
          <div className="mb-[5px] flex items-center text-[14px] leading-[18.2px] font-normal">
            <Link href={p.href} className="block w-full overflow-hidden text-left text-[25px] leading-[32.5px] font-medium text-ellipsis whitespace-nowrap text-[#000000] hover:text-[#01aef1]">
              {p.name}
            </Link>
          </div>
          {p.features.length > 0 && (
            <div className="mt-[5px] mb-[10px] text-left text-[14px] leading-[21px] text-[#00000099]">
              <ul className="mb-[10px] list-disc pl-[20px]">
                {p.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {price}
          <div className="mt-[5px] flex items-center justify-between">
            <div className="flex flex-1 justify-start">
              <div className="relative items-center">
                <div className="mt-[10px] flex items-center justify-start">{buy}</div>
              </div>
              <div className="relative flex items-center">
                <div className="relative mr-[5px] flex h-[38px] w-[100px] items-center overflow-hidden border border-[#0000001f]">
                  <input
                    ref={qtyRef}
                    type="text"
                    name="quantity"
                    defaultValue="1"
                    className="h-[36px] min-w-0 flex-1 bg-[#f0fafe] pr-[20px] pl-[2px] text-center text-[13px] leading-[16.9px] text-[#000000b3] outline-none"
                  />
                  <span className="absolute top-0 right-0 z-[10] flex h-[36px] w-[19px] flex-col border-l border-transparent">
                    {[
                      ["", 1],
                      ["", -1],
                    ].map(([c, d]) => (
                      <i
                        key={String(d)}
                        onClick={() => step(Number(d))}
                        style={glyph(String(c))}
                        className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center bg-[#e3f5fd] text-[#00000099] before:block before:h-[15px] before:w-[12px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i)"
                      />
                    ))}
                  </span>
                </div>
                {cart}
              </div>
              <div className="relative flex items-center">
                <a
                  title="Add to Wish List"
                  onClick={() => shop.wishlist({ name: p.name, href: p.href, image: p.image?.src ?? "" })}
                  style={glyph("")}
                  className="relative flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[20px] border border-[#0000001f] bg-[#01aef1] text-[#000000] before:block before:h-[16px] before:w-[16px] before:font-[icomoon] before:text-[16px] before:leading-[16px] before:content-(--i)"
                />
                <a
                  title="Compare this Product"
                  onClick={() => shop.addToCompare({ id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", model: p.model ?? "", brand: p.brand?.name ?? "", price: p.price ?? "", oldPrice: p.oldPrice ?? "" })}
                  style={glyph("")}
                  className="relative ml-[5px] flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[20px] border border-[#0000001f] bg-[#01aef1] text-[#000000] before:block before:h-[16px] before:w-[16px] before:font-[icomoon] before:text-[16px] before:leading-[16px] before:content-(--i)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
