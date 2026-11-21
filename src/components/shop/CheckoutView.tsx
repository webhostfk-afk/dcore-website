"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { DISTRICTS } from "@/lib/bd";
import { cartTotal, money } from "@/lib/shop-store";
import PageTitle from "@/components/layout/PageTitle";
import CartNotice from "./CartNotice";
import { useShop } from "./ShopProvider";

type Fields = { firstname: string; email: string; telephone: string; address_1: string; zone: string };
const EMPTY: Fields = { firstname: "", email: "", telephone: "", address_1: "", zone: "Dhaka" };

// the delivery charge depends on the district chosen above: inside Dhaka 70, everywhere else 120
const deliveryFor = (zone: string) =>
  zone === "Dhaka"
    ? { label: "Inside of Dhaka City", price: 70, where: "ঢাকার মধ্যে ৭০ টাকা" }
    : { label: "Outside of Dhaka City", price: 120, where: "ঢাকার বাইরে ১২০ টাকা" };
const PICKUP = { label: "Pickup From Store", price: 0 };

const glyph = (code: string) => ({ "--i": `"${code}"` }) as CSSProperties;
const section = "block bg-white p-[15px]";
const title = "relative mb-[15px] text-[15px] leading-[18px] font-medium";
const group = "relative mb-[6px] flex flex-wrap";
const label = "flex w-full pt-[7px] pb-[5px] text-[14px] leading-[26.6px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal";
const req = "after:mt-[3px] after:ml-[5px] after:block after:h-[10px] after:leading-[10px] after:text-[#e4212a] after:content-['*']";
const input = "block h-[38px] max-[471px]:h-[32px] w-full flex-1 rounded-[3px] border border-[#e2e2e2] bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] max-[471px]:leading-[20.8px] text-[#555] outline-none placeholder:text-[#999]";
const btn = "relative flex cursor-pointer items-center justify-center rounded-[3px] bg-[#1a202c] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-white uppercase";
const radio = "relative flex items-center pl-[20px] text-[14px] leading-[26.6px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal";
const radioInput = "absolute top-[6.8px] left-0 size-[13px]";
const th = "max-[471px]:normal-case bg-[#f2f3f7] p-[5px] align-middle text-[12px] leading-[17.14px] max-[471px]:text-[10px] max-[471px]:leading-[14.28px] font-bold text-[#1a202c] uppercase";
const td = "border-b border-[#e2e2e2] bg-white p-[5px] align-middle text-[12px] leading-[17.14px] max-[471px]:text-[10px] max-[471px]:leading-[14.28px] text-[#1a202c]";
const tf = "border-t border-[#e2e2e2] bg-[#f2f3f7] p-[5px] text-right align-middle text-[12px] leading-[17.14px] text-[#1a202c]";

export default function CheckoutView() {
  const { cart, removeFromCart, setQty, clearCart } = useShop();
  const [account, setAccount] = useState<"" | "register" | "guest">("guest");
  const [f, setF] = useState<Fields>(EMPTY);
  const [same, setSame] = useState(true);
  const [ship, setShip] = useState<"dhaka" | "pickup">("dhaka");
  const [pay, setPay] = useState("cod");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [alert, setAlert] = useState<{ kind: "danger" | "success"; text: string } | null>(null);
  const [done, setDone] = useState(false);

  const sub = cartTotal(cart);
  const delivery = deliveryFor(f.zone);
  const chosen = ship === "pickup" ? PICKUP : delivery;
  const shipPrice = cart.length ? chosen.price : 0;
  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const err = (k: string) => (errors[k] ? <div className="mt-[5px] text-[14px] text-[#e4212a]">{errors[k]}</div> : null);

  const confirm = () => {
    const problems: Record<string, string> = {};
    if (f.firstname.length < 1 || f.firstname.length > 32) problems.firstname = "Full Name must be between 1 and 32 characters!";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) problems.email = "E-Mail Address does not appear to be valid!";
    if (!/^\+?\d{10,15}$/.test(f.telephone.replace(/[\s-]/g, ""))) problems.telephone = "Mobile Number does not appear to be valid!";
    if (f.address_1.length < 3 || f.address_1.length > 128) problems.address_1 = "Address must be between 3 and 128 characters!";
    if (!f.zone) problems.zone = "Please select a District!";
    setErrors(problems);
    if (cart.length === 0) return setAlert({ kind: "danger", text: "Your shopping cart is empty!" });
    if (Object.keys(problems).length) return setAlert({ kind: "danger", text: "Warning: Please check the form carefully for errors!" });
    if (!agree) return setAlert({ kind: "danger", text: "Warning: You must agree to the Privacy Policy, Terms & Conditions, and Refund & Return Policy!" });
    clearCart();
    setDone(true);
    window.scrollTo({ top: 0 });
  };

  const qtyOf = (id: string, q: number) => edits[id] ?? String(q);
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

  if (done)
    return (
      <div className="text-[15px] leading-[28.5px] font-medium text-[#333]">
        <PageTitle>Your order has been placed!</PageTitle>
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="py-[20px] max-[1301px]:px-[20px] max-[1301px]:pt-0 max-[1301px]:pb-[20px] max-[471px]:p-[5px]">
            <p>Your order has been successfully processed!</p>
            <p className="mt-[10px]">
              Please direct any questions you have to the{" "}
              <Link href="/contact" className="text-[#337ab7]">
                store owner
              </Link>
              .
            </p>
            <p className="mt-[10px]">Thanks for shopping with us online!</p>
            <div className="mt-[20px] flex">
              <Link href="/" className={`${btn} h-[39px] w-full`}>
                Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="text-[15px] leading-[28.5px] font-medium text-[#333]">
      <h1 className="sr-only">Checkout</h1>
      <CartNotice />
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="py-[20px] max-[1301px]:px-[20px] max-[1301px]:pt-0 max-[1301px]:pb-[20px] max-[471px]:p-[5px]">
          {alert && (
            <div className={`relative mt-[20px] mb-[20px] rounded-[3px] border p-[15px] text-[14px] ${alert.kind === "danger" ? "border-[#ebccd1] bg-[#f2dede] text-[#a94442]" : "border-[#d6e9c6] bg-[#dff0d8] text-[#3c763d]"}`}>
              <i className={`fa fa-${alert.kind === "danger" ? "exclamation" : "check"}-circle`} /> {alert.text}
              <button type="button" className="absolute top-[10px] right-[15px] cursor-pointer text-[21px] leading-none" onClick={() => setAlert(null)}>
                ×
              </button>
            </div>
          )}
          <div className="flex flex-wrap">
            {/* ---- left: who is ordering */}
            <div className="w-[40%] flex-none max-[471px]:w-full">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className={section}>
                  <div className={title}>Login or Register</div>
                  <div className="flex flex-col">
                    <div className="relative flex flex-wrap">
                      {(
                        [
                          ["", "Login"],
                          ["register", "Register"],
                          ["guest", "Guest"],
                        ] as const
                      ).map(([k, t]) => (
                        <div key={t} className="relative flex flex-col pr-[15px]">
                          <label className={`${radio} cursor-pointer`}>
                            <input type="radio" name="account" checked={account === k} onChange={() => setAccount(k)} className={radioInput} />
                            {t}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-[10px]">
                    {account === "" && (
                      <div>
                        <div className={group}>
                          <label className={`${label} ${req}`}>E-Mail</label>
                          <input type="text" placeholder="E-Mail" className={input} />
                        </div>
                        <div className={group}>
                          <label className={`${label} ${req}`}>Password</label>
                          <input type="password" placeholder="Password" className={input} />
                        </div>
                        <button type="button" className={`${btn} h-[39px]`} onClick={() => setAlert({ kind: "danger", text: "Warning: No match for E-Mail Address and/or Password." })}>
                          Login
                        </button>
                      </div>
                    )}
                    </div>
                  </div>
                </div>

                <div className={section}>
                  <div className={title}>Your Personal Details</div>
                  <div className="flex flex-col">
                    <div className={group}>
                      <label htmlFor="input-firstname" className={`${label} ${req}`}>
                        Full Name
                      </label>
                      <input type="text" value={f.firstname} onChange={set("firstname")} placeholder="Full Name" id="input-firstname" className={input} />
                      {err("firstname")}
                    </div>
                    <div className={group}>
                      <label htmlFor="input-email" className={`${label} ${req}`}>
                        E-Mail
                      </label>
                      <input type="text" value={f.email} onChange={set("email")} placeholder="E-Mail" id="input-email" className={input} />
                      {err("email")}
                    </div>
                    <div className={group}>
                      <label htmlFor="input-telephone" className={`${label} ${req}`}>
                        Mobile Number
                      </label>
                      <div className="relative flex min-w-[200px] flex-1 flex-col">
                        <div className="relative flex w-[255px] items-center max-[471px]:w-[276px]">
                          <input id="input-telephone" type="text" value={f.telephone} onChange={set("telephone")} placeholder="Mobile Number" className={`${input} h-[39px] max-[471px]:h-[39px] max-[471px]:min-w-0`} />
                          <span className="relative text-[0px] leading-[0px] whitespace-nowrap">
                            <input
                              type="button"
                              value="Verify"
                              className={`${btn} ml-[5px] inline-flex h-[39px]`}
                              onClick={() => setAlert({ kind: "success", text: "Mobile number verification is not available in this demo." })}
                            />
                          </span>
                        </div>
                        {err("telephone")}
                      </div>
                    </div>
                    {account === "register" && (
                      <>
                        <div className={group}>
                          <label className={`${label} ${req}`}>Password</label>
                          <input type="password" placeholder="Password" className={input} />
                        </div>
                        <div className={group}>
                          <label className={`${label} ${req}`}>Password Confirm</label>
                          <input type="password" placeholder="Password Confirm" className={input} />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className={`${section} -mt-[50px]`}>
                  <div className={`${title} h-0`} />
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <div className={group}>
                        <label htmlFor="input-payment-address-1" className={`${label} ${req}`}>
                          Full Address
                        </label>
                        <input type="text" value={f.address_1} onChange={set("address_1")} placeholder="Full Address" id="input-payment-address-1" className={input} />
                        {err("address_1")}
                      </div>
                      <div className={group}>
                        <label htmlFor="input-payment-zone" className={`${label} ${req}`}>
                          District
                        </label>
                        <select value={f.zone} onChange={set("zone")} id="input-payment-zone" className="h-[34px] w-[200px] rounded-[3px] border border-[#e2e2e2] bg-white px-[12px] py-[6px] text-[14px] text-[#555]">
                          {DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {err("zone")}
                      </div>
                    </div>
                    <div className="relative mt-[15px] flex pr-[15px]">
                      <label className={`${radio} cursor-pointer`}>
                        <input type="checkbox" checked={same} onChange={(e) => setSame(e.target.checked)} className={`${radioInput} mt-[3px]`} /> My delivery and billing addresses are the same.
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* ---- right: delivery, payment, cart, confirm */}
            <div className="flex w-[60%] flex-1 flex-col pl-[10px] max-[471px]:w-full">
              <div className={`${section} flex max-[1000px]:flex-col`}>
                <div className="w-[40%] flex-none max-[1000px]:w-full">
                  <div className={title}>Shipping Method</div>
                  <div className="flex flex-col">
                    <div style={glyph("")} className="flex before:block before:w-[30px] before:flex-none before:font-[icomoon] before:text-[22px] before:leading-[28.5px] before:content-(--i) before:text-[#333]">
                      <div className="pl-[8px]">
                        <div className="flex flex-col">
                          <div className="relative mt-[2px] mb-[5px] inline-flex flex-col pr-[15px]">
                            <label className={`${radio} cursor-pointer`}>
                              <input type="radio" name="shipping_method" checked={ship === "dhaka"} onChange={() => setShip("dhaka")} className={radioInput} /> <span>{delivery.label} - {delivery.price}</span>
                            </label>
                          </div>
                          <div className="text-[11px] leading-[20.9px] text-[#999]">
                            সর্বোচ্চ ৫০০ গ্রাম বা তার কম ওজনের প্রোডাক্টের জন্য ডেলিভারি চার্জ {delivery.where}। তবে, এর থেকে বেশি ওজনের প্রোডাক্টের ডেলিভারি চার্জ প্রোডাক্টের ওজন, আকার, এবং ধরনের উপর নির্ধারিত হবে।
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={glyph("")} className="flex before:block before:w-[30px] before:flex-none before:font-[icomoon] before:text-[22px] before:leading-[28.5px] before:content-(--i) before:text-[#50ad55]">
                      <div className="pl-[8px]">
                        <div className="relative mt-[2px] mb-[5px] inline-flex flex-col pr-[15px]">
                          <label className={`${radio} cursor-pointer`}>
                            <input type="radio" name="shipping_method" checked={ship === "pickup"} onChange={() => setShip("pickup")} className={radioInput} /> <span>Pickup From Store - 0৳</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 pl-[20px] max-[1000px]:pt-[20px] max-[1000px]:pl-0">
                  <div className={title}>Payment Method</div>
                  <div className="flex flex-col">
                    {(
                      [
                        ["cod", "Cash On Delivery"],
                        ["card", "Pay with Credit Card / Debit Card"],
                      ] as const
                    ).map(([k, t]) => (
                      <div key={k} style={glyph(k === "cod" ? "" : "")} className="flex before:block before:w-[30px] before:flex-none before:font-[icomoon] before:text-[22px] before:leading-[28.5px] before:content-(--i) before:text-[#333]">
                        <div className="relative mb-[5px] flex flex-1 flex-col pr-[15px] pl-[8px]">
                          <label className={`${radio} cursor-pointer`}>
                            <input type="radio" name="payment_method" checked={pay === k} onChange={() => setPay(k)} className={radioInput} /> <span>{t}</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={section}>
                <div className={title}>Coupon / Voucher / Reward</div>
                <div className="flex flex-col">
                  {[
                    ["input-coupon", "Enter your coupon here", "Warning: Coupon is either invalid, expired or reached its usage limit!"],
                    ["input-voucher", "Enter your gift certificate code here", "Warning: Gift Certificate is either invalid or the balance has been used up!"],
                  ].map(([id, text, msg]) => (
                    <div key={id} className="relative mb-[6px] flex flex-wrap">
                      <label htmlFor={id} className="flex w-[250px] flex-none pt-[7px] pb-[5px] text-[14px] leading-[26.6px] font-normal max-[471px]:text-[12px] max-[471px]:leading-[22.8px]">
                        {text}
                      </label>
                      <div className="relative flex min-w-[200px] flex-1 items-center justify-end">
                        <input type="text" placeholder={text} id={id} className={`${input} h-[39px] max-[471px]:h-[39px] max-[471px]:min-w-0`} />
                        <span className="relative text-[0px] leading-[0px] whitespace-nowrap">
                          <button type="button" className={`${btn} ml-[5px] inline-flex h-[39px]`} onClick={() => setAlert({ kind: "danger", text: msg })}>
                            <span>Submit</span>
                          </button>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={section}>
                <div className={title}>Shopping Cart</div>
                <div className="flex flex-col">
                  <div className="overflow-x-auto overflow-y-hidden border border-[#e2e2e2]">
                    <table className="w-full min-w-[592px] max-w-full border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <td className={`${th} w-[100px] text-center`}>Image</td>
                          <td className={`${th} text-left`}>Product Name</td>
                          <td className={`${th} w-[192px] text-center`}>Quantity</td>
                          <td className={`${th} w-[100px] text-right`}>Unit Price</td>
                          <td className={`${th} w-[100px] text-right`}>Total</td>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((i) => (
                          <tr key={i.id}>
                            <td className={`${td} text-center`}>
                              <Link href={i.href} className="inline-block">
                                <img src={i.image} width={60} height={60} alt={i.name} title={i.name} className="inline-block" />
                              </Link>
                            </td>
                            <td className={`${td} text-left`}>
                              <Link href={i.href} className="inline-block text-[#1a202c]">
                                {i.name}
                              </Link>
                            </td>
                            <td className={`${td} text-left`}>
                              <div className="relative flex max-w-[200px] items-center">
                                <div className="relative flex h-[30px] w-[100px] items-center overflow-hidden border border-[#e2e2e2] text-[15px] leading-[21.4px]">
                                  <input
                                    type="text"
                                    value={qtyOf(i.id, i.qty)}
                                    onChange={(e) => typed(i.id, e.target.value)}
                                    onBlur={() => settle(i.id)}
                                    className="relative h-[28px] min-w-0 flex-1 rounded-[3px] border border-[#e2e2e2] bg-white pr-[20px] pl-[2px] text-center text-[13px] leading-[16.9px] text-[#555] outline-none"
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
                                        className="flex h-[14px] w-[18px] cursor-pointer items-center justify-center bg-[#e6e6e6] text-[#696973] before:block before:h-[15px] before:w-[12px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i)"
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
                                    className="relative ml-[5px] inline-flex h-[35px] w-[36px] cursor-pointer items-center justify-center rounded-[3px] bg-white text-[12px] before:font-[icomoon] before:text-[12px] before:leading-[12px] before:text-[#1a202c] before:content-(--i)"
                                  />
                                  <button
                                    type="button"
                                    title="Remove"
                                    onClick={() => removeFromCart(i.id)}
                                    style={glyph("")}
                                    className="relative ml-[5px] inline-flex h-[35px] w-[36px] cursor-pointer items-center justify-center rounded-[3px] bg-white text-[12px] before:font-[icomoon] before:text-[12px] before:leading-[12px] before:text-[#1a202c] before:content-(--i)"
                                  />
                                </span>
                              </div>
                            </td>
                            <td className={`${td} text-right`}>{money(i.price)}</td>
                            <td className={`${td} text-right`}>{money(i.price * i.qty)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <table className="mt-[10px] w-full border-separate border-spacing-0">
                    <tfoot>
                      <tr>
                        <td className={tf}>
                          <strong className="font-bold">Sub-Total:</strong>
                        </td>
                        <td className={`${tf} w-[20%] min-w-[100px]`}>{money(sub)}</td>
                      </tr>
                      {cart.length > 0 && (
                        <tr>
                          <td className={tf}>
                            <strong className="font-bold">{chosen.label} :</strong>
                          </td>
                          <td className={tf}>{money(shipPrice)}</td>
                        </tr>
                      )}
                      <tr>
                        <td className={tf}>
                          <strong className="font-bold">Total:</strong>
                        </td>
                        <td className={tf}>{money(sub + shipPrice)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className={section}>
                <div className={title}>Confirm Your Order</div>
                <div className="flex flex-col">
                  <div>
                    <textarea placeholder="Add Comments About Your Order" className="mb-[10px] block h-[100px] w-full rounded-[3px] border border-[#e2e2e2] bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] max-[471px]:leading-[20.8px] text-[#555] outline-none placeholder:text-[#999]" />
                  </div>
                  <div className="relative pr-[15px]">
                    <label className="relative block cursor-pointer pl-[20px] text-[14px] leading-[26.6px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal">
                      <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="absolute top-[2px] left-0 mt-[3px] size-[13px]" /> I have read and agree to the{" "}
                      <Link href="/privacy-policy" className="inline-block px-[3px] text-[#337ab7]">
                        <b>Privacy Policy</b>
                      </Link>
                      ,{" "}
                      <Link href="/terms-and-conditions" className="inline-block px-[3px] text-[#337ab7]">
                        <b>Terms &amp; Conditions</b>
                      </Link>
                      , and{" "}
                      <Link href="/refund-and-return-policy" className="inline-block px-[3px] text-[#337ab7]">
                        <b>Refund &amp; Return Policy</b>
                      </Link>
                      .{" "}
                    </label>
                  </div>
                  <div className="mt-[20px] flex">
                    <button type="button" className={`${btn} h-[39px] w-full`} onClick={confirm}>
                      <span>Confirm Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
