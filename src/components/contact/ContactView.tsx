import ContactForm from "@/components/contact/ContactForm";

// Edit the contact details and the opening hours here.
const PHONES = ["+8801844600030", "+8809678800672"];
const EMAIL = "info@dcores.net";
const OFFICES = [
  { title: "Corporate Office", text: "House# 11, Road# 3, Gulshan 1, Gudaraghat, Lake Par, Dhaka" },
  { title: "Registered Office", text: "GA-185/1, Mohakhali Wireless Gate, Banani, Dhaka-1213" },
];
const HOURS = [
  { day: "Saturday - Thursday", time: "10:00 am - 8:00 pm" },
  { day: "Friday", time: "Closed" },
];
const MAP = "https://www.google.com/maps?q=" + encodeURIComponent("House 11, Road 3, Gulshan 1, Dhaka") + "&output=embed";

const card = "rounded-[12px] border border-[#01aef133] bg-[#f0fafe] p-[22px] max-[561px]:p-[16px]";
const cardTitle = "mb-[16px] border-b border-[#01aef133] pb-[14px] text-[16px] leading-[22px] font-extrabold tracking-[0.02em] text-black uppercase";
const small = "text-[11px] leading-[16px] font-bold tracking-[0.04em] text-black uppercase";

const svg = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
const Phone = () => (
  <svg {...svg}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);
const Pin = () => (
  <svg {...svg}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const Mail = () => (
  <svg {...svg}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-[10px]">
      <span className="mt-[2px] flex-none text-[#01aef1]">{icon}</span>
      <div className="min-w-0">
        <div className={small}>{title}</div>
        <div className="mt-[4px] text-[14px] leading-[22px] font-normal text-[#000000b3]">{children}</div>
      </div>
    </div>
  );
}

export default function ContactView() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-[15px] pt-[40px] pb-[60px] text-left">
      <div className="mb-[34px] flex items-end justify-between gap-[30px] max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-[10px]">
        <h2 className="text-[56px] leading-[1] font-extrabold tracking-[-0.01em] text-black uppercase max-[561px]:text-[38px]">Contact Us</h2>
        <p className="max-w-[380px] text-[14px] leading-[22px] font-normal text-[#000000a6]">
          If you have any questions, please feel free to get in touch with us via phone, text, email, the form below, or even on social media!
        </p>
      </div>

      <div className="grid grid-cols-[1.2fr_1fr] items-start gap-[18px] max-[900px]:grid-cols-1">
        <section className={card}>
          <h3 className={cardTitle}>Get In Touch</h3>
          <ContactForm />
        </section>

        <div className="flex flex-col gap-[18px]">
          <section className={card}>
            <h3 className={cardTitle}>Contact Information</h3>
            <div className="grid grid-cols-[1.2fr_1fr] gap-x-[20px] gap-y-[20px] max-[561px]:grid-cols-1">
              <Info icon={<Pin />} title="Address">
                {OFFICES.map((o) => (
                  <span key={o.title} className="mb-[6px] block last:mb-0">
                    <b className="font-semibold text-black">{o.title}: </b>
                    {o.text}
                  </span>
                ))}
              </Info>
              <div className="flex flex-col gap-[16px]">
                <Info icon={<Phone />} title="Phone">
                  {PHONES.map((p) => (
                    <a key={p} href={`tel:${p}`} className="block hover:text-[#01aef1]">
                      {p}
                    </a>
                  ))}
                </Info>
                <Info icon={<Mail />} title="Email">
                  <a href={`mailto:${EMAIL}`} className="break-all hover:text-[#01aef1]">
                    {EMAIL}
                  </a>
                </Info>
              </div>
            </div>
          </section>

          <section className={card}>
            <h3 className={cardTitle}>Business Hours</h3>
            <div className="grid grid-cols-2 gap-[16px] max-[561px]:grid-cols-1">
              {HOURS.map((h) => (
                <div key={h.day}>
                  <div className={small}>{h.day}</div>
                  <div className="mt-[4px] text-[14px] leading-[22px] font-normal text-[#000000b3]">{h.time}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-[18px] overflow-hidden rounded-[12px] border border-[#01aef133]">
        <iframe title="D CORE Solutions on the map" src={MAP} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block h-[360px] w-full border-0 max-[561px]:h-[280px]" />
      </div>
    </div>
  );
}
