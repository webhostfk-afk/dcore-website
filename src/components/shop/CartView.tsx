"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { DISTRICTS } from "@/lib/bd";
import { cartTotal, money } from "@/lib/shop-store";
import CartNotice from "./CartNotice";
import { useShop } from "./ShopProvider";

type Alert = { kind: "danger" | "success"; text: string };

const glyph = (code: string) => ({ "--i": `"${code}"` }) as CSSProperties;
const th = "whitespace-nowrap bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] font-bold text-[#01aef1] capitalize";
const td = "bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] max-[471px]:text-[13px] max-[471px]:leading-[18.5714px] text-black border-b border-[#e3f5fd]";
const btnDark = "relative flex cursor-pointer items-center justify-center rounded-[3px] bg-[#000000] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-white uppercase";
const field = "block h-[38px] w-full rounded-[3px] border border-[#0000001f] bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] text-[#000000b3] outline-none";
const label = "flex w-full pt-[7px] pb-[5px] text-[14px] leading-[26.6px] font-normal";
const req = "after:mt-[3px] after:ml-[5px] after:block after:h-[10px] after:leading-[10px] after:text-[#01aef1] after:content-['*']";

export default function CartView() {
  const { cart, removeFromCart, setQty } = useShop();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [zone, setZone] = useState("");
  const [country, setCountry] = useState("");

  const total = money(cartTotal(cart));
  const qtyOf = (id: string, fallback: number) => edits[id] ?? String(fallback);
  // the quantity (and so every price) changes at once: with the arrows and while typing a number
  const step = (id: string, cur: number, d: number) => {
    setQty(id, Math.max(1, cur + d));
    setEdits((e) => {
      const n = { ...e };
      delete n[id];
      return n;
    });
  };
  const typed = (id: string, text: string) => {
    setEdits((e) => ({ ...e, [id]: text }));
    const v = parseInt(text, 10);
    if (/^\d+$/.test(text) && v >= 1) setQty(id, v);
  };
  const settle = (id: string) =>
    setEdits((e) => {
      const n = { ...e };
      delete n[id];
      return n;
    });
  const update = (id: string) => {
    const v = parseInt(edits[id] ?? "", 10);
    if (v) setQty(id, v);
    setEdits((e) => {
      const n = { ...e };
      delete n[id];
      return n;
    });
  };
  const toggle = (k: string) => setOpen((o) => (o === k ? null : k));

  const panel = (key: string, title: string, body: React.ReactNode, first = false) => {
    const isOpen = open === key;
    return (
      <div className={`relative ${isOpen ? "z-[2]" : "z-[1]"}`}>
        <div className={`relative z-[2] ${first ? "" : "border-t border-[#0000001f]"}`}>
          <h4 className="relative text-[15px] leading-[16.5px] font-medium uppercase">
            <a
              onClick={() => toggle(key)}
              style={glyph(isOpen ? "" : "")}
              className={`flex cursor-pointer items-center justify-between before:order-2 before:mr-[3px] before:block before:h-[15px] before:w-[11.8px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i) ${isOpen ? "text-[#000000]" : "text-[#00000099]"}`}
            >
              {title}
            </a>
          </h4>
        </div>
        {isOpen && <div className="relative z-[1]">{body}</div>}
      </div>
    );
  };

  return (
    <div className="text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <h1 className="sr-only">Shopping Cart{cart.length > 0 && " (0.00kg)"}</h1>
      <CartNotice />

      <div className="mx-auto w-full max-w-[1280px]">
        <div className="py-[20px] max-[1301px]:px-[20px] max-[1301px]:pt-0 max-[1301px]:pb-[20px] max-[471px]:p-[5px]">
          {alert && (
            <div className={`relative mt-[20px] mb-[20px] rounded-[3px] border p-[15px] text-[14px] ${alert.kind === "danger" ? "border-[#d1effc] bg-[#e3f5fd] text-[#0189bc]" : "border-[#d1effc] bg-[#e3f5fd] text-[#0189bc]"}`}>
              <i className={`fa fa-${alert.kind === "danger" ? "exclamation" : "check"}-circle`} /> {alert.text}
              <button type="button" className="absolute top-[10px] right-[15px] cursor-pointer text-[21px] leading-none" onClick={() => setAlert(null)}>
                ×
              </button>
            </div>
          )}
          {cart.length === 0 ? (
            <div className="pt-[20px]">
              <p>Your shopping cart is empty!</p>
              <div className="mt-[20px] flex justify-end">
                <Link href="/" className="relative inline-flex items-center justify-center rounded-[3px] bg-[#000000] px-[18px] py-[13px] text-[13px] leading-[13px] text-white uppercase">
                  Continue
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex max-[1025px]:flex-col">
              <form className="min-w-[745px] flex-1 max-[471px]:min-w-0" onSubmit={(e) => e.preventDefault()}>
                <div className="min-h-[0.01%] overflow-x-auto overflow-y-hidden">
                  <table className="w-full min-w-[745px] max-w-full table-fixed border-separate border-spacing-0 max-[1301px]:table-auto">
                    <thead>
                      <tr>
                        <td className={`${th} w-[10.47%] max-[1301px]:w-auto max-[1301px]:min-w-[90px] text-center`}>Image</td>
                        <td className={`${th} w-[33.72%] max-[1301px]:w-auto text-left`}>Product Name</td>
                        <td className={`${th} w-[10.47%] max-[1301px]:w-auto max-[1301px]:min-w-[90px] text-center`}>Model</td>
                        <td className={`${th} w-[24.42%] max-[1301px]:w-auto max-[1301px]:min-w-[210px] text-center`}>Quantity</td>
                        <td className={`${th} w-[10.47%] max-[1301px]:w-auto max-[1301px]:min-w-[90px] text-center`}>Unit Price</td>
                        <td className={`${th} w-[10.47%] max-[1301px]:w-auto max-[1301px]:min-w-[90px] text-center`}>Total</td>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((i) => (
                        <tr key={i.id}>
                          <td className={`${td} text-center`}>
                            <Link href={i.href} className="inline-block text-[#01aef1]">
                              <img src={i.image} width={60} height={60} alt={i.name} title={i.name} className="inline" />
                            </Link>
                          </td>
                          <td className={`${td} text-left`}>
                            <Link href={i.href} className="inline-block text-[#01aef1]">
                              {i.name}
                            </Link>
                          </td>
                          <td className={`${td} text-center`}>{i.model}</td>
                          <td className={`${td} text-center`}>
                            <div className="relative flex items-center justify-center">
                              <div className="relative flex h-[30px] w-[100px] items-center overflow-hidden border border-[#0000001f] text-[15px] leading-[21.4px]">
                                <input
                                  type="text"
                                  value={qtyOf(i.id, i.qty)}
                                  onChange={(e) => typed(i.id, e.target.value)}
                                    onBlur={() => settle(i.id)}
                                  size={1}
                                  className="relative z-[2] h-[28px] min-w-0 flex-1 bg-[#f0fafe] pr-[20px] pl-[2px] text-center text-[13px] leading-[16.9px] text-[#000000b3] outline-none"
                                />
                                <span className="absolute top-0 left-[79px] z-[10] flex h-[28px] w-[19px] flex-col border-l border-transparent">
                                  {[
                                    ["", 1],
                                    ["", -1],
                                  ].map(([c, d]) => (
                                    <i
                                      key={String(d)}
                                      onClick={() => step(i.id, i.qty, Number(d))}
                                      style={glyph(String(c))}
                                      className="flex h-[14px] w-[18px] cursor-pointer items-center justify-center bg-[#e3f5fd] text-[#00000099] before:block before:h-[15px] before:w-[12px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i)"
                                    />
                                  ))}
                                </span>
                              </div>
                              <span className="relative text-[0px] leading-[0px] whitespace-nowrap">
                                <button
                                  type="button"
                                  title="Update"
                                  onClick={() => update(i.id)}
                                  style={glyph("")}
                                  className="relative ml-[5px] inline-flex size-[36px] cursor-pointer items-center justify-center rounded-[3px] bg-[#000000] text-[13px] text-white before:font-[icomoon] before:text-[13px] before:leading-[13px] before:content-(--i)"
                                />
                                <button
                                  type="button"
                                  title="Remove"
                                  onClick={() => removeFromCart(i.id)}
                                  style={glyph("")}
                                  className="relative ml-[5px] inline-flex size-[36px] cursor-pointer items-center justify-center rounded-[3px] bg-[#01aef1] text-[13px] text-white before:font-[icomoon] before:text-[13px] before:leading-[13px] before:content-(--i)"
                                />
                              </span>
                            </div>
                          </td>
                          <td className={`${td} text-center`}>{money(i.price)}</td>
                          <td className={`${td} text-center`}>{money(i.price * i.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </form>

              <div className="ml-[20px] block w-[400px] min-w-[242px] shrink border border-[#0000001f] bg-[#e3f5fd] p-[20px] max-[1025px]:mt-[20px] max-[1025px]:ml-0 max-[1025px]:max-w-full max-[1025px]:shrink-0">
                <div className="flex flex-col justify-between">
                  <div className="flex-1">
                    <h2 className="relative mb-[15px] text-[14px] leading-[16.8px] font-medium after:mt-[10px] after:block after:h-px after:w-[50px] after:bg-[#01aef1] after:content-['']">What would you like to do next?</h2>
                    <div>
                      {panel(
                        "coupon",
                        "Use Coupon Code",
                        <div className="relative mb-[6px] flex flex-wrap">
                          <label htmlFor="input-coupon" className={label}>
                            Enter your coupon here
                          </label>
                          <div className="relative flex min-w-[200px] flex-1 items-center">
                            <input type="text" name="coupon" placeholder="Enter your coupon here" id="input-coupon" className={`${field} h-[39px] flex-1`} />
                            <span className="relative text-[0px] leading-[0px] whitespace-nowrap">
                              <input
                                type="button"
                                value="Apply Coupon"
                                onClick={() => setAlert({ kind: "danger", text: "Warning: Coupon is either invalid, expired or reached its usage limit!" })}
                                className={`${btnDark} ml-[5px] inline-flex h-[39px]`}
                              />
                            </span>
                          </div>
                        </div>,
                        true,
                      )}
                      {panel(
                        "shipping",
                        "Estimate Shipping & Taxes",
                        <div>
                          <p className="mb-[10px]">Enter your destination to get a shipping estimate.</p>
                          <div>
                            <div className="relative mb-[6px] flex flex-wrap">
                              <label htmlFor="input-country" className={`${label} ${req}`}>
                                Country
                              </label>
                              <div className="relative flex min-w-[200px] flex-1">
                                <select id="input-country" className="h-[34px] w-[200px] rounded-[3px] border border-[#0000001f] bg-white px-[12px] py-[6px] text-[14px] text-[#000000b3]" value={country} onChange={(e) => setCountry(e.target.value)}>
                                  <option value=""> --- Please Select --- </option>
                                  <option value="18">Bangladesh</option>
                                </select>
                              </div>
                            </div>
                            <div className="relative mb-[6px] flex flex-wrap">
                              <label htmlFor="input-zone" className={`${label} ${req}`}>
                                Region / State
                              </label>
                              <div className="relative flex min-w-[200px] flex-1">
                                <select id="input-zone" className="h-[34px] w-[200px] rounded-[3px] border border-[#0000001f] bg-white px-[12px] py-[6px] text-[14px] text-[#000000b3]" value={zone} onChange={(e) => setZone(e.target.value)}>
                                  <option value=""> --- Please Select --- </option>
                                  {DISTRICTS.map((d) => (
                                    <option key={d} value={d}>
                                      {d}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="relative mb-[6px] flex flex-wrap">
                              <label htmlFor="input-postcode" className={label}>
                                Post Code
                              </label>
                              <div className="relative flex min-w-[200px] flex-1">
                                <input type="text" placeholder="Post Code" id="input-postcode" className={field} />
                              </div>
                            </div>
                            <div className="mt-[20px] flex justify-end">
                              <button
                                type="button"
                                className={`${btnDark} flex-1`}
                                onClick={() => {
                                  if (!country || !zone) return setAlert({ kind: "danger", text: "Warning: Please select your country and region / state!" });
                                  setAlert(
                                    zone === "Dhaka"
                                      ? { kind: "success", text: "Success: Inside of Dhaka City delivery charge is 70৳." }
                                      : { kind: "success", text: "Success: The delivery charge outside Dhaka depends on the weight and size of the products." },
                                  );
                                }}
                              >
                                Get Quotes
                              </button>
                            </div>
                          </div>
                        </div>,
                      )}
                      {panel(
                        "voucher",
                        "Use Gift Certificate",
                        <div className="relative mb-[6px] flex flex-wrap">
                          <label htmlFor="input-voucher" className={label}>
                            Enter your gift certificate code here
                          </label>
                          <div className="relative flex min-w-[200px] flex-1 items-center">
                            <input type="text" name="voucher" placeholder="Enter your gift certificate code here" id="input-voucher" className={`${field} h-[39px] flex-1`} />
                            <span className="relative text-[0px] leading-[0px] whitespace-nowrap">
                              <input
                                type="button"
                                value="Apply Gift Certificate"
                                onClick={() => setAlert({ kind: "danger", text: "Warning: Gift Certificate is either invalid or the balance has been used up!" })}
                                className={`${btnDark} ml-[5px] inline-flex h-[39px]`}
                              />
                            </span>
                          </div>
                        </div>,
                      )}
                    </div>
                  </div>
                  <div className="mt-[20px] flex">
                    <table className="w-full border-separate border-spacing-0">
                      <tbody>
                        {["Sub-Total:", "Total:"].map((t) => (
                          <tr key={t}>
                            <td className={`${td} text-right`}>
                              <strong className="font-bold">{t}</strong>
                            </td>
                            <td className={`${td} w-[100px] text-right`}>{total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-[20px] flex flex-wrap text-[12px] leading-[22.8px]">
                  <div className="flex-1 basis-0 max-[471px]:basis-full">
                    <Link href="/" className="relative inline-flex h-[39px] w-full items-center justify-center rounded-[3px] bg-[#01aef1] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-white uppercase">
                      <span>Continue Shopping</span>
                    </Link>
                  </div>
                  <div className="flex flex-1 basis-0 items-center justify-end pl-[10px] max-[471px]:basis-full max-[471px]:pt-[10px] max-[471px]:pl-0">
                    <Link href="/checkout" className="relative flex h-[39px] w-full items-center justify-center rounded-[3px] bg-[#01aef1] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-white uppercase">
                      <span>Checkout</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
