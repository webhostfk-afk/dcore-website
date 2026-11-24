"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { api, setCustomer, signOut, useCustomer, type Customer } from "@/lib/customer";
import { money } from "@/lib/shop-store";

// The customer account: dashboard, orders, cancel & return, reviews, wish list, address book, profile and password.
type Status = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
type Item = { id: string; name: string; href: string; image: string; price: number; qty: number };
type Order = { id: string; number: string; name: string; phone: string; address: string; city: string; region: string; shipping: string; payment: string; items: Item[]; subtotal: number; shippingFee: number; total: number; status: Status; createdAt: number };
type Eligible = { id: string; number: string; deliveredAt: number; daysLeft: number; items: (Item & { left: number })[] };
type ReturnReq = { id: string; number: string; orderNumber: string; product: string; qty: number; status: string; createdAt: number };
type Card = { id: string; name: string; href: string; image: string; price: string | null; oldPrice: string | null; requestPrice: boolean };

const ST: Record<Status, { t: string; c: string }> = {
  pending: { t: "Pending", c: "bg-[#fff4d6] text-[#a16207]" },
  processing: { t: "Processing", c: "bg-[#e0f2fe] text-[#0369a1]" },
  shipped: { t: "Shipped", c: "bg-[#e0e7ff] text-[#4338ca]" },
  delivered: { t: "Delivered", c: "bg-[#dcf7e4] text-[#0b7a3b]" },
  cancelled: { t: "Cancelled", c: "bg-[#fde8e8] text-[#d92d20]" },
  returned: { t: "Returned", c: "bg-[#f3e8ff] text-[#7e22ce]" },
};
const FILTERS: ("all" | Status)[] = ["all", "pending", "processing", "shipped", "delivered", "cancelled", "returned"];
const RET: Record<string, string> = { requested: "Under review", approved: "Approved - send it back", received: "Product received", refunded: "Refunded", rejected: "Not accepted" };
const SECTIONS = ["dashboard", "orders", "returns", "reviews", "wishlist", "address", "profile", "password"];
const NAV: [string, string, string][] = [
  ["dashboard", "Dashboard", "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z"],
  ["orders", "Order History", "M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"],
  ["returns", "Cancel & Return", "M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"],
  ["reviews", "My Reviews", "M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"],
  ["wishlist", "Wishlist", "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"],
  ["address", "Address Book", "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"],
  ["profile", "Profile Info", "M20 21a8 8 0 0 0-16 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  ["password", "Change Password", "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4"],
];

const box = "rounded-[10px] border border-[#0000001a] bg-white p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] max-[561px]:p-[14px]";
const h3 = "text-[17px] leading-[24px] font-bold text-black";
const input = "block h-[42px] w-full rounded-[6px] border border-[#0000002e] bg-white px-[12px] text-[14px] font-normal text-black outline-none focus:border-[#01aef1] focus:shadow-[0_0_0_3px_rgba(1,174,241,0.18)] disabled:bg-[#f3f6f8]";
const lab = "mb-[5px] block text-[13px] leading-[18px] font-semibold text-black";
const btn = "inline-flex h-[40px] cursor-pointer items-center justify-center rounded-[6px] bg-[#01aef1] px-[22px] text-[14px] font-bold text-white transition-colors hover:bg-[#0189bc] disabled:cursor-wait disabled:opacity-70";
const btnLine = "inline-flex h-[34px] cursor-pointer items-center justify-center rounded-[6px] border border-[#01aef1] bg-white px-[14px] text-[13px] font-semibold text-[#01aef1] transition-colors hover:bg-[#01aef1] hover:text-white disabled:opacity-60";
const th = "whitespace-nowrap border-b border-[#0000001a] bg-[#f0fafe] px-[12px] py-[10px] text-left text-[12px] font-bold tracking-[0.03em] text-black uppercase";
const td = "border-b border-[#0000000f] px-[12px] py-[10px] align-middle text-[14px] leading-[20px] text-[#000000b3]";

const dateText = (t: number) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "U";

const Ico = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const Badge = ({ s }: { s: Status }) => <span className={`inline-block rounded-[999px] px-[10px] py-[2px] text-[12px] leading-[18px] font-bold ${ST[s].c}`}>{ST[s].t}</span>;
const Sec = ({ id, sec, children }: { id: string; sec: string; children: ReactNode }) => (sec === id ? <section>{children}</section> : null);
const Empty = ({ cols, text }: { cols: number; text: string }) => (
  <tr>
    <td colSpan={cols} className="px-[12px] py-[28px] text-center text-[14px] text-[#00000099]">{text}</td>
  </tr>
);
const Msg = ({ m }: { m: { ok: boolean; t: string } | null }) =>
  m ? <p className={`mb-[12px] rounded-[6px] px-[12px] py-[8px] text-[14px] leading-[20px] font-normal ${m.ok ? "bg-[#dcf7e4] text-[#0b7a3b]" : "bg-[#fde8e8] text-[#d92d20]"}`}>{m.t}</p> : null;

const onHash = (cb: () => void) => {
  addEventListener("hashchange", cb);
  return () => removeEventListener("hashchange", cb);
};

export default function AccountView() {
  const me = useCustomer();
  const router = useRouter();
  const hash = useSyncExternalStore(onHash, () => location.hash.slice(1), () => "");
  const sec = SECTIONS.includes(hash) ? hash : "dashboard";
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [wish, setWish] = useState<Card[] | null>(null);
  const [ret, setRet] = useState<{ windowDays: number; requests: ReturnReq[]; eligible: Eligible[] } | null>(null);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [tab, setTab] = useState<"c" | "r" | "q">("c");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(false);
  const [retOrder, setRetOrder] = useState("");
  const [retQty, setRetQty] = useState<Record<string, number>>({});

  useEffect(() => {
    if (me === null) router.replace("/login?next=/account");
  }, [me, router]);

  const [tick, setTick] = useState(0);
  const reload = () => setTick((t) => t + 1);
  useEffect(() => {
    if (!me) return;
    let live = true;
    Promise.all([api<{ orders: Order[] }>("/api/account/orders"), api<{ products: Card[] }>("/api/account/wishlist"), api<{ windowDays: number; requests: ReturnReq[]; eligible: Eligible[] }>("/api/account/returns")])
      .then(([o, w, r]) => {
        if (!live) return;
        setOrders(o.orders);
        setWish(w.products);
        setRet(r);
        setRetOrder((cur) => cur || r.eligible[0]?.id || "");
      })
      .catch((e) => {
        if (!live) return;
        setOrders([]);
        setMsg({ ok: false, t: (e as Error).message });
      });
    return () => {
      live = false;
    };
  }, [me?.id, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!me) return <div className="mx-auto min-h-[420px] w-full max-w-[1280px] px-[15px]" />;

  const list = orders ?? [];
  const count = (s: Status) => list.filter((o) => o.status === s).length;
  const stats: [string, string, number, string, string, string][] = [
    ["orders", "bg-[#e0f2fe] text-[#0369a1]", list.length, "Total Orders", "orders", NAV[1][2]],
    ["orders", "bg-[#dcf7e4] text-[#0b7a3b]", count("delivered"), "Successful", "orders", "M5 13l4 4L19 7"],
    ["orders", "bg-[#fff4d6] text-[#a16207]", count("pending") + count("processing") + count("shipped"), "In Progress", "orders", "M1 3h15v13H1zM16 8h4l3 3v5h-7zM6 19.5a2 2 0 1 0 0-.01zM18 19.5a2 2 0 1 0 0-.01z"],
    ["returns", "bg-[#fde8e8] text-[#d92d20]", count("cancelled"), "Cancelled", "returns", "M18 6L6 18M6 6l12 12"],
    ["returns", "bg-[#f3e8ff] text-[#7e22ce]", count("returned"), "Returned", "returns", NAV[2][2]],
  ];
  const addr = [me.address, me.city, me.region].filter(Boolean).join(", ");
  const nav = (id: string) => ({ href: "#" + id, onClick: () => setMsg(null) });

  const cancel = async (o: Order) => {
    if (!confirm(`Cancel order #${o.number}?`)) return;
    try {
      await api("/api/account/orders", { id: o.id });
      setMsg({ ok: true, t: `Order #${o.number} has been cancelled.` });
      reload();
    } catch (e) {
      setMsg({ ok: false, t: (e as Error).message });
    }
  };
  const unwish = async (id: string) => {
    try {
      await api("/api/account/wishlist", { id, remove: true });
      setWish((w) => (w ?? []).filter((p) => p.id !== id));
      setCustomer({ ...me, wishlist: me.wishlist.filter((x) => x !== id) });
    } catch {}
  };
  const saveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries());
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ user: Customer }>("/api/account/profile", d, "PATCH");
      setCustomer(r.user);
      setMsg({ ok: true, t: "Your profile has been updated." });
    } catch (er) {
      setMsg({ ok: false, t: (er as Error).message });
    }
    setBusy(false);
  };
  const savePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (d.next !== d.confirm) return setMsg({ ok: false, t: "The new passwords do not match." });
    setBusy(true);
    setMsg(null);
    try {
      await api("/api/account/password", { current: d.current, next: d.next });
      form.reset();
      setMsg({ ok: true, t: "Your password has been changed." });
    } catch (er) {
      setMsg({ ok: false, t: (er as Error).message });
    }
    setBusy(false);
  };
  const sendReturn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const items = Object.entries(retQty).filter(([, q]) => q > 0).map(([id, qty]) => ({ id, qty }));
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ requests: { number: string }[] }>("/api/account/returns", { orderId: retOrder, reason: d.reason, details: d.details, items });
      setModal(false);
      setRetQty({});
      setTab("q");
      setMsg({ ok: true, t: `Return request sent (${r.requests.map((x) => x.number).join(", ")}). We will review it soon.` });
      reload();
    } catch (er) {
      setMsg({ ok: false, t: (er as Error).message });
    }
    setBusy(false);
  };

  const ordersTable = (rows: Order[], empty: string, actions = true) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            {["Order ID", "Date", "Products", "Total", "Status", ...(actions ? ["Action"] : [])].map((h) => (
              <th key={h} className={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders === null ? <Empty cols={6} text="Loading..." /> : rows.length === 0 ? <Empty cols={6} text={empty} /> : rows.map((o) => (
            <tr key={o.id}>
              <td className={td}><b className="text-black">#{o.number}</b></td>
              <td className={td}>{dateText(o.createdAt)}</td>
              <td className={td}>
                <span className="flex items-center gap-[4px]">
                  {o.items.slice(0, 3).map((i) => (
                    <Link key={i.id} href={i.href} title={`${i.name} x ${i.qty}`}>
                      <img src={i.image} alt="" width={32} height={32} className="size-[32px] rounded-[4px] border border-[#0000001a] bg-white object-contain" />
                    </Link>
                  ))}
                  {o.items.length > 3 && <span className="text-[12px]">+{o.items.length - 3}</span>}
                </span>
              </td>
              <td className={td}><b className="text-black">{money(o.total)}</b></td>
              <td className={td}><Badge s={o.status} /></td>
              {actions && (
                <td className={td}>
                  {o.status === "pending" ? <button type="button" className={btnLine} onClick={() => cancel(o)}>Cancel</button> : <span className="text-[#00000066]">-</span>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const eligible = ret?.eligible ?? [];
  const chosen = eligible.find((o) => o.id === retOrder);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-[15px] pt-[24px] pb-[50px] text-left">
      <div className="grid grid-cols-[270px_1fr] items-start gap-[20px] max-[900px]:grid-cols-1">
        <aside className={`${box} p-0 max-[900px]:static`}>
          <div className="flex items-center gap-[12px] border-b border-[#0000001a] p-[18px]">
            <span className="flex size-[52px] flex-none items-center justify-center rounded-full bg-[#01aef1] text-[18px] font-extrabold text-white">{initials(me.name)}</span>
            <div className="min-w-0">
              <b className="block truncate text-[16px] leading-[22px] text-black">{me.name}</b>
              <span className="block text-[13px] text-[#00000099]">{me.phone}</span>
              <span className="mt-[3px] inline-block rounded-[999px] bg-[#e3f5fd] px-[8px] text-[12px] font-semibold text-[#0189bc]">{me.points.toLocaleString("en-US")} Reward Points</span>
            </div>
          </div>
          <nav className="flex flex-col p-[8px] max-[900px]:flex-row max-[900px]:overflow-x-auto">
            {NAV.map(([id, name, d]) => (
              <a key={id} {...nav(id)} className={`flex items-center gap-[10px] rounded-[6px] px-[12px] py-[10px] text-[14px] leading-[20px] font-semibold whitespace-nowrap transition-colors ${sec === id ? "bg-[#01aef1] text-white" : "text-[#000000b3] hover:bg-[#f0fafe] hover:text-[#01aef1]"}`}>
                <Ico d={d} />
                {name}
                {id === "orders" && <em className="ml-auto text-[12px] not-italic opacity-80">{list.length}</em>}
                {id === "wishlist" && <em className="ml-auto text-[12px] not-italic opacity-80">{me.wishlist.length}</em>}
              </a>
            ))}
            <button type="button" onClick={async () => { await signOut(); router.push("/login"); }} className="flex cursor-pointer items-center gap-[10px] rounded-[6px] px-[12px] py-[10px] text-left text-[14px] font-semibold whitespace-nowrap text-[#d92d20] hover:bg-[#fde8e8]">
              <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              Logout
            </button>
          </nav>
        </aside>

        <div className="min-w-0">
          {sec !== "profile" && sec !== "password" && <Msg m={msg} />}

          <Sec id="dashboard" sec={sec}>
            <div className="mb-[16px] flex flex-wrap items-center justify-between gap-[10px]">
              <div>
                <h1 className="text-[24px] leading-[30px] font-extrabold text-black">Hello, {me.firstname}!</h1>
                <p className="text-[14px] text-[#00000099]">Here is a summary of your account.</p>
              </div>
              <Link href="/" className={btnLine}>Continue Shopping</Link>
            </div>
            <div className="grid grid-cols-5 gap-[12px] max-[1024px]:grid-cols-3 max-[561px]:grid-cols-2">
              {stats.map((s) => (
                <a key={s[3]} href={"#" + s[4]} className={`${box} flex flex-col gap-[4px] p-[14px] transition-shadow hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]`}>
                  <span className={`flex size-[38px] items-center justify-center rounded-full ${s[1]}`}><Ico d={s[5]} /></span>
                  <b className="text-[24px] leading-[30px] text-black">{s[2]}</b>
                  <span className="text-[13px] text-[#00000099]">{s[3]}</span>
                </a>
              ))}
            </div>
            <div className={`${box} mt-[18px] p-0`}>
              <div className="flex items-center justify-between border-b border-[#0000001a] px-[20px] py-[14px]">
                <h3 className={h3}>Recent Orders</h3>
                <a href="#orders" className="text-[13px] font-bold text-[#01aef1] hover:underline">View all</a>
              </div>
              {ordersTable(list.slice(0, 4), "You have not placed any orders yet.")}
            </div>
            <div className="mt-[18px] grid grid-cols-2 gap-[16px] max-[700px]:grid-cols-1">
              <div className={box}>
                <h3 className={h3}>Default Address</h3>
                <p className="mt-[8px] text-[14px] leading-[24px] text-[#000000b3]">
                  {addr ? <><b className="text-black">{me.name}</b> · {me.phone}<br />{addr}</> : "No address saved yet. It is saved when you place an order."}
                </p>
                <a href="#address" className="mt-[8px] inline-block text-[13px] font-bold text-[#01aef1] hover:underline">Manage address</a>
              </div>
              <div className={box}>
                <h3 className={h3}>Wishlist</h3>
                <p className="mt-[8px] text-[14px] text-[#000000b3]"><b className="text-black">{me.wishlist.length}</b> saved products.</p>
                <a href="#wishlist" className="mt-[8px] inline-block text-[13px] font-bold text-[#01aef1] hover:underline">View wishlist</a>
              </div>
            </div>
          </Sec>

          <Sec id="orders" sec={sec}>
            <div className={`${box} p-0`}>
              <div className="border-b border-[#0000001a] px-[20px] py-[14px]">
                <h3 className={`${h3} mb-[10px]`}>Order History</h3>
                <div className="flex flex-wrap gap-[8px]">
                  {FILTERS.map((f) => (
                    <button key={f} type="button" onClick={() => setFilter(f)} className={`cursor-pointer rounded-[999px] border px-[12px] py-[3px] text-[13px] font-semibold ${filter === f ? "border-[#01aef1] bg-[#01aef1] text-white" : "border-[#0000001f] bg-white text-[#000000b3] hover:border-[#01aef1] hover:text-[#01aef1]"}`}>
                      {f === "all" ? "All" : ST[f].t} <span className="opacity-80">({f === "all" ? list.length : count(f)})</span>
                    </button>
                  ))}
                </div>
              </div>
              {ordersTable(list.filter((o) => filter === "all" || o.status === filter), "No orders here.")}
            </div>
          </Sec>

          <Sec id="returns" sec={sec}>
            <div className="mb-[16px] grid grid-cols-2 gap-[12px]">
              <div className={`${box} p-[14px]`}><b className="block text-[24px] text-black">{count("cancelled")}</b><span className="text-[13px] text-[#00000099]">Cancelled Orders</span></div>
              <div className={`${box} p-[14px]`}><b className="block text-[24px] text-black">{count("returned")}</b><span className="text-[13px] text-[#00000099]">Returned Orders</span></div>
            </div>
            <div className={`${box} p-0`}>
              <div className="flex flex-wrap gap-[8px] border-b border-[#0000001a] px-[20px] py-[14px]">
                {([["c", "Cancelled"], ["r", "Returned"], ["q", `My Return Requests${ret?.requests.length ? ` (${ret.requests.length})` : ""}`]] as const).map(([k, n]) => (
                  <button key={k} type="button" onClick={() => setTab(k)} className={`cursor-pointer rounded-[999px] border px-[14px] py-[4px] text-[13px] font-semibold ${tab === k ? "border-[#01aef1] bg-[#01aef1] text-white" : "border-[#0000001f] bg-white text-[#000000b3]"}`}>{n}</button>
                ))}
              </div>
              {tab !== "q" ? ordersTable(list.filter((o) => o.status === (tab === "c" ? "cancelled" : "returned")), "Nothing here.", false) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse">
                    <thead><tr>{["Request", "Order", "Product", "Qty", "Date", "Status"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {!ret ? <Empty cols={6} text="Loading..." /> : ret.requests.length === 0 ? <Empty cols={6} text="You have not asked to return anything." /> : ret.requests.map((q) => (
                        <tr key={q.id}>
                          <td className={td}><b className="text-black">{q.number}</b></td>
                          <td className={td}>#{q.orderNumber}</td>
                          <td className={td}>{q.product}</td>
                          <td className={td}>{q.qty}</td>
                          <td className={td}>{dateText(q.createdAt)}</td>
                          <td className={td}>{RET[q.status] ?? q.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-[10px] border-t border-[#0000001a] px-[20px] py-[14px]">
                <span className="text-[13px] text-[#00000099]">A delivered product can be returned within {ret?.windowDays ?? 7} days of delivery. See our <Link href="/refund-and-return-policy" className="text-[#01aef1] hover:underline">Refund &amp; Return Policy</Link>.</span>
                <button type="button" className={btn} onClick={() => { setMsg(null); setModal(true); }}>Request a Return</button>
              </div>
            </div>
          </Sec>

          <Sec id="reviews" sec={sec}>
            <div className={box}>
              <h3 className={h3}>My Reviews</h3>
              <p className="mt-[10px] text-[14px] leading-[22px] text-[#00000099]">You have not reviewed any products yet. After your order is delivered you can review it from the product page.</p>
            </div>
          </Sec>

          <Sec id="wishlist" sec={sec}>
            <h2 className="mb-[14px] text-[22px] leading-[28px] font-extrabold text-black">My Wishlist</h2>
            {wish === null ? <p className="text-[#00000099]">Loading...</p> : wish.length === 0 ? <div className={box}><p className="text-[14px] text-[#00000099]">No saved products yet. Use the heart button on a product to save it here.</p></div> : (
              <div className="grid grid-cols-4 gap-[14px] max-[1100px]:grid-cols-3 max-[700px]:grid-cols-2">
                {wish.map((p) => (
                  <div key={p.id} className={`${box} flex flex-col p-[12px]`}>
                    <Link href={p.href}><img src={p.image} alt={p.name} width={200} height={200} className="mx-auto block h-[150px] w-auto max-w-full object-contain" /></Link>
                    <Link href={p.href} className="mt-[8px] line-clamp-2 text-[14px] leading-[19px] font-semibold text-black hover:text-[#01aef1]">{p.name}</Link>
                    <span className="mt-[4px] text-[15px] font-extrabold text-[#01aef1]">{p.price ?? "Call for Price"}{p.price && p.oldPrice && <s className="ml-[6px] text-[12px] font-normal text-[#00000066]">{p.oldPrice}</s>}</span>
                    <button type="button" className={`${btnLine} mt-[10px]`} onClick={() => unwish(p.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </Sec>

          <Sec id="address" sec={sec}>
            <h2 className="mb-[14px] text-[22px] leading-[28px] font-extrabold text-black">Address Book</h2>
            <div className="grid grid-cols-2 gap-[14px] max-[700px]:grid-cols-1">
              {addr ? (
                <div className={`${box} border-[#01aef1]`}>
                  <h3 className={h3}>Home <span className="ml-[6px] rounded-[4px] bg-[#e3f5fd] px-[8px] py-[1px] text-[12px] text-[#0189bc]">Default</span></h3>
                  <p className="mt-[8px] text-[14px] leading-[24px] text-[#000000b3]"><b className="text-black">{me.name}</b> · {me.phone}<br />{addr}</p>
                  <a href="#profile" className="mt-[8px] inline-block text-[13px] font-bold text-[#01aef1] hover:underline">Edit</a>
                </div>
              ) : <div className={box}><p className="text-[14px] text-[#00000099]">No address saved yet. Your delivery address is saved here when you place an order. You can also add it under Profile Info.</p></div>}
            </div>
          </Sec>

          <Sec id="profile" sec={sec}>
            <div className={box}>
              <h3 className={h3}>Profile Information</h3>
              <form onSubmit={saveProfile} key={me.id + me.email + me.address} className="mt-[14px] grid grid-cols-2 gap-[14px] max-[700px]:grid-cols-1">
                <div className="col-span-2 max-[700px]:col-span-1"><Msg m={msg} /></div>
                <div><label htmlFor="p-name" className={lab}>Full Name</label><input id="p-name" name="name" defaultValue={me.name} required className={input} /></div>
                <div><label htmlFor="p-phone" className={lab}>Phone</label><input id="p-phone" value={me.phone} disabled readOnly className={input} /></div>
                <div><label htmlFor="p-email" className={lab}>E-Mail</label><input id="p-email" name="email" type="email" defaultValue={me.email} required className={input} /></div>
                <div><label htmlFor="p-city" className={lab}>City</label><input id="p-city" name="city" defaultValue={me.city} className={input} /></div>
                <div><label htmlFor="p-region" className={lab}>Division</label><input id="p-region" name="region" defaultValue={me.region} className={input} /></div>
                <div className="col-span-2 max-[700px]:col-span-1"><label htmlFor="p-addr" className={lab}>Address</label><input id="p-addr" name="address" defaultValue={me.address} className={input} /></div>
                <div className="col-span-2 max-[700px]:col-span-1"><button type="submit" disabled={busy} className={btn}>{busy ? "Saving..." : "Save Changes"}</button></div>
              </form>
            </div>
          </Sec>

          <Sec id="password" sec={sec}>
            <div className={`${box} max-w-[520px]`}>
              <h3 className={h3}>Change Password</h3>
              <form onSubmit={savePassword} className="mt-[14px] flex flex-col gap-[14px]">
                <Msg m={msg} />
                <div><label htmlFor="w-cur" className={lab}>Current Password</label><input id="w-cur" name="current" type="password" required autoComplete="current-password" className={input} /></div>
                <div><label htmlFor="w-new" className={lab}>New Password</label><input id="w-new" name="next" type="password" required minLength={8} autoComplete="new-password" className={input} /></div>
                <div><label htmlFor="w-cf" className={lab}>Confirm Password</label><input id="w-cf" name="confirm" type="password" required minLength={8} autoComplete="new-password" className={input} /></div>
                <button type="submit" disabled={busy} className={`${btn} self-start`}>{busy ? "Updating..." : "Update Password"}</button>
              </form>
            </div>
          </Sec>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[60000] flex items-start justify-center overflow-y-auto bg-black/50 p-[16px]" onMouseDown={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="my-[30px] w-full max-w-[560px] rounded-[10px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-[#0000001a] px-[20px] py-[14px]">
              <h3 className="text-[19px] font-bold text-black">Request a Return</h3>
              <button type="button" aria-label="Close" onClick={() => setModal(false)} className="size-[34px] cursor-pointer rounded-full text-[22px] leading-none text-[#000000b3] hover:bg-[#f0fafe] hover:text-[#01aef1]">×</button>
            </div>
            <form onSubmit={sendReturn} className="flex flex-col gap-[14px] p-[20px]">
              {!ret ? <p className="text-[#00000099]">Loading your delivered orders...</p> : eligible.length === 0 ? (
                <p className="text-[14px] leading-[22px] text-[#000000b3]">Nothing can be returned right now. A product can be returned within {ret.windowDays} days after it is delivered, and only if it has not already been sent back.</p>
              ) : (
                <>
                  <div>
                    <label htmlFor="rt-order" className={lab}>Order</label>
                    <select id="rt-order" value={retOrder} onChange={(e) => { setRetOrder(e.target.value); setRetQty({}); }} className={input}>
                      {eligible.map((o) => <option key={o.id} value={o.id}>#{o.number} · delivered {dateText(o.deliveredAt)} · {o.daysLeft} day{o.daysLeft === 1 ? "" : "s"} left</option>)}
                    </select>
                  </div>
                  <div>
                    <span className={lab}>Products to return</span>
                    {(chosen?.items ?? []).map((it) => (
                      <label key={it.id} className="flex cursor-pointer items-center gap-[8px] border-b border-[#0000000f] py-[8px] text-[14px] font-normal text-[#000000b3]">
                        <input type="checkbox" checked={(retQty[it.id] ?? 0) > 0} onChange={(e) => setRetQty((q) => ({ ...q, [it.id]: e.target.checked ? 1 : 0 }))} className="accent-[#01aef1]" />
                        <span className="flex-1">{it.name}</span>
                        {(retQty[it.id] ?? 0) > 0 && it.left > 1 && (
                          <select value={retQty[it.id]} onChange={(e) => setRetQty((q) => ({ ...q, [it.id]: Number(e.target.value) }))} className="h-[32px] rounded-[4px] border border-[#0000002e] px-[6px]" aria-label="Quantity">
                            {Array.from({ length: it.left }, (_, n) => n + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                          </select>
                        )}
                      </label>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="rt-reason" className={lab}>Reason</label>
                    <select id="rt-reason" name="reason" defaultValue="defective" className={input}>
                      <option value="defective">Defective product</option>
                      <option value="wrong_item">Wrong product delivered</option>
                      <option value="damaged">Damaged on arrival</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rt-details" className={lab}>Tell us what is wrong</label>
                    <textarea id="rt-details" name="details" required minLength={5} rows={3} className="block w-full rounded-[6px] border border-[#0000002e] px-[12px] py-[10px] text-[14px] outline-none focus:border-[#01aef1]" />
                  </div>
                  <button type="submit" disabled={busy} className={btn}>{busy ? "Sending..." : "Send return request"}</button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
