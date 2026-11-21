"use client";
import { toNumber } from "@/lib/shop-store";
import { useShop } from "@/components/shop/ShopProvider";

type Info = { id: string; name: string; href: string; image: string; price: string | null; requestPrice: boolean };

// One look for every card button: same height, same corners, same gap, centred.
export const cardBtn =
  "relative flex h-[32px] cursor-pointer items-center justify-center gap-[5px] rounded-[3px] px-[14px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap capitalize max-[471px]:h-[28px] max-[471px]:px-[10px] max-[471px]:text-[11px] max-[471px]:leading-[11px]";
export const cardBtnFill = `${cardBtn} bg-[#e4212a] text-white hover:bg-[#c71b23]`;
export const cardBtnLine = `${cardBtn} border-2 border-solid border-[#db2427] bg-white text-[#db2427] hover:bg-[#db2427] hover:text-white`;
const ask = "w-[150px] max-w-full max-[471px]:w-[120px]";

// "Buy Now" and "Add to Cart" of a card (or two "Request Price" buttons when the price is on request).
export default function HomeCardButtons({ p }: { p: Info }) {
  const shop = useShop();
  const req = p.requestPrice && !p.price;
  const item = { id: p.id, name: p.name, href: p.href, image: p.image, model: "", price: toNumber(p.price) };
  const askPrice = () => shop.askPrice({ id: p.id, name: p.name });
  return (
    <div className="block px-[10px] pt-[10px] pb-[10px]">
      {req ? (
        <div className="flex flex-col items-center gap-[6px]">
          <a className={`${cardBtnFill} ${ask}`} onClick={askPrice}>
            <i className="fa fa-question-circle" />
            <span className="block">Request Price</span>
          </a>
          <a className={`${cardBtnLine} ${ask}`} onClick={askPrice}>
            <i className="fa fa-question-circle" />
            <span className="block">Request Price</span>
          </a>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-[8px] max-[471px]:gap-[5px]">
          <a className={cardBtnFill} onClick={() => shop.addToCart(item, 1, true)}>
            <span className="block">Buy Now</span>
          </a>
          <a className={cardBtnLine} onClick={() => shop.addToCart(item, 1)}>
            <span className="block">Add to Cart</span>
          </a>
        </div>
      )}
    </div>
  );
}
