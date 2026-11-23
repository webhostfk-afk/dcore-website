import type { CSSProperties } from "react";

const NOTICE =
  "* অর্ডার করার পূর্বে কাস্টমার কেয়ার থেকে পন্যের স্টক ও ডেলিভারি সম্পর্কে জেনে নেয়ার অনুরোধ করা যাচ্ছে। আই টি পণ্যের মূল্য অস্থিতিশীল হওয়ায় কারণে যেকোন মুহূর্তে, যেকোন আই টি পণ্যের মূল্য পরিবর্তন হতে পারে। কাস্টমার কেয়ার: +8801844600030, +8809678800672, যোগাযোগের নাম্বার: 01844600030, 09678800672 *";

// The green notice above the cart and the checkout.
export default function CartNotice() {
  return (
    <div className="mx-auto max-w-[1280px] text-[15px] leading-[28.5px] font-medium text-[#000000] max-[471px]:mx-[10px] max-[471px]:mb-[10px]">
      <div className="mt-[10px] flex rounded-[3px] bg-[#d1effc] p-[5px]">
        <div className="w-full">
          <div
            style={{ "--i": "\"\"" } as CSSProperties}
            className="relative flex text-left before:mr-[10px] before:ml-[20px] before:flex before:size-[40px] before:flex-none before:items-center before:justify-center before:font-[icomoon] before:text-[20px] before:text-[#01aef1] before:content-(--i) max-[471px]:before:mx-0"
          >
            <div className="flex flex-col justify-center pt-[11px]">
              <div className="text-[13px] leading-[24.7px] text-black">{NOTICE}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
