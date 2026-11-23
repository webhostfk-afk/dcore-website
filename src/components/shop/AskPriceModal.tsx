"use client";
import { useEffect, useState } from "react";

export type PriceRequest = { id: string; name: string };

const label = "mb-[5px] block w-full max-w-full pt-[7px] pb-[5px] text-[14px] leading-[26.6px] font-normal";
const star = "after:ml-[5px] after:text-[#01aef1] after:content-['*']";
const field =
  "block w-full rounded-[3px] border border-solid bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] font-medium text-[#000000b3] outline-none placeholder:text-[#00000080]";

// "Ask For Price" window of the shop's price-request plugin; a valid form shows the confirmation, nothing is sent.
export default function AskPriceModal({ request, onClose }: { request: PriceRequest; onClose: () => void }) {
  const [v, setV] = useState({ name: "", email: "", telephone: "", quantity: "1", comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  // the page behind does not scroll while the window is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const submit = () => {
    const problems: Record<string, string> = {};
    if (v.name.length < 3 || v.name.length > 32) problems.name = "Name must be between 3 and 32 characters!";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) problems.email = "E-Mail Address does not appear to be valid!";
    if (v.telephone.length < 3 || v.telephone.length > 32) problems.telephone = "Telephone must be between 3 and 32 characters!";
    if (!/^\d+$/.test(v.quantity) || Number(v.quantity) < 1) problems.quantity = "Quantity must be a number!";
    if (v.comment.length < 10 || v.comment.length > 3000) problems.comment = "Comment must be between 10 and 3000 characters!";
    setErrors(problems);
    if (Object.keys(problems).length === 0) {
      setSent(true);
      setTimeout(onClose, 2500);
    }
  };

  const group = (k: keyof typeof v, text: string, wide = false) => {
    const bad = !!errors[k];
    const common = `${field} ${bad ? "border-[#01aef1]" : "border-[#0000001f]"}`;
    return (
      <div className={`mb-[8px] ${wide ? "w-full" : "w-1/2"} ${bad ? "text-[#01aef1]" : ""}`}>
        <label htmlFor={`ask-${k}`} className={`${label} ${star}`}>
          {text}
        </label>
        {k === "comment" ? (
          <textarea id={`ask-${k}`} rows={4} value={v[k]} onChange={set(k)} placeholder={text} className={`${common} h-[100px]`} />
        ) : (
          <input id={`ask-${k}`} type="text" value={v[k]} onChange={set(k)} placeholder={text} className={`${common} h-[38px]`} />
        )}
        {bad && <div className="mt-[5px] flex text-[14px] leading-[26.6px] font-medium text-[#01aef1]">{errors[k]}</div>}
      </div>
    );
  };

  return (
    <div className="text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <div
        role="dialog"
        aria-modal="true"
        className="dcore-fade fixed inset-0 z-[99999] overflow-x-hidden overflow-y-auto"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative mx-auto my-[30px] w-[600px] max-w-[calc(100%-40px)] max-[767px]:w-auto max-[767px]:mx-[10px]">
          <div className="relative rounded-[6px] border border-solid border-black/20 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            <div className="rounded-t-[6px] border-b border-solid border-[#d1effc] p-[15px]">
              <button type="button" aria-label="Close" onClick={onClose} className="float-right cursor-pointer text-[25px] leading-[25px] font-bold text-black">
                ×
              </button>
              <h4 className="text-[18px] leading-[25.7143px] font-medium text-[#000000] uppercase">Ask For Price</h4>
            </div>
            <div className="relative p-[15px]">
              {sent ? (
                <div className="mb-[20px] rounded-[4px] border border-solid border-[#d1effc] bg-[#e3f5fd] p-[15px] text-[#0189bc]">
                  <i className="fa fa-check-circle" /> Thank you! Your price request for {request.name} has been sent. We will contact you soon.
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap">
                    {group("name", "Name")}
                    {group("email", "E-Mail")}
                    {group("telephone", "Telephone")}
                    {group("quantity", "Quantity")}
                    {group("comment", "Comment", true)}
                  </div>
                  <button
                    type="button"
                    onClick={submit}
                    className="inline-flex cursor-pointer items-center justify-center rounded-[3px] bg-[#000000] px-[18px] py-[13px] text-[13px] leading-[13px] font-normal text-white uppercase shadow-[inset_0_0_5px_rgba(0,0,0,0.1)] hover:bg-[#01aef1]"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-[1040] bg-black/50" />
    </div>
  );
}
