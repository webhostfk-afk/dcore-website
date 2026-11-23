"use client";
import { useEffect, useState, type CSSProperties } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import popups from "@/data/popups.json";

type Slide = { src: string; alt: string };
type PopupData = { kind: "form" | "slider"; title: string; slides: Slide[] };

const FIELDS = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "phone", label: "Phone", type: "tel", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "company", label: "Company Name", type: "text", required: false },
] as const;

const close = { "--i": '""' } as CSSProperties;

function EnquiryForm({ title }: { title: string }) {
  const [v, setV] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const problems: Record<string, string> = {};
    for (const f of FIELDS) {
      const val = (v[f.key] ?? "").trim();
      if (f.required && !val) problems[f.key] = `${f.label} is required!`;
      else if (f.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) problems[f.key] = "E-Mail Address does not appear to be valid!";
    }
    setErrors(problems);
    if (Object.keys(problems).length === 0) setSent(true);
  };

  return (
    <div className="p-[20px] text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <h3 className="relative mb-[15px] h-[27.8px] text-[14px] leading-[14px] font-normal after:absolute after:bottom-0 after:left-0 after:h-px after:w-[50px] after:bg-[#00000099] after:content-['']">
        {title}
      </h3>
      {sent ? (
        <div className="mb-[20px] rounded-[4px] border border-solid border-[#d1effc] bg-[#e3f5fd] p-[15px] text-[#0189bc]">
          <i className="fa fa-check-circle" /> Thank you! Your request has been sent. We will contact you soon.
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          {FIELDS.map((f) => (
            <div key={f.key} className="mb-[8.67px] flex flex-wrap max-[767px]:mb-[3px] items-start">
              <label
                htmlFor={`pf-${f.key}`}
                className={`w-full pt-[4px] pb-[5px] text-[14px] leading-[26.6px] max-[767px]:text-[12px] max-[767px]:leading-[22.8px] font-normal sm:w-[150px] sm:pt-[6px] ${f.required ? "after:ml-[5px] after:align-top after:text-[11px] after:text-[#01aef1] after:content-['*']" : ""}`}
              >
                {f.label}
              </label>
              <div className="w-full sm:w-[310px]">
                <input
                  id={`pf-${f.key}`}
                  type={f.type}
                  value={v[f.key] ?? ""}
                  onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value }))}
                  placeholder={f.label}
                  className={`block h-[38px] max-[767px]:h-[32px] w-full rounded-[3px] border border-solid bg-white px-[12px] py-[6px] text-[14px] max-[767px]:text-[16px] leading-[18.2px] text-[#000000b3] outline-none placeholder:text-[#00000080] ${errors[f.key] ? "border-[#01aef1]" : "border-[#0000001f]"}`}
                />
                {errors[f.key] && <div className="mt-[5px] text-[14px] leading-[26.6px] text-[#01aef1]">{errors[f.key]}</div>}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="mt-[28.3px] max-[767px]:mt-[23px] flex h-[39px] w-full cursor-pointer items-center justify-center rounded-[3px] bg-[#000000] text-[13px] leading-[13px] font-normal text-white uppercase shadow-[inset_0_0_5px_rgba(0,0,0,0.1)] hover:bg-[#01aef1]"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

// Module popups (Corporate Deal, Become A Dealer, Online Pay Numbers): a box in the middle of the page over a dark layer.
export default function ModulePopup({ id, onClose }: { id: number; onClose: () => void }) {
  const p = (popups as unknown as Record<string, PopupData>)[String(id)];
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", key);
    };
  }, [onClose]);
  if (!p) return null;
  const slider = p.kind === "slider";
  return (
    <div className="fixed inset-0 z-[999998] flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 z-[9997] bg-black/75" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="dcore-fade relative z-[9999] max-w-[calc(100%-40px)]"
        style={{ width: slider ? 345 : 500 }}
      >
        <button
          type="button"
          aria-label="Close"
          style={close}
          onClick={onClose}
          className="absolute top-[5px] right-[10px] z-[100] h-[30px] w-[36px] cursor-pointer rounded-[3px] bg-white text-[12px] text-[#000000] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:font-[icomoon] before:text-[18px] before:content-(--i) hover:text-[#01aef1]"
        />
        <div className="overflow-hidden rounded-[3px] bg-[#f0fafe] shadow-[0_15px_90px_-10px_rgba(0,0,0,0.2)]">
          {slider ? (
            <div className="max-h-[calc(100vh-100px)] overflow-hidden">
              <HeroSlider slides={p.slides.map((s) => ({ ...s, href: "", width: 345, height: 530 }))} delay={3} width={345} height={530} />
            </div>
          ) : (
            <EnquiryForm title={p.title} />
          )}
        </div>
      </div>
    </div>
  );
}
