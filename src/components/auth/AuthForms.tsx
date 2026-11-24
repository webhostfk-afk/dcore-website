"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { afterAuth, api, setCustomer, useCustomer, type Customer } from "@/lib/customer";

// Start Tech style account forms (login, register, forgotten password) in the D CORE colours.
const panel = "mx-auto w-full max-w-[460px] rounded-[10px] border border-[#01aef133] bg-white shadow-[0_8px_30px_rgba(1,174,241,0.12)]";
const label = "mb-[6px] block text-[14px] leading-[20px] font-semibold text-black";
const input =
  "block h-[44px] w-full rounded-[6px] border border-[#0000002e] bg-white px-[14px] text-[15px] font-normal text-black outline-none transition-colors placeholder:text-[#00000066] focus:border-[#01aef1] focus:shadow-[0_0_0_3px_rgba(1,174,241,0.18)]";
const primary = "flex h-[46px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-[#01aef1] text-[15px] font-bold text-white transition-colors hover:bg-[#0189bc] disabled:cursor-wait disabled:opacity-70";
const outline = "flex h-[46px] w-full items-center justify-center rounded-[6px] border border-[#01aef1] bg-white text-[15px] font-bold text-[#01aef1] transition-colors hover:bg-[#01aef1] hover:text-white";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-[15px] py-[40px] max-[561px]:py-[24px]">
      <div className={panel}>
        <h2 className="border-b border-[#01aef133] px-[24px] py-[18px] text-center text-[22px] leading-[28px] font-extrabold text-black max-[561px]:px-[16px]">{title}</h2>
        <div className="p-[24px] text-left max-[561px]:p-[16px]">{children}</div>
      </div>
    </div>
  );
}
const Err = ({ text }: { text: string }) => <p className="mb-[14px] rounded-[6px] bg-[#fde8e8] px-[12px] py-[8px] text-[14px] leading-[20px] font-normal text-[#d92d20]">{text}</p>;

// An already signed-in customer has no business on these pages.
function useGoAccount() {
  const me = useCustomer();
  const router = useRouter();
  useEffect(() => {
    if (me) router.replace(afterAuth());
  }, [me, router]);
}

function Eye({ show, toggle }: { show: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} aria-label={show ? "Hide password" : "Show password"} className="absolute top-0 right-0 flex h-[44px] w-[44px] cursor-pointer items-center justify-center text-[#00000099] hover:text-[#01aef1]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
        {show && <path d="M3 3l18 18" />}
      </svg>
    </button>
  );
}

// Keep the page the visitor came from (?next=) when they switch between login and register.
function useKeepNext() {
  const router = useRouter();
  return (to: string) => (e: React.MouseEvent) => {
    const n = new URLSearchParams(location.search).get("next");
    if (!n) return;
    e.preventDefault();
    router.push(to + "?next=" + encodeURIComponent(n));
  };
}

export function LoginForm() {
  useGoAccount();
  const keep = useKeepNext();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries());
    setBusy(true);
    setErr("");
    try {
      const r = await api<{ user: Customer }>("/api/auth/login", d);
      setCustomer(r.user);
      router.push(afterAuth());
    } catch (er) {
      setErr((er as Error).message);
      setBusy(false);
    }
  };
  return (
    <Shell title="Account Login">
      <form onSubmit={submit}>
        {err && <Err text={err} />}
        <div className="mb-[16px]">
          <label htmlFor="l-user" className={label}>Phone / E-Mail</label>
          <input id="l-user" name="username" required placeholder="Phone or E-Mail" autoComplete="username" className={input} />
        </div>
        <div className="mb-[18px]">
          <div className="mb-[6px] flex items-center justify-between">
            <label htmlFor="l-pw" className="text-[14px] leading-[20px] font-semibold text-black">Password</label>
            <Link href="/forgotten" className="text-[13px] font-normal text-[#01aef1] hover:underline">Forgotten Password?</Link>
          </div>
          <div className="relative">
            <input id="l-pw" name="password" type={show ? "text" : "password"} required placeholder="Password" autoComplete="current-password" className={`${input} pr-[44px]`} />
            <Eye show={show} toggle={() => setShow((s) => !s)} />
          </div>
        </div>
        <button type="submit" disabled={busy} className={primary}>{busy ? "Signing in..." : "Login"}</button>
      </form>
      <p className="my-[18px] flex items-center gap-[12px] text-[14px] text-[#00000099] before:h-px before:flex-1 before:bg-[#0000001a] after:h-px after:flex-1 after:bg-[#0000001a]">Don&apos;t have an account?</p>
      <Link href="/register" onClick={keep("/register")} className={outline}>Create Your Account</Link>
    </Shell>
  );
}

const hints = ["Use 8 or more characters", "Weak", "Fair", "Good", "Strong password"];
const strength = (v: string) => {
  let s = 0;
  if (v.length >= 8) s++;
  if (/\d/.test(v)) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return v ? Math.max(1, s) : 0;
};

export function RegisterForm() {
  useGoAccount();
  const keep = useKeepNext();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const s = strength(pw);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    if (d.password !== d.confirm) return setErr("Password confirmation does not match password.");
    if (!d.agree) return setErr("You must agree to the Privacy Policy.");
    setBusy(true);
    setErr("");
    try {
      const r = await api<{ user: Customer }>("/api/auth/register", d);
      setCustomer(r.user);
      router.push(afterAuth());
    } catch (er) {
      setErr((er as Error).message);
      setBusy(false);
    }
  };
  return (
    <Shell title="Register Account">
      <form onSubmit={submit}>
        {err && <Err text={err} />}
        <div className="mb-[16px] grid grid-cols-2 gap-[12px] max-[471px]:grid-cols-1">
          <div>
            <label htmlFor="r-fn" className={label}>First Name <b className="text-[#d92d20]">*</b></label>
            <input id="r-fn" name="firstname" required placeholder="First Name" autoComplete="given-name" className={input} />
          </div>
          <div>
            <label htmlFor="r-ln" className={label}>Last Name</label>
            <input id="r-ln" name="lastname" placeholder="Last Name" autoComplete="family-name" className={input} />
          </div>
        </div>
        <div className="mb-[16px]">
          <label htmlFor="r-em" className={label}>E-Mail <b className="text-[#d92d20]">*</b></label>
          <input id="r-em" name="email" type="email" required placeholder="E-Mail" autoComplete="email" className={input} />
        </div>
        <div className="mb-[16px]">
          <label htmlFor="r-tel" className={label}>Telephone <b className="text-[#d92d20]">*</b></label>
          <input id="r-tel" name="telephone" type="tel" required placeholder="01XXXXXXXXX" autoComplete="tel" className={input} />
        </div>
        <div className="mb-[16px]">
          <label htmlFor="r-pw" className={label}>Password <b className="text-[#d92d20]">*</b></label>
          <div className="relative">
            <input id="r-pw" name="password" type={show ? "text" : "password"} required minLength={8} placeholder="Password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={`${input} pr-[44px]`} />
            <Eye show={show} toggle={() => setShow((x) => !x)} />
          </div>
          <div className="mt-[8px] grid grid-cols-4 gap-[4px]">
            {[1, 2, 3, 4].map((i) => (
              <i key={i} className={`h-[4px] rounded-full ${i <= s ? (s <= 1 ? "bg-[#d92d20]" : s === 2 ? "bg-[#f59e0b]" : "bg-[#16a34a]") : "bg-[#0000001a]"}`} />
            ))}
          </div>
          <span className="mt-[4px] block text-[12px] text-[#00000099]">{hints[s]}</span>
        </div>
        <div className="mb-[16px]">
          <label htmlFor="r-cf" className={label}>Confirm Password <b className="text-[#d92d20]">*</b></label>
          <input id="r-cf" name="confirm" type={show ? "text" : "password"} required minLength={8} placeholder="Confirm Password" autoComplete="new-password" className={input} />
        </div>
        <label className="mb-[18px] flex cursor-pointer items-start gap-[8px] text-[14px] leading-[20px] font-normal text-[#000000b3]">
          <input type="checkbox" name="agree" value="1" className="mt-[3px] size-[16px] accent-[#01aef1]" />
          <span>
            I have read and agree to the <Link href="/privacy-policy" target="_blank" className="text-[#01aef1] hover:underline">Privacy Policy</Link>
          </span>
        </label>
        <button type="submit" disabled={busy} className={primary}>{busy ? "Creating account..." : "Continue"}</button>
      </form>
      <p className="my-[18px] flex items-center gap-[12px] text-[14px] text-[#00000099] before:h-px before:flex-1 before:bg-[#0000001a] after:h-px after:flex-1 after:bg-[#0000001a]">Already have an account?</p>
      <Link href="/login" onClick={keep("/login")} className={outline}>Login</Link>
    </Shell>
  );
}

export function ForgotForm() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries());
    setBusy(true);
    setErr("");
    try {
      await api("/api/auth/forgot", d);
      setDone(true);
    } catch (er) {
      setErr((er as Error).message);
    }
    setBusy(false);
  };
  return (
    <Shell title="Forgot Your Password?">
      {done ? (
        <p className="rounded-[6px] bg-[#dcf7e4] px-[12px] py-[10px] text-[14px] leading-[22px] font-normal text-[#0b7a3b]">Your request has been sent. Our team will call you on your number to reset the password.</p>
      ) : (
        <form onSubmit={submit}>
          <p className="mb-[16px] text-[14px] leading-[22px] font-normal text-[#000000b3]">Enter the mobile number of your account. Our team will call you and help you set a new password.</p>
          {err && <Err text={err} />}
          <div className="mb-[18px]">
            <label htmlFor="f-ph" className={label}>Phone</label>
            <input id="f-ph" name="phone" type="tel" required placeholder="01XXXXXXXXX" className={input} />
          </div>
          <button type="submit" disabled={busy} className={primary}>{busy ? "Sending..." : "Send Request"}</button>
        </form>
      )}
      <Link href="/login" className="mt-[16px] block text-center text-[14px] text-[#01aef1] hover:underline">Back to Login</Link>
    </Shell>
  );
}
