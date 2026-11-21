"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { toNumber } from "@/lib/shop-store";
import PageTitle from "@/components/layout/PageTitle";
import { useShop } from "./ShopProvider";

const cell = "border-b border-[#e2e2e2] bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] text-black max-[471px]:text-[13px] max-[471px]:leading-[18.5714px]";
const rows = ["Product", "Image", "Price", "Model", "Brand", "Availability", "Rating"] as const;

export default function CompareView() {
  const { compare, removeFromCompare, addToCart } = useShop();
  const n = compare.length;
  return (
    <div className="text-[15px] leading-[28.5px] font-medium text-[#333]">
      <PageTitle>Product Comparison</PageTitle>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="py-[20px] max-[1301px]:px-[20px] max-[1301px]:pt-0 max-[1301px]:pb-[20px] max-[471px]:p-[5px]">
          {n === 0 ? (
            <>
              <p>You have not chosen any products to compare.</p>
              <div className="mt-[20px] flex">
                <Link href="/" className="relative flex h-[39px] w-full items-center justify-center rounded-[3px] bg-[#1a202c] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-white uppercase">
                  Continue
                </Link>
              </div>
            </>
          ) : (
            <div className="overflow-x-auto overflow-y-hidden">
              <table className="w-full max-w-full table-auto border-separate border-spacing-0">
                <colgroup>
                  <col className="w-[21.38%]" />
                </colgroup>
                <thead>
                  <tr>
                    <td colSpan={n + 1} className={`${cell} border-b-0 capitalize max-[471px]:text-[14px] max-[471px]:leading-[20px]`}>
                      <strong className="font-bold text-[#2c3a96]">Product Details</strong>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((label) => (
                    <tr key={label}>
                      <td className={`${cell} whitespace-nowrap`}>{label}</td>
                      {compare.map((p) => (
                        <td key={p.id} className={`${cell} ${label === "Image" ? "text-left" : ""}`}>
                          {label === "Product" && (
                            <Link href={p.href} className="inline-block text-[#337ab7]">
                              <strong className="font-bold">{p.name}</strong>
                            </Link>
                          )}
                          {label === "Image" && <img src={p.image} width={90} height={90} alt={p.name} title={p.name} className="inline-block size-[90px]" />}
                          {label === "Price" &&
                            (p.oldPrice ? (
                              <>
                                <span className="line-through">{p.oldPrice}</span>{p.price}
                              </>
                            ) : (
                              p.price
                            ))}
                          {label === "Model" && p.model}
                          {label === "Brand" && p.brand}
                          {label === "Availability" && "In Stock"}
                          {label === "Rating" && (
                            <>
                              {[0, 1, 2, 3, 4].map((i) => (
                                <i key={i} className="fa fa-star-o mr-[5px] text-[13px] leading-[13px]" />
                              ))}
                              <br /> Based on 0 reviews.
                            </>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="border-t border-[#e2e2e2] bg-[#eee] px-[14px] py-[8px]" />
                    {compare.map((p) => (
                      <td key={p.id} className="border-t border-[#e2e2e2] bg-[#eee] px-[14px] py-[8px] align-middle">
                        <div className="flex flex-wrap items-center justify-center py-[7px]">
                          <button
                            type="button"
                            className="relative m-[4px] flex h-[39px] flex-auto cursor-pointer items-center justify-center rounded-[3px] bg-[#1a202c] px-[18px] py-[13px] text-[13px] leading-[13px] font-normal text-white uppercase"
                            onClick={() => addToCart({ id: p.id, name: p.name, href: p.href, image: p.image, model: p.model, price: toNumber(p.price) }, 1)}
                          >
                            <span>Add to Cart</span>
                          </button>{" "}
                          <a className="relative m-[4px] flex h-[39px] flex-auto cursor-pointer items-center justify-center rounded-[3px] bg-[#e4212a] px-[18px] py-[13px] text-[13px] leading-[13px] font-normal text-white uppercase" onClick={() => removeFromCompare(p.id)}>
                            <span>Remove</span>
                          </a>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
